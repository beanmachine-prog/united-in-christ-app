import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, PressableProps, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, componentVariants, radius, shadows, spacing, typography } from '@/constants/theme';

type CardVariant = keyof typeof componentVariants.card;
type ButtonVariant = keyof typeof componentVariants.button;
type StatusVariant = keyof typeof componentVariants.status;

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  </SafeAreaView>;
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

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return <View style={styles.sectionTitle}>{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<H2>{title}</H2></View>;
}

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
  return <Card variant="quiet"><Badge label="Coming soon" variant="muted" /><H2>{title}</H2><Muted>{message}</Muted>{action}</Card>;
}

export function ErrorState({ title = 'Something needs attention', message }: { title?: string; message: string }) {
  return <Card variant="danger"><Badge label="Review" variant="danger" /><H2>{title}</H2><Body>{message}</Body></Card>;
}

export function DemoNotice() {
  return <Card variant="quiet"><Badge label="Preview Mode" variant="muted" /><Muted>This first preview uses safe local content. Nothing is published, synced, or exposed until Supabase is configured and admin review is enabled.</Muted></Card>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md, paddingBottom: 112 },
  hero: { backgroundColor: colors.backgroundSoft, borderColor: colors.borderStrong, borderWidth: 1, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md, overflow: 'hidden' },
  card: { width: '100%', borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  stack: { gap: spacing.xs, flex: 1 },
  sectionTitle: { gap: spacing.xs, marginTop: spacing.sm },
  brandWrap: { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.redSoft, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  crossVertical: { position: 'absolute', width: 7, height: 36, borderRadius: radius.sm, backgroundColor: colors.cream },
  crossHorizontal: { position: 'absolute', top: 18, width: 26, height: 7, borderRadius: radius.sm, backgroundColor: colors.cream },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  eyebrow: { color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.8, fontSize: typography.micro, fontWeight: '800' },
  h1: { color: colors.text, fontSize: typography.h1, lineHeight: 37, fontWeight: '900', letterSpacing: -0.7 },
  h2: { color: colors.text, fontSize: typography.h2, lineHeight: 29, fontWeight: '800', letterSpacing: -0.3 },
  body: { color: colors.textSoft, fontSize: typography.body, lineHeight: 26 },
  muted: { color: colors.muted, fontSize: typography.small, lineHeight: 21 },
  badge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  badgeText: { fontSize: typography.micro, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  button: { width: '100%', minHeight: 50, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonText: { fontWeight: '900', letterSpacing: 0.3, fontSize: typography.small },
  input: { color: colors.text, backgroundColor: colors.surfaceSoft, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: typography.body, lineHeight: 22 },
  multiline: { minHeight: 132, textAlignVertical: 'top' },
});
