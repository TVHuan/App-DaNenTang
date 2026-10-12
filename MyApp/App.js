import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background.jpg')} style={styles.container}></ImageBackground>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>Tạ Văn Huấn</Text>
          <Text style={styles.major}>Sinh viên CNTT</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Môn</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3.6</Text>
          <Text style={styles.statLabel}>GPA</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>120</Text>
          <Text style={styles.statLabel}>Tín chỉ</Text>
        </View>
      </View>

      <View style={styles.list}>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>Thông tin cá nhân</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>Lịch học</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>Bảng điểm</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>Cài đặt</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#D32F2F',
    paddingTop: 40,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D32F2F',
    marginRight: 16,
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  major: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  list: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
});
