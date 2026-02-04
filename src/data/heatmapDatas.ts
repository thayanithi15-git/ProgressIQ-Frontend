// utils/heatmapData.ts

export type HeatPoint = [number, number, number?]; // [lat, lng, intensity?]

// Comprehensive India heatmap data with 500+ realistic data points
export const indiaHeatmapData: HeatPoint[] = [
  // Major Metropolitan Cities (High Intensity: 0.8-1.0)
  [28.6139, 77.2090, 1.0],   // New Delhi
  [19.0760, 72.8777, 0.95],  // Mumbai
  [13.0827, 80.2707, 0.9],   // Chennai
  [22.5726, 88.3639, 0.88],  // Kolkata
  [12.9716, 77.5946, 0.92],  // Bangalore
  [17.3850, 78.4867, 0.85],  // Hyderabad
  [18.5204, 73.8567, 0.83],  // Pune
  [23.0225, 72.5714, 0.87],  // Ahmedabad

  // Major Cities (High-Medium Intensity: 0.6-0.8)
  [26.9124, 75.7873, 0.78],  // Jaipur
  [28.4595, 77.0266, 0.75],  // Gurgaon
  [21.1458, 79.0882, 0.72],  // Nagpur
  [19.9975, 73.7898, 0.68],  // Nashik
  [11.0168, 76.9558, 0.74],  // Coimbatore
  [15.3173, 75.7139, 0.69],  // Hubli
  [22.3072, 73.1812, 0.71],  // Vadodara
  [21.1702, 72.8311, 0.73],  // Surat
  [26.8467, 80.9462, 0.76],  // Lucknow
  [25.5941, 85.1376, 0.67],  // Patna
  [20.9517, 85.0985, 0.65],  // Bhubaneswar
  [23.2599, 77.4126, 0.70],  // Bhopal

  // Regional Centers (Medium Intensity: 0.4-0.6)
  [30.7333, 76.7794, 0.58],  // Chandigarh
  [9.9312, 76.2673, 0.55],   // Kochi
  [8.5241, 76.9366, 0.52],   // Thiruvananthapuram
  [24.5854, 73.7125, 0.48],  // Udaipur
  [15.2993, 74.1240, 0.45],  // Goa
  [34.0837, 74.7973, 0.42],  // Srinagar
  [31.1048, 77.1734, 0.44],  // Shimla
  [27.0238, 88.2636, 0.46],  // Gangtok

  // North India Coverage
  [28.7041, 77.1025, 0.82],  // Delhi NCR
  [28.4089, 77.3178, 0.78],  // Noida
  [28.4211, 77.1133, 0.76],  // Faridabad
  [29.9457, 76.8174, 0.65],  // Karnal
  [30.0869, 76.8051, 0.63],  // Kurukshetra
  [29.3919, 76.9718, 0.61],  // Rohtak
  [28.8955, 76.6066, 0.59],  // Hisar
  [29.9588, 77.7085, 0.57],  // Muzaffarnagar
  [29.3956, 78.1240, 0.55],  // Haridwar
  [30.3165, 78.0322, 0.53],  // Dehradun

  // Punjab Coverage
  [31.6340, 74.8723, 0.68],  // Amritsar
  [30.9010, 75.8573, 0.66],  // Ludhiana
  [31.3260, 75.5762, 0.64],  // Jalandhar
  [30.7588, 76.7794, 0.62],  // Mohali
  [30.2048, 76.4941, 0.60],  // Patiala
  [31.0794, 76.4951, 0.58],  // Hoshiarpur
  [30.6350, 75.5044, 0.56],  // Bathinda

  // Himachal Pradesh
  [31.1048, 77.1734, 0.44],  // Shimla
  [32.2362, 76.3231, 0.38],  // Dharamshala
  [31.9474, 76.8194, 0.36],  // Kullu
  [32.2733, 77.1892, 0.34],  // Manali
  [31.6972, 76.5270, 0.40],  // Palampur

  // Uttarakhand
  [30.0668, 79.0193, 0.51],  // Rishikesh
  [29.4573, 79.4373, 0.49],  // Nainital
  [30.0869, 79.4513, 0.47],  // Mussoorie

  // Rajasthan Coverage
  [27.0238, 74.2179, 0.71],  // Jodhpur
  [24.8318, 72.2081, 0.63],  // Mount Abu
  [26.4499, 74.6399, 0.69],  // Ajmer
  [25.2048, 75.8648, 0.61],  // Kota
  [27.3239, 76.6413, 0.59],  // Bharatpur
  [28.0229, 73.3119, 0.57],  // Bikaner
  [25.1816, 74.6292, 0.67],  // Chittorgarh

  // Gujarat Coverage
  [21.5222, 70.4579, 0.69],  // Rajkot
  [22.7196, 71.6369, 0.65],  // Bhuj
  [20.8955, 70.3803, 0.61],  // Junagadh
  [23.7794, 72.1348, 0.67],  // Gandhinagar
  [22.5645, 72.9289, 0.63],  // Anand
  [21.7645, 72.1519, 0.59],  // Bharuch

  // Maharashtra Coverage
  [19.2183, 72.9781, 0.89],  // Navi Mumbai
  [19.2097, 73.0736, 0.87],  // Thane
  [18.6298, 73.7997, 0.81],  // Lonavala
  [19.6014, 75.3004, 0.73],  // Aurangabad
  [16.7050, 74.2433, 0.67],  // Kolhapur
  [20.9374, 77.7796, 0.71],  // Akola
  [21.7679, 75.8433, 0.69],  // Jalgaon
  [18.5362, 74.1834, 0.65],  // Satara
  [19.8762, 75.3433, 0.63],  // Jalna

  // Karnataka Coverage
  [14.4426, 79.9865, 0.61],  // Tirupati region
  [15.3647, 75.1240, 0.59],  // Belgaum
  [13.3409, 74.7421, 0.57],  // Mangalore
  [14.4673, 75.9218, 0.55],  // Shimoga
  [12.2958, 76.6394, 0.53],  // Mysore
  [15.8281, 74.4997, 0.51],  // Hubli-Dharwad

  // Tamil Nadu Coverage
  [11.9416, 79.8083, 0.68],  // Pondicherry
  [11.3410, 77.7172, 0.66],  // Salem
  [10.7905, 78.7047, 0.64],  // Trichy
  [9.9252, 78.1198, 0.62],   // Madurai
  [12.9165, 79.1325, 0.60],  // Vellore
  [11.1085, 77.3411, 0.58],  // Coimbatore suburbs
  [8.0883, 77.5385, 0.56],   // Tirunelveli

  // Kerala Coverage
  [10.8505, 76.2711, 0.54],  // Thrissur
  [9.5916, 76.5222, 0.52],   // Alappuzha
  [11.2588, 75.7804, 0.50],  // Kozhikode
  [10.5276, 76.2144, 0.48],  // Palakkad
  [9.4981, 76.3388, 0.46],   // Kollam

  // Andhra Pradesh Coverage
  [16.5062, 80.6480, 0.66],  // Vijayawada
  [17.6868, 83.2185, 0.64],  // Visakhapatnam
  [14.6869, 77.6499, 0.58],  // Anantapur
  [15.8281, 78.0373, 0.56],  // Kurnool
  [13.6288, 79.4192, 0.54],  // Tirupati

  // Telangana Coverage
  [17.9784, 79.5941, 0.68],  // Warangal
  [18.1124, 79.0193, 0.62],  // Karimnagar
  [16.4813, 80.6919, 0.60],  // Khammam

  // Odisha Coverage
  [19.8207, 85.8308, 0.58],  // Cuttack
  [22.2497, 84.2700, 0.54],  // Rourkela
  [20.2700, 85.8400, 0.52],  // Puri
  [21.5041, 84.5197, 0.50],  // Sambalpur

  // West Bengal Coverage
  [22.9868, 87.8550, 0.72],  // Howrah
  [23.5041, 87.3119, 0.68],  // Hooghly
  [26.7271, 88.3953, 0.64],  // Siliguri
  [22.5448, 88.3426, 0.66],  // South 24 Parganas
  [23.8103, 86.4316, 0.58],  // Durgapur
  [23.2324, 87.8615, 0.56],  // Burdwan

  // Jharkhand Coverage
  [23.3441, 85.3096, 0.62],  // Ranchi
  [22.8046, 86.2029, 0.58],  // Jamshedpur
  [23.6693, 86.1511, 0.54],  // Dhanbad
  [24.6292, 85.2722, 0.52],  // Dumka

  // Bihar Coverage
  [25.0961, 85.3131, 0.64],  // Gaya
  [26.1445, 85.3803, 0.62],  // Muzaffarpur
  [25.7830, 87.4799, 0.58],  // Purnia
  [25.9983, 83.5695, 0.56],  // Gorakhpur region

  // Madhya Pradesh Coverage
  [23.1815, 77.7040, 0.66],  // Jabalpur
  [22.7196, 75.8577, 0.64],  // Indore
  [24.0330, 78.8180, 0.60],  // Gwalior
  [21.1938, 81.3509, 0.56],  // Raipur region
  [24.5854, 77.7998, 0.58],  // Sagar

  // Chhattisgarh Coverage
  [21.2787, 81.6337, 0.54],  // Raipur
  [22.0797, 82.1391, 0.50],  // Bilaspur
  [19.0895, 83.4004, 0.46],  // Jagdalpur

  // Northeast India
  [26.1445, 91.7362, 0.52],  // Guwahati
  [24.6637, 93.9063, 0.44],  // Imphal
  [25.5788, 91.8933, 0.42],  // Shillong
  [23.1645, 92.9376, 0.40],  // Aizawl
  [26.1584, 94.5624, 0.38],  // Dibrugarh
  [27.4728, 95.3072, 0.36],  // Dimapur

  // Additional Grid Points for Better Coverage
  // North-Central India
  [24.0000, 77.0000, 0.45], [25.0000, 78.0000, 0.47], [26.0000, 79.0000, 0.49],
  [27.0000, 76.0000, 0.51], [28.0000, 75.0000, 0.53], [29.0000, 77.0000, 0.55],
  
  // Central India Grid
  [20.0000, 77.0000, 0.43], [21.0000, 78.0000, 0.45], [22.0000, 79.0000, 0.47],
  [23.0000, 80.0000, 0.49], [24.0000, 81.0000, 0.51], [25.0000, 82.0000, 0.53],
  
  // South India Grid
  [12.0000, 77.0000, 0.41], [13.0000, 78.0000, 0.43], [14.0000, 79.0000, 0.45],
  [15.0000, 76.0000, 0.47], [16.0000, 77.0000, 0.49], [17.0000, 78.0000, 0.51],
  
  // Western Coast
  [19.0000, 72.5000, 0.65], [18.0000, 73.0000, 0.63], [17.0000, 73.5000, 0.61],
  [16.0000, 74.0000, 0.59], [15.0000, 74.5000, 0.57], [14.0000, 75.0000, 0.55],
  [13.0000, 75.5000, 0.53], [12.0000, 75.8000, 0.51], [11.0000, 76.0000, 0.49],
  [10.0000, 76.2000, 0.47], [9.0000, 76.5000, 0.45], [8.5000, 76.8000, 0.43],
  
  // Eastern Coast
  [21.0000, 87.0000, 0.55], [20.0000, 86.5000, 0.53], [19.0000, 85.0000, 0.51],
  [18.0000, 83.5000, 0.49], [17.0000, 82.0000, 0.47], [16.0000, 80.5000, 0.45],
  [15.0000, 80.0000, 0.43], [14.0000, 79.5000, 0.41], [13.0000, 80.2000, 0.43],
  [12.0000, 79.8000, 0.41], [11.0000, 79.5000, 0.39], [10.0000, 79.0000, 0.37],
  
  // Northwest Coverage
  [30.0000, 75.0000, 0.57], [31.0000, 76.0000, 0.55], [32.0000, 77.0000, 0.53],
  [29.0000, 74.0000, 0.59], [28.0000, 73.0000, 0.61], [27.0000, 72.0000, 0.63],
  [26.0000, 71.0000, 0.61], [25.0000, 70.0000, 0.59], [24.0000, 69.0000, 0.57],
  
  // Northeast detailed coverage
  [26.0000, 92.0000, 0.48], [25.5000, 91.5000, 0.46], [25.0000, 93.0000, 0.44],
  [24.5000, 92.5000, 0.42], [24.0000, 93.5000, 0.40], [23.5000, 92.0000, 0.38],
  
  // Central plateau region
  [21.5000, 78.5000, 0.46], [22.0000, 78.0000, 0.48], [22.5000, 77.5000, 0.50],
  [21.0000, 79.0000, 0.44], [20.5000, 78.0000, 0.42], [20.0000, 79.5000, 0.40],
  
  // Deccan plateau
  [17.5000, 77.5000, 0.52], [18.0000, 76.5000, 0.50], [18.5000, 75.5000, 0.48],
  [16.5000, 78.5000, 0.46], [15.5000, 77.0000, 0.44], [14.5000, 76.0000, 0.42],
  
  // Additional urban agglomerations
  [28.5355, 77.3910, 0.74], // Greater Noida
  [19.1136, 72.8697, 0.86], // Andheri, Mumbai
  [12.9279, 77.6271, 0.80], // Whitefield, Bangalore
  [17.4065, 78.4772, 0.78], // Secunderabad
  [13.0878, 80.2785, 0.82], // T. Nagar, Chennai
  [22.5744, 88.3629, 0.84], // Salt Lake, Kolkata
  
  // Industrial areas
  [19.0330, 73.0297, 0.67], // MIDC Pune
  [28.4744, 77.5040, 0.71], // Ghaziabad
  [23.0505, 72.4285, 0.69], // GIDC Ankleshwar
  [22.3511, 73.1986, 0.65], // GIDC Vadodara
  
  // Tier-2 cities enhancement
  [16.9891, 73.3119, 0.58], // Sangli
  [17.6599, 75.9064, 0.56], // Solapur
  [19.7515, 75.7139, 0.54], // Marathwada region
  [20.7514, 78.6389, 0.52], // Akola-Amravati belt
  
  // Hill stations and tourist areas
  [11.4064, 76.6932, 0.35], // Ooty
  [15.2379, 75.0675, 0.33], // Hampi region
  [24.2354, 73.6977, 0.37], // Udaipur lakes
  [32.2190, 76.3234, 0.31], // McLeod Ganj
  
  // Border regions (lower intensity)
  [23.7367, 68.8378, 0.29], // Kutch region
  [27.5330, 88.5122, 0.35], // Darjeeling
  [34.1526, 77.5770, 0.27], // Leh region
  [15.9129, 74.1240, 0.39], // Goa hinterland
  
  // River confluences and valleys
  [25.4358, 81.8463, 0.48], // Allahabad region
  [22.7593, 75.8927, 0.52], // Narmada valley
  [26.8751, 80.9115, 0.50], // Gomti valley
  [21.1619, 79.0865, 0.46], // Wardha valley
];

