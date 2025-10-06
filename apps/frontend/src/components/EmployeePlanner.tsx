import { FormEvent, useMemo, useState } from 'react';
import { CareerGoal, RecommendationRequest } from '../types';
import { useRecommendationMutation } from '../hooks/useRecommendations';
import TrainingList from './TrainingList';

interface FormState {
  readonly name: string;
  readonly currentRole: string;
  readonly aspiration: string;
  readonly strengths: string;
  readonly growthAreas: string;
  readonly selectedGoalId: string;
}

const GOALS: readonly CareerGoal[] = [
  {
    id: 'trading-specialist',
    title: 'トレーディングスペシャリスト',
    description: '商品知識と交渉スキルを高めて大型案件を獲得する',
    targetSkills: ['国際取引', '交渉力', '財務分析']
  },
  {
    id: 'digital-strategist',
    title: 'デジタル戦略担当',
    description: 'DX 推進をリードし、全社の業務効率化を実現する',
    targetSkills: ['データ分析', 'プロジェクト管理', 'デジタルマーケティング']
  },
  {
    id: 'sustainability-lead',
    title: 'サステナビリティリード',
    description: 'ESG 観点での新規事業開発を牽引する',
    targetSkills: ['ESG', 'ステークホルダーマネジメント', '新規事業開発']
  }
];

const createInitialState = (): FormState => ({
  name: '山田 花子',
  currentRole: '法人営業',
  aspiration: 'グローバル案件をリードできる営業マネージャーになりたい',
  strengths: '顧客折衝, 問題解決',
  growthAreas: '財務知識, 英語プレゼン',
  selectedGoalId: GOALS[0]?.id ?? ''
});

const EmployeePlanner = (): JSX.Element => {
  const [formState, setFormState] = useState<FormState>(createInitialState);
  const recommendationMutation = useRecommendationMutation();

  const selectedGoal: CareerGoal | undefined = useMemo(
    () => GOALS.find((goal) => goal.id === formState.selectedGoalId),
    [formState.selectedGoalId]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (selectedGoal === undefined) {
      return;
    }

    const payload: RecommendationRequest = {
      persona: 'employee',
      goals: [selectedGoal],
      focusSkillIds: selectedGoal.targetSkills,
      employeeProfile: {
        name: formState.name,
        currentRole: formState.currentRole,
        aspiration: formState.aspiration,
        strengths: formState.strengths.split(',').map((item) => item.trim()).filter((item) => item.length > 0),
        growthAreas: formState.growthAreas.split(',').map((item) => item.trim()).filter((item) => item.length > 0)
      }
    };

    await recommendationMutation.mutateAsync(payload);
  };

  return (
    <div className="panel">
      <h2>キャリアプラン作成</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          氏名
          <input
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            required
          />
        </label>
        <label>
          現在の役割
          <input
            value={formState.currentRole}
            onChange={(event) => setFormState({ ...formState, currentRole: event.target.value })}
            required
          />
        </label>
        <label>
          キャリア展望
          <textarea
            value={formState.aspiration}
            onChange={(event) => setFormState({ ...formState, aspiration: event.target.value })}
            rows={3}
          />
        </label>
        <label>
          強み (カンマ区切り)
          <input
            value={formState.strengths}
            onChange={(event) => setFormState({ ...formState, strengths: event.target.value })}
          />
        </label>
        <label>
          伸ばしたい領域 (カンマ区切り)
          <input
            value={formState.growthAreas}
            onChange={(event) => setFormState({ ...formState, growthAreas: event.target.value })}
          />
        </label>
        <label>
          目標ロール
          <select
            value={formState.selectedGoalId}
            onChange={(event) => setFormState({ ...formState, selectedGoalId: event.target.value })}
          >
            {GOALS.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={recommendationMutation.isPending}>
          {recommendationMutation.isPending ? 'AI が分析中...' : '研修を提案してもらう'}
        </button>
      </form>
      {recommendationMutation.data !== undefined && (
        <TrainingList
          trainings={recommendationMutation.data.trainings}
          summary={recommendationMutation.data.summary}
        />
      )}
      {recommendationMutation.error !== undefined && (
        <p className="error">提案の生成中に問題が発生しました</p>
      )}
    </div>
  );
};

export default EmployeePlanner;
