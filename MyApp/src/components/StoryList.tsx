import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MOCK_STORIES, Story } from '../data/mockData';

interface StoryListProps {
  onStoryPress?: (story: Story) => void;
  onCreateStoryPress?: () => void;
}

export const StoryList: React.FC<StoryListProps> = ({
  onStoryPress,
  onCreateStoryPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {MOCK_STORIES.map(story => {
        if (story.isOwner) {
          return (
            <TouchableOpacity
              key={story.id}
              style={[styles.storyCard, styles.ownerCard]}
              activeOpacity={0.85}
              onPress={onCreateStoryPress}
            >
              <Image source={{ uri: story.storyImage }} style={styles.ownerTopImage} />
              <View style={styles.addIconContainer}>
                <Text style={styles.addIconText}>+</Text>
              </View>
              <Text style={styles.ownerText}>Tạo tin</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={story.id}
            style={styles.storyCard}
            activeOpacity={0.85}
            onPress={() => onStoryPress && onStoryPress(story)}
          >
            <Image source={{ uri: story.storyImage }} style={styles.storyBackground} />
            <View style={styles.avatarBorder}>
              <Image source={{ uri: story.userAvatar }} style={styles.storyAvatar} />
            </View>
            <Text style={styles.storyUserName} numberOfLines={2}>
              {story.userName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  storyCard: {
    width: 105,
    height: 180,
    borderRadius: 14,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1c1e21',
  },
  storyBackground: {
    ...StyleSheet.absoluteFill,
    resizeMode: 'cover',
  },
  avatarBorder: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2.5,
    borderColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: '#FFFFFF',
  },
  storyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  storyUserName: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ownerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E6EB',
  },
  ownerTopImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  addIconContainer: {
    position: 'absolute',
    top: 104,
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1877F2',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  ownerText: {
    marginTop: 22,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#050505',
  },
});
