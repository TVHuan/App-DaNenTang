import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from '../types/navigation';
import { BottomTabNavigator } from './BottomTabNavigator';
import { StatsScreen } from '../screens/StatsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { CustomDrawerContent } from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 300,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          title: 'Trang chủ',
        }}
      />
      <Drawer.Screen
        name="StatisticsDrawer"
        component={StatsScreen}
        options={{
          title: 'Thống kê & Báo cáo',
        }}
      />
      <Drawer.Screen
        name="AboutDrawer"
        component={AboutScreen}
        options={{
          title: 'Thông tin ứng dụng',
        }}
      />
    </Drawer.Navigator>
  );
};
