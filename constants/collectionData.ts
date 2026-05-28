export interface CollectionItem {
  id: string;
  title: string;
  description: string;
  moodTag: string;
  icon: string;
  duration: string;
  category: string;
  audioFile: any; // Using require()
  coverImage?: string;
  videoFile?: any;
}

export interface CollectionCategory {
  id: string;
  title: string;
  description: string;
  moodTag: string;
  icon: string;
  itemCount: number;
  colors: [string, string];
  coverImage?: string;
  videoFile?: any;
}

export const collectionCategories: CollectionCategory[] = [
  {
    id: "yogasutras",
    title: "Yoga Sutras",
    description: "Ancient wisdom for modern living, exploring Patanjali's timeless teachings.",
    moodTag: "Wisdom",
    icon: "🧘",
    itemCount: 7,
    colors: ["#4A3F55", "#2A2530"],
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "gita",
    title: "Modern Gita",
    description: "The Bhagavad Gita reimagined for today's challenges and dilemmas.",
    moodTag: "Guidance",
    icon: "📿",
    itemCount: 18,
    colors: ["#5A4422", "#2B2010"],
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "reset",
    title: "Modern Reset",
    description: "Quick practices to reset your mind in our always-on world.",
    moodTag: "Reset",
    icon: "🔄",
    itemCount: 5,
    colors: ["#273A57", "#151A2D"],
    coverImage: "https://tse1.mm.bing.net/th/id/OIP.xKoQ0iUH1GluPlzL4v1Y7AHaE8?r=0&cb=thfvnextfalcon&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: "lifestyle",
    title: "Lifestyle OS",
    description: "Operating system for a balanced, intentional life.",
    moodTag: "Lifestyle",
    icon: "🌱",
    itemCount: 6,
    colors: ["#2D5A4C", "#172D27"],
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "innerhealing",
    title: "Inner Healing",
    description: "Practical wisdom for life's most common struggles and emotional healing.",
    moodTag: "Healing",
    icon: "💡",
    itemCount: 10,
    colors: ["#684B25", "#2B1E0F"],
    coverImage: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop",
  },
];

