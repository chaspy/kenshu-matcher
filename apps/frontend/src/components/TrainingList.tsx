import { TrainingRecommendation } from '../types';
import Markdown from './common/Markdown';
import YouTubeResults from './YouTubeResults';

const tryExtractYouTubeQuery = (url: string): string | undefined => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com') && parsed.pathname === '/results') {
      const q = parsed.searchParams.get('search_query') ?? undefined;
      return q ?? undefined;
    }
  } catch {
    // ignore
  }
  return undefined;
};

interface TrainingListProps {
  readonly trainings: readonly TrainingRecommendation[];
  readonly summary: string;
}

const TrainingList = ({ trainings, summary }: TrainingListProps): JSX.Element => {
  return (
    <section className="panel">
      <h2>AI 推薦結果</h2>
      <div className="summary">
        <Markdown text={summary} />
      </div>
      <ul className="list">
        {trainings.map((training) => (
          <li key={training.id}>
            <div className="list-header">
              <div>
                <h3>{training.title}</h3>
                <p className="tagline">関連度: {training.relevance}%</p>
              </div>
              {tryExtractYouTubeQuery(training.url) === undefined && (
                <a href={training.url} target="_blank" rel="noreferrer" className="badge">
                  開く
                </a>
              )}
            </div>
            <p>{training.description}</p>
            {(() => {
              const q = tryExtractYouTubeQuery(training.url);
              if (q !== undefined) {
                return <YouTubeResults query={q} />;
              }
              return null;
            })()}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrainingList;
