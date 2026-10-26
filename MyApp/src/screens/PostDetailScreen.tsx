import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { CURRENT_USER } from '../data/mockData';

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

interface Comment {
  id: string;
  name: string;
  avatar: string;
  content: string;
  timeAgo: string;
  likes: number;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    name: 'Nguyễn Văn Nam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Chúc mừng anh em nhé! Quá tự hào luôn 🔥👏',
    timeAgo: '1 giờ',
    likes: 12,
  },
  {
    id: 'c2',
    name: 'Phương Linh',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    content: 'Trận đấu hồi hộp nghẹt thở đến những giây phút cuối cùng luôn ấy!',
    timeAgo: '45 phút',
    likes: 8,
  },
];

export const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation();
  const { post } = route.params;

  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      content: commentText.trim(),
      timeAgo: 'Vừa xong',
      likes: 0,
    };

    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Navbar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Bài viết của {post.author.name}</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea}>
          {/* Post Header */}
          <View style={styles.authorRow}>
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
            <View style={styles.authorMeta}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.timeAgo}>{post.timeAgo} • {post.privacy === 'public' ? '🌍' : '👥'}</Text>
            </View>
          </View>

          {/* Post Text */}
          <Text style={styles.content}>{post.content}</Text>

          {/* Post Image */}
          {post.image && (
            <Image source={{ uri: post.image }} style={styles.postImage} />
          )}

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.likeBadgeRow}>
              <Text style={styles.likeBadge}>👍</Text>
              <Text style={styles.statsText}>{likesCount.toLocaleString()}</Text>
            </View>
            <Text style={styles.statsText}>{comments.length} bình luận</Text>
          </View>

          <View style={styles.divider} />

          {/* Interactive buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleToggleLike}>
              <Text style={[styles.actionBtnText, liked && styles.activeText]}>
                👍 {liked ? 'Đã thích' : 'Thích'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>💬 Bình luận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>↗️ Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Comments Section */}
          <View style={styles.commentsContainer}>
            <Text style={styles.commentSectionTitle}>Tất cả bình luận ({comments.length})</Text>

            {comments.map(c => (
              <View key={c.id} style={styles.commentItem}>
                <Image source={{ uri: c.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentBubbleWrapper}>
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentAuthor}>{c.name}</Text>
                    <Text style={styles.commentContent}>{c.content}</Text>
                  </View>
                  <View style={styles.commentMetaRow}>
                    <Text style={styles.commentTime}>{c.timeAgo}</Text>
                    <TouchableOpacity>
                      <Text style={styles.commentAction}>Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.commentAction}>Phản hồi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Comment Input */}
        <View style={styles.inputContainer}>
          <Image source={{ uri: CURRENT_USER.avatar }} style={styles.myInputAvatar} />
          <TextInput
            style={styles.textInput}
            placeholder="Viết bình luận..."
            placeholderTextColor="#8A8D91"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
            onPress={handleSendComment}
            disabled={!commentText.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
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
  keyboardContainer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0D4',
  },
  backBtn: {
    padding: 6,
  },
  backBtnText: {
    fontSize: 32,
    lineHeight: 32,
    color: '#050505',
    fontWeight: '300',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
  },
  searchBtn: {
    padding: 6,
  },
  searchIcon: {
    fontSize: 18,
  },
  scrollArea: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  authorMeta: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
  },
  timeAgo: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    color: '#050505',
    lineHeight: 22,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  likeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeBadge: {
    fontSize: 14,
    marginRight: 6,
  },
  statsText: {
    fontSize: 13,
    color: '#65676B',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CED0D4',
  },
  actionRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65676B',
  },
  activeText: {
    color: '#1877F2',
  },
  commentsContainer: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 30,
  },
  commentSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#65676B',
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4E6EB',
  },
  commentBubbleWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  commentBubble: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#050505',
    marginBottom: 2,
  },
  commentContent: {
    fontSize: 14,
    color: '#050505',
    lineHeight: 18,
  },
  commentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    paddingLeft: 6,
  },
  commentTime: {
    fontSize: 12,
    color: '#65676B',
  },
  commentAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#65676B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0D4',
    backgroundColor: '#FFFFFF',
  },
  myInputAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  textInput: {
    flex: 1,
    height: 38,
    backgroundColor: '#F0F2F5',
    borderRadius: 19,
    paddingHorizontal: 14,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#050505',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#E4E6EB',
  },
  sendIcon: {
    fontSize: 15,
    color: '#FFFFFF',
  },
});