export const collectionItems: Record<string, CollectionItem[]> = {
  yogasutras: [
    {
      id: "ys-1",
      title: "Mind Waves",
      description: "Understanding the ripples of the mind.",
      moodTag: "Foundation",
      icon: "🌊",
      duration: "5:30",
      category: "yogasutras",
      audioFile: require('../assets/audio/collection/yogasutras/Yoga sutra 1 mind waves.mp3'),
      coverImage: "https://images.unsplash.com/photo-1518115391078-f67bd5f2d967?q=80&w=600&auto=format&fit=crop",
      videoFile: require('../assets/videos/Yoga sutra 1 mind waves.mp4'),
    },
    {
      id: "ys-2",
      title: "Root Cause",
      description: "Identifying the source of mental fluctuations.",
      moodTag: "Insight",
      icon: "🌱",
      duration: "6:15",
      category: "yogasutras",
      audioFile: require('../assets/audio/collection/yogasutras/Yoga sutra 2 root cause.mp3'),
      coverImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=600&auto=format&fit=crop",
      videoFile: require('../assets/videos/Yoga sutra 2 root cause.mp4'),
    },
    {
      id: "ys-3",
      title: "Stillness Ladder",
      description: "Climbing towards inner peace.",
      moodTag: "Path",
      icon: "🪜",
      duration: "7:20",
      category: "yogasutras",
      audioFile: require('../assets/audio/collection/yogasutras/Yoga sutras 3 stillness ladder.mp3'),
      coverImage: "https://images.unsplash.com/photo-1473186533642-424295830239?q=80&w=600&auto=format&fit=crop",
      videoFile: require('../assets/videos/Yoga sutras 3 stillness ladder.mp4'),
    },
    {
      id: "ys-4",
      title: "Abhyas Engine",
      description: "The power of consistent practice.",
      moodTag: "Discipline",
      icon: "⚙️",
      duration: "5:45",
      category: "yogasutras",
      audioFile: require('../assets/audio/collection/yogasutras/Yoga Sutras 4 Abhyas engine.mp3'),
      coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=600&auto=format&fit=crop",
      videoFile: require('../assets/videos/Yoga Sutras 4 Abhyas engine.mp4'),
    },
    {
      id: "ys-5",
      title: "Vairagya Method",
      description: "The art of non-attachment.",
      moodTag: "Freedom",
      icon: "🦅",
      duration: "8:10",
      category: "yogasutras",
      audioFile: require('../assets/audio/collection/yogasutras/Yoga sutras 5 Vairagya Method.mp3'),
      coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
      videoFile: require('../assets/videos/Yoga sutras 5 Vairagya Method.mp4'),
    },
    {
      id: "ys-6",
      title: "Sankalp",
      description: "Setting your inner intention.",
      moodTag: "Focus",
      icon: "🎯",
      duration: "6:50",
      category: "yogasutras",
      audioFile: require('../assets/audio/collection/yogasutras/Yoga Sutras 6 Sankalp.mp3'),
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
      videoFile: require('../assets/videos/Yoga Sutras 6 Sankalp.mp4'),
    },
    {
      id: "ys-7",
      title: "Inner Freedom",
      description: "Reaching the state of Samadhi.",
      moodTag: "Unity",
      icon: "☀️",
      duration: "9:10",
      category: "yogasutras",
      audioFile: require('../assets/audio/collection/yogasutras/Yoga Sutras 7 Inner Freedom.mp3'),
      coverImage: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format&fit=crop",
      videoFile: require('../assets/videos/Yoga Sutras 7 Inner Freedom.mp4'),
    },
  ],
  gita: [
    { id: "g-1", title: "Chapter 1: Arjuna's Dilemma", description: "Facing the internal conflict.", moodTag: "Identity", icon: "⚔️", duration: "6:20", category: "gita", audioFile: require('../assets/audio/collection/gita/gita chap 1.mp3'), coverImage: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 1.mp4') },
    { id: "g-2", title: "Chapter 2: Path of Knowledge", description: "Wisdom of the soul.", moodTag: "Wisdom", icon: "🧠", duration: "7:45", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 2.mp3'), coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 2.mp4') },
    { id: "g-3", title: "Chapter 3: Path of Action", description: "Doing your duty.", moodTag: "Action", icon: "🎭", duration: "6:30", category: "gita", audioFile: require('../assets/audio/collection/gita/gita 3.mp3'), coverImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 3.mp4') },
    { id: "g-4", title: "Chapter 4: Spiritual Knowledge", description: "Divine wisdom.", moodTag: "Divine", icon: "💫", duration: "9:15", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 4.mp3'), coverImage: "https://images.unsplash.com/photo-1467632499275-7a693a761056?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 4.mp4') },
    { id: "g-5", title: "Chapter 5: Karma Yoga", description: "Renunciation of action.", moodTag: "Peace", icon: "🕊️", duration: "8:25", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 5.mp3'), coverImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 5.mp4') },
    { id: "g-6", title: "Chapter 6: Meditation", description: "Mastering the mind.", moodTag: "Focus", icon: "🧘", duration: "7:55", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 6.mp3'), coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 6.mp4') },
    { id: "g-7", title: "Chapter 7: Knowledge of the Absolute", description: "The nature of reality.", moodTag: "Truth", icon: "☀️", duration: "8:10", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 7.mp3'), coverImage: "https://images.unsplash.com/photo-1502134273026-acb7cad13c58?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 7.mp4') },
    { id: "g-8", title: "Chapter 8: Path to the Eternal", description: "The ultimate goal.", moodTag: "Eternal", icon: "🌌", duration: "8:05", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 8.mp3'), coverImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 8.mp4') },
    { id: "g-9", title: "Chapter 9: The Most Confidential Knowledge", description: "The secret of devotion.", moodTag: "Love", icon: "❤️", duration: "8:45", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 9.mp3'), coverImage: "https://images.unsplash.com/photo-1516589174382-c68555f1480e?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 9.mp4') },
    { id: "g-10", title: "Chapter 10: Divine Opulence", description: "Seeing God in everything.", moodTag: "Vision", icon: "👁️", duration: "9:30", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 10.mp3'), coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 10.mp4') },
    { id: "g-11", title: "Chapter 11: The Universal Form", description: "The cosmic vision.", moodTag: "Awe", icon: "🌟", duration: "7:20", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 11.mp3'), coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 11.mp4') },
    { id: "g-12", title: "Chapter 12: Bhakti Yoga", description: "The path of devotion.", moodTag: "Devotion", icon: "🙏", duration: "7:40", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 12.mp3'), coverImage: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 12.mp4') },
    { id: "g-13", title: "Chapter 13: Field and Knower", description: "Body and soul.", moodTag: "Awareness", icon: "🧭", duration: "7:10", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 13.mp3'), coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 13.mp4') },
    { id: "g-14", title: "Chapter 14: Three Gunas", description: "Qualities of nature.", moodTag: "Nature", icon: "🌈", duration: "7:50", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 14.mp3'), coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 14.mp4') },
    { id: "g-15", title: "Chapter 15: The Supreme Person", description: "The tree of life.", moodTag: "Life", icon: "🌳", duration: "8:15", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 15.mp3'), coverImage: "https://images.unsplash.com/photo-1447752823016-521b11905a91?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 15.mp4') },
    { id: "g-16", title: "Chapter 16: Divine and Demonic", description: "Choice of path.", moodTag: "Choice", icon: "😇", duration: "7:25", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 16.mp3'), coverImage: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 5.mp4') },
    { id: "g-17", title: "Chapter 17: Divisions of Faith", description: "Three types of faith.", moodTag: "Faith", icon: "💫", duration: "8:00", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 17.mp3'), coverImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 10.mp4') },
    { id: "g-18", title: "Chapter 18: Final Liberation", description: "The ultimate surrender.", moodTag: "Freedom", icon: "🏆", duration: "6:50", category: "gita", audioFile: require('../assets/audio/collection/gita/gita ch 18.mp3'), coverImage: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/gita 12.mp4') },
  ],
  reset: [
    { id: "r-1", title: "When Mind Stops", description: "Find clarity in silence.", moodTag: "Clarity", icon: "🔇", duration: "6:15", category: "reset", audioFile: require('../assets/audio/collection/Reset/Mind Reset 1 when mind stops.mp3'), coverImage: "https://images.unsplash.com/photo-1499209974431-9eaa37a11944?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Mind Reset 1 when mind stops.mp4') },
    { id: "r-2", title: "Worst Case Scenario", description: "Overcoming fear of the future.", moodTag: "Fearless", icon: "😨", duration: "7:20", category: "reset", audioFile: require('../assets/audio/collection/Reset/Mind Reset 2 Worst Case.mp3'), coverImage: "https://images.unsplash.com/photo-1518115391078-f67bd5f2d967?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Mind Reset 2 Worst Case.mp4') },
    { id: "r-3", title: "Small Decisions", description: "Relieving pressure from choices.", moodTag: "Ease", icon: "⚖️", duration: "6:45", category: "reset", audioFile: require('../assets/audio/collection/Reset/Mind reset 3 Small decision big pressure.mp3'), coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Mind reset 3 Small decision big pressure.mp4') },
    { id: "r-4", title: "Repeat Thinking", description: "Breaking the loop of thoughts.", moodTag: "Breakthrough", icon: "🔄", duration: "8:30", category: "reset", audioFile: require('../assets/audio/collection/Reset/Mind reset 4 Repeat repeat thinking.mp3'), coverImage: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Mind reset 4 Repeat repeat thinking.mp4') },
    { id: "r-5", title: "What is Clarity?", description: "Defining a clear mind.", moodTag: "Clarity", icon: "💎", duration: "6:05", category: "reset", audioFile: require('../assets/audio/collection/Reset/mind reser 5 what is clarity.mp3'), coverImage: "https://images.unsplash.com/photo-1518115391078-f67bd5f2d967?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/mind reser 5 what is clarity.mp4') },
  ],
  lifestyle: [
    { id: "l-1", title: "Dinacharya", description: "The daily rhythm of health.", moodTag: "Rhythm", icon: "🌅", duration: "6:30", category: "lifestyle", audioFile: require('../assets/audio/collection/Lifestyle/Lifestyle OS - Dinacharya.mp3'), coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Lifestyle OS -1 Dinacharya.mp4') },
    { id: "l-2", title: "Guna Santulan", description: "Balancing the three qualities.", moodTag: "Balance", icon: "☯️", duration: "7:45", category: "lifestyle", audioFile: require('../assets/audio/collection/Lifestyle/Lifestyle OS 2 - Guna Santulan.mp3'), coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Lifestyle OS 2 - Guna Santulan.mp4') },
    { id: "l-3", title: "Sync Food & Mind", description: "Mindful eating for mental health.", moodTag: "Mindful", icon: "🍏", duration: "6:40", category: "lifestyle", audioFile: require('../assets/audio/collection/Lifestyle/Lifestyle OS 3 - Sync Food & Mind.mp3'), coverImage: "https://images.unsplash.com/photo-1490818387583-1baba5e6382b?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Lifestyle OS 3 - Sync Food & Mind.mp4') },
    { id: "l-4", title: "Art of Sleep", description: "Mastering the science of rest.", moodTag: "Rest", icon: "🌙", duration: "6:50", category: "lifestyle", audioFile: require('../assets/audio/collection/Lifestyle/Lifestyle OS 4 - Art of sleep.mp3'), coverImage: "https://images.unsplash.com/photo-1511295742364-911243512971?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Lifestyle OS 4 - Art of sleep.mp4') },
    { id: "l-5", title: "Control Your Senses", description: "The power of Pratyahara.", moodTag: "Mastery", icon: "🛡️", duration: "5:25", category: "lifestyle", audioFile: require('../assets/audio/collection/Lifestyle/Lifestyle OS 5 - Control your senses.mp3'), coverImage: "https://images.unsplash.com/photo-1467632499275-7a693a761056?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Lifestyle OS 5 - Control your senses.mp4') },
    { id: "l-6", title: "Energy Path", description: "Managing your vital energy.", moodTag: "Energy", icon: "⚡", duration: "6:35", category: "lifestyle", audioFile: require('../assets/audio/collection/Lifestyle/Lifestyle OS 6 - Energy path.mp3'), coverImage: "https://images.unsplash.com/photo-1502134273026-acb7cad13c58?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/Lifestyle OS 6 - Energy path.mp4') },
  ],
  innerhealing: [
    { id: "ih-1", title: "Career Anxiety", description: "Navigating workplace stress.", moodTag: "Calm", icon: "💼", duration: "12:50", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Career anxiety and overthinking.mp3'), coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 1.mp4') },
    { id: "ih-2", title: "Fear of Failure", description: "Embracing growth over perfection.", moodTag: "Growth", icon: "🌱", duration: "12:35", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Fear of Failure & Rejection.mp3'), coverImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 2.mp4') },
    { id: "ih-3", title: "Healing Heartbreak", description: "Moving through emotional pain.", moodTag: "Healing", icon: "💔", duration: "11:15", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Healing After Heartbreak.mp3'), coverImage: "https://images.unsplash.com/photo-1516589174382-c68555f1480e?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 3.mp4') },
    { id: "ih-4", title: "Who Am I?", description: "Discovering your true self.", moodTag: "Identity", icon: "👤", duration: "13:20", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Identity - Who am I really.mp3'), coverImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 4.mp4') },
    { id: "ih-5", title: "Comparison & Insecurity", description: "Finding peace in your journey.", moodTag: "Peace", icon: "⚖️", duration: "13:10", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Jealousy, comparison, insecurity.mp3'), coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 1.mp4') },
    { id: "ih-6", title: "Loneliness", description: "Finding connection within.", moodTag: "Connection", icon: "🤝", duration: "13:05", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Loneliness & Emptiness.mp3'), coverImage: "https://images.unsplash.com/photo-1514820402329-de527fdd2e6d?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 2.mp4') },
    { id: "ih-7", title: "Meaning & Purpose", description: "Defining your reason for being.", moodTag: "Purpose", icon: "🌟", duration: "13:25", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Meaning & Purpose of Life.mp3'), coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 3.mp4') },
    { id: "ih-8", title: "Relationships", description: "Building healthy attachments.", moodTag: "Love", icon: "💑", duration: "12:10", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Relationships & Attachment,.mp3'), coverImage: "https://images.unsplash.com/photo-1516589174382-c68555f1480e?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 4.mp4') },
    { id: "ih-9", title: "Self-Worth", description: "Building core confidence.", moodTag: "Confidence", icon: "💪", duration: "14:15", category: "innerhealing", audioFile: require('../assets/audio/collection/InnerHealing/Self-worth & confidence.mp3'), coverImage: "https://images.unsplash.com/photo-1506126279646-a6602b7d3466?q=80&w=600&auto=format&fit=crop", videoFile: require('../assets/videos/inner-healing 1.mp4') },
  ],
};

export const getCollectionItems = (categoryId: string): CollectionItem[] => {
  return collectionItems[categoryId] || [];
};

export const getCollectionItemById = (
  categoryId: string,
  itemId: string,
): CollectionItem | undefined => {
  return collectionItems[categoryId]?.find((item) => item.id === itemId);
};
