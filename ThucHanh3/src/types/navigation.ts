import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  StudentListTab: undefined;
  StatsTab: undefined;
  AddStudentTab: undefined;
  AboutTab: undefined;
};

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  StatisticsDrawer: undefined;
  AboutDrawer: undefined;
};

export type RootStackParamList = {
  DrawerRoot: NavigatorScreenParams<DrawerParamList>;
  StudentDetail: { studentId: string };
  EditStudent: { studentId: string };
  AddStudent: undefined;
};
