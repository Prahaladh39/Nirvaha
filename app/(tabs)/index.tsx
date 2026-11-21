import { StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ui/ScreenContainer';
import GreetingHeader from '../../components/home/GreetingHeader';
import EmotionChips from '../../components/home/EmotionChips';
import HeroCarousel from '../../components/home/HeroCarousel';
import BookingsBanner from '../../components/home/BookingsBanner';
import EventsRail from '../../components/home/EventsRail';
import CollectionRail from '../../components/home/CollectionRail';
import SoundRail from '../../components/home/SoundRail';
import CompactTilesGrid from '../../components/home/CompactTile';
import AncientPlacesCard from '../../components/home/AncientPlacesCard';
import AncientCharacterCard from '../../components/home/AncientCharacterCard';
import TempleOfBalanceCard from '../../components/home/TempleOfBalanceCard';
import SmartActions from '../../components/home/SmartActions';

export default function Home() {
  return (
    <ScreenContainer
      scrollable
      hasBottomTab
      statusBarStyle="light"
      style={styles.safeArea}
      scrollContentStyle={styles.scrollContent}
    >
      <GreetingHeader />
      <EmotionChips />
      <HeroCarousel />
      <BookingsBanner />
      <EventsRail />
      <CollectionRail />
      <SoundRail />
      <CompactTilesGrid />
      <AncientPlacesCard />
      <AncientCharacterCard />
      <TempleOfBalanceCard />
      <SmartActions />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Dark theme background
  },
  scrollContent: {
    // Spacing at the bottom is calculated dynamically by ScreenContainer
  }
});
