import { NavigatorScreenParams } from '@react-navigation/native';
import { Post } from '../data/mockData';

export type MainTabParamList = {
  Feed: undefined;
  Friends: undefined;
  Watch: undefined;
  Notifications: undefined;
  Menu: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  PostDetail: { post: Post };
  Profile: { userId?: string };
  CreatePost: undefined;
};
