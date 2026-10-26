import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Post } from '../data/mockData';

interface PostCardProps {
  post: Post;
  onPressPost?: () => void;
  onPressAuthor?: () => void;
  onPressComment?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPressPost,
  onPressAuthor,
  onPressComment,
}) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleToggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
      setLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setLiked(true);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorRow} onPress={onPressAuthor} activeOpacity={0.7}>
          <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          <View style={styles.authorMeta}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {post.author.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheck}>✓</Text>
                </View>
              )}
            </View>
            <View style={styles.subMetaRow}>
              <Text style={styles.timeAgo}>{post.timeAgo}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.privacyIcon}>
                {post.privacy === 'public' ? '🌍' : '👥'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <TouchableOpacity onPress={onPressPost} activeOpacity={0.9}>
        <Text style={styles.content}>{post.content}</Text>
      </TouchableOpacity>

      {/* Post Image */}
      {post.image && (
        <TouchableOpacity onPress={onPressPost} activeOpacity={0.95}>
          <Image source={{ uri: post.image }} style={styles.postImage} />
        </TouchableOpacity>
      )}

      {/* Stats (Likes, Comments, Shares) */}
      <View style={styles.statsRow}>
        <View style={styles.likeStat}>
          <View style={styles.likeBadge}>
            <Text style={styles.likeBadgeIcon}>👍</Text>
          </View>
          <Text style={styles.statCountText}>{likesCount.toLocaleString()}</Text>
        </View>

        <View style={styles.commentShareStat}>
          <Text style={styles.statCountText}>{post.comments} bình luận</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.statCountText}>{post.shares} chia sẻ</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleToggleLike} activeOpacity={0.7}>
          <Text style={[styles.actionBtnIcon, liked && styles.activeIcon]}>
            {liked ? '👍' : '👍'}
          </Text>
          <Text style={[styles.actionBtnText, liked && styles.activeText]}>
            Thích
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onPressComment} activeOpacity={0.7}>
          <Text style={styles.actionBtnIcon}>💬</Text>
          <Text style={styles.actionBtnText}>Bình luận</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Text style={styles.actionBtnIcon}>↗️</Text>
          <Text style={styles.actionBtnText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0D4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E4E6EB',
  },
  authorMeta: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#050505',
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  verifiedCheck: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: '#65676B',
  },
  dotSeparator: {
    marginHorizontal: 4,
    color: '#65676B',
    fontSize: 12,
  },
  privacyIcon: {
    fontSize: 11,
  },
  moreButton: {
    padding: 6,
  },
  moreText: {
    fontSize: 18,
    color: '#65676B',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 15,
    color: '#050505',
    lineHeight: 21,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    backgroundColor: '#F0F2F5',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  likeStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  likeBadgeIcon: {
    fontSize: 11,
  },
  commentShareStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCountText: {
    fontSize: 13,
    color: '#65676B',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CED0D4',
    marginHorizontal: 12,
  },
  actionRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 4,
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
  activeIcon: {
    opacity: 1,
  },
  activeText: {
    color: '#1877F2',
    fontWeight: '700',
  },
});
