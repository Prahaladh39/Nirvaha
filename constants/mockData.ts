export interface ContentItem {
  id: string;
  title: string;
  image: string;
  tags: string[];
  duration?: string;
}

export const aiRecommendations: ContentItem[] = [
  { id: "1", title: "Yoga Nidra for Deep Rest", image: "photo-1545389336-cf090694435e", tags: ["Sleep", "Calm", "Relaxation"], duration: "35 min" },
  { id: "2", title: "Finding Purpose with Ikigai", image: "photo-1506744038136-46273834b3fb", tags: ["Focus", "Mindfulness", "Purpose"], duration: "48 min" },
  { id: "3", title: "Ocean Waves & Deep Breathing", image: "photo-1518495973542-4542c06a5843", tags: ["Relaxation", "Breathing", "Calm"], duration: "15 min" },
];

export const contentRows = [
  {
    title: "Guided Meditations",
    items: [
      { id: "4", title: "Morning Energy Boost", image: "photo-1441974231531-c6227db76b6e", tags: ["Morning", "Energy", "Joyful"], duration: "10 min" },
      { id: "5", title: "Evening Wind Down", image: "photo-1511671782779-c97d3d27a1d4", tags: ["Sleep", "Calm", "Stressed"], duration: "20 min" },
    ]
  }
];

export const soundCategories = [
  { id: "binaural", title: "Binaural Tones", trackCount: 12, moodTag: "Focus & Clarity" },
  { id: "mantras", title: "Mantras", trackCount: 18, moodTag: "Spiritual Balance" },
  { id: "nature", title: "Nature Sounds", trackCount: 24, moodTag: "Deep Relaxation" },
  { id: "frequency", title: "Healing Frequencies", trackCount: 9, moodTag: "Cellular Healing" },
];
