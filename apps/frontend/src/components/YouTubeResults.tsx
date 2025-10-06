import React from 'react';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';

interface Props {
  readonly query: string;
}

const YouTubeResults = ({ query }: Props): JSX.Element | null => {
  const { videos, isLoading } = useYouTubeSearch(query, 4);

  if (isLoading) {
    return <p className="tagline">YouTube を検索中...</p>;
  }

  if (videos.length === 0) {
    const href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    return (
      <p className="tagline">
        検索結果の取得に失敗しました。<a href={href} target="_blank" rel="noreferrer">YouTube で検索</a>
      </p>
    );
  }

  return (
    <div className="yt-grid">
      {videos.map((v) => (
        <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="yt-card">
          <img src={v.thumbnail} alt={v.title} />
          <span>{v.title}</span>
        </a>
      ))}
    </div>
  );
};

export default YouTubeResults;
