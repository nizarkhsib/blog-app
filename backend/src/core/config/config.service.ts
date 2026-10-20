
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath: string) {
    // Load a local configuration file if it exists.
    const fileConfig: Record<string, string> = fs.existsSync(filePath)
      ? dotenv.parse(fs.readFileSync(filePath))
      : {};

    // Environment variables supplied by Vercel override file values.
    this.envConfig = { ...fileConfig };

    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        this.envConfig[key] = value;
      }
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
