import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onSelect,
  scrollable = false,
  style,
}) => {
  const content = items.map((item) => {
    const isActive = activeId === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {item.label}
        </Text>
        {item.count !== undefined && (
          <View
            style={[
              styles.countBadge,
              isActive ? styles.countBadgeActive : styles.countBadgeInactive,
            ]}
          >
            <Text
              style={[
                styles.countText,
                isActive ? styles.countTextActive : styles.countTextInactive,
              ]}
            >
              {item.count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.container, styles.scrollContainer, style]}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5', // Zinc 100
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  scrollContainer: {
    paddingHorizontal: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#71717A', // Zinc 500
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#09090B', // Zinc 950
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: '#18181B',
  },
  countBadgeInactive: {
    backgroundColor: '#E4E4E7',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  countTextInactive: {
    color: '#71717A',
  },
});
