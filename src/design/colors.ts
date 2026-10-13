/**
 * App color palette. Change values here to re-theme the whole app.
 */
export const colors = {
  primary: '#0E5A3A',
  primaryDark: '#0A4229',
  primaryLight: '#E6F2EC',
  secondary: '#C5E01B',
  accentWarm: '#FDF1DC',
  accentWarmText: '#8A5A12',

  background: '#F4F5F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF0EE',
  border: '#E4E6E4',

  text: '#111827',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',
  textMuted: '#9CA3AF',

  success: '#2E7D32',
  successBg: '#E3F4E4',
  warning: '#F59F00',
  danger: '#D64545',
  dangerBg: '#FDE4E4',
  rating: '#F5B301',
} as const;

export type ColorName = keyof typeof colors;
