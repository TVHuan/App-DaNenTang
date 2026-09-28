export interface WeatherTheme {
  primaryBg: string;
  cardBg: string;
  cardBorder: string;
  cardHighlight: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  badgeBg: string;
  gradientTop: string;
  gradientBottom: string;
}

export const THEMES: Record<string, WeatherTheme> = {
  sunny: {
    primaryBg: '#0D2137',
    cardBg: 'rgba(23, 42, 69, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardHighlight: 'rgba(251, 191, 36, 0.15)',
    accent: '#F59E0B',
    textPrimary: '#FFFFFF',
    textSecondary: '#E2E8F0',
    textMuted: '#94A3B8',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    gradientTop: '#1E3A5F',
    gradientBottom: '#0A1826',
  },
  night: {
    primaryBg: '#090D16',
    cardBg: 'rgba(19, 25, 41, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardHighlight: 'rgba(129, 140, 248, 0.15)',
    accent: '#818CF8',
    textPrimary: '#FFFFFF',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    badgeBg: 'rgba(129, 140, 248, 0.18)',
    gradientTop: '#151C2E',
    gradientBottom: '#070A10',
  },
  rainy: {
    primaryBg: '#0D1B2A',
    cardBg: 'rgba(21, 37, 54, 0.72)',
    cardBorder: 'rgba(56, 189, 248, 0.18)',
    cardHighlight: 'rgba(56, 189, 248, 0.12)',
    accent: '#38BDF8',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0F2FE',
    textMuted: '#7DD3FC',
    badgeBg: 'rgba(56, 189, 248, 0.18)',
    gradientTop: '#172A3A',
    gradientBottom: '#0A121A',
  },
  cloudy: {
    primaryBg: '#131A22',
    cardBg: 'rgba(27, 36, 46, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardHighlight: 'rgba(148, 163, 184, 0.15)',
    accent: '#94A3B8',
    textPrimary: '#FFFFFF',
    textSecondary: '#E2E8F0',
    textMuted: '#94A3B8',
    badgeBg: 'rgba(148, 163, 184, 0.18)',
    gradientTop: '#1E293B',
    gradientBottom: '#0F172A',
  },
  storm: {
    primaryBg: '#130F24',
    cardBg: 'rgba(28, 21, 49, 0.75)',
    cardBorder: 'rgba(168, 85, 247, 0.2)',
    cardHighlight: 'rgba(168, 85, 247, 0.15)',
    accent: '#A855F7',
    textPrimary: '#FFFFFF',
    textSecondary: '#E9D5FF',
    textMuted: '#C084FC',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    gradientTop: '#24143D',
    gradientBottom: '#0D0717',
  },
  fog: {
    primaryBg: '#14181D',
    cardBg: 'rgba(30, 36, 44, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardHighlight: 'rgba(203, 213, 225, 0.15)',
    accent: '#CBD5E1',
    textPrimary: '#FFFFFF',
    textSecondary: '#F1F5F9',
    textMuted: '#94A3B8',
    badgeBg: 'rgba(203, 213, 225, 0.18)',
    gradientTop: '#1F2730',
    gradientBottom: '#0F1216',
  },
  snow: {
    primaryBg: '#0F1E2E',
    cardBg: 'rgba(24, 43, 64, 0.75)',
    cardBorder: 'rgba(224, 242, 254, 0.25)',
    cardHighlight: 'rgba(224, 242, 254, 0.15)',
    accent: '#BAE6FD',
    textPrimary: '#FFFFFF',
    textSecondary: '#F0F9FF',
    textMuted: '#7DD3FC',
    badgeBg: 'rgba(186, 230, 253, 0.2)',
    gradientTop: '#1A334D',
    gradientBottom: '#0A141F',
  },
};
