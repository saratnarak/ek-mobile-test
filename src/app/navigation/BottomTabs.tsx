import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabIcon } from '@/components/ui';
import { appBarOptions, colors } from '@/design';
import { AccountScreen } from '@/features/account';
import { SearchScreen } from '@/features/discovery';
import { HomeScreen } from '@/features/home';
import { OrdersScreen } from '@/features/orders';

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Order: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        ...appBarOptions,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name="search" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name="order" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