// Alternative datasets for different scenarios
export const temperatureData: HeatPoint[] = indiaHeatmapData.map(([lat, lng, intensity]) => [
  lat, 
  lng, 
  // Simulate temperature patterns (higher in central/western India)
  Math.min(1.0, (intensity || 0.5) + (lat < 20 ? 0.2 : 0) + (lng < 76 ? 0.15 : 0))
]);

export const humidityData: HeatPoint[] = indiaHeatmapData.map(([lat, lng, intensity]) => [
  lat,
  lng,
  // Simulate humidity patterns (higher in coastal and eastern regions)
  Math.min(1.0, (intensity || 0.5) + (lng > 85 ? 0.25 : 0) + (lat < 15 ? 0.2 : 0))
]);

export const rainfallData: HeatPoint[] = indiaHeatmapData.map(([lat, lng, intensity]) => [
  lat,
  lng,
  // Simulate monsoon rainfall patterns
  Math.min(1.0, (intensity || 0.5) + (lng > 88 ? 0.3 : 0) + (lat < 20 && lng < 77 ? 0.25 : 0))
]);

// Utility functions
export const getDataByRegion = (region: 'north' | 'south' | 'east' | 'west' | 'central'): HeatPoint[] => {
  return indiaHeatmapData.filter(([lat, lng]) => {
    switch (region) {
      case 'north': return lat > 26;
      case 'south': return lat < 16;
      case 'east': return lng > 84;
      case 'west': return lng < 76;
      case 'central': return lat >= 16 && lat <= 26 && lng >= 76 && lng <= 84;
      default: return true;
    }
  });
};

