import { Mastra } from '@mastra/core';
import { createFallbackProvider, createGeminiProvider, createOpenAiProvider } from '@mastra/llamaindex';
import { Training, TrainingSkill } from '@prisma/client';
import { GEMINI_API_KEY, OPENAI_API_KEY } from '../config';
import prisma from '../utils/prisma';
import { RecommendationPayload, RecommendationRequestBody } from '../types';

interface TrainingWithSkills extends Training {
  readonly skills: readonly (TrainingSkill & {
    readonly skill: {
      readonly name: string;
    };
  })[];
}

const buildPrompt = (request: RecommendationRequestBody, trainings: readonly TrainingWithSkills[]): string => {
  const employeeSection = request.employeeProfile
    ? `名前: ${request.employeeProfile.name}\n現職: ${request.employeeProfile.currentRole}\nキャリア展望: ${request.employeeProfile.aspiration}\n強み: ${request.employeeProfile.strengths.join(', ')}\n伸ばしたい領域: ${request.employeeProfile.growthAreas.join(', ')}`
    : '従業員情報: 指定なし';

  const goalDescriptions = request.goals
    .map((goal) => `${goal.title}: ${goal.description} / スキル: ${goal.targetSkills.join(', ')}`)
    .join('\n');

  const trainingOptions = trainings
    .map((training) => `- ${training.title}: ${training.description} / スキル: ${training.skills.map((skill) => skill.skill.name).join(', ')}`)
    .join('\n');

  return `以下の従業員とキャリアゴールに対して、上位 3 件の研修を推奨し、理由と期待効果を日本語で 120 文字程度にまとめてください。\n従業員:\n${employeeSection}\n\nキャリアゴール:\n${goalDescriptions}\n\n利用可能な研修候補:\n${trainingOptions}`;
};

const createFallbackSummary = (request: RecommendationRequestBody): string => {
  const goalTitles = request.goals.map((goal) => goal.title).join('、');
  return `目標「${goalTitles}」に向けて、重点スキルを段階的に強化できる研修を提案しました。スキル習得後は現場での実践と振り返りを組み合わせて定着を図りましょう。`;
};

class RecommendationService {
  private readonly mastra: Mastra;

  public constructor() {
    const providers = [createFallbackProvider(() => '')];

    if (OPENAI_API_KEY.length > 0) {
      providers.unshift(
        createOpenAiProvider({
          apiKey: OPENAI_API_KEY,
          model: 'gpt-4o-mini'
        })
      );
    }

    if (GEMINI_API_KEY.length > 0) {
      providers.unshift(
        createGeminiProvider({
          apiKey: GEMINI_API_KEY,
          model: 'gemini-1.5-flash-latest'
        })
      );
    }

    this.mastra = new Mastra({ providers });
  }

  public async generateRecommendation(request: RecommendationRequestBody): Promise<RecommendationPayload> {
    const focusSkillSet = new Set(request.focusSkillIds);

    const trainings = await prisma.training.findMany({
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    });

    const enrichedTrainings = trainings as unknown as TrainingWithSkills[];

    const scored = enrichedTrainings
      .map((training) => {
        const matchedSkills = training.skills.filter((skill) => focusSkillSet.has(skill.skill.name));
        const score = Math.min(100, matchedSkills.length * 30 + 40);
        return {
          training,
          score
        };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 3);

    const aiPrompt = buildPrompt(request, scored.map((item) => item.training));
    const aiResult = await this.mastra.run(aiPrompt);
    const summary = aiResult.output.length > 0 ? aiResult.output : createFallbackSummary(request);

    return {
      summary,
      trainings: scored.map((item, index) => ({
        id: `${item.training.id}`,
        title: item.training.title,
        description: item.training.description,
        url: item.training.url,
        relevance: Math.min(100, item.score + (2 - index) * 5)
      }))
    };
  }
}

const recommendationService = new RecommendationService();

export default recommendationService;
