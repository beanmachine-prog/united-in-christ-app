import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return <Tabs screenOptions={{
    tabBarStyle: { backgroundColor: colors.backgroundSoft, borderTopColor: colors.border, height: 86, paddingBottom: 24, paddingTop: 10 },
    tabBarActiveTintColor: colors.cream,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelStyle: { fontWeight: '800', fontSize: 11, letterSpacing: 0.1 },
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    headerTitleStyle: { fontWeight: '900' },
    headerShadowVisible: false,
  }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
    <Tabs.Screen name="scripture" options={{ title: 'Scripture', tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} /> }} />
    <Tabs.Screen name="prayer" options={{ title: 'Prayer', tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} /> }} />
    <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }} />
    <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="menu" color={color} size={size} /> }} />
  </Tabs>;
}
