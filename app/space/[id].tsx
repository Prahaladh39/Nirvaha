import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ArrowLeft, Send, Heart } from 'lucide-react-native';
import { doc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { theme } from '../../constants/theme';
import Toast from 'react-native-toast-message';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
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

export default function SpacePostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!id) return;

    // Fetch Post Details
    const postRef = doc(db, 'spacePosts', id);
    const unsubPost = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        Toast.show({ type: 'error', text1: 'Post not found' });
        router.back();
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching post detail:", error);
      setLoading(false);
    });

    // Fetch Comments
    const commentsRef = collection(db, 'spacePosts', id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsubComments = onSnapshot(q, (snapshot) => {
      const fetched: Comment[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(fetched);
    }, (error) => {
      console.error("Error fetching comments:", error);
    });

    return () => {
      unsubPost();
      unsubComments();
    };
  }, [id]);

  const handleLikeToggle = async () => {
    if (!currentUser || !post) {
      Toast.show({ type: 'info', text1: 'Authentication Required', text2: 'Please log in to like.' });
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
          likesCount: (post.likesCount || 0) + 1
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !currentUser || !id) return;
    
    setIsSubmitting(true);
    try {
      let authorName = 'Anonymous Soul';
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data()?.name) {
          authorName = userDoc.data().name;
        } else if (currentUser.displayName) {
          authorName = currentUser.displayName;
        } else if (currentUser.email) {
          authorName = currentUser.email.split('@')[0];
        }
      } catch (e) {
        console.warn("Could not fetch user doc for name:", e);
        if (currentUser.displayName) authorName = currentUser.displayName;
        else if (currentUser.email) authorName = currentUser.email.split('@')[0];
      }

      await addDoc(collection(db, 'spacePosts', id, 'comments'), {
        authorId: currentUser.uid,
        authorName,
        content: newComment.trim(),
        createdAt: serverTimestamp()
      });

      // Send notification if not commenting on own post
      if (post && currentUser.uid !== post.authorId) {
        await addDoc(collection(db, 'users', post.authorId, 'notifications'), {
          type: 'reply',
          postId: id,
          postTitle: post.title,
          replierName: authorName,
          createdAt: serverTimestamp()
        });
      }

      setNewComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
      Toast.show({ type: 'error', text1: 'Failed to post reply' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFullDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: 'numeric', minute: '2-digit' 
    });
  };

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

  const renderComment = ({ item, index }: { item: Comment, index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)} style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.smallAvatar}>
          <LinearGradient
            colors={['rgba(50, 140, 140, 0.4)', 'rgba(142, 164, 150, 0.2)']}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View style={styles.commentHeaderRight}>
          <Text style={styles.commentAuthor}>{item.authorName}</Text>
          <Text style={styles.commentTime}>{getRelativeTime(item.createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </Animated.View>
  );

  if (loading || !post) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.healingGreen} />
      </SafeAreaView>
    );
  }

  const hasLiked = currentUser ? post.likedBy?.includes(currentUser.uid) : false;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Wisdom</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.postSection}>
              <View style={styles.authorRow}>
                <View style={styles.avatar}>
                  <LinearGradient
                    colors={['rgba(50, 140, 140, 0.4)', 'rgba(142, 164, 150, 0.2)']}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
                <View>
                  <Text style={styles.authorName}>{post.authorName}</Text>
                  <View style={[styles.emotionPill, { backgroundColor: `${getEmotionColor(post.emotionType)}20`, marginTop: 4 }]}>
                    <Text style={styles.emotionEmoji}>{getEmotionEmoji(post.emotionType)}</Text>
                    <Text style={[styles.emotionText, { color: getEmotionColor(post.emotionType) }]}>{post.emotionType}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>

              <Text style={styles.fullTimestamp}>{formatFullDate(post.createdAt)}</Text>

              <View style={styles.postFooter}>
                <Pressable 
                  style={styles.likeButton}
                  onPress={handleLikeToggle}
                  hitSlop={10}
                >
                  <Heart 
                    size={20} 
                    color={hasLiked ? '#E74C3C' : 'rgba(255,255,255,0.4)'} 
                    fill={hasLiked ? '#E74C3C' : 'transparent'} 
                  />
                  <Text style={[styles.likeCount, hasLiked && { color: '#E74C3C' }]}>
                    {post.likesCount || 0}
                  </Text>
                </Pressable>
              </View>
              
              <View style={styles.divider} />
              <Text style={styles.commentsTitle}>
                {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
              </Text>
            </View>
          }
          renderItem={renderComment}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add to the wisdom..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <Pressable 
            style={[styles.sendButton, (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled]}
            onPress={handleSendComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#0A0A0A" />
            ) : (
              <Send size={18} color="#0A0A0A" />
            )}
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
  postSection: {
    padding: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(50, 140, 140, 0.2)',
  },
  authorName: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emotionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  emotionEmoji: {
    fontSize: 10,
  },
  emotionText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: '600',
  },
  postTitle: {
    fontFamily: theme.typography.display,
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  postContent: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
    marginBottom: 16,
  },
  fullTimestamp: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 24,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  likeCount: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  commentsTitle: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  commentCard: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(50, 140, 140, 0.2)',
  },
  commentHeaderRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  commentTime: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  commentContent: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    paddingLeft: 36, // Align with text
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0A0A0A',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    color: '#FFFFFF',
    fontFamily: theme.typography.body,
    fontSize: 14,
    maxHeight: 120,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.healingGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
