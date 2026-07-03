export const colors = {
  background: '#060607',
  backgroundSoft: '#0B0B0D',
  surface: '#111216',
  surfaceSoft: '#191A20',
  surfaceRaised: '#1D191B',
  border: '#2B2628',
  borderStrong: '#45252A',
  text: '#F4EFE6',
  textSoft: '#D8D0C4',
  muted: '#9B948B',
  red: '#9A2229',
  redDeep: '#531318',
  redSoft: '#2A0D10',
  cream: '#F4EFE6',
  gold: '#BFA46B',
  success: '#4E9F6E',
  warning: '#D8A34A',
  danger: '#C94C52',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
  xxl: 44,
};

export const typography = {
  title: 38,
  h1: 31,
  h2: 22,
  h3: 18,
  body: 16,
  small: 13,
  micro: 11,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const shadows = {
  none: {},
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  redGlow: {
    shadowColor: colors.redDeep,
    shadowOpacity: 0.32,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
};

export const componentVariants = {
  card: {
    default: { backgroundColor: colors.surface, borderColor: colors.border },
    accent: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderStrong },
    quiet: { backgroundColor: colors.backgroundSoft, borderColor: colors.border },
    danger: { backgroundColor: colors.redSoft, borderColor: colors.borderStrong },
  },
  button: {
    primary: { backgroundColor: colors.red, borderColor: colors.red, textColor: colors.text },
    secondary: { backgroundColor: 'transparent', borderColor: colors.borderStrong, textColor: colors.textSoft },
    ghost: { backgroundColor: colors.surfaceSoft, borderColor: colors.border, textColor: colors.textSoft },
  },
  status: {
    default: { backgroundColor: colors.redSoft, borderColor: colors.borderStrong, textColor: colors.text },
    muted: { backgroundColor: colors.surfaceSoft, borderColor: colors.border, textColor: colors.muted },
    success: { backgroundColor: '#0F2419', borderColor: '#245A3B', textColor: colors.success },
    warning: { backgroundColor: '#2A1E0C', borderColor: '#5C4317', textColor: colors.warning },
    danger: { backgroundColor: colors.redSoft, borderColor: colors.borderStrong, textColor: colors.danger },
  },
};

export const theme = { colors, spacing, typography, radius, shadows, componentVariants };
