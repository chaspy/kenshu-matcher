import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface YouTubeVideo {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: string;
  readonly url: string;
}

export const useYouTubeSearch = (query: string, maxResults = 4): {
  readonly videos: readonly YouTubeVideo[];
  readonly isLoading: boolean;
  readonly error: unknown;
} => {
  const envKey = (import.meta as unknown as { env: { VITE_YOUTUBE_API_KEY?: string } }).env.VITE_YOUTUBE_API_KEY;

  const { data, isLoading, error } = useQuery({
    queryKey: ['yt-search', query, maxResults],
    enabled: query.length > 0,
    queryFn: async () => {
      try {
        const response = await axios.get('/api/youtube/search', { params: { q: query, maxResults } });
        return response.data as unknown;
      } catch (err) {
        if ((envKey?.length ?? 0) > 0) {
          const direct = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: { key: envKey, part: 'snippet', q: query, type: 'video', maxResults }
          });
          return direct.data as unknown;
        }
        throw err;
      }
    }
  });

  const backendItems = (data as { videos?: readonly any[] } | undefined)?.videos;
  const items = (backendItems ?? (data as { items?: readonly any[] } | undefined)?.items) ?? [];
  const videos: readonly YouTubeVideo[] = items
    .map((item) => {
      // Support both backend-shape and direct Google API shape
      const id = (item?.id?.videoId as string | undefined) ?? (item?.id as string | undefined);
      const title = (item?.snippet?.title as string | undefined) ?? (item?.title as string | undefined);
      const thumb = (item?.snippet?.thumbnails?.medium?.url as string | undefined) ?? (item?.thumbnail as string | undefined);
      const url = (item?.url as string | undefined) ?? (id ? `https://www.youtube.com/watch?v=${id}` : undefined);
      if (!id || !title || !thumb || !url) return undefined;
      return { id, title, thumbnail: thumb, url } satisfies YouTubeVideo;
    })
    .filter((v): v is YouTubeVideo => v !== undefined);

  return { videos, isLoading, error };
};