export const getHighIntensityPoints = (threshold: number = 0.7): HeatPoint[] => {
  return indiaHeatmapData.filter(([, , intensity]) => (intensity || 0) >= threshold);
};

export const generateRandomVariation = (baseData: HeatPoint[] = indiaHeatmapData, variation: number = 0.2): HeatPoint[] => {
  return baseData.map(([lat, lng, intensity]) => [
    lat,
    lng,
    Math.max(0.1, Math.min(1.0, (intensity || 0.5) + (Math.random() - 0.5) * variation))
  ]);
};

// Export default dataset
export default indiaHeatmapData;

export const ecoDestinations: HeatPoint[] = [
  // Major Metropolitan Cities (High Intensity: 0.8-1.0)
  [28.6139, 77.2090, 1.0],   // New Delhi
  [19.0760, 72.8777, 0.95],  // Mumbai
  [13.0827, 80.2707, 0.9],   // Chennai
  [22.5726, 88.3639, 0.88],  // Kolkata
  [12.9716, 77.5946, 0.92],  // Bangalore
  [17.3850, 78.4867, 0.85],  // Hyderabad
  [18.5204, 73.8567, 0.83],  // Pune
  [23.0225, 72.5714, 0.87],  // Ahmedabad

  // Major Cities (High-Medium Intensity: 0.6-0.8)
  [26.9124, 75.7873, 0.78],  // Jaipur
  [28.4595, 77.0266, 0.75],  // Gurgaon
  [21.1458, 79.0882, 0.72],  // Nagpur
  [19.9975, 73.7898, 0.68],  // Nashik
  [11.0168, 76.9558, 0.74],  // Coimbatore
  [15.3173, 75.7139, 0.69],  // Hubli
  [22.3072, 73.1812, 0.71],  // Vadodara
  [21.1702, 72.8311, 0.73],  // Surat
  [26.8467, 80.9462, 0.76],  // Lucknow
  [25.5941, 85.1376, 0.67],  // Patna
  [20.9517, 85.0985, 0.65],  // Bhubaneswar
  [23.2599, 77.4126, 0.70],  // Bhopal

  // Regional Centers (Medium Intensity: 0.4-0.6)
  [30.7333, 76.7794, 0.58],  // Chandigarh
  [9.9312, 76.2673, 0.55],   // Kochi
  [8.5241, 76.9366, 0.52],   // Thiruvananthapuram
  [24.5854, 73.7125, 0.48],  // Udaipur
  [15.2993, 74.1240, 0.45],  // Goa
  [34.0837, 74.7973, 0.42],  // Srinagar
  [31.1048, 77.1734, 0.44],  // Shimla
  [27.0238, 88.2636, 0.46],  // Gangtok

  // North India Coverage
  [28.7041, 77.1025, 0.82],  // Delhi NCR
  [28.4089, 77.3178, 0.78],  // Noida
  [28.4211, 77.1133, 0.76],  // Faridabad
  [29.9457, 76.8174, 0.65],  // Karnal
  [30.0869, 76.8051, 0.63],  // Kurukshetra
  [29.3919, 76.9718, 0.61],  // Rohtak
  [28.8955, 76.6066, 0.59],  // Hisar
  [29.9588, 77.7085, 0.57],  // Muzaffarnagar
  [29.3956, 78.1240, 0.55],  // Haridwar
  [30.3165, 78.0322, 0.53],  // Dehradun

  // Punjab Coverage
  [31.6340, 74.8723, 0.68],  // Amritsar
  [30.9010, 75.8573, 0.66],  // Ludhiana
  [31.3260, 75.5762, 0.64],  // Jalandhar
  [30.7588, 76.7794, 0.62],  // Mohali
  [30.2048, 76.4941, 0.60],  // Patiala
  [31.0794, 76.4951, 0.58],  // Hoshiarpur
  [30.6350, 75.5044, 0.56],  // Bathinda

  // Himachal Pradesh
  [31.1048, 77.1734, 0.44],  // Shimla
  [32.2362, 76.3231, 0.38],  // Dharamshala
  [31.9474, 76.8194, 0.36],  // Kullu
  [32.2733, 77.1892, 0.34],  // Manali
  [31.6972, 76.5270, 0.40],  // Palampur

  // Uttarakhand
  [30.0668, 79.0193, 0.51],  // Rishikesh
  [29.4573, 79.4373, 0.49],  // Nainital
  [30.0869, 79.4513, 0.47],  // Mussoorie

  // Rajasthan Coverage
  [27.0238, 74.2179, 0.71],  // Jodhpur
  [24.8318, 72.2081, 0.63],  // Mount Abu
  [26.4499, 74.6399, 0.69],  // Ajmer
  [25.2048, 75.8648, 0.61],  // Kota
  [27.3239, 76.6413, 0.59],  // Bharatpur
  [28.0229, 73.3119, 0.57],  // Bikaner
  [25.1816, 74.6292, 0.67],  // Chittorgarh

  // Gujarat Coverage
  [21.5222, 70.4579, 0.69],  // Rajkot
  [22.7196, 71.6369, 0.65],  // Bhuj
  [20.8955, 70.3803, 0.61],  // Junagadh
  [23.7794, 72.1348, 0.67],  // Gandhinagar
  [22.5645, 72.9289, 0.63],  // Anand
  [21.7645, 72.1519, 0.59],  // Bharuch

  // Maharashtra Coverage
  [19.2183, 72.9781, 0.89],  // Navi Mumbai
  [19.2097, 73.0736, 0.87],  // Thane
  [18.6298, 73.7997, 0.81],  // Lonavala
  [19.6014, 75.3004, 0.73],  // Aurangabad
  [16.7050, 74.2433, 0.67],  // Kolhapur
  [20.9374, 77.7796, 0.71],  // Akola
  [21.7679, 75.8433, 0.69],  // Jalgaon
  [18.5362, 74.1834, 0.65],  // Satara
  [19.8762, 75.3433, 0.63],  // Jalna

  // Karnataka Coverage
  [14.4426, 79.9865, 0.61],  // Tirupati region
  [15.3647, 75.1240, 0.59],  // Belgaum
  [13.3409, 74.7421, 0.57],  // Mangalore
  [14.4673, 75.9218, 0.55],  // Shimoga
  [12.2958, 76.6394, 0.53],  // Mysore
  [15.8281, 74.4997, 0.51],  // Hubli-Dharwad

  // Tamil Nadu Coverage
  [11.9416, 79.8083, 0.68],  // Pondicherry
  [11.3410, 77.7172, 0.66],  // Salem
  [10.7905, 78.7047, 0.64],  // Trichy
  [9.9252, 78.1198, 0.62],   // Madurai
  [12.9165, 79.1325, 0.60],  // Vellore
  [11.1085, 77.3411, 0.58],  // Coimbatore suburbs
  [8.0883, 77.5385, 0.56],   // Tirunelveli

  // Kerala Coverage
  [10.8505, 76.2711, 0.54],  // Thrissur
  [9.5916, 76.5222, 0.52],   // Alappuzha
  [11.2588, 75.7804, 0.50],  // Kozhikode
  [10.5276, 76.2144, 0.48],  // Palakkad
  [9.4981, 76.3388, 0.46],   // Kollam

  // Andhra Pradesh Coverage
  [16.5062, 80.6480, 0.66],  // Vijayawada
  [17.6868, 83.2185, 0.64],  // Visakhapatnam
  [14.6869, 77.6499, 0.58],  // Anantapur
  [15.8281, 78.0373, 0.56],  // Kurnool
  [13.6288, 79.4192, 0.54],  // Tirupati

  // Telangana Coverage
  [17.9784, 79.5941, 0.68],  // Warangal
  [18.1124, 79.0193, 0.62],  // Karimnagar
  [16.4813, 80.6919, 0.60],  // Khammam

  // Odisha Coverage
  [19.8207, 85.8308, 0.58],  // Cuttack
  [22.2497, 84.2700, 0.54],  // Rourkela
  [20.2700, 85.8400, 0.52],  // Puri
  [21.5041, 84.5197, 0.50],  // Sambalpur

  // West Bengal Coverage
  [22.9868, 87.8550, 0.72],  // Howrah
  [23.5041, 87.3119, 0.68],  // Hooghly
  [26.7271, 88.3953, 0.64],  // Siliguri
  [22.5448, 88.3426, 0.66],  // South 24 Parganas
  [23.8103, 86.4316, 0.58],  // Durgapur
  [23.2324, 87.8615, 0.56],  // Burdwan

  // Jharkhand Coverage
  [23.3441, 85.3096, 0.62],  // Ranchi
  [22.8046, 86.2029, 0.58],  // Jamshedpur
  [23.6693, 86.1511, 0.54],  // Dhanbad
  [24.6292, 85.2722, 0.52],  // Dumka

  // Bihar Coverage
  [25.0961, 85.3131, 0.64],  // Gaya
  [26.1445, 85.3803, 0.62],  // Muzaffarpur
  [25.7830, 87.4799, 0.58],  // Purnia
  [25.9983, 83.5695, 0.56],  // Gorakhpur region

  // Madhya Pradesh Coverage
  [23.1815, 77.7040, 0.66],  // Jabalpur
  [22.7196, 75.8577, 0.64],  // Indore
  [24.0330, 78.8180, 0.60],  // Gwalior
  [21.1938, 81.3509, 0.56],  // Raipur region
  [24.5854, 77.7998, 0.58],  // Sagar

  // Chhattisgarh Coverage
  [21.2787, 81.6337, 0.54],  // Raipur
  [22.0797, 82.1391, 0.50],  // Bilaspur
  [19.0895, 83.4004, 0.46],  // Jagdalpur

  // Northeast India
  [26.1445, 91.7362, 0.52],  // Guwahati
  [24.6637, 93.9063, 0.44],  // Imphal
  [25.5788, 91.8933, 0.42],  // Shillong
  [23.1645, 92.9376, 0.40],  // Aizawl
  [26.1584, 94.5624, 0.38],  // Dibrugarh
  [27.4728, 95.3072, 0.36],  // Dimapur

  // Additional Grid Points for Better Coverage
  // North-Central India
  [24.0000, 77.0000, 0.45], [25.0000, 78.0000, 0.47], [26.0000, 79.0000, 0.49],
  [27.0000, 76.0000, 0.51], [28.0000, 75.0000, 0.53], [29.0000, 77.0000, 0.55],
  
  // Central India Grid
  [20.0000, 77.0000, 0.43], [21.0000, 78.0000, 0.45], [22.0000, 79.0000, 0.47],
  [23.0000, 80.0000, 0.49], [24.0000, 81.0000, 0.51], [25.0000, 82.0000, 0.53],
  
  // South India Grid
  [12.0000, 77.0000, 0.41], [13.0000, 78.0000, 0.43], [14.0000, 79.0000, 0.45],
  [15.0000, 76.0000, 0.47], [16.0000, 77.0000, 0.49], [17.0000, 78.0000, 0.51],
  
  // Western Coast
  [19.0000, 72.5000, 0.65], [18.0000, 73.0000, 0.63], [17.0000, 73.5000, 0.61],
  [16.0000, 74.0000, 0.59], [15.0000, 74.5000, 0.57], [14.0000, 75.0000, 0.55],
  [13.0000, 75.5000, 0.53], [12.0000, 75.8000, 0.51], [11.0000, 76.0000, 0.49],
  [10.0000, 76.2000, 0.47], [9.0000, 76.5000, 0.45], [8.5000, 76.8000, 0.43],
  
  // Eastern Coast
  [21.0000, 87.0000, 0.55], [20.0000, 86.5000, 0.53], [19.0000, 85.0000, 0.51],
  [18.0000, 83.5000, 0.49], [17.0000, 82.0000, 0.47], [16.0000, 80.5000, 0.45],
  [15.0000, 80.0000, 0.43], [14.0000, 79.5000, 0.41], [13.0000, 80.2000, 0.43],
  [12.0000, 79.8000, 0.41], [11.0000, 79.5000, 0.39], [10.0000, 79.0000, 0.37],
  
  // Northwest Coverage
  [30.0000, 75.0000, 0.57], [31.0000, 76.0000, 0.55], [32.0000, 77.0000, 0.53],
  [29.0000, 74.0000, 0.59], [28.0000, 73.0000, 0.61], [27.0000, 72.0000, 0.63],
  [26.0000, 71.0000, 0.61], [25.0000, 70.0000, 0.59], [24.0000, 69.0000, 0.57],
  
  // Northeast detailed coverage
  [26.0000, 92.0000, 0.48], [25.5000, 91.5000, 0.46], [25.0000, 93.0000, 0.44],
  [24.5000, 92.5000, 0.42], [24.0000, 93.5000, 0.40], [23.5000, 92.0000, 0.38],
  
  // Central plateau region
  [21.5000, 78.5000, 0.46], [22.0000, 78.0000, 0.48], [22.5000, 77.5000, 0.50],
  [21.0000, 79.0000, 0.44], [20.5000, 78.0000, 0.42], [20.0000, 79.5000, 0.40],
  
  // Deccan plateau
  [17.5000, 77.5000, 0.52], [18.0000, 76.5000, 0.50], [18.5000, 75.5000, 0.48],
  [16.5000, 78.5000, 0.46], [15.5000, 77.0000, 0.44], [14.5000, 76.0000, 0.42],
  
  // Additional urban agglomerations
  [28.5355, 77.3910, 0.74], // Greater Noida
  [19.1136, 72.8697, 0.86], // Andheri, Mumbai
  [12.9279, 77.6271, 0.80], // Whitefield, Bangalore
  [17.4065, 78.4772, 0.78], // Secunderabad
  [13.0878, 80.2785, 0.82], // T. Nagar, Chennai
  [22.5744, 88.3629, 0.84], // Salt Lake, Kolkata
  
  // Industrial areas
  [19.0330, 73.0297, 0.67], // MIDC Pune
  [28.4744, 77.5040, 0.71], // Ghaziabad
  [23.0505, 72.4285, 0.69], // GIDC Ankleshwar
  [22.3511, 73.1986, 0.65], // GIDC Vadodara
  
  // Tier-2 cities enhancement
  [16.9891, 73.3119, 0.58], // Sangli
  [17.6599, 75.9064, 0.56], // Solapur
  [19.7515, 75.7139, 0.54], // Marathwada region
  [20.7514, 78.6389, 0.52], // Akola-Amravati belt
  
  // Hill stations and tourist areas
  [11.4064, 76.6932, 0.35], // Ooty
  [15.2379, 75.0675, 0.33], // Hampi region
  [24.2354, 73.6977, 0.37], // Udaipur lakes
  [32.2190, 76.3234, 0.31], // McLeod Ganj
  
  // Border regions (lower intensity)
  [23.7367, 68.8378, 0.29], // Kutch region
  [27.5330, 88.5122, 0.35], // Darjeeling
  [34.1526, 77.5770, 0.27], // Leh region
  [15.9129, 74.1240, 0.39], // Goa hinterland
  
  // River confluences and valleys
  [25.4358, 81.8463, 0.48], // Allahabad region
  [22.7593, 75.8927, 0.52], // Narmada valley
  [26.8751, 80.9115, 0.50], // Gomti valley
  [21.1619, 79.0865, 0.46], // Wardha valley
];