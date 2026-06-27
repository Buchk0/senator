import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/navigation/custom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="hotel" />
      <Tabs.Screen name="restaurants" />
      <Tabs.Screen name="spa" />
      <Tabs.Screen name="conference" />
      <Tabs.Screen name="vip" />
      <Tabs.Screen name="promotions" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="photos" />
      <Tabs.Screen name="coupons" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
