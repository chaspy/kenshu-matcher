import { HrDashboardResponse } from '../types';

export const getHrDashboard = async (): Promise<HrDashboardResponse> => {
  return {
    goals: [
      {
        id: 'global-sales',
        title: 'グローバル営業体制の強化',
        description: '海外営業チームの大型案件獲得を加速する',
        progress: 62,
        focusSkills: ['国際取引', '交渉力', '財務分析']
      },
      {
        id: 'dx-promotion',
        title: 'DX 推進による業務改革',
        description: '部門横断のデジタルプロジェクトを内製化',
        progress: 48,
        focusSkills: ['データ分析', 'プロジェクト管理', 'デジタルマーケティング']
      },
      {
        id: 'sustainability',
        title: 'サステナビリティ経営の実装',
        description: 'ESG を意識した新規ビジネス創出を目指す',
        progress: 35,
        focusSkills: ['ESG', 'ステークホルダーマネジメント', '新規事業開発']
      }
    ],
    employees: [
      {
        id: 'employee-1',
        name: '山田 花子',
        currentRole: '法人営業',
        targetRole: 'グローバルアカウントマネージャー',
        readiness: 55
      },
      {
        id: 'employee-2',
        name: '田中 太郎',
        currentRole: '事業開発',
        targetRole: 'サステナビリティ戦略リード',
        readiness: 42
      },
      {
        id: 'employee-3',
        name: '佐藤 京子',
        currentRole: 'DX 推進室',
        targetRole: 'デジタル戦略ディレクター',
        readiness: 68
      }
    ]
  };
};
