import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { theme } from '../../constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

interface AppNotification {
  id: string;
  type: string;
  postId: string;
  postTitle: string;
  replierName: string;
  createdAt: any;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const notifRef = collection(db, 'users', currentUser.uid, 'notifications');
    const q = query(notifRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: AppNotification[] = [];
      const now = new Date().getTime();
      const docsToDelete: string[] = [];

      snapshot.forEach((document) => {
        const data = document.data();
        const createdAt = data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date();
        
        // Check if older than 48 hours
        const diffHours = (now - createdAt.getTime()) / (1000 * 60 * 60);
        
        if (diffHours >= 48) {
          docsToDelete.push(document.id);
        } else {
          fetched.push({ id: document.id, ...data } as AppNotification);
        }
      });

      // Lazy cleanup of old notifications
      docsToDelete.forEach(async (id) => {
        try {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'notifications', id));
        } catch (e) {
          console.error("Error auto-deleting old notification", e);
        }
      });

      setNotifications(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleClearAll = async () => {
    if (!currentUser || notifications.length === 0) return;
    setClearing(true);
    
    try {
      const batch = writeBatch(db);
      notifications.forEach((notif) => {
        const ref = doc(db, 'users', currentUser.uid, 'notifications', notif.id);
        batch.delete(ref);
      });
      await batch.commit();
      Toast.show({ type: 'success', text1: 'Notifications cleared' });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      Toast.show({ type: 'error', text1: 'Could not clear notifications' });
    } finally {
      setClearing(false);
    }
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

  const renderNotification = ({ item, index }: { item: AppNotification, index: number }) => {
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
        <Pressable 
          style={styles.notificationCard}
          onPress={() => router.push(`/space/${item.postId}`)}
        >
          <View style={styles.iconContainer}>
            <MessageCircle size={20} color="#B4A5D8" fill="#E8E1F4" />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.titleText}>New response</Text>
            <Text style={styles.bodyText}>
              {item.replierName} responded to your post "{item.postTitle}"
            </Text>
            <Text style={styles.timeText}>{getRelativeTime(item.createdAt)}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        
        {notifications.length > 0 && (
          <Pressable 
            onPress={handleClearAll} 
            disabled={clearing}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            {clearing ? (
              <ActivityIndicator size="small" color={theme.colors.healingGreen} />
            ) : (
              <Text style={styles.clearText}>Clear</Text>
            )}
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.healingGreen} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You have no new notifications.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  clearText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#F7F9F6', // Off-white card like the image
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6ECE5', // Subtle green/gray background for icon
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2F25',
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#4A5B53',
    lineHeight: 20,
    marginBottom: 8,
  },
  timeText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: '#8E9C95',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
  },
});
