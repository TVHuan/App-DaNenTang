import { UserProfile } from '../types';

export const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  MAIN_TABS: 'MainTabs',
  HOME_TAB: 'HomeTab',
  CONTACTS_TAB: 'ContactsTab',
  NOTIFICATIONS_TAB: 'NotificationsTab',
  SETTINGS_TAB: 'SettingsTab',
  CHAT: 'Chat',
} as const;

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Chat: {
    receiverId: string;
    receiverName: string;
    receiverAvatar?: string;
    receiverEmail?: string;
  };
};

export type MainTabParamList = {
  HomeTab: undefined;
  ContactsTab: undefined;
  NotificationsTab: undefined;
  SettingsTab: undefined;
};
