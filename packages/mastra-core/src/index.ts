export interface MastraProvider {
  readonly name: string;
  readonly call: (prompt: string) => Promise<string>;
}

export interface MastraConfig {
  readonly providers: readonly MastraProvider[];
}

export class Mastra {
  private readonly providers: readonly MastraProvider[];

  public constructor(config: MastraConfig) {
    this.providers = config.providers;
  }

  public async run(prompt: string): Promise<{ readonly output: string }> {
    for (const provider of this.providers) {
      try {
        const result = await provider.call(prompt);
        if (result.length > 0) {
          return { output: result };
        }
      } catch {
        // fall through to next provider
      }
    }

    return {
      output: ''
    };
  }
}
