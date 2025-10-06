import { useMemo } from 'react';
import { useHrDashboard } from '../hooks/useRecommendations';

const HrDashboard = (): JSX.Element => {
  const { data, isLoading, error } = useHrDashboard();

  const averageProgress: number = useMemo(() => {
    if (!data?.goals.length) {
      return 0;
    }
    const totalProgress = data.goals.reduce((accumulator: number, goal) => accumulator + goal.progress, 0);
    return Math.round(totalProgress / data.goals.length);
  }, [data]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (error != null) {
    const err = error as unknown as {
      readonly message?: string;
      readonly response?: { readonly status?: number; readonly statusText?: string };
    };
    const detail = err.message ?? (err.response?.statusText ?? '不明なエラー');
    return <p className="error">ダッシュボードの取得中にエラーが発生しました: {detail}</p>;
  }

  return (
    <div className="panel-grid">
      <section className="panel">
        <h2>優先キャリアゴール</h2>
        <p className="metric">平均進捗 {averageProgress}%</p>
        <ul className="list">
          {data?.goals.map((goal) => (
            <li key={goal.id}>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
              <p className="tagline">注力スキル: {goal.focusSkills.join(', ')}</p>
              <progress value={goal.progress} max={100} />
            </li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2>従業員のサクセッション</h2>
        <ul className="list">
          {data?.employees.map((employee) => (
            <li key={employee.id}>
              <div className="list-header">
                <div>
                  <h3>{employee.name}</h3>
                  <p className="tagline">現職: {employee.currentRole} / 目標: {employee.targetRole}</p>
                </div>
                <span className="badge">準備度 {employee.readiness}%</span>
              </div>
              <progress value={employee.readiness} max={100} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HrDashboard;
