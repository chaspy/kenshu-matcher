import { MastraProvider } from '@mastra/core';

interface OpenAiConfig {
  readonly apiKey: string;
  readonly model?: string;
}

interface GeminiConfig {
  readonly apiKey: string;
  readonly model?: string;
}

interface OpenAiChatChoice {
  readonly message?: {
    readonly content?: string;
  };
}

interface OpenAiChatCompletionResponse {
  readonly choices: readonly OpenAiChatChoice[];
}

interface GeminiCandidate {
  readonly content?: {
    readonly parts?: readonly {
      readonly text?: string;
    }[];
  };
}

interface GeminiResponse {
  readonly candidates?: readonly GeminiCandidate[];
}

const readResponseText = async (response: Response): Promise<string> => {
  const payload = (await response.json()) as unknown;
  if (typeof payload !== 'object' || payload === null) {
    return '';
  }

  if ('choices' in payload) {
    const typed = payload as OpenAiChatCompletionResponse;
    return typed.choices[0]?.message?.content ?? '';
  }

  if ('candidates' in payload) {
    const typed = payload as GeminiResponse;
    return typed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }

  return '';
};

export const createOpenAiProvider = (config: OpenAiConfig): MastraProvider => ({
  name: 'openai',
  call: async (prompt: string) => {
    if (config.apiKey.length === 0) {
      throw new Error('Missing OpenAI API key');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model ?? 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful career development assistant for Japanese trading companies.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    return readResponseText(response);
  }
});

export const createGeminiProvider = (config: GeminiConfig): MastraProvider => ({
  name: 'gemini',
  call: async (prompt: string) => {
    if (config.apiKey.length === 0) {
      throw new Error('Missing Gemini API key');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model ?? 'gemini-1.5-flash-latest'}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini error: ${response.status}`);
    }

    return readResponseText(response);
  }
});

export const createFallbackProvider = (generate: (prompt: string) => string): MastraProvider => ({
  name: 'fallback',
  call: async (prompt: string) => Promise.resolve(generate(prompt))
});
