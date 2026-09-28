import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PROVINCES,
  REGION_TABS,
  removeVietnameseAccents,
} from '../data/provinces';
import { Province, Region } from '../types/weather';
import { WeatherTheme } from '../styles/theme';

interface Props {
  visible: boolean;
  currentProvince: Province;
  theme: WeatherTheme;
  onSelectProvince: (province: Province) => void;
  onClose: () => void;
}

export const ProvincePickerModal: React.FC<Props> = ({
  visible,
  currentProvince,
  theme,
  onSelectProvince,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('all');

  const filteredProvinces = useMemo(() => {
    let list = PROVINCES;

    // Filter by region tab
    if (selectedRegion !== 'all') {
      list = list.filter((p) => p.region === selectedRegion);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const normalizedQuery = removeVietnameseAccents(searchQuery);
      list = list.filter((p) => {
        const nameNorm = removeVietnameseAccents(p.name);
        const shortNameNorm = removeVietnameseAccents(p.shortName);
        return (
          nameNorm.includes(normalizedQuery) ||
          shortNameNorm.includes(normalizedQuery)
        );
      });
    }

    return list;
  }, [searchQuery, selectedRegion]);

  const popularProvinces = useMemo(() => {
    return PROVINCES.filter((p) => p.isPopular);
  }, []);

  const handleSelect = (item: Province) => {
    onSelectProvince(item);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.primaryBg,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Chọn Tỉnh / Thành Phố
            </Text>
            <Text style={[styles.subTitle, { color: theme.textMuted }]}>
              Dự báo thời tiết 40 tỉnh thành Việt Nam
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.closeButton,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeIcon, { color: theme.textPrimary }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Tìm kiếm theo tên tỉnh hoặc thành phố..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearText, { color: theme.textMuted }]}>
                Xóa
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Popular Picks */}
        <View style={styles.popularSection}>
          <Text style={[styles.popularTitle, { color: theme.textSecondary }]}>
            ĐỊA ĐIỂM PHỔ BIẾN
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularProvinces}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.popularList}
            renderItem={({ item }) => {
              const isSelected = item.id === currentProvince.id;
              return (
                <TouchableOpacity
                  style={[
                    styles.popularChip,
                    {
                      backgroundColor: isSelected
                        ? theme.accent
                        : theme.cardBg,
                      borderColor: isSelected
                        ? theme.accent
                        : theme.cardBorder,
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.popularChipText,
                      {
                        color: isSelected ? '#000000' : theme.textPrimary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {item.shortName}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Region Filter Tabs */}
        <View style={styles.tabBar}>
          {REGION_TABS.map((tab) => {
            const isActive = selectedRegion === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabItem,
                  isActive && [
                    styles.activeTabItem,
                    { borderBottomColor: theme.accent },
                  ],
                ]}
                onPress={() => setSelectedRegion(tab.key)}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? theme.accent : theme.textMuted },
                    isActive && styles.boldTabLabel,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Provinces List */}
        <FlatList
          data={filteredProvinces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                Không tìm thấy tỉnh thành phù hợp với từ khóa "{searchQuery}"
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isSelected = item.id === currentProvince.id;
            return (
              <TouchableOpacity
                style={[
                  styles.provinceItem,
                  {
                    backgroundColor: isSelected
                      ? theme.cardHighlight
                      : theme.cardBg,
                    borderColor: isSelected ? theme.accent : theme.cardBorder,
                  },
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.provinceLeft}>
                  <View
                    style={[
                      styles.provinceIndexCircle,
                      {
                        backgroundColor: isSelected
                          ? theme.accent
                          : 'rgba(255,255,255,0.08)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.provinceIndexText,
                        {
                          color: isSelected ? '#000000' : theme.textSecondary,
                        },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.provinceName,
                        {
                          color: isSelected
                            ? theme.accent
                            : theme.textPrimary,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.coordsText,
                        { color: theme.textMuted },
                      ]}
                    >
                      Vĩ độ {item.latitude.toFixed(2)}° • Kinh độ{' '}
                      {item.longitude.toFixed(2)}°
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View
                    style={[
                      styles.activeBadge,
                      { backgroundColor: theme.accent },
                    ]}
                  >
                    <Text style={styles.activeBadgeText}>Đang chọn</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
  },
  popularSection: {
    marginTop: 6,
    marginBottom: 10,
  },
  popularTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 8,
  },
  popularList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  popularChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  popularChipText: {
    fontSize: 13,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomWidth: 2,
  },
  tabLabel: {
    fontSize: 13,
  },
  boldTabLabel: {
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    gap: 10,
  },
  provinceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  provinceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  provinceIndexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  provinceIndexText: {
    fontSize: 11,
    fontWeight: '700',
  },
  provinceName: {
    fontSize: 15,
    fontWeight: '600',
  },
  coordsText: {
    fontSize: 11,
    marginTop: 2,
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
