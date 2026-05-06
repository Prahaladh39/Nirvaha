import { Slot, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import BottomNav from '../../components/navigation/BottomNav';

export default function TabLayout() {
  const pathname = usePathname();
  const showBottomNav = !pathname.includes('chat');

  return (
    <View style={styles.container}>
      {/* Content for the active tab screen */}
      <View style={styles.content}>
        <Slot />
      </View>
      
      {/* Floating Bottom Navigation */}
      {showBottomNav && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
  }
});
