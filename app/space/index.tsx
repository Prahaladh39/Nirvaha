import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, Bell, Heart, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { theme } from '../../constants/theme';
import Toast from 'react-native-toast-message';

export interface SpacePost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  emotionType: string;
  likesCount: number;
  likedBy: string[];
  createdAt: any;
}

const getEmotionColor = (emotion: string) => {
  switch (emotion) {
    case 'Emotional Health': return '#429373';
    case 'Anxiety': return '#D3755C';
    case 'Self-Discovery': return '#8B74A5';
    case 'Relationships': return '#D4A373';
    case 'Mindfulness': return '#B38B4D';
    case 'Healing': return '#6B8E73';
    case 'Sleep': return '#7B88A1';
    case 'Gratitude': return '#D1A370';
    default: return theme.colors.healingGreen;
  }
};

const getEmotionEmoji = (emotion: string) => {
  switch (emotion) {
    case 'Emotional Health': return '💚';
    case 'Anxiety': return '⚡';
    case 'Self-Discovery': return '🔮';
    case 'Relationships': return '🤝';
    case 'Mindfulness': return '🧘';
    case 'Healing': return '🌿';
    case 'Sleep': return '🌙';
    case 'Gratitude': return '✨';
    default: return '💭';
  }
};

export default function SpaceScreen() {
  const [posts, setPosts] = useState<SpacePost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
    const notifRef = collection(db, 'users', currentUser.uid, 'notifications');
    const unsub = onSnapshot(notifRef, (snap) => {
      setUnreadCount(snap.docs.length);
    });
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    const q = query(
      collection(db, 'spacePosts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: SpacePost[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as SpacePost);
      });
      setPosts(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching space posts:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLikeToggle = async (post: SpacePost) => {
    if (!currentUser) {
      Toast.show({ type: 'info', text1: 'Authentication Required', text2: 'Please log in to like a post.' });
      return;
    }

    const postRef = doc(db, 'spacePosts', post.id);
    const hasLiked = post.likedBy?.includes(currentUser.uid);

    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(currentUser.uid),
          likesCount: Math.max(0, post.likesCount - 1)
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(currentUser.uid),
          likesCount: post.likesCount + 1
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPost = ({ item, index }: { item: SpacePost, index: number }) => {
    const hasLiked = currentUser ? item.likedBy?.includes(currentUser.uid) : false;

    // Simple relative time calculation
    const getRelativeTime = (timestamp: any) => {
      if (!timestamp) return 'Just now';
      const now = new Date();
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    };

    return (
      <Animated.View 
        entering={FadeInDown.duration(400).delay(index * 100)} 
        style={styles.card}
      >
        <Pressable onPress={() => router.push(`/space/${item.id}`)}>
          <View style={styles.cardHeader}>
            <View style={styles.authorRow}>
              <View style={styles.avatar}>
                <LinearGradient
                  colors={['rgba(50, 140, 140, 0.4)', 'rgba(142, 164, 150, 0.2)']}
                  style={StyleSheet.absoluteFill}
                />
              </View>
              <Text style={styles.authorName}>{item.authorName}</Text>
              <Text style={styles.bullet}>·</Text>
              <Text style={styles.timeText}>{getRelativeTime(item.createdAt)}</Text>
            </View>
          </View>

          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>
        </Pressable>

        <View style={styles.cardFooter}>
          <View style={[styles.emotionPill, { backgroundColor: `${getEmotionColor(item.emotionType)}20` }]}>
            <Text style={styles.emotionEmoji}>{getEmotionEmoji(item.emotionType)}</Text>
            <Text style={[styles.emotionText, { color: getEmotionColor(item.emotionType) }]}>{item.emotionType}</Text>
          </View>
          
          <Pressable 
            style={styles.likeButton}
            onPress={() => handleLikeToggle(item)}
            hitSlop={10}
          >
            <Heart 
              size={18} 
              color={hasLiked ? '#E74C3C' : 'rgba(255,255,255,0.4)'} 
              fill={hasLiked ? '#E74C3C' : 'transparent'} 
            />
            <Text style={[styles.likeCount, hasLiked && { color: '#E74C3C' }]}>
              {item.likesCount || 0}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={20} color="#FFFFFF" />
            </Pressable>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Nirvaha Space</Text>
              <Text style={styles.subtitle}>A Digital Sanctuary for the Soul</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={() => router.push('/space/notifications')}>
              <Bell size={20} color="rgba(255,255,255,0.7)" />
              {unreadCount > 0 && (
                <View style={styles.unreadBadge} />
              )}
            </Pressable>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={18} color="rgba(255,255,255,0.5)" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search through wisdom..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.healingGreen} />
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No wisdom shared yet. Be the first.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <Pressable 
        style={styles.fab} 
        onPress={() => router.push('/space/create')}
      >
        <Plus size={24} color={theme.colors.primaryForeground} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {},
  title: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    borderWidth: 1.5,
    borderColor: '#0A0A0A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: {
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(50, 140, 140, 0.2)',
  },
  authorName: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bullet: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  timeText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  postTitle: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  postContent: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  emotionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  emotionEmoji: {
    fontSize: 12,
  },
  emotionText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    fontWeight: '600',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likeCount: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 48 : 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.healingGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});
