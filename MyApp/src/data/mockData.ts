export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  timeAgo: string;
  privacy: 'public' | 'friends';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
}

export interface Story {
  id: string;
  userName: string;
  userAvatar: string;
  storyImage: string;
  isOwner?: boolean;
}

export interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  timeAgo: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  avatar: string;
  timeAgo: string;
  isRead: boolean;
  type: 'like' | 'comment' | 'friend' | 'tag' | 'group';
}

export interface VideoPost {
  id: string;
  channelName: string;
  channelAvatar: string;
  title: string;
  timeAgo: string;
  thumbnail: string;
  views: string;
  likes: string;
  comments: string;
}

export const CURRENT_USER = {
  name: 'Lê Minh Châu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  coverPhoto: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
  bio: '✨ Đam mê công nghệ, nhiếp ảnh và du lịch 🎒\n📍 Hà Nội, Việt Nam 🇻🇳',
  work: 'Kỹ sư phần mềm tại TechCorp',
  education: 'Tốt nghiệp Đại học Bách Khoa',
  friendsCount: 1248,
};

export const MOCK_STORIES: Story[] = [
  {
    id: 'owner',
    userName: 'Tạo tin',
    userAvatar: CURRENT_USER.avatar,
    storyImage: CURRENT_USER.avatar,
    isOwner: true,
  },
  {
    id: 's1',
    userName: 'Nguyễn Văn Nam',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 's2',
    userName: 'Trần Thị Mai',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 's3',
    userName: 'Hoàng Long',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 's4',
    userName: 'Phương Linh',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&auto=format&fit=crop&q=80',
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: {
      name: 'VnExpress',
      avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    timeAgo: '2 giờ trước',
    privacy: 'public',
    content: 'Cầu thủ trẻ tỏa sáng giúp đội tuyển giành chiến thắng ngoạn mục trong trận chung kết giải bóng đá khu vực tối qua! 🔥🏆 Cả nước cùng ăn mừng chiến thắng lịch sử.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    likes: 3420,
    comments: 512,
    shares: 120,
    liked: false,
  },
  {
    id: 'p2',
    author: {
      name: 'Nguyễn Hải Đăng',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    timeAgo: '4 giờ trước',
    privacy: 'friends',
    content: 'Cuối tuần làm một chuyến cắm trại trốn khói bụi thành phố. Không khí trong lành, bình minh ở Đà Lạt thật sự chưa bao giờ làm mình thất vọng! 🏕️🌲🌤️',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80',
    likes: 428,
    comments: 63,
    shares: 14,
    liked: true,
  },
  {
    id: 'p3',
    author: {
      name: 'Cộng đồng Lập Trình Viên',
      avatar: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    timeAgo: '6 giờ trước',
    privacy: 'public',
    content: 'React Native New Architecture và React Navigation v7 mang lại hiệu năng cực kỳ mượt mà. Anh em dev đã sẵn sàng nâng cấp dự án chưa nào? 🚀💻 #reactnative #coding',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    likes: 856,
    comments: 142,
    shares: 98,
    liked: false,
  },
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'f1',
    name: 'Đặng Thảo My',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    mutualFriends: 18,
    timeAgo: '1 ngày',
  },
  {
    id: 'f2',
    name: 'Hoàng Minh Tuấn',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    mutualFriends: 5,
    timeAgo: '3 ngày',
  },
  {
    id: 'f3',
    name: 'Bùi Diệu Linh',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    mutualFriends: 24,
    timeAgo: '5 ngày',
  },
];

export const MOCK_VIDEOS: VideoPost[] = [
  {
    id: 'v1',
    channelName: 'Khám Phá Thiên Nhiên',
    channelAvatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    title: 'Top 10 địa điểm ngắm hoàng hôn đẹp nhất hành tinh mà bạn phải đến một lần trong đời 🌅',
    timeAgo: 'Hôm qua',
    thumbnail: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop&q=80',
    views: '1.2M lượt xem',
    likes: '45K',
    comments: '2.1K',
  },
  {
    id: 'v2',
    channelName: 'Góc Ẩm Thực Phố',
    channelAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
    title: 'Bí quyết nấu phở bò chuẩn vị truyền thống Hà Nội nước dùng trong veo thơm nức mũi 🍜😋',
    timeAgo: '3 ngày trước',
    thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
    views: '840K lượt xem',
    likes: '32K',
    comments: '1.8K',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Trần Thị Mai và 14 người khác đã thích bài viết của bạn.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timeAgo: '15 phút trước',
    isRead: false,
    type: 'like',
  },
  {
    id: 'n2',
    title: 'Hoàng Long đã bình luận về ảnh của bạn: "Đẹp quá anh ơi! Cho em xin toạ độ với."',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    timeAgo: '45 phút trước',
    isRead: false,
    type: 'comment',
  },
  {
    id: 'n3',
    title: 'Đặng Thảo My đã gửi cho bạn một lời mời kết bạn.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    timeAgo: '2 giờ trước',
    isRead: true,
    type: 'friend',
  },
  {
    id: 'n4',
    title: 'Cộng đồng Lập Trình Viên đã thêm một bài viết mới: "Hội thảo React & AI Summit 2026".',
    avatar: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=150&auto=format&fit=crop&q=80',
    timeAgo: '5 giờ trước',
    isRead: true,
    type: 'group',
  },
];
