import { TrainingRecommendation } from '../types';

interface TrainingListProps {
  readonly trainings: readonly TrainingRecommendation[];
  readonly summary: string;
}

const TrainingList = ({ trainings, summary }: TrainingListProps): JSX.Element => {
  return (
    <section className="panel">
      <h2>AI 推薦結果</h2>
      <p className="summary">{summary}</p>
      <ul className="list">
        {trainings.map((training) => (
          <li key={training.id}>
            <div className="list-header">
              <div>
                <h3>{training.title}</h3>
                <p className="tagline">関連度: {training.relevance}%</p>
              </div>
              <a href={training.url} target="_blank" rel="noreferrer" className="badge">
                視聴する
              </a>
            </div>
            <p>{training.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrainingList;
