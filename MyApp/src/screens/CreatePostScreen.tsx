import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CURRENT_USER } from '../data/mockData';

export const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');

  const handlePublish = () => {
    if (!content.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung bài viết!');
      return;
    }
    Alert.alert('Thành công', 'Bài viết đã được đăng lên Bảng tin!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo bài viết</Text>
          <TouchableOpacity
            style={[styles.publishBtn, !content.trim() && styles.publishBtnDisabled]}
            disabled={!content.trim()}
            onPress={handlePublish}
          >
            <Text
              style={[
                styles.publishBtnText,
                !content.trim() && styles.publishBtnTextDisabled,
              ]}
            >
              ĐĂNG
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Info & Privacy Row */}
        <View style={styles.userInfoRow}>
          <Image source={{ uri: CURRENT_USER.avatar }} style={styles.avatar} />
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{CURRENT_USER.name}</Text>
            <TouchableOpacity
              style={styles.privacyBadge}
              onPress={() => setPrivacy(p => (p === 'public' ? 'friends' : 'public'))}
            >
              <Text style={styles.privacyIcon}>
                {privacy === 'public' ? '🌍 Công khai' : '👥 Bạn bè'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Text Area */}
        <TextInput
          style={styles.inputArea}
          placeholder="Bạn đang nghĩ gì?"
          placeholderTextColor="#8A8D91"
          multiline
          autoFocus
          value={content}
          onChangeText={setContent}
        />

        {/* Action Toolbar */}
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Thêm vào bài viết của bạn</Text>
          <View style={styles.toolbarIcons}>
            <TouchableOpacity style={styles.toolIconBtn}>
              <Text style={styles.toolIcon}>🖼️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolIconBtn}>
              <Text style={styles.toolIcon}>👥</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolIconBtn}>
              <Text style={styles.toolIcon}>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolIconBtn}>
              <Text style={styles.toolIcon}>📍</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0D4',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 20,
    color: '#050505',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#050505',
  },
  publishBtn: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
  },
  publishBtnDisabled: {
    backgroundColor: '#E4E6EB',
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  publishBtnTextDisabled: {
    color: '#8A8D91',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userMeta: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#050505',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  privacyIcon: {
    fontSize: 12,
    color: '#050505',
    fontWeight: '600',
  },
  dropdownArrow: {
    fontSize: 9,
    color: '#65676B',
    marginLeft: 6,
  },
  inputArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 18,
    color: '#050505',
    textAlignVertical: 'top',
  },
  toolbar: {
    borderTopWidth: 1,
    borderColor: '#CED0D4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  toolbarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050505',
  },
  toolbarIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  toolIconBtn: {
    padding: 4,
  },
  toolIcon: {
    fontSize: 22,
  },
});
