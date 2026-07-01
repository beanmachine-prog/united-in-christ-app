import { kjvVerses } from '@/data/kjvVerses';
import { KJVVerse } from '@/types/content';
export type BibleTranslation = 'KJV' | 'NKJV' | 'RV1960';
export class BibleService {
  static getDailyVerse(date = new Date()): KJVVerse {
    const start = new Date(date.getFullYear(), 0, 0);
    const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
    return kjvVerses[day % kjvVerses.length];
  }
  static getVerseHistory(): KJVVerse[] { return kjvVerses; }
  static async getVerse(reference: string, translation: BibleTranslation = 'KJV') {
    if (translation !== 'KJV') {
      // TODO: Add licensed Bible API integration for NKJV and Spanish RV1960. Do not hardcode copyrighted translations.
      throw new Error(`${translation} requires a licensed Bible provider before use.`);
    }
    return kjvVerses.find(v => v.reference.toLowerCase() === reference.toLowerCase()) ?? kjvVerses[0];
  }
}
