import prisma from '../utils/prisma';

export const ensureSeedData = async (): Promise<void> => {
  const skillCount = await prisma.skill.count();
  if (skillCount > 0) {
    return;
  }

  const skills = await prisma.$transaction(
    [
      prisma.skill.create({ data: { name: '国際取引' } }),
      prisma.skill.create({ data: { name: '交渉力' } }),
      prisma.skill.create({ data: { name: '財務分析' } }),
      prisma.skill.create({ data: { name: 'データ分析' } }),
      prisma.skill.create({ data: { name: 'プロジェクト管理' } }),
      prisma.skill.create({ data: { name: 'デジタルマーケティング' } }),
      prisma.skill.create({ data: { name: 'ESG' } }),
      prisma.skill.create({ data: { name: 'ステークホルダーマネジメント' } }),
      prisma.skill.create({ data: { name: '新規事業開発' } })
    ]
  );

  const trainings = await prisma.$transaction(
    [
      prisma.training.create({
        data: {
          title: '国際取引の基礎 - YouTube 講座',
          description: '貿易実務と契約の基本を分かりやすく解説',
          url: 'https://www.youtube.com/results?search_query=%E5%9B%BD%E9%9A%9B%E5%8F%96%E5%BC%95+%E5%9F%BA%E7%A4%8E',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: '交渉力を鍛えるケーススタディ',
          description: '実践的な交渉フレームワークと商談の進め方',
          url: 'https://www.youtube.com/results?search_query=%E4%BA%A4%E6%B8%89%E5%8A%9B+%E5%95%86%E7%A4%BE',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: '財務三表を読み解く',
          description: '営業に必要な財務分析スキルを習得',
          url: 'https://www.youtube.com/results?search_query=%E8%B2%A1%E5%8B%99%E5%88%86%E6%9E%90+%E5%95%86%E7%A4%BE',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: 'データ分析入門',
          description: 'Excel と BI ツールを用いた分析プロセス',
          url: 'https://www.youtube.com/results?search_query=%E3%83%87%E3%83%BC%E3%82%BF%E5%88%86%E6%9E%90+DX',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: 'プロジェクトマネジメント実践',
          description: '商社の DX プロジェクトを成功させるコツ',
          url: 'https://www.youtube.com/results?search_query=%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E7%AE%A1%E7%90%86+DX',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: 'デジタルマーケティングで案件創出',
          description: 'B2B マーケティングにおけるリード獲得手法',
          url: 'https://www.youtube.com/results?search_query=B2B+%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E3%83%9E%E3%83%BC%E3%82%B1%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: 'ESG 経営の最前線',
          description: 'サステナビリティを事業戦略に取り込むポイント',
          url: 'https://www.youtube.com/results?search_query=ESG+%E7%AE%A1%E7%90%86',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: 'ステークホルダーを巻き込むコミュニケーション',
          description: '社内外の関係者との合意形成をリードする',
          url: 'https://www.youtube.com/results?search_query=%E3%82%B9%E3%83%86%E3%83%BC%E3%82%AF%E3%83%9B%E3%83%AB%E3%83%80%E3%83%BC+%E3%82%B3%E3%83%9F%E3%83%A5%E3%83%8B%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3',
          source: 'YouTube'
        }
      }),
      prisma.training.create({
        data: {
          title: '新規事業開発の実践フレーム',
          description: '市場調査から事業化までのプロセスを学ぶ',
          url: 'https://www.youtube.com/results?search_query=%E6%96%B0%E8%A6%8F%E4%BA%8B%E6%A5%AD%E9%96%8B%E7%99%BA+%E5%95%86%E7%A4%BE',
          source: 'YouTube'
        }
      })
    ]
  );

  await prisma.$transaction(
    trainings.flatMap((training, index) =>
      (skills[index] !== undefined
        ? [
            prisma.trainingSkill.create({
              data: {
                trainingId: training.id,
                skillId: skills[index]?.id ?? skills[0]?.id ?? 0
              }
            })
          ]
        : [])
    )
  );
};
