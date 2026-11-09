import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Send,
  MapPin,
  ExternalLink,
  Navigation as NavigationIcon,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import {
  getChatId,
  sendMessage,
  subscribeMessages,
  markChatAsRead,
} from '../../services/chatService';
import { subscribeUserProfile } from '../../services/userService';
import { getCurrentLocation } from '../../services/locationService';
import { ChatMessage, LocationData, UserProfile } from '../../types';
import { RootStackParamList } from '../../navigation/routes';
import UserAvatar from '../../components/common/UserAvatar';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatTime } from '../../utils/date';

type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ChatScreen() {
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { currentUser } = useAuth();

  const { receiverId, receiverName, receiverAvatar, receiverEmail } = route.params;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const chatId = currentUser?.uid ? getChatId(currentUser.uid, receiverId) : '';

  // 1. Lắng nghe trạng thái online/offline của người nhận realtime
  useEffect(() => {
    const unsubUser = subscribeUserProfile(receiverId, user => {
      if (user) {
        setOtherUser(user);
      }
    });

    return () => {
      unsubUser();
    };
  }, [receiverId]);

  // 2. Lắng nghe tin nhắn của cuộc trò chuyện realtime
  useEffect(() => {
    if (!chatId || !currentUser?.uid) return;

    // Đánh dấu đã đọc khi vừa mở cuộc trò chuyện
    markChatAsRead(currentUser.uid, receiverId);

    // Lắng nghe tin nhắn
    const unsubscribeMessages = subscribeMessages(chatId, msgs => {
      setMessages(msgs);
      // Đánh dấu đã đọc mỗi khi nhận tin mới trong lúc màn hình đang mở
      markChatAsRead(currentUser.uid, receiverId);
    });

    // Cleanup khi component unmount để không bị hiện lặp tin nhắn
    return () => {
      unsubscribeMessages();
    };
  }, [chatId, currentUser?.uid, receiverId]);

  // Gửi tin nhắn văn bản
  const handleSendText = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || !currentUser) return;

    try {
      setSending(true);
      setInputText('');
      await sendMessage(
        currentUser,
        {
          uid: receiverId,
          displayName: otherUser?.displayName || receiverName,
          avatar: otherUser?.avatar || receiverAvatar,
          email: otherUser?.email || receiverEmail,
        },
        textToSend,
        'text'
      );
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể gửi tin nhắn.');
    } finally {
      setSending(false);
    }
  };

  // Gửi tin nhắn vị trí GPS
  const handleSendLocation = async () => {
    if (!currentUser) return;

    try {
      setSharingLocation(true);
      const loc: LocationData = await getCurrentLocation();

      await sendMessage(
        currentUser,
        {
          uid: receiverId,
          displayName: otherUser?.displayName || receiverName,
          avatar: otherUser?.avatar || receiverAvatar,
          email: otherUser?.email || receiverEmail,
        },
        loc.address || 'Đã chia sẻ vị trí',
        'location',
        loc
      );
    } catch (err: any) {
      Alert.alert('Lỗi vị trí', err.message || 'Không thể lấy vị trí hiện tại.');
    } finally {
      setSharingLocation(false);
    }
  };

  // Mở bản đồ Google Maps
  const handleOpenMap = (loc?: LocationData) => {
    if (!loc) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Thông báo', 'Không thể mở ứng dụng bản đồ.');
    });
  };

  // Render từng bong bóng tin nhắn
  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isSelf = item.senderId === currentUser?.uid;
    const timeString = formatTime(new Date(item.createdAt));

    return (
      <View
        style={[
          styles.messageRow,
          isSelf ? styles.messageRowSelf : styles.messageRowOther,
        ]}
      >
        {!isSelf && (
          <UserAvatar
            name={otherUser?.displayName || receiverName}
            avatarUri={otherUser?.avatar || receiverAvatar}
            size="sm"
            style={styles.senderAvatar}
          />
        )}

        <View
          style={[
            styles.bubble,
            isSelf ? styles.bubbleSelf : styles.bubbleOther,
            item.type === 'location' && styles.bubbleLocation,
          ]}
        >
          {item.type === 'location' ? (
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <View
                  style={[
                    styles.locationPinBg,
                    isSelf ? styles.locationPinBgSelf : styles.locationPinBgOther,
                  ]}
                >
                  <MapPin size={18} color={isSelf ? '#FFFFFF' : colors.primary} />
                </View>
                <Text
                  style={[
                    styles.locationTitle,
                    isSelf ? styles.textSelf : styles.textOther,
                  ]}
                >
                  Vị trí chia sẻ
                </Text>
              </View>

              <Text
                style={[
                  styles.locationCoords,
                  isSelf ? styles.textSelfMuted : styles.textOtherMuted,
                ]}
              >
                {item.location?.address ||
                  `Tọa độ: ${item.location?.latitude.toFixed(4)}, ${item.location?.longitude.toFixed(4)}`}
              </Text>

              <TouchableOpacity
                style={[
                  styles.openMapBtn,
                  isSelf ? styles.openMapBtnSelf : styles.openMapBtnOther,
                ]}
                onPress={() => handleOpenMap(item.location)}
              >
                <NavigationIcon
                  size={14}
                  color={isSelf ? colors.primary : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.openMapText,
                    isSelf ? styles.openMapTextSelf : styles.openMapTextOther,
                  ]}
                >
                  Xem trên bản đồ
                </Text>
                <ExternalLink
                  size={12}
                  color={isSelf ? colors.primary : '#FFFFFF'}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.messageText, isSelf ? styles.textSelf : styles.textOther]}>
              {item.text}
            </Text>
          )}

          <Text
            style={[
              styles.messageTime,
              isSelf ? styles.messageTimeSelf : styles.messageTimeOther,
            ]}
          >
            {timeString}
          </Text>
        </View>
      </View>
    );
  };

  const isReceiverOnline = otherUser ? otherUser.isOnline : false;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <UserAvatar
            name={otherUser?.displayName || receiverName}
            avatarUri={otherUser?.avatar || receiverAvatar}
            size="sm"
            isOnline={isReceiverOnline}
            showStatus={true}
          />

          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>
              {otherUser?.displayName || receiverName}
            </Text>
            <View style={styles.headerStatusRow}>
              <View
                style={[
                  styles.headerStatusDot,
                  isReceiverOnline ? styles.dotOnline : styles.dotOffline,
                ]}
              />
              <Text
                style={[
                  styles.headerStatusText,
                  isReceiverOnline && styles.headerStatusTextOnline,
                ]}
              >
                {isReceiverOnline ? 'Đang hoạt động' : 'Không hoạt động'}
              </Text>
            </View>
          </View>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>
                Hãy gửi tin nhắn đầu tiên để bắt đầu trò chuyện!
              </Text>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={handleSendLocation}
            disabled={sharingLocation}
          >
            {sharingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <MapPin size={22} color={colors.primary} />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
            ]}
            onPress={handleSendText}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send
                size={18}
                color={inputText.trim() ? '#FFFFFF' : colors.textMuted}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingRight: spacing.sm,
  },
  headerInfo: {
    marginLeft: spacing.sm + 4,
    flex: 1,
  },
  headerName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  dotOnline: {
    backgroundColor: colors.success,
  },
  dotOffline: {
    backgroundColor: colors.textMuted,
  },
  headerStatusText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  headerStatusTextOnline: {
    color: colors.success,
    fontWeight: '600',
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  messageRowSelf: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    marginRight: spacing.xs + 2,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
  },
  bubbleSelf: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleLocation: {
    padding: spacing.sm + 2,
    minWidth: 220,
  },
  messageText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  textSelf: {
    color: '#FFFFFF',
  },
  textOther: {
    color: colors.text,
  },
  textSelfMuted: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  textOtherMuted: {
    color: colors.textSecondary,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeSelf: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  messageTimeOther: {
    color: colors.textMuted,
  },
  locationContainer: {
    gap: 6,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationPinBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPinBgSelf: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  locationPinBgOther: {
    backgroundColor: colors.primaryLight,
  },
  locationTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  locationCoords: {
    fontSize: 12,
  },
  openMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  openMapBtnSelf: {
    backgroundColor: '#FFFFFF',
  },
  openMapBtnOther: {
    backgroundColor: colors.primary,
  },
  openMapText: {
    fontSize: 12,
    fontWeight: '700',
  },
  openMapTextSelf: {
    color: colors.primary,
  },
  openMapTextOther: {
    color: '#FFFFFF',
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  emptyChatText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },
  locationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    maxHeight: 100,
    minHeight: 40,
    ...typography.body,
    color: colors.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
});

