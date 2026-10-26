import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { FacebookHeader } from '../components/FacebookHeader';
import { StoryList } from '../components/StoryList';
import { PostCard } from '../components/PostCard';
import { CURRENT_USER, MOCK_POSTS, Post } from '../data/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FeedScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FacebookHeader
        onSearchPress={() => {}}
        onMessengerPress={() => {}}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1877F2']} />
        }
      >
        {/* Create Post Prompt */}
        <View style={styles.createPostBox}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', {})}>
            <Image source={{ uri: CURRENT_USER.avatar }} style={styles.userAvatar} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inputPrompt}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.inputPromptText}>Bạn đang nghĩ gì?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.photoIcon}>🖼️</Text>
            <Text style={styles.photoLabel}>Ảnh</Text>
          </TouchableOpacity>
        </View>

        {/* Stories Section */}
        <StoryList
          onCreateStoryPress={() => navigation.navigate('CreatePost')}
          onStoryPress={() => {}}
        />

        {/* Posts Feed */}
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onPressPost={() => navigation.navigate('PostDetail', { post })}
            onPressComment={() => navigation.navigate('PostDetail', { post })}
            onPressAuthor={() => navigation.navigate('Profile', {})}
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
  createPostBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E4E6EB',
  },
  inputPrompt: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#CED0D4',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  inputPromptText: {
    color: '#65676B',
    fontSize: 15,
  },
  photoButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIcon: {
    fontSize: 20,
  },
  photoLabel: {
    fontSize: 11,
    color: '#65676B',
    marginTop: 2,
    fontWeight: '500',
  },
  footerSpacing: {
    height: 20,
  },
});
