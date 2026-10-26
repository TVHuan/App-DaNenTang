import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MOCK_VIDEOS, VideoPost } from '../data/mockData';

export const WatchScreen = () => {
  const [videos] = useState<VideoPost[]>(MOCK_VIDEOS);
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});

  const toggleLike = (id: string) => {
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Video</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {['Dành cho bạn', 'Trực tiếp', 'Reels', 'Đang theo dõi', 'Đã lưu'].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tabButton, index === 0 && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, index === 0 && styles.tabTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Video Items */}
        {videos.map(video => {
          const isLiked = likedMap[video.id];

          return (
            <View key={video.id} style={styles.videoCard}>
              {/* Channel Meta */}
              <View style={styles.channelRow}>
                <Image source={{ uri: video.channelAvatar }} style={styles.channelAvatar} />
                <View style={styles.channelMeta}>
                  <Text style={styles.channelName}>{video.channelName}</Text>
                  <Text style={styles.timeAgo}>{video.timeAgo} • 🌍</Text>
                </View>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followBtnText}>Theo dõi</Text>
                </TouchableOpacity>
              </View>

              {/* Title */}
              <Text style={styles.videoTitle}>{video.title}</Text>

              {/* Video Thumbnail / Mock player */}
              <View style={styles.playerContainer}>
                <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
                <View style={styles.playButtonOverlay}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>08:24</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <Text style={styles.statsText}>👍 {video.likes}</Text>
                <Text style={styles.statsText}>{video.views} • {video.comments} bình luận</Text>
              </View>

              <View style={styles.divider} />

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => toggleLike(video.id)}
                >
                  <Text style={styles.actionBtnIcon}>👍</Text>
                  <Text style={[styles.actionBtnText, isLiked && styles.likedText]}>
                    {isLiked ? 'Đã thích' : 'Thích'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnIcon}>💬</Text>
                  <Text style={styles.actionBtnText}>Bình luận</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnIcon}>↗️</Text>
                  <Text style={styles.actionBtnText}>Chia sẻ</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

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
    backgroundColor: '#CED0D4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#050505',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  tabsRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E4E6EB',
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: '#E7F3FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050505',
  },
  tabTextActive: {
    color: '#1877F2',
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E4E6EB',
  },
  channelMeta: {
    flex: 1,
    marginLeft: 10,
  },
  channelName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#050505',
  },
  timeAgo: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 2,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E7F3FF',
  },
  followBtnText: {
    color: '#1877F2',
    fontWeight: '700',
    fontSize: 13,
  },
  videoTitle: {
    fontSize: 15,
    color: '#050505',
    paddingHorizontal: 12,
    paddingVertical: 8,
    lineHeight: 20,
  },
  playerContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    ...StyleSheet.absoluteFill,
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#65676B',
  },
  divider: {
    height: 1,
    backgroundColor: '#CED0D4',
    marginHorizontal: 12,
  },
  actionRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionBtnIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#65676B',
  },
  likedText: {
    color: '#1877F2',
  },
  footerSpacing: {
    height: 30,
  },
});
