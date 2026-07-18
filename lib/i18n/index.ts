import { ar, type Dictionary } from './ar';
import { en } from './en';

export type Lang = 'ar' | 'en';

export const dictionaries: Record<Lang, Dictionary> = { ar, en };

export type { Dictionary };
