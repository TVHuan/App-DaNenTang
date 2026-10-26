import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Đăng ký cả appName và các alias tương thích để tránh lỗi "has not been registered"
AppRegistry.registerComponent(appName, () => App);
if (appName !== 'ThucHanh3') {
  AppRegistry.registerComponent('ThucHanh3', () => App);
}
if (appName !== 'ThucHanh4') {
  AppRegistry.registerComponent('ThucHanh4', () => App);
}
