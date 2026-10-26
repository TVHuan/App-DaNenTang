import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CURRENT_USER, MOCK_POSTS } from '../data/mockData';
import { PostCard } from '../components/PostCard';

export const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>{CURRENT_USER.name}</Text>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Cover & Avatar Header */}
        <View style={styles.headerImagesContainer}>
          <Image source={{ uri: CURRENT_USER.coverPhoto }} style={styles.coverPhoto} />
          <View style={styles.avatarContainer}>
            <Image source={{ uri: CURRENT_USER.avatar }} style={styles.avatar} />
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{CURRENT_USER.name}</Text>
          <Text style={styles.userBio}>{CURRENT_USER.bio}</Text>

          {/* Action Buttons Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.addStoryBtn}>
              <Text style={styles.addStoryText}>+ Thêm vào tin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.editProfileText}>Chỉnh sửa trang cá nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreOptionsBtn}>
              <Text style={styles.moreOptionsText}>⋯</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Details Section */}
          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>💼</Text>
              <Text style={styles.detailText}>{CURRENT_USER.work}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🎓</Text>
              <Text style={styles.detailText}>{CURRENT_USER.education}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>Sống tại Hà Nội, Việt Nam</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>👥</Text>
              <Text style={styles.detailText}>
                Có <Text style={styles.boldText}>{CURRENT_USER.friendsCount.toLocaleString()}</Text> người bạn
              </Text>
            </View>
          </View>

          {/* Edit Details Button */}
          <TouchableOpacity style={styles.editDetailsButton}>
            <Text style={styles.editDetailsButtonText}>Chỉnh sửa chi tiết công khai</Text>
          </TouchableOpacity>
        </View>

        {/* User Posts Heading */}
        <View style={styles.postsHeader}>
          <Text style={styles.postsTitle}>Bài viết của bạn</Text>
        </View>

        {/* User Posts Feed */}
        {MOCK_POSTS.slice(1, 2).map(post => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              author: {
                name: CURRENT_USER.name,
                avatar: CURRENT_USER.avatar,
              },
            }}
          />
        ))}

        <View style={styles.footerSpacing} />
      </ScrollView>
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
    backgroundColor: '#C9CCD1',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0D4',
  },
  navBtn: {
    padding: 6,
  },
  navBtnText: {
    fontSize: 32,
    lineHeight: 32,
    color: '#050505',
    fontWeight: '300',
  },
  navIcon: {
    fontSize: 18,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#050505',
  },
  headerImagesContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingBottom: 60,
  },
  coverPhoto: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    backgroundColor: '#E4E6EB',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E4E6EB',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E4E6EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    fontSize: 15,
  },
  userInfoSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#050505',
  },
  userBio: {
    fontSize: 14,
    color: '#050505',
    marginTop: 6,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },
  addStoryBtn: {
    flex: 1.2,
    backgroundColor: '#1877F2',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addStoryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  editProfileBtn: {
    flex: 1.4,
    backgroundColor: '#E4E6EB',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editProfileText: {
    color: '#050505',
    fontWeight: '700',
    fontSize: 13,
  },
  moreOptionsBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#E4E6EB',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOptionsText: {
    fontSize: 20,
    color: '#050505',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#CED0D4',
    marginVertical: 14,
  },
  detailsList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 18,
    width: 28,
  },
  detailText: {
    fontSize: 15,
    color: '#050505',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  editDetailsButton: {
    marginTop: 16,
    backgroundColor: '#E7F3FF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editDetailsButtonText: {
    color: '#1877F2',
    fontWeight: '700',
    fontSize: 14,
  },
  postsHeader: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0D4',
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#050505',
  },
  footerSpacing: {
    height: 40,
  },
});
