import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, PressableProps, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, componentVariants, radius, shadows, spacing, typography } from '@/constants/theme';

type CardVariant = keyof typeof componentVariants.card;
type ButtonVariant = keyof typeof componentVariants.button;
type StatusVariant = keyof typeof componentVariants.status;

export function Screen({ children }: { children: ReactNode }) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>{children}</ScrollView>;
}

export function Card({ children, variant = 'default' }: { children: ReactNode; variant?: CardVariant }) {
  const cardVariant = componentVariants.card[variant];
  return <View style={[styles.card, { backgroundColor: cardVariant.backgroundColor, borderColor: cardVariant.borderColor }, variant === 'accent' && shadows.soft]}>{children}</View>;
}

export function Hero({ children }: { children: ReactNode }) {
  return <View style={[styles.hero, shadows.redGlow]}>{children}</View>;
}

export function Row({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

export function Stack({ children }: { children: ReactNode }) {
  return <View style={styles.stack}>{children}</View>;
}

export function BrandMark() {
  return <View style={styles.brandWrap}>
    <View style={styles.crossVertical} />
    <View style={styles.crossHorizontal} />
  </View>;
}

export function Divider() { return <View style={styles.divider} />; }
export function Eyebrow({ children }: { children: ReactNode }) { return <Text style={styles.eyebrow}>{children}</Text>; }
export function H1({ children }: { children: ReactNode }) { return <Text style={styles.h1}>{children}</Text>; }
export function H2({ children }: { children: ReactNode }) { return <Text style={styles.h2}>{children}</Text>; }
export function Body({ children }: { children: ReactNode }) { return <Text style={styles.body}>{children}</Text>; }
export function Muted({ children }: { children: ReactNode }) { return <Text style={styles.muted}>{children}</Text>; }

export function Badge({ label, variant = 'default' }: { label: string; variant?: StatusVariant }) {
  const badgeVariant = componentVariants.status[variant];
  return <View style={[styles.badge, { backgroundColor: badgeVariant.backgroundColor, borderColor: badgeVariant.borderColor }]}>
    <Text style={[styles.badgeText, { color: badgeVariant.textColor }]}>{label}</Text>
  </View>;
}

type ButtonProps = Omit<PressableProps, 'style'> & { label: string; variant?: ButtonVariant; style?: StyleProp<ViewStyle> };

export function Button({ label, variant = 'primary', style, ...props }: ButtonProps) {
  const buttonVariant = componentVariants.button[variant];
  return <Pressable {...props} style={({ pressed }) => [styles.button, { backgroundColor: buttonVariant.backgroundColor, borderColor: buttonVariant.borderColor }, pressed && styles.pressed, style]}>
    <Text style={[styles.buttonText, { color: buttonVariant.textColor }]}>{label}</Text>
  </Pressable>;
}

export function Field(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.muted} {...props} style={[styles.input, props.multiline && styles.multiline, props.style]} />;
}

export function LoadingState({ title = 'Loading', message = 'Preparing this section…' }: { title?: string; message?: string }) {
  return <Card variant="quiet"><Row><Stack><Eyebrow>{title}</Eyebrow><Muted>{message}</Muted></Stack><ActivityIndicator color={colors.red} /></Row></Card>;
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return <Card variant="quiet"><Eyebrow>Empty State</Eyebrow><H2>{title}</H2><Muted>{message}</Muted>{action}</Card>;
}

export function ErrorState({ title = 'Something needs attention', message }: { title?: string; message: string }) {
  return <Card variant="danger"><Badge label="Review" variant="danger" /><H2>{title}</H2><Body>{message}</Body></Card>;
}

export function DemoNotice() {
  return <Card variant="quiet"><Badge label="Demo Mode" variant="muted" /><Muted>Supabase is not configured yet, so this preview uses safe local mock data and does not publish or expose real community content.</Muted></Card>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 92 },
  hero: { backgroundColor: colors.backgroundSoft, borderColor: colors.borderStrong, borderWidth: 1, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md, overflow: 'hidden' },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  stack: { gap: spacing.xs, flex: 1 },
  brandWrap: { width: 54, height: 54, borderRadius: radius.md, backgroundColor: colors.redSoft, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  crossVertical: { position: 'absolute', width: 7, height: 34, borderRadius: radius.sm, backgroundColor: colors.cream },
  crossHorizontal: { position: 'absolute', top: 18, width: 25, height: 7, borderRadius: radius.sm, backgroundColor: colors.cream },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  eyebrow: { color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.8, fontSize: typography.micro, fontWeight: '800' },
  h1: { color: colors.text, fontSize: typography.h1, lineHeight: 36, fontWeight: '900', letterSpacing: -0.7 },
  h2: { color: colors.text, fontSize: typography.h2, lineHeight: 28, fontWeight: '800', letterSpacing: -0.3 },
  body: { color: colors.textSoft, fontSize: typography.body, lineHeight: 25 },
  muted: { color: colors.muted, fontSize: typography.small, lineHeight: 20 },
  badge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  badgeText: { fontSize: typography.micro, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  button: { padding: spacing.md, borderRadius: radius.md, alignItems: 'center', borderWidth: 1 },
  pressed: { opacity: 0.82 },
  buttonText: { fontWeight: '900', letterSpacing: 0.2 },
  input: { color: colors.text, backgroundColor: colors.surfaceSoft, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: typography.body },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
});
