import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),

    OLLAMA_URL: z.string().url().default('http://localhost:11434'),

    OLLAMA_MODEL: z.string().default('qwen2.5:3b'),
});

export const env = envSchema.parse(process.env);