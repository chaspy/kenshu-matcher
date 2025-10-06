import { Router } from 'express';
import { YOUTUBE_API_KEY } from '../config';

const youtubeRoute = Router();

youtubeRoute.get('/search', async (request, response) => {
  const query = String(request.query.q ?? '').trim();
  const maxResults = Number(request.query.maxResults ?? '4');

  if (query.length === 0) {
    response.status(400).json({ message: 'Missing query parameter q' });
    return;
  }

  if (YOUTUBE_API_KEY.length === 0) {
    response.status(501).json({ message: 'YouTube API key is not configured on the server' });
    return;
  }

  try {
    const params = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: String(Number.isFinite(maxResults) ? Math.max(1, Math.min(8, maxResults)) : 4)
    });

    const fetchUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
    const referer = (request.get('origin') ?? request.get('referer') ?? 'http://localhost:5173').toString();
    const yt = await fetch(fetchUrl, {
      headers: {
        // Some API key configs require an HTTP referrer; forward the frontend origin if available
        Referer: referer
      }
    });
    if (!yt.ok) {
      const text = await yt.text();
      try {
        const body = JSON.parse(text) as unknown;
        response.status(yt.status).json({ message: 'YouTube API error', upstream: body });
      } catch {
        response.status(yt.status).json({ message: 'YouTube API error', upstream: text });
      }
      return;
    }

    const payload = (await yt.json()) as unknown as {
      readonly items?: readonly any[];
    };

    const items = payload.items ?? [];
    const videos = items
      .map((item) => {
        const id = item?.id?.videoId as string | undefined;
        const title = item?.snippet?.title as string | undefined;
        const thumb = item?.snippet?.thumbnails?.medium?.url as string | undefined;
        if (id === undefined || title === undefined || thumb === undefined) {
          return undefined;
        }
        return {
          id,
          title,
          thumbnail: thumb,
          url: `https://www.youtube.com/watch?v=${id}`
        };
      })
      .filter((v): v is { id: string; title: string; thumbnail: string; url: string } => v !== undefined);

    response.json({ videos });
  } catch (error) {
    response.status(500).json({
      message: 'Failed to search YouTube',
      detail: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default youtubeRoute;
