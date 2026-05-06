import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export interface MoodEntry {
  id: string;
  mood: string;
  timestamp: string; // ISO string
}

export function useMoodLog() {
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Get date for 7 days ago to only pull recent logs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const q = query(
      collection(db, `users/${user.uid}/moodLogs`),
      where("timestamp", ">=", sevenDaysAgo.toISOString()),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs: MoodEntry[] = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as MoodEntry);
      });
      setMoodLog(logs);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { moodLog, loading };
}
