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
import { MOCK_FRIEND_REQUESTS, FriendRequest } from '../data/mockData';

export const FriendsScreen = () => {
  const [requests, setRequests] = useState<FriendRequest[]>(MOCK_FRIEND_REQUESTS);
  const [confirmedIds, setConfirmedIds] = useState<{ [id: string]: boolean }>({});

  const handleConfirm = (id: string) => {
    setConfirmedIds(prev => ({ ...prev, [id]: true }));
  };

  const handleDelete = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Top bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bạn bè</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Filter Tags */}
        <View style={styles.tagRow}>
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>Gợi ý</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>Bạn bè của bạn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Friend Requests Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Lời mời kết bạn <Text style={styles.counterText}>({requests.length})</Text>
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        {requests.map(req => {
          const isConfirmed = confirmedIds[req.id];

          return (
            <View key={req.id} style={styles.requestItem}>
              <Image source={{ uri: req.avatar }} style={styles.avatar} />
              <View style={styles.requestInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{req.name}</Text>
                  <Text style={styles.timeAgo}>{req.timeAgo}</Text>
                </View>
                <Text style={styles.mutualFriends}>
                  {req.mutualFriends} bạn chung
                </Text>

                {isConfirmed ? (
                  <View style={styles.confirmedBox}>
                    <Text style={styles.confirmedText}>✓ Đã chấp nhận lời mời kết bạn</Text>
                  </View>
                ) : (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => handleConfirm(req.id)}
                    >
                      <Text style={styles.confirmButtonText}>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(req.id)}
                    >
                      <Text style={styles.deleteButtonText}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#050505',
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  tagRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tagButton: {
    backgroundColor: '#E4E6EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050505',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E6EB',
    marginVertical: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#050505',
  },
  counterText: {
    color: '#E41E3F',
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 15,
    color: '#1877F2',
    fontWeight: '600',
  },
  requestItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E4E6EB',
  },
  requestInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
  },
  timeAgo: {
    fontSize: 12,
    color: '#65676B',
  },
  mutualFriends: {
    fontSize: 13,
    color: '#65676B',
    marginTop: 2,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1877F2',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E4E6EB',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#050505',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmedBox: {
    paddingVertical: 8,
  },
  confirmedText: {
    color: '#31A24C',
    fontWeight: '600',
    fontSize: 13,
  },
  footerSpacing: {
    height: 30,
  },
});
