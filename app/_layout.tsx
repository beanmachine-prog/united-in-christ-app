import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return <>
    <StatusBar style="light" backgroundColor={colors.background} />
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: '900' },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.background },
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin/index" options={{ title: 'Admin Dashboard' }} />
    </Stack>
  </>;
}
