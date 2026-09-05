import { describe, it, expect } from 'vitest';
import { starMeaning, communityDescriptor } from './descriptors';

describe('starMeaning', () => {
  it('maps each star value to its meaning', () => {
    expect(starMeaning(1)).toBe('Bana göre değil');
    expect(starMeaning(2)).toBe('Vaktin varsa');
    expect(starMeaning(3)).toBe('Görmeye değer');
    expect(starMeaning(4)).toBe('Çok iyi');
    expect(starMeaning(5)).toBe('Kesin görülmeli');
  });

  it('clamps out-of-range values', () => {
    expect(starMeaning(0)).toBe('Bana göre değil');
    expect(starMeaning(9)).toBe('Kesin görülmeli');
  });
});

describe('communityDescriptor', () => {
  it('returns null below the minimum vote threshold, regardless of average', () => {
    expect(communityDescriptor(5, 1)).toBeNull();
    expect(communityDescriptor(5, 4)).toBeNull();
  });

  it('returns null with no average at all', () => {
    expect(communityDescriptor(undefined, 0)).toBeNull();
  });

  it('returns the right band once the threshold is met', () => {
    expect(communityDescriptor(4.8, 10)).toBe('Kesin görülmeli');
    expect(communityDescriptor(4.5, 10)).toBe('Kesin görülmeli');
    expect(communityDescriptor(4.2, 10)).toBe('Çok öneriliyor');
    expect(communityDescriptor(3.7, 10)).toBe('Görmeye değer');
    expect(communityDescriptor(3.2, 10)).toBe('Değerlendirmeler karışık');
    expect(communityDescriptor(2.0, 10)).toBe('Sınırlı ilgi gördü');
  });

  it('never returns an insulting or dismissive phrase for low scores', () => {
    const phrase = communityDescriptor(1.2, 20)!;
    expect(phrase.toLowerCase()).not.toMatch(/kötü|berbat|değersiz/);
  });
});
