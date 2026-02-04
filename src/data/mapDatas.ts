// utils/touristData.ts

export type TouristStatus = 'online' | 'women' | 'idle' | 'offline' | 'emergency';

export type Tourist = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: TouristStatus;
  lastSeen: string;
  age: number;
  country: string;
  avatar: string;
  interests: string[];
  phoneNumber: string;
  accommodation?: string;
  emergencyContact?: string;
  digitalId: string;
  arrivalDate: string;
  plannedDeparture: string;
  currentLocation: string;
  batteryLevel?: number;
  deviceType: 'mobile' | 'wearable' | 'tracker';
  safetyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
};

// Indian cities with coordinates for realistic distribution
const indianCities = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'Thane', lat: 19.2183, lng: 72.9781 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
  { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376 },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
  { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
  { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
  { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
  { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
  { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
  { name: 'Kalyan-Dombivali', lat: 19.2403, lng: 73.1305 },
  { name: 'Vasai-Virar', lat: 19.4919, lng: 72.8397 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
  { name: 'Aurangabad', lat: 19.8762, lng: 75.3433 },
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
  { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297 },
  { name: 'Allahabad', lat: 25.4358, lng: 81.8463 },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { name: 'Howrah', lat: 22.5958, lng: 88.2636 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Jabalpur', lat: 23.1815, lng: 79.9864 },
  { name: 'Gwalior', lat: 26.2183, lng: 78.1828 },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
  { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
  { name: 'Kota', lat: 25.2138, lng: 75.8648 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
  { name: 'Solapur', lat: 17.6599, lng: 75.9064 },
  { name: 'Hubli-Dharwad', lat: 15.3647, lng: 75.1240 },
  // Tourist destinations
  { name: 'Goa (Panaji)', lat: 15.2993, lng: 74.1240 },
  { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
  { name: 'Manali', lat: 32.2396, lng: 77.1887 },
  { name: 'Rishikesh', lat: 30.0869, lng: 78.2676 },
  { name: 'Haridwar', lat: 29.9457, lng: 78.1642 },
  { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
  { name: 'Pushkar', lat: 26.4901, lng: 74.5544 },
  { name: 'Mount Abu', lat: 24.5926, lng: 72.7156 },
  { name: 'Ooty', lat: 11.4064, lng: 76.6932 },
  { name: 'Kodaikanal', lat: 10.2381, lng: 77.4892 },
  { name: 'Munnar', lat: 10.0889, lng: 77.0595 },
  { name: 'Alleppey', lat: 9.4981, lng: 76.3388 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Darjeeling', lat: 27.0360, lng: 88.2627 },
  { name: 'Gangtok', lat: 27.3389, lng: 88.6065 },
  { name: 'Shillong', lat: 25.5788, lng: 91.8933 },
  { name: 'Kaziranga', lat: 26.5774, lng: 93.1723 },
  { name: 'Leh', lat: 34.1526, lng: 77.5771 },
  { name: 'Dharamshala', lat: 32.2190, lng: 76.3234 },
  { name: 'McLeod Ganj', lat: 32.2395, lng: 76.3200 },
  { name: 'Pondicherry', lat: 11.9416, lng: 79.8083 },
  { name: 'Hampi', lat: 15.3350, lng: 76.4600 },
  { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
  { name: 'Khajuraho', lat: 24.8318, lng: 79.9199 },
  { name: 'Ajanta Caves', lat: 20.5319, lng: 75.7033 },
  { name: 'Ellora Caves', lat: 20.0269, lng: 75.1793 }
];

const countries = [
  'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'South Korea',
  'Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam',
  'Brazil', 'Argentina', 'Mexico', 'Spain', 'Italy', 'Netherlands', 'Sweden',
  'Norway', 'Denmark', 'Finland', 'Russia', 'China', 'Israel', 'UAE', 'Saudi Arabia',
  'South Africa', 'Egypt', 'Morocco', 'Nigeria', 'Kenya', 'Bangladesh', 'Sri Lanka',
  'Nepal', 'Bhutan', 'Myanmar', 'Cambodia', 'Laos', 'New Zealand', 'Fiji'
];

const interests = [
  'Photography', 'History', 'Food', 'Culture', 'Art', 'Music', 'Dance', 'Festivals',
  'Temples', 'Architecture', 'Heritage', 'Spirituality', 'Yoga', 'Meditation',
  'Adventure', 'Trekking', 'Wildlife', 'Nature', 'Mountains', 'Beaches',
  'Shopping', 'Bollywood', 'Literature', 'Technology', 'Street Food', 'Local Cuisine',
  'Palaces', 'Crafts', 'Textiles', 'Jewelry', 'Traditional Medicine', 'Ayurveda',
  'Languages', 'Philosophy', 'Religion', 'Astrology', 'Martial Arts', 'Cricket',
  'Social Work', 'Education', 'Business', 'Startups', 'Innovation'
];

const accommodationTypes = [
  'Hotel Taj Palace', 'Backpacker Hostel', 'Heritage Hotel', 'Resort & Spa',
  'Boutique Hotel', 'Homestay', 'Guest House', 'Luxury Resort', 'Beach Resort',
  'Mountain Lodge', 'Ashram', 'Eco Lodge', 'Palace Hotel', 'Business Hotel',
  'Budget Hotel', 'Capsule Hotel', 'Serviced Apartment', 'Villa', 'Cottage',
  'Treehouse', 'Houseboat', 'Tent Resort', 'Monastery Stay', 'Farm Stay'
];

const firstNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah',
  'Ivan', 'Julia', 'Kevin', 'Lisa', 'Mike', 'Nina', 'Oscar', 'Paula',
  'Quinn', 'Rita', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier',
  'Yuki', 'Zara', 'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley',
  'Gray', 'Harper', 'Indigo', 'Jordan', 'Kai', 'Lane', 'Morgan', 'Nova',
  'Parker', 'River', 'Sage', 'Taylor', 'Unity', 'Vale', 'Wren', 'Zion',
  'Aria', 'Blaze', 'Cora', 'Dante', 'Eden', 'Felix', 'Grace', 'Hayes',
  'Iris', 'Jude', 'Knox', 'Luna', 'Max', 'Nora', 'Owen', 'Piper',
  'Quincy', 'Ruby', 'Silas', 'Thea', 'Uri', 'Vera', 'Wade', 'Xara',
  'Yale', 'Zoe', 'Ava', 'Ben', 'Chloe', 'David', 'Emma', 'Frank',
  'Gina', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah',
  'Olivia', 'Peter', 'Queen', 'Ryan', 'Sofia', 'Tom', 'Ursula', 'Vince'
];

const lastNames = [
  'Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
  'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Kumar', 'Singh', 'Patel',
  'Shah', 'Gupta', 'Agarwal', 'Sharma', 'Verma', 'Jain', 'Mehta', 'Bansal',
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
  'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto',
  'Kim', 'Park', 'Lee', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang',
  'Mueller', 'Schmidt', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'
];

// Generate random coordinates with slight variation around city centers
const getRandomCoordinate = (baseCoord: number, variance: number = 0.05): number => {
  return baseCoord + (Math.random() - 0.5) * variance;
};

// Generate random tourist data
const generateTourists = (count: number): Tourist[] => {
  const tourists: Tourist[] = [];
  
  for (let i = 0; i < count; i++) {
    const city = indianCities[Math.floor(Math.random() * indianCities.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    // Assign status with realistic distribution
    const statusRandom = Math.random();
    let status: TouristStatus;
    if (statusRandom < 0.55) status = 'online';
    else if (statusRandom < 0.66) status = 'women';
    else if (statusRandom < 0.85) status = 'idle';
    else if (statusRandom < 0.88) status = 'offline';
    else status = 'emergency';
    
    // Generate interests (2-5 random interests)
    const numberOfInterests = Math.floor(Math.random() * 4) + 2;
    const touristInterests = [];
    const shuffledInterests = [...interests].sort(() => Math.random() - 0.5);
    for (let j = 0; j < numberOfInterests; j++) {
      touristInterests.push(shuffledInterests[j]);
    }
    
    // Generate realistic timestamps based on status
    const getLastSeenTime = (status: TouristStatus): string => {
      const now = new Date();
      let minutesAgo: number;
      
      switch (status) {
        case 'online':
          minutesAgo = Math.floor(Math.random() * 10); // 0-10 minutes
          break;
        case 'women':
          minutesAgo = Math.floor(Math.random() * 30) + 20; // 0-10 minutes
          break;
        case 'idle':
          minutesAgo = Math.floor(Math.random() * 40) + 10; // 10-70 minutes
          break;
        case 'offline':
          minutesAgo = Math.floor(Math.random() * 240) + 60; // 1-5 hours
          break;
        case 'emergency':
          minutesAgo = Math.floor(Math.random() * 5); // 0-5 minutes (recent)
          break;
        default:
          minutesAgo = 5;
      }
      
      if (minutesAgo === 0) return 'Just now';
      if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
      const hours = Math.floor(minutesAgo / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    };
    
    // Generate safety score based on various factors
    const baseSafetyScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const statusPenalty = status === 'emergency' ? -30 : status === 'offline' ? -10 : 0;
    const safetyScore = Math.max(0, Math.min(100, baseSafetyScore + statusPenalty));
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (safetyScore >= 80) riskLevel = 'low';
    else if (safetyScore >= 60) riskLevel = 'medium';
    else riskLevel = 'high';
    
    const tourist: Tourist = {
      id: `tourist-${String(i + 1).padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      lat: getRandomCoordinate(city.lat),
      lng: getRandomCoordinate(city.lng),
      status,
      lastSeen: getLastSeenTime(status),
      age: Math.floor(Math.random() * 50) + 18, // 18-67 years
      country,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      interests: touristInterests,
      phoneNumber: `+${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      accommodation: accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)],
      emergencyContact: `+${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      digitalId: `DID-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      arrivalDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      plannedDeparture: new Date(Date.now() + Math.floor(Math.random() * 21) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentLocation: city.name,
      batteryLevel: status === 'offline' ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 60) + 40,
      deviceType: ['mobile', 'wearable', 'tracker'][Math.floor(Math.random() * 3)] as 'mobile' | 'wearable' | 'tracker',
      safetyScore,
      riskLevel
    };
    
    tourists.push(tourist);
  }
  
  return tourists;
};

// Export the generated data
export const touristData = generateTourists(120);

// Helper functions for filtering and analysis
export const getTouristsByStatus = (status: TouristStatus) => {
  return touristData.filter(tourist => tourist.status === status);
};

export const getTouristsByCountry = (country: string) => {
  return touristData.filter(tourist => tourist.country === country);
};

export const getTouristsByRiskLevel = (riskLevel: 'low' | 'medium' | 'high') => {
  return touristData.filter(tourist => tourist.riskLevel === riskLevel);
};

export const getEmergencyTourists = () => {
  return touristData.filter(tourist => tourist.status === 'emergency');
};

export const getHighRiskTourists = () => {
  return touristData.filter(tourist => tourist.riskLevel === 'high' || tourist.status === 'emergency');
};

export const getTouristStats = () => {
  const total = touristData.length;
  const online = getTouristsByStatus('online').length;
  const women = getTouristsByStatus('women').length;
  const idle = getTouristsByStatus('idle').length;
  const offline = getTouristsByStatus('offline').length;
  const emergency = getTouristsByStatus('emergency').length;
  const lowRisk = getTouristsByRiskLevel('low').length;
  const mediumRisk = getTouristsByRiskLevel('medium').length;
  const highRisk = getTouristsByRiskLevel('high').length;
  
  return {
    total,
    online,
    women,
    idle,
    offline,
    emergency,
    lowRisk,
    mediumRisk,
    highRisk,
    activePercentage: Math.round((online / total) * 100),
    riskDistribution: {
      low: Math.round((lowRisk / total) * 100),
      medium: Math.round((mediumRisk / total) * 100),
      high: Math.round((highRisk / total) * 100)
    }
  };
};

// Real-time update simulation
export const updateTouristStatus = (id: string, newStatus: TouristStatus) => {
  const tourist = touristData.find(t => t.id === id);
  if (tourist) {
    tourist.status = newStatus;
    tourist.lastSeen = newStatus === 'online' ? 'Just now' : tourist.lastSeen;
  }
};

export const simulateRealTimeUpdates = () => {
  // Randomly update a few tourists every few seconds
  setInterval(() => {
    const randomTourists = touristData
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 5) + 1);
    
    randomTourists.forEach(tourist => {
      const statusChange = Math.random();
      if (statusChange < 0.1) { // 10% chance of status change
        const newStatus = ['online', 'women', 'idle', 'offline'][Math.floor(Math.random() * 3)] as TouristStatus;
        updateTouristStatus(tourist.id, newStatus);
      }
    });
  }, 5000); // Update every 5 seconds
};

export const featuredDestinations = [
    {
      id: 1,
      name: "Costa Rica Rainforest",
      type: "eco",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&auto=format",
      rating: 4.8,
      location: "Costa Rica",
      price: "$299",
      duration: "5 days",
      ecoRating: 95,
      description: "Explore pristine rainforests and support local conservation efforts.",
      highlights: ["Wildlife spotting", "Canopy tours", "Local community visits"]
    },
    {
      id: 2,
      name: "Machu Picchu Heritage",
      type: "cultural",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=400&fit=crop&auto=format",
      rating: 4.9,
      location: "Peru",
      price: "$899",
      duration: "7 days",
      ecoRating: 88,
      description: "Discover ancient Incan civilization and traditional Andean culture.",
      highlights: ["Historic ruins", "Traditional crafts", "Local cuisine"]
    },
    {
      id: 3,
      name: "Norwegian Fjords",
      type: "eco",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format",
      rating: 4.7,
      location: "Norway",
      price: "$1299",
      duration: "8 days",
      ecoRating: 92,
      description: "Experience sustainable Nordic tourism in breathtaking landscapes.",
      highlights: ["Zero-emission cruises", "Aurora viewing", "Sami culture"]
    }
  ]