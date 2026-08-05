export interface AncientPlace {
  id: string;
  name: string;
  sanskritName: string;
  location: string;
  state: string;
  region: string;
  river: string;
  primaryTheme: string;
  architecturalStyle: string;
  x: number;
  y: number;
  history: string;
  significance: string;
  contemporary: string;
  relevance: string;
}

export const ancientPlaces: AncientPlace[] = [
  {
    id: 'brihadishwara',
    name: 'Brihadishwara Temple',
    sanskritName: 'Rajarajesvaram • Peruvudaiyar Kovil',
    location: 'Thanjavur',
    state: 'Tamil Nadu',
    region: 'South',
    river: 'Cauvery River',
    primaryTheme: 'Chola Imperial Architecture',
    architecturalStyle: 'Dravidian (Chola period)',
    x: 235.35,
    y: 627.82,
    history: 'Built by the legendary Chola emperor Raja Raja Chola I in 1010 CE, the Brihadishwara Temple stands as the crowning achievement of Chola dynasty architecture. Designated a UNESCO World Heritage Site, the temple was constructed using granite blocks transported from quarries over 50 kilometers away. Its vimana (tower) rises 66 meters, making it one of the tallest temple towers in the world, crowned by an 80-ton monolithic capstone that was maneuvered into place using an inclined plane stretching over 6 kilometers.',
    significance: 'The temple represents the zenith of Dravidian architectural engineering. Its perfectly proportioned structure, massive Nandi statue carved from a single rock, and exquisite bronze sculptures reflect the Chola mastery of metallurgy, stone engineering, and artistic expression. The temple is an enduring symbol of sovereign power dedicated to cultural immortality.',
    contemporary: 'Modern structural analysis reveals that the temple was designed with an advanced understanding of load distribution—the shadow of the vimana never falls on the ground at noon due to its precise geometric proportions. The temple complex also houses one of the finest collections of Chola bronze sculptures and Bharatanatyam dance poses carved in stone.',
    relevance: 'Brihadishwara Temple reminds us that monumental achievements require vision, precision, and collective effort. It teaches that architecture can serve as a permanent expression of cultural identity and civilizational ambition.'
  },
  {
    id: 'sun-temple',
    name: 'Sun Temple',
    sanskritName: 'Konark • The Black Pagoda',
    location: 'Konark',
    state: 'Odisha',
    region: 'East',
    river: 'Bay of Bengal Coast (Chandrabhaga)',
    primaryTheme: 'Solar Worship & Cosmic Time',
    architecturalStyle: 'Kalinga (Eastern Ganga dynasty)',
    x: 377.46,
    y: 410.77,
    history: 'Erected around 1250 CE by King Narasimhadeva I of the Eastern Ganga dynasty, the Sun Temple at Konark was conceived as a colossal stone chariot of the Sun God Surya. European sailors once called it the "Black Pagoda" as it served as a major maritime landmark. The temple originally stood over 70 meters tall before partial collapse. It was built using chlorite, laterite, and khondalite stone by an estimated 1,200 artisans over 12 years.',
    significance: 'Designed as a massive 24-wheeled chariot drawn by seven horses, the temple is an astronomical instrument in stone. Each wheel functions as a precise sundial, capable of telling time to the minute. The temple celebrates the union of science, art, and devotion—encoding knowledge of celestial mechanics into its very architecture.',
    contemporary: 'The intricately carved wheels of the temple are studied by archaeo-astronomers for their accuracy in tracking solar movements. The temple\'s erotic sculptures are considered among the finest examples of medieval Indian art, reflecting a society that celebrated the full spectrum of human experience without inhibition.',
    relevance: 'The Sun Temple teaches that the pursuit of knowledge and beauty can be woven into a single monument. It stands as a reminder that ancient civilizations possessed sophisticated scientific understanding expressed through artistic magnificence.'
  },
  {
    id: 'ajanta',
    name: 'Ajanta Caves',
    sanskritName: 'Rock-Cut Buddhist Masterpiece',
    location: 'Aurangabad',
    state: 'Maharashtra',
    region: 'West',
    river: 'Waghora River',
    primaryTheme: 'Buddhist Art & Monasticism',
    architecturalStyle: 'Rock-cut (2nd cent. BCE – 6th cent. CE)',
    x: 164.92,
    y: 394.93,
    history: 'The 30 rock-cut caves of Ajanta were carved into a horseshoe-shaped cliff along the Waghora River over a span of nearly 800 years, from the 2nd century BCE to the 6th century CE. Abandoned and forgotten for centuries, they were rediscovered in 1819 by a British officer during a tiger hunt. The caves served as monsoon retreats for Buddhist monks and contain some of the earliest surviving examples of Indian wall painting.',
    significance: 'Ajanta represents the pinnacle of ancient Indian painting and sculpture. The murals depict Jataka tales with extraordinary detail—facial expressions, textile patterns, and atmospheric perspective that predate European Renaissance techniques by a millennium. The caves demonstrate the evolution of Buddhist art from Hinayana austerity to Mahayana expressiveness.',
    contemporary: 'Conservation scientists use advanced imaging techniques to study the mineral-based pigments used in the paintings, many of which retain their vibrancy after two millennia. The cave paintings have influenced art historians\' understanding of ancient Indian society, trade routes, and daily life.',
    relevance: 'Ajanta teaches that art created in devotion can transcend time itself. The caves remind us that isolation and contemplation can produce works of extraordinary beauty and cultural significance.'
  },
  {
    id: 'ellora',
    name: 'Ellora Caves',
    sanskritName: 'Verul Leni • Multi-Faith Heritage',
    location: 'Aurangabad',
    state: 'Maharashtra',
    region: 'West',
    river: 'Elaganga River',
    primaryTheme: 'Religious Harmony & Coexistence',
    architecturalStyle: 'Rock-cut (6th – 11th century CE)',
    x: 154.19,
    y: 407.45,
    history: 'Ellora comprises 34 caves carved between the 6th and 11th centuries CE—12 Buddhist, 17 Hindu, and 5 Jain—representing one of the world\'s most remarkable demonstrations of religious coexistence. The crown jewel is Cave 16, the Kailasa Temple, a monolithic structure carved top-down from a single basalt cliff. An estimated 200,000 tonnes of rock were excavated over decades to create this astonishing monument.',
    significance: 'Ellora is unique in world heritage as a site where three major religions—Buddhism, Hinduism, and Jainism—created sacred spaces side by side over centuries. The Kailasa Temple alone, carved from a single rock, represents engineering ambition unmatched in the ancient world. It symbolizes the Indian civilizational ethos of pluralism and mutual respect.',
    contemporary: 'Modern geological surveys reveal that the artisans of Ellora possessed an intuitive understanding of rock mechanics, selecting specific basalt layers for their structural integrity. The site continues to serve as a powerful symbol for interfaith dialogue and India\'s tradition of religious tolerance.',
    relevance: 'Ellora reminds humanity that diverse beliefs can not only coexist but enrich one another. The Kailasa Temple teaches that even the most ambitious visions can be realized through patient, sustained effort across generations.'
  },
  {
    id: 'hampi',
    name: 'Hampi',
    sanskritName: 'Vijayanagara • City of Victory',
    location: 'Hospet, Bellary',
    state: 'Karnataka',
    region: 'South',
    river: 'Tungabhadra River',
    primaryTheme: 'Vijayanagara Empire & Trade',
    architecturalStyle: 'Vijayanagara / Dravidian-Islamic fusion',
    x: 181.02,
    y: 519.26,
    history: 'Hampi was the capital of the Vijayanagara Empire (1336–1646 CE), one of the wealthiest and most powerful kingdoms in Indian history. At its peak in the 15th–16th centuries, the city had an estimated population of 500,000, making it the second-largest medieval city in the world after Beijing. Portuguese and Persian travelers described its markets overflowing with diamonds, silk, and spices. The city fell after the Battle of Talikota in 1565.',
    significance: 'Hampi\'s ruins spread across 26 square kilometers, featuring over 1,600 surviving structures including temples, royal enclosures, aqueducts, and bazaars. The Vittala Temple\'s iconic stone chariot and musical pillars that produce distinct notes when struck demonstrate the extraordinary integration of art, engineering, and acoustics achieved by Vijayanagara artisans.',
    contemporary: 'Archaeological excavations continue to reveal the sophistication of Vijayanagara urban planning, including advanced water management systems with interconnected tanks, channels, and sluice gates. The site\'s boulder-strewn landscape creates a surreal environment that attracts photographers, climbers, and history enthusiasts from around the world.',
    relevance: 'Hampi stands as a monument to the impermanence of empire and the endurance of culture. It teaches that even fallen civilizations leave behind knowledge and beauty that continue to inspire future generations.'
  },
  {
    id: 'dholavira',
    name: 'Dholavira',
    sanskritName: 'Kotada Timba • Harappan Metropolis',
    location: 'Khadirbet, Kutch',
    state: 'Gujarat',
    region: 'West',
    river: 'Seasonal (Mansar & Manhar streams)',
    primaryTheme: 'Indus Valley Civilization',
    architecturalStyle: 'Harappan Urban Planning (3000–1500 BCE)',
    x: 53.26,
    y: 315.42,
    history: 'Dholavira is one of the five largest Harappan cities and the most prominent archaeological site in India belonging to the Indus Valley Civilization, dating from approximately 3000 BCE to 1500 BCE. Inscribed as a UNESCO World Heritage Site in 2021, the settlement was occupied for over 1,500 years across seven cultural stages. It is located on Khadir island in the Great Rann of Kutch, once fed by seasonal rivers.',
    significance: 'Dholavira reveals an extraordinarily sophisticated urban civilization with a unique three-part city layout (citadel, middle town, and lower town), advanced water harvesting systems with 16 reservoirs, a massive stadium-like structure, and one of the world\'s earliest known signboards with Indus script characters. Its water management engineering remains relevant even today.',
    contemporary: 'The site\'s elaborate water conservation system—designed to capture every drop of rain and seasonal river flow in an arid environment—is studied by modern hydrologists as a model for sustainable water management in drought-prone regions. The site also provides crucial evidence about the decline of the Indus Valley Civilization.',
    relevance: 'Dholavira teaches that sustainable resource management is not a modern invention but an ancient wisdom. It reminds us that civilizations thrive or collapse based on their relationship with water and natural resources.'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    sanskritName: 'काशी • Kashi',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North',
    river: 'Ganges River',
    primaryTheme: 'Eternal City of Learning & Spirituality',
    architecturalStyle: 'Ancient Hindu, Buddhist & Indo-Islamic',
    x: 314.43,
    y: 281.17,
    history: 'Varanasi is one of the oldest continuously inhabited cities on Earth, with a history spanning over 3,000 years. Known as Kashi in ancient texts, it has been a center of learning, philosophy, and spirituality since the time of the Buddha, who gave his first sermon at nearby Sarnath around 528 BCE. The city has been a seat of Sanskrit learning, classical music, silk weaving, and theological debate for millennia.',
    significance: 'Varanasi occupies a unique position in Indian civilization as the city that never dies. Its 84 ghats along the Ganges serve as stages for the entire cycle of human existence—from morning prayers to cremation rites. The city has nurtured scholars, poets, musicians, and philosophers across ages, including Tulsidas, Kabir, and Ravidas.',
    contemporary: 'The recent Kashi Vishwanath Corridor project has restored the ancient pathway between the main temple and the Ganges, blending archaeological preservation with modern urban design. Varanasi\'s silk weaving industry, Banarasi sari tradition, and classical music gharana continue to thrive as living cultural heritage.',
    relevance: 'Varanasi teaches the acceptance of life\'s transient nature while celebrating its richness. It stands as proof that a city can reinvent itself across millennia while preserving its cultural soul and spiritual identity.'
  },
  {
    id: 'vrindavan',
    name: 'Vrindavan',
    sanskritName: 'वृन्दावन • Land of Sacred Groves',
    location: 'Mathura',
    state: 'Uttar Pradesh',
    region: 'North',
    river: 'Yamuna River',
    primaryTheme: 'Devotional Heritage & Bhakti Movement',
    architecturalStyle: 'Medieval Hindu Temple Architecture',
    x: 206.05,
    y: 227.24,
    history: 'Vrindavan, situated along the banks of the Yamuna River, is one of the most ancient pilgrimage sites in India, revered as the place where Lord Krishna spent his childhood. The town\'s recorded temple-building history spans from the 16th century, when the Six Goswamis of Vrindavan—disciples of Chaitanya Mahaprabhu—established major temples and codified Bhakti theology. Today the town contains over 5,000 temples.',
    significance: 'Vrindavan is the spiritual heart of the Bhakti movement, which democratized spirituality by emphasizing personal devotion over ritualistic hierarchy. The town\'s theology, music (especially Dhrupad and Haveli Sangeet), dance (Raas Leela), and art forms have profoundly influenced Indian culture. It represents the idea that divinity can be accessed through love and devotion by anyone, regardless of social status.',
    contemporary: 'Modern Vrindavan is a vibrant convergence of ancient devotional traditions and contemporary spiritual movements. The town attracts millions of pilgrims annually and has become a center for widow rehabilitation and charitable work. The Yamuna river conservation movement has its strongest advocacy base here.',
    relevance: 'Vrindavan teaches that the most profound spiritual experiences emerge from simplicity, community, and unconditional devotion. It reminds us that sacred landscapes are living ecosystems that require active protection and reverence.'
  },
  {
    id: 'dwarka',
    name: 'Dwarka',
    sanskritName: 'द्वारका • Gateway City',
    location: 'Dwarka',
    state: 'Gujarat',
    region: 'West',
    river: 'Gomti River',
    primaryTheme: 'Ancient Maritime Heritage & Mythology',
    architecturalStyle: 'Chalukya-Solanki (Hindu temple)',
    x: 27.92,
    y: 354.62,
    history: 'Dwarka, one of the four sacred Char Dham pilgrimage sites and one of the seven most ancient cities (Sapta Puri) in Hindu tradition, is believed to have been the legendary kingdom of Lord Krishna. The Dwarkadhish Temple, built in the 15th–16th century over older structures, rises five stories with 72 pillars. Marine archaeological explorations by the National Institute of Oceanography have discovered submerged structures offshore, dating back to approximately 1500 BCE.',
    significance: 'Dwarka holds immense significance as a convergence point of mythology, archaeology, and maritime heritage. The underwater ruins discovered off the coast suggest an ancient port city that may correspond to the legendary Dwarka described in the Mahabharata. The city represents India\'s deep maritime trading history connecting the subcontinent to the Persian Gulf and beyond.',
    contemporary: 'Ongoing marine archaeological surveys using sonar mapping and diving expeditions continue to reveal submerged stone structures, anchors, and artifacts. These discoveries fuel scholarly debate about the historicity of epic narratives and the sophistication of ancient Indian coastal engineering and navigation.',
    relevance: 'Dwarka teaches that mythology and history are often intertwined, and that the oceans hold secrets of lost civilizations. It reminds us of India\'s ancient maritime prowess and the importance of underwater archaeology in reconstructing the past.'
  },
  {
    id: 'nalanda',
    name: 'Nalanda',
    sanskritName: 'नालंदा • Ancient University',
    location: 'Rajgir, Nalanda District',
    state: 'Bihar',
    region: 'East',
    river: 'Panchanan River (nearby)',
    primaryTheme: 'Ancient Center of Global Learning',
    architecturalStyle: 'Buddhist Monastic (Gupta & Pala periods)',
    x: 364.24,
    y: 285.52,
    history: 'Nalanda was one of the world\'s first residential universities, flourishing from the 5th to the 12th century CE. At its peak, it hosted over 10,000 students and 2,000 teachers from across Asia, including China, Korea, Japan, Tibet, Mongolia, Turkey, and Southeast Asia. The Chinese scholar Xuanzang studied here for five years (630–635 CE) and left detailed accounts. The university was destroyed by Bakhtiyar Khilji\'s forces around 1193 CE, and its library is said to have burned for three months.',
    significance: 'Nalanda represents humanity\'s oldest experiment in organized, international higher education. Its nine-story library (Dharmaganja) contained hundreds of thousands of manuscripts. The university taught logic, grammar, medicine, metaphysics, astronomy, and every major Buddhist philosophical school. It established the model of structured curricula, debate-based learning, and residential scholarship that influenced universities worldwide.',
    contemporary: 'The excavated ruins, designated a UNESCO World Heritage Site in 2016, reveal a meticulously planned campus with monasteries, temples, meditation halls, and lecture rooms arranged in a grid pattern. A new Nalanda University was established in 2014 near the ancient site, reviving the tradition of international scholarship in Bihar.',
    relevance: 'Nalanda reminds us that the free exchange of knowledge across borders is the foundation of civilizational progress. Its destruction serves as a warning about the fragility of learning, while its legacy inspires the ongoing pursuit of universal education.'
  }
];
