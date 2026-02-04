// data/touristSafetyData.ts

export interface TouristSafetyData {
    id: string;
    name: string;
    state: string;
    lat: number;
    lng: number;
    safetyIndex: number;
    category: 'very_safe' | 'safe' | 'moderate' | 'risky' | 'high_risk';
    tourismLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
    incidents: number;
    population: string;
    type: 'metro' | 'city' | 'town' | 'hill_station' | 'beach' | 'heritage' | 'pilgrimage' | 'adventure';
    avgTemperature: number;
    connectivity: 'excellent' | 'good' | 'average' | 'poor';
    infrastructure: 'excellent' | 'good' | 'average' | 'poor';
}

export const touristSafetyData: TouristSafetyData[] = [
    // NORTH INDIA - METRO CITIES (Higher Risk)
    { id: '1', name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, safetyIndex: 35, category: 'risky', tourismLevel: 'very_high', incidents: 45, population: '32.9M', type: 'metro', avgTemperature: 25, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '2', name: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266, safetyIndex: 42, category: 'moderate', tourismLevel: 'medium', incidents: 28, population: '1.1M', type: 'city', avgTemperature: 26, connectivity: 'excellent', infrastructure: 'good' },
    { id: '3', name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, safetyIndex: 38, category: 'risky', tourismLevel: 'low', incidents: 32, population: '642K', type: 'city', avgTemperature: 25, connectivity: 'excellent', infrastructure: 'good' },
    { id: '4', name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, safetyIndex: 36, category: 'risky', tourismLevel: 'low', incidents: 35, population: '1.4M', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },

    // PUNJAB & HARYANA
    { id: '5', name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, safetyIndex: 62, category: 'safe', tourismLevel: 'high', incidents: 18, population: '1.1M', type: 'city', avgTemperature: 24, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '6', name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, safetyIndex: 44, category: 'moderate', tourismLevel: 'very_high', incidents: 25, population: '1.2M', type: 'pilgrimage', avgTemperature: 23, connectivity: 'good', infrastructure: 'good' },
    { id: '7', name: 'Ludhiana', state: 'Punjab', lat: 30.9009, lng: 75.8573, safetyIndex: 28, category: 'risky', tourismLevel: 'low', incidents: 41, population: '1.6M', type: 'city', avgTemperature: 24, connectivity: 'good', infrastructure: 'average' },
    { id: '8', name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, safetyIndex: 31, category: 'risky', tourismLevel: 'low', incidents: 38, population: '873K', type: 'city', avgTemperature: 24, connectivity: 'good', infrastructure: 'average' },
    { id: '9', name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, safetyIndex: 33, category: 'risky', tourismLevel: 'medium', incidents: 36, population: '446K', type: 'heritage', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },
    { id: '10', name: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455, safetyIndex: 29, category: 'risky', tourismLevel: 'low', incidents: 39, population: '286K', type: 'city', avgTemperature: 25, connectivity: 'average', infrastructure: 'average' },

    // UTTAR PRADESH
    { id: '11', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, safetyIndex: 39, category: 'risky', tourismLevel: 'high', incidents: 33, population: '2.8M', type: 'heritage', avgTemperature: 26, connectivity: 'excellent', infrastructure: 'good' },
    { id: '12', name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, safetyIndex: 25, category: 'high_risk', tourismLevel: 'low', incidents: 48, population: '2.9M', type: 'city', avgTemperature: 27, connectivity: 'good', infrastructure: 'average' },
    { id: '13', name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, safetyIndex: 31, category: 'risky', tourismLevel: 'very_high', incidents: 42, population: '1.7M', type: 'heritage', avgTemperature: 26, connectivity: 'excellent', infrastructure: 'good' },
    { id: '14', name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, safetyIndex: 27, category: 'risky', tourismLevel: 'very_high', incidents: 45, population: '1.2M', type: 'pilgrimage', avgTemperature: 27, connectivity: 'good', infrastructure: 'average' },
    { id: '15', name: 'Allahabad', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, safetyIndex: 29, category: 'risky', tourismLevel: 'high', incidents: 43, population: '1.2M', type: 'pilgrimage', avgTemperature: 27, connectivity: 'good', infrastructure: 'average' },
    { id: '16', name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, safetyIndex: 24, category: 'high_risk', tourismLevel: 'low', incidents: 49, population: '1.3M', type: 'city', avgTemperature: 25, connectivity: 'good', infrastructure: 'average' },
    { id: '17', name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, safetyIndex: 26, category: 'risky', tourismLevel: 'low', incidents: 46, population: '1.7M', type: 'city', avgTemperature: 25, connectivity: 'excellent', infrastructure: 'good' },
    { id: '18', name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880, safetyIndex: 23, category: 'high_risk', tourismLevel: 'low', incidents: 50, population: '874K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '19', name: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8386, lng: 78.7733, safetyIndex: 22, category: 'high_risk', tourismLevel: 'low', incidents: 51, population: '889K', type: 'city', avgTemperature: 25, connectivity: 'average', infrastructure: 'average' },
    { id: '20', name: 'Saharanpur', state: 'Uttar Pradesh', lat: 29.9680, lng: 77.5552, safetyIndex: 21, category: 'high_risk', tourismLevel: 'low', incidents: 52, population: '703K', type: 'city', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },

    // RAJASTHAN
    { id: '21', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, safetyIndex: 52, category: 'moderate', tourismLevel: 'very_high', incidents: 22, population: '3.1M', type: 'heritage', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '22', name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, safetyIndex: 50, category: 'moderate', tourismLevel: 'very_high', incidents: 24, population: '1.0M', type: 'heritage', avgTemperature: 29, connectivity: 'good', infrastructure: 'good' },
    { id: '23', name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, safetyIndex: 65, category: 'safe', tourismLevel: 'very_high', incidents: 12, population: '475K', type: 'heritage', avgTemperature: 27, connectivity: 'good', infrastructure: 'excellent' },
    { id: '24', name: 'Pushkar', state: 'Rajasthan', lat: 26.4899, lng: 74.5511, safetyIndex: 68, category: 'safe', tourismLevel: 'very_high', incidents: 10, population: '22K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '25', name: 'Jaisalmer', state: 'Rajasthan', lat: 26.9157, lng: 70.9083, safetyIndex: 71, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '78K', type: 'heritage', avgTemperature: 31, connectivity: 'average', infrastructure: 'good' },
    { id: '26', name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, safetyIndex: 48, category: 'moderate', tourismLevel: 'high', incidents: 26, population: '644K', type: 'heritage', avgTemperature: 30, connectivity: 'average', infrastructure: 'average' },
    { id: '27', name: 'Mount Abu', state: 'Rajasthan', lat: 24.5925, lng: 72.7056, safetyIndex: 78, category: 'very_safe', tourismLevel: 'very_high', incidents: 5, population: '22K', type: 'hill_station', avgTemperature: 22, connectivity: 'average', infrastructure: 'good' },
    { id: '28', name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, safetyIndex: 46, category: 'moderate', tourismLevel: 'very_high', incidents: 28, population: '551K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'good', infrastructure: 'average' },
    { id: '29', name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, safetyIndex: 34, category: 'risky', tourismLevel: 'low', incidents: 37, population: '1.0M', type: 'city', avgTemperature: 28, connectivity: 'good', infrastructure: 'average' },
    { id: '30', name: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346, safetyIndex: 41, category: 'moderate', tourismLevel: 'medium', incidents: 31, population: '341K', type: 'heritage', avgTemperature: 27, connectivity: 'average', infrastructure: 'average' },

    // HIMACHAL PRADESH & UTTARAKHAND (HILL STATIONS - SAFER)
    { id: '31', name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, safetyIndex: 78, category: 'very_safe', tourismLevel: 'very_high', incidents: 5, population: '170K', type: 'hill_station', avgTemperature: 16, connectivity: 'good', infrastructure: 'excellent' },
    { id: '32', name: 'Manali', state: 'Himachal Pradesh', lat: 32.2396, lng: 77.1887, safetyIndex: 82, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '8K', type: 'hill_station', avgTemperature: 14, connectivity: 'average', infrastructure: 'good' },
    { id: '33', name: 'Dharamshala', state: 'Himachal Pradesh', lat: 32.2190, lng: 76.3234, safetyIndex: 85, category: 'very_safe', tourismLevel: 'very_high', incidents: 2, population: '30K', type: 'hill_station', avgTemperature: 18, connectivity: 'good', infrastructure: 'excellent' },
    { id: '34', name: 'Dalhousie', state: 'Himachal Pradesh', lat: 32.5439, lng: 75.9618, safetyIndex: 83, category: 'very_safe', tourismLevel: 'high', incidents: 2, population: '7K', type: 'hill_station', avgTemperature: 15, connectivity: 'average', infrastructure: 'good' },
    { id: '35', name: 'Kasauli', state: 'Himachal Pradesh', lat: 30.8995, lng: 76.9652, safetyIndex: 84, category: 'very_safe', tourismLevel: 'high', incidents: 1, population: '4K', type: 'hill_station', avgTemperature: 17, connectivity: 'average', infrastructure: 'good' },
    { id: '36', name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, safetyIndex: 70, category: 'safe', tourismLevel: 'high', incidents: 9, population: '699K', type: 'city', avgTemperature: 22, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '37', name: 'Mussoorie', state: 'Uttarakhand', lat: 30.4598, lng: 78.0664, safetyIndex: 76, category: 'very_safe', tourismLevel: 'very_high', incidents: 6, population: '31K', type: 'hill_station', avgTemperature: 19, connectivity: 'good', infrastructure: 'good' },
    { id: '38', name: 'Rishikesh', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, safetyIndex: 75, category: 'safe', tourismLevel: 'very_high', incidents: 7, population: '102K', type: 'pilgrimage', avgTemperature: 23, connectivity: 'good', infrastructure: 'good' },
    { id: '39', name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, safetyIndex: 59, category: 'safe', tourismLevel: 'very_high', incidents: 16, population: '228K', type: 'pilgrimage', avgTemperature: 24, connectivity: 'good', infrastructure: 'good' },
    { id: '40', name: 'Nainital', state: 'Uttarakhand', lat: 29.3803, lng: 79.4636, safetyIndex: 81, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '41K', type: 'hill_station', avgTemperature: 18, connectivity: 'good', infrastructure: 'excellent' },

    // BIHAR & JHARKHAND (HIGHER RISK)
    { id: '41', name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, safetyIndex: 22, category: 'high_risk', tourismLevel: 'low', incidents: 51, population: '1.7M', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '42', name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002, safetyIndex: 26, category: 'risky', tourismLevel: 'high', incidents: 46, population: '470K', type: 'pilgrimage', avgTemperature: 27, connectivity: 'average', infrastructure: 'average' },
    { id: '43', name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, safetyIndex: 19, category: 'high_risk', tourismLevel: 'very_low', incidents: 55, population: '394K', type: 'city', avgTemperature: 26, connectivity: 'average', infrastructure: 'poor' },
    { id: '44', name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, safetyIndex: 32, category: 'risky', tourismLevel: 'medium', incidents: 38, population: '1.1M', type: 'city', avgTemperature: 24, connectivity: 'good', infrastructure: 'average' },
    { id: '45', name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, safetyIndex: 35, category: 'risky', tourismLevel: 'low', incidents: 35, population: '1.3M', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },

    // WEST INDIA - MAHARASHTRA
    { id: '46', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, safetyIndex: 52, category: 'moderate', tourismLevel: 'very_high', incidents: 23, population: '12.5M', type: 'metro', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '47', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, safetyIndex: 65, category: 'safe', tourismLevel: 'high', incidents: 13, population: '3.1M', type: 'city', avgTemperature: 25, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '48', name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, safetyIndex: 56, category: 'safe', tourismLevel: 'medium', incidents: 18, population: '2.4M', type: 'city', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'good' },
    { id: '49', name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, safetyIndex: 61, category: 'safe', tourismLevel: 'high', incidents: 15, population: '1.5M', type: 'pilgrimage', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },
    { id: '50', name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, safetyIndex: 58, category: 'safe', tourismLevel: 'very_high', incidents: 17, population: '1.2M', type: 'heritage', avgTemperature: 27, connectivity: 'good', infrastructure: 'good' },
    { id: '51', name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433, safetyIndex: 63, category: 'safe', tourismLevel: 'medium', incidents: 14, population: '550K', type: 'heritage', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },
    { id: '52', name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064, safetyIndex: 54, category: 'moderate', tourismLevel: 'low', incidents: 20, population: '952K', type: 'city', avgTemperature: 28, connectivity: 'average', infrastructure: 'average' },
    { id: '53', name: 'Lonavala', state: 'Maharashtra', lat: 18.7537, lng: 73.4068, safetyIndex: 72, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '58K', type: 'hill_station', avgTemperature: 23, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '54', name: 'Mahabaleshwar', state: 'Maharashtra', lat: 17.9244, lng: 73.6544, safetyIndex: 76, category: 'very_safe', tourismLevel: 'very_high', incidents: 6, population: '13K', type: 'hill_station', avgTemperature: 20, connectivity: 'good', infrastructure: 'excellent' },
    { id: '55', name: 'Alibag', state: 'Maharashtra', lat: 18.6414, lng: 72.8722, safetyIndex: 69, category: 'safe', tourismLevel: 'high', incidents: 11, population: '20K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },

    // GUJARAT
    { id: '56', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, safetyIndex: 57, category: 'safe', tourismLevel: 'high', incidents: 17, population: '5.6M', type: 'heritage', avgTemperature: 29, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '57', name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, safetyIndex: 61, category: 'safe', tourismLevel: 'medium', incidents: 15, population: '4.5M', type: 'city', avgTemperature: 29, connectivity: 'excellent', infrastructure: 'good' },
    { id: '58', name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, safetyIndex: 64, category: 'safe', tourismLevel: 'medium', incidents: 13, population: '1.7M', type: 'heritage', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '59', name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, safetyIndex: 59, category: 'safe', tourismLevel: 'low', incidents: 16, population: '1.3M', type: 'city', avgTemperature: 29, connectivity: 'good', infrastructure: 'good' },
    { id: '60', name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519, safetyIndex: 62, category: 'safe', tourismLevel: 'medium', incidents: 14, population: '594K', type: 'city', avgTemperature: 29, connectivity: 'good', infrastructure: 'good' },
    { id: '61', name: 'Dwarka', state: 'Gujarat', lat: 22.2394, lng: 68.9678, safetyIndex: 74, category: 'safe', tourismLevel: 'very_high', incidents: 7, population: '39K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '62', name: 'Somnath', state: 'Gujarat', lat: 20.8880, lng: 70.4011, safetyIndex: 73, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '15K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '63', name: 'Diu', state: 'Daman and Diu', lat: 20.7144, lng: 70.9876, safetyIndex: 79, category: 'very_safe', tourismLevel: 'very_high', incidents: 4, population: '44K', type: 'beach', avgTemperature: 28, connectivity: 'average', infrastructure: 'excellent' },

    // MADHYA PRADESH & CHHATTISGARH
    { id: '64', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, safetyIndex: 53, category: 'moderate', tourismLevel: 'medium', incidents: 21, population: '1.8M', type: 'city', avgTemperature: 26, connectivity: 'excellent', infrastructure: 'good' },
    { id: '65', name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, safetyIndex: 58, category: 'safe', tourismLevel: 'medium', incidents: 17, population: '2.2M', type: 'city', avgTemperature: 26, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '66', name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, safetyIndex: 43, category: 'moderate', tourismLevel: 'high', incidents: 29, population: '1.1M', type: 'heritage', avgTemperature: 27, connectivity: 'good', infrastructure: 'average' },
    { id: '67', name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, safetyIndex: 47, category: 'moderate', tourismLevel: 'medium', incidents: 26, population: '1.3M', type: 'city', avgTemperature: 25, connectivity: 'good', infrastructure: 'average' },
    { id: '68', name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, safetyIndex: 51, category: 'moderate', tourismLevel: 'very_high', incidents: 23, population: '515K', type: 'pilgrimage', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '69', name: 'Khajuraho', state: 'Madhya Pradesh', lat: 24.8318, lng: 79.9199, safetyIndex: 67, category: 'safe', tourismLevel: 'very_high', incidents: 11, population: '24K', type: 'heritage', avgTemperature: 26, connectivity: 'average', infrastructure: 'excellent' },
    { id: '70', name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, safetyIndex: 47, category: 'moderate', tourismLevel: 'low', incidents: 26, population: '1.0M', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },

    // EAST INDIA - WEST BENGAL
    { id: '71', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, safetyIndex: 49, category: 'moderate', tourismLevel: 'very_high', incidents: 24, population: '4.5M', type: 'metro', avgTemperature: 27, connectivity: 'excellent', infrastructure: 'good' },
    { id: '72', name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, safetyIndex: 45, category: 'moderate', tourismLevel: 'medium', incidents: 28, population: '1.1M', type: 'city', avgTemperature: 27, connectivity: 'excellent', infrastructure: 'average' },
    { id: '73', name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119, safetyIndex: 42, category: 'moderate', tourismLevel: 'low', incidents: 30, population: '581K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '74', name: 'Asansol', state: 'West Bengal', lat: 23.6739, lng: 86.9524, safetyIndex: 38, category: 'risky', tourismLevel: 'very_low', incidents: 33, population: '564K', type: 'city', avgTemperature: 26, connectivity: 'average', infrastructure: 'average' },
    { id: '75', name: 'Darjeeling', state: 'West Bengal', lat: 27.0360, lng: 88.2627, safetyIndex: 76, category: 'very_safe', tourismLevel: 'very_high', incidents: 6, population: '119K', type: 'hill_station', avgTemperature: 15, connectivity: 'average', infrastructure: 'good' },
    { id: '76', name: 'Kalimpong', state: 'West Bengal', lat: 27.0667, lng: 88.4667, safetyIndex: 74, category: 'safe', tourismLevel: 'high', incidents: 7, population: '43K', type: 'hill_station', avgTemperature: 16, connectivity: 'average', infrastructure: 'good' },
    { id: '77', name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, safetyIndex: 48, category: 'moderate', tourismLevel: 'medium', incidents: 25, population: '513K', type: 'city', avgTemperature: 24, connectivity: 'good', infrastructure: 'average' },
    { id: '78', name: 'Digha', state: 'West Bengal', lat: 21.6277, lng: 87.5099, safetyIndex: 63, category: 'safe', tourismLevel: 'high', incidents: 14, population: '48K', type: 'beach', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },

    // ODISHA
    { id: '79', name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, safetyIndex: 66, category: 'safe', tourismLevel: 'high', incidents: 12, population: '837K', type: 'heritage', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '80', name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8828, safetyIndex: 54, category: 'moderate', tourismLevel: 'medium', incidents: 20, population: '606K', type: 'city', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '81', name: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8312, safetyIndex: 68, category: 'safe', tourismLevel: 'very_high', incidents: 10, population: '201K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '82', name: 'Konark', state: 'Odisha', lat: 19.8876, lng: 86.0943, safetyIndex: 71, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '16K', type: 'heritage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },

    // NORTHEAST INDIA (GENERALLY SAFER BUT LOWER CONNECTIVITY)
    { id: '83', name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, safetyIndex: 56, category: 'safe', tourismLevel: 'medium', incidents: 18, population: '963K', type: 'city', avgTemperature: 25, connectivity: 'good', infrastructure: 'good' },
    { id: '84', name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, safetyIndex: 72, category: 'safe', tourismLevel: 'high', incidents: 8, population: '143K', type: 'hill_station', avgTemperature: 18, connectivity: 'average', infrastructure: 'good' },
    { id: '85', name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368, safetyIndex: 45, category: 'moderate', tourismLevel: 'low', incidents: 28, population: '268K', type: 'city', avgTemperature: 22, connectivity: 'poor', infrastructure: 'average' },
    { id: '86', name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868, safetyIndex: 52, category: 'moderate', tourismLevel: 'low', incidents: 22, population: '400K', type: 'city', avgTemperature: 25, connectivity: 'average', infrastructure: 'average' },
    { id: '87', name: 'Aizawl', state: 'Mizoram', lat: 23.7307, lng: 92.7173, safetyIndex: 69, category: 'safe', tourismLevel: 'low', incidents: 10, population: '228K', type: 'city', avgTemperature: 20, connectivity: 'poor', infrastructure: 'average' },
    { id: '88', name: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053, safetyIndex: 64, category: 'safe', tourismLevel: 'very_low', incidents: 13, population: '44K', type: 'city', avgTemperature: 19, connectivity: 'poor', infrastructure: 'average' },

    // SOUTH INDIA - KARNATAKA (GENERALLY SAFER)
    { id: '89', name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, safetyIndex: 77, category: 'very_safe', tourismLevel: 'very_high', incidents: 6, population: '8.4M', type: 'metro', avgTemperature: 24, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '90', name: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394, safetyIndex: 81, category: 'very_safe', tourismLevel: 'very_high', incidents: 4, population: '887K', type: 'heritage', avgTemperature: 24, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '91', name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lng: 74.8560, safetyIndex: 76, category: 'very_safe', tourismLevel: 'high', incidents: 6, population: '488K', type: 'beach', avgTemperature: 27, connectivity: 'good', infrastructure: 'excellent' },
    { id: '92', name: 'Hubli', state: 'Karnataka', lat: 15.3647, lng: 75.1240, safetyIndex: 69, category: 'safe', tourismLevel: 'low', incidents: 10, population: '943K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },
    { id: '93', name: 'Belgaum', state: 'Karnataka', lat: 15.8497, lng: 74.4977, safetyIndex: 67, category: 'safe', tourismLevel: 'medium', incidents: 11, population: '488K', type: 'city', avgTemperature: 25, connectivity: 'good', infrastructure: 'good' },
    { id: '94', name: 'Gulbarga', state: 'Karnataka', lat: 17.3297, lng: 76.8343, safetyIndex: 63, category: 'safe', tourismLevel: 'medium', incidents: 14, population: '532K', type: 'heritage', avgTemperature: 26, connectivity: 'average', infrastructure: 'average' },
    { id: '95', name: 'Hampi', state: 'Karnataka', lat: 15.3350, lng: 76.4600, safetyIndex: 83, category: 'very_safe', tourismLevel: 'very_high', incidents: 2, population: '2K', type: 'heritage', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '96', name: 'Coorg', state: 'Karnataka', lat: 12.3375, lng: 75.8069, safetyIndex: 85, category: 'very_safe', tourismLevel: 'very_high', incidents: 2, population: '28K', type: 'hill_station', avgTemperature: 21, connectivity: 'average', infrastructure: 'excellent' },
    { id: '97', name: 'Udupi', state: 'Karnataka', lat: 13.3409, lng: 74.7421, safetyIndex: 79, category: 'very_safe', tourismLevel: 'high', incidents: 4, population: '125K', type: 'pilgrimage', avgTemperature: 27, connectivity: 'good', infrastructure: 'good' },
    { id: '98', name: 'Chikmagalur', state: 'Karnataka', lat: 13.3161, lng: 75.7720, safetyIndex: 82, category: 'very_safe', tourismLevel: 'high', incidents: 3, population: '118K', type: 'hill_station', avgTemperature: 22, connectivity: 'average', infrastructure: 'good' },

    // TAMIL NADU
    { id: '99', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, safetyIndex: 73, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '4.7M', type: 'metro', avgTemperature: 29, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '100', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, safetyIndex: 75, category: 'safe', tourismLevel: 'medium', incidents: 7, population: '1.1M', type: 'city', avgTemperature: 26, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '101', name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, safetyIndex: 68, category: 'safe', tourismLevel: 'very_high', incidents: 10, population: '1.0M', type: 'heritage', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '102', name: 'Trichy', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, safetyIndex: 71, category: 'safe', tourismLevel: 'high', incidents: 9, population: '847K', type: 'heritage', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '103', name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, safetyIndex: 66, category: 'safe', tourismLevel: 'low', incidents: 12, population: '831K', type: 'city', avgTemperature: 27, connectivity: 'good', infrastructure: 'good' },
    { id: '104', name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567, safetyIndex: 64, category: 'safe', tourismLevel: 'medium', incidents: 13, population: '474K', type: 'city', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '105', name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, safetyIndex: 62, category: 'safe', tourismLevel: 'medium', incidents: 14, population: '423K', type: 'heritage', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '106', name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lng: 79.1378, safetyIndex: 74, category: 'safe', tourismLevel: 'very_high', incidents: 7, population: '222K', type: 'heritage', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '107', name: 'Kanyakumari', state: 'Tamil Nadu', lat: 8.0883, lng: 77.5385, safetyIndex: 78, category: 'very_safe', tourismLevel: 'very_high', incidents: 5, population: '19K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '108', name: 'Ooty', state: 'Tamil Nadu', lat: 11.4064, lng: 76.6932, safetyIndex: 84, category: 'very_safe', tourismLevel: 'very_high', incidents: 2, population: '88K', type: 'hill_station', avgTemperature: 18, connectivity: 'good', infrastructure: 'excellent' },
    { id: '109', name: 'Kodaikanal', state: 'Tamil Nadu', lat: 10.2381, lng: 77.4892, safetyIndex: 86, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '36K', type: 'hill_station', avgTemperature: 17, connectivity: 'average', infrastructure: 'excellent' },
    { id: '110', name: 'Rameswaram', state: 'Tamil Nadu', lat: 9.2881, lng: 79.3129, safetyIndex: 77, category: 'very_safe', tourismLevel: 'very_high', incidents: 5, population: '44K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },

    // ANDHRA PRADESH & TELANGANA
    { id: '111', name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, safetyIndex: 71, category: 'safe', tourismLevel: 'very_high', incidents: 9, population: '6.9M', type: 'metro', avgTemperature: 27, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '112', name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, safetyIndex: 68, category: 'safe', tourismLevel: 'high', incidents: 10, population: '1.7M', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '113', name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, safetyIndex: 59, category: 'safe', tourismLevel: 'medium', incidents: 16, population: '1.0M', type: 'city', avgTemperature: 29, connectivity: 'excellent', infrastructure: 'good' },
    { id: '114', name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, safetyIndex: 56, category: 'safe', tourismLevel: 'low', incidents: 18, population: '651K', type: 'city', avgTemperature: 29, connectivity: 'good', infrastructure: 'average' },
    { id: '115', name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865, safetyIndex: 61, category: 'safe', tourismLevel: 'low', incidents: 15, population: '499K', type: 'city', avgTemperature: 29, connectivity: 'good', infrastructure: 'average' },
    { id: '116', name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373, safetyIndex: 54, category: 'moderate', tourismLevel: 'low', incidents: 20, population: '484K', type: 'city', avgTemperature: 28, connectivity: 'average', infrastructure: 'average' },
    { id: '117', name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, safetyIndex: 63, category: 'safe', tourismLevel: 'medium', incidents: 14, population: '704K', type: 'heritage', avgTemperature: 27, connectivity: 'good', infrastructure: 'average' },
    { id: '118', name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, safetyIndex: 75, category: 'safe', tourismLevel: 'very_high', incidents: 7, population: '287K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },

    // KERALA (HIGHEST SAFETY)
    { id: '119', name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, safetyIndex: 82, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '677K', type: 'beach', avgTemperature: 27, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '120', name: 'Trivandrum', state: 'Kerala', lat: 8.5241, lng: 76.9366, safetyIndex: 79, category: 'very_safe', tourismLevel: 'very_high', incidents: 4, population: '957K', type: 'beach', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '121', name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, safetyIndex: 81, category: 'very_safe', tourismLevel: 'high', incidents: 3, population: '432K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '122', name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, safetyIndex: 83, category: 'very_safe', tourismLevel: 'high', incidents: 2, population: '315K', type: 'heritage', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '123', name: 'Kollam', state: 'Kerala', lat: 8.8932, lng: 76.6141, safetyIndex: 80, category: 'very_safe', tourismLevel: 'high', incidents: 4, population: '349K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '124', name: 'Alappuzha', state: 'Kerala', lat: 9.4981, lng: 76.3388, safetyIndex: 85, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '174K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '125', name: 'Munnar', state: 'Kerala', lat: 10.0889, lng: 77.0595, safetyIndex: 89, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '72K', type: 'hill_station', avgTemperature: 19, connectivity: 'average', infrastructure: 'excellent' },
    { id: '126', name: 'Thekkady', state: 'Kerala', lat: 9.5965, lng: 77.1608, safetyIndex: 87, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '8K', type: 'adventure', avgTemperature: 22, connectivity: 'average', infrastructure: 'good' },
    { id: '127', name: 'Varkala', state: 'Kerala', lat: 8.7379, lng: 76.7163, safetyIndex: 84, category: 'very_safe', tourismLevel: 'very_high', incidents: 2, population: '43K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '128', name: 'Kumarakom', state: 'Kerala', lat: 9.6178, lng: 76.4298, safetyIndex: 86, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '15K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },

    // GOA (VERY SAFE BEACH DESTINATION)
    { id: '129', name: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278, safetyIndex: 84, category: 'very_safe', tourismLevel: 'very_high', incidents: 2, population: '114K', type: 'beach', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '130', name: 'Margao', state: 'Goa', lat: 15.2700, lng: 73.9525, safetyIndex: 82, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '99K', type: 'beach', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '131', name: 'Calangute', state: 'Goa', lat: 15.5438, lng: 73.7553, safetyIndex: 79, category: 'very_safe', tourismLevel: 'very_high', incidents: 4, population: '25K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '132', name: 'Anjuna', state: 'Goa', lat: 15.5733, lng: 73.7406, safetyIndex: 81, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '15K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },

    // UNION TERRITORIES
    { id: '133', name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083, safetyIndex: 78, category: 'very_safe', tourismLevel: 'very_high', incidents: 5, population: '245K', type: 'heritage', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '134', name: 'Port Blair', state: 'Andaman and Nicobar Islands', lat: 11.6234, lng: 92.7265, safetyIndex: 73, category: 'safe', tourismLevel: 'high', incidents: 8, population: '140K', type: 'beach', avgTemperature: 27, connectivity: 'poor', infrastructure: 'good' },
    { id: '135', name: 'Leh', state: 'Ladakh', lat: 34.1526, lng: 77.5770, safetyIndex: 81, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '31K', type: 'adventure', avgTemperature: 8, connectivity: 'poor', infrastructure: 'good' },
    { id: '136', name: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973, safetyIndex: 28, category: 'risky', tourismLevel: 'high', incidents: 44, population: '1.3M', type: 'hill_station', avgTemperature: 14, connectivity: 'average', infrastructure: 'average' },

    // ADDITIONAL SMALLER CITIES & TOWNS FOR BETTER COVERAGE

    // More Rajasthan
    { id: '137', name: 'Chittorgarh', state: 'Rajasthan', lat: 24.8887, lng: 74.6269, safetyIndex: 55, category: 'moderate', tourismLevel: 'very_high', incidents: 19, population: '117K', type: 'heritage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '138', name: 'Bharatpur', state: 'Rajasthan', lat: 27.2152, lng: 77.4909, safetyIndex: 49, category: 'moderate', tourismLevel: 'high', incidents: 24, population: '252K', type: 'adventure', avgTemperature: 27, connectivity: 'good', infrastructure: 'average' },
    { id: '139', name: 'Sawai Madhopur', state: 'Rajasthan', lat: 26.0173, lng: 76.3509, safetyIndex: 57, category: 'safe', tourismLevel: 'very_high', incidents: 17, population: '125K', type: 'adventure', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },

    // More UP
    { id: '140', name: 'Mathura', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737, safetyIndex: 33, category: 'risky', tourismLevel: 'very_high', incidents: 37, population: '441K', type: 'pilgrimage', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '141', name: 'Vrindavan', state: 'Uttar Pradesh', lat: 27.5814, lng: 77.7007, safetyIndex: 35, category: 'risky', tourismLevel: 'very_high', incidents: 35, population: '63K', type: 'pilgrimage', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '142', name: 'Ayodhya', state: 'Uttar Pradesh', lat: 26.7922, lng: 82.1998, safetyIndex: 31, category: 'risky', tourismLevel: 'very_high', incidents: 40, population: '55K', type: 'pilgrimage', avgTemperature: 27, connectivity: 'average', infrastructure: 'average' },
    { id: '143', name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, safetyIndex: 24, category: 'high_risk', tourismLevel: 'low', incidents: 48, population: '674K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '144', name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304, safetyIndex: 21, category: 'high_risk', tourismLevel: 'very_low', incidents: 53, population: '898K', type: 'city', avgTemperature: 25, connectivity: 'average', infrastructure: 'average' },

    // More Maharashtra
    { id: '145', name: 'Shirdi', state: 'Maharashtra', lat: 19.7645, lng: 74.4761, safetyIndex: 67, category: 'safe', tourismLevel: 'very_high', incidents: 11, population: '37K', type: 'pilgrimage', avgTemperature: 26, connectivity: 'good', infrastructure: 'excellent' },
    { id: '146', name: 'Ajanta', state: 'Maharashtra', lat: 20.5502, lng: 75.7029, safetyIndex: 71, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '3K', type: 'heritage', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '147', name: 'Ellora', state: 'Maharashtra', lat: 20.0268, lng: 75.1789, safetyIndex: 73, category: 'safe', tourismLevel: 'very_high', incidents: 7, population: '2K', type: 'heritage', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '148', name: 'Sindhudurg', state: 'Maharashtra', lat: 16.0667, lng: 73.5000, safetyIndex: 75, category: 'safe', tourismLevel: 'high', incidents: 7, population: '849K', type: 'beach', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },

    // More Gujarat
    { id: '149', name: 'Kutch', state: 'Gujarat', lat: 23.7337, lng: 69.8597, safetyIndex: 66, category: 'safe', tourismLevel: 'very_high', incidents: 12, population: '2.1M', type: 'heritage', avgTemperature: 30, connectivity: 'average', infrastructure: 'good' },
    { id: '150', name: 'Gir', state: 'Gujarat', lat: 21.1247, lng: 70.7951, safetyIndex: 72, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '15K', type: 'adventure', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '151', name: 'Palitana', state: 'Gujarat', lat: 21.5222, lng: 71.8258, safetyIndex: 76, category: 'very_safe', tourismLevel: 'high', incidents: 6, population: '67K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },

    // More Himachal & Uttarakhand
    { id: '152', name: 'Spiti Valley', state: 'Himachal Pradesh', lat: 32.2464, lng: 78.0344, safetyIndex: 88, category: 'very_safe', tourismLevel: 'high', incidents: 1, population: '12K', type: 'adventure', avgTemperature: 5, connectivity: 'poor', infrastructure: 'average' },
    { id: '153', name: 'Kullu', state: 'Himachal Pradesh', lat: 31.9578, lng: 77.1089, safetyIndex: 79, category: 'very_safe', tourismLevel: 'very_high', incidents: 4, population: '18K', type: 'hill_station', avgTemperature: 16, connectivity: 'average', infrastructure: 'good' },
    { id: '154', name: 'McLeod Ganj', state: 'Himachal Pradesh', lat: 32.2190, lng: 76.3234, safetyIndex: 86, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '9K', type: 'hill_station', avgTemperature: 18, connectivity: 'good', infrastructure: 'excellent' },
    { id: '155', name: 'Auli', state: 'Uttarakhand', lat: 30.5370, lng: 79.5669, safetyIndex: 84, category: 'very_safe', tourismLevel: 'high', incidents: 2, population: '1K', type: 'adventure', avgTemperature: 8, connectivity: 'poor', infrastructure: 'good' },
    { id: '156', name: 'Jim Corbett', state: 'Uttarakhand', lat: 29.5316, lng: 78.9444, safetyIndex: 77, category: 'very_safe', tourismLevel: 'very_high', incidents: 5, population: '4K', type: 'adventure', avgTemperature: 21, connectivity: 'average', infrastructure: 'excellent' },

    // More Karnataka
    { id: '157', name: 'Badami', state: 'Karnataka', lat: 15.9149, lng: 75.6768, safetyIndex: 74, category: 'safe', tourismLevel: 'very_high', incidents: 7, population: '30K', type: 'heritage', avgTemperature: 26, connectivity: 'average', infrastructure: 'good' },
    { id: '158', name: 'Gokarna', state: 'Karnataka', lat: 14.5492, lng: 74.3200, safetyIndex: 81, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '25K', type: 'beach', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '159', name: 'Bandipur', state: 'Karnataka', lat: 11.8081, lng: 76.4951, safetyIndex: 80, category: 'very_safe', tourismLevel: 'high', incidents: 4, population: '3K', type: 'adventure', avgTemperature: 23, connectivity: 'average', infrastructure: 'good' },

    // More Tamil Nadu
    { id: '160', name: 'Mahabalipuram', state: 'Tamil Nadu', lat: 12.6269, lng: 80.1927, safetyIndex: 76, category: 'very_safe', tourismLevel: 'very_high', incidents: 6, population: '12K', type: 'heritage', avgTemperature: 29, connectivity: 'good', infrastructure: 'excellent' },
    { id: '161', name: 'Pondicherry Beach', state: 'Tamil Nadu', lat: 11.9139, lng: 79.8145, safetyIndex: 77, category: 'very_safe', tourismLevel: 'very_high', incidents: 5, population: '245K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '162', name: 'Yelagiri', state: 'Tamil Nadu', lat: 12.5810, lng: 78.6549, safetyIndex: 83, category: 'very_safe', tourismLevel: 'high', incidents: 2, population: '35K', type: 'hill_station', avgTemperature: 20, connectivity: 'average', infrastructure: 'good' },

    // More Kerala
    { id: '163', name: 'Wayanad', state: 'Kerala', lat: 11.6854, lng: 76.1320, safetyIndex: 87, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '817K', type: 'hill_station', avgTemperature: 21, connectivity: 'average', infrastructure: 'excellent' },
    { id: '164', name: 'Kovalam', state: 'Kerala', lat: 8.4004, lng: 76.9790, safetyIndex: 84, category: 'very_safe', tourismLevel: 'very_high', incidents: 2, population: '68K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '165', name: 'Bekal', state: 'Kerala', lat: 12.3920, lng: 75.0337, safetyIndex: 85, category: 'very_safe', tourismLevel: 'high', incidents: 1, population: '26K', type: 'beach', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },

    // Industrial Cities (Mixed Safety)
    { id: '166', name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536, safetyIndex: 51, category: 'moderate', tourismLevel: 'very_low', incidents: 23, population: '484K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },
    { id: '167', name: 'Bokaro', state: 'Jharkhand', lat: 23.6693, lng: 86.1511, safetyIndex: 41, category: 'moderate', tourismLevel: 'very_low', incidents: 31, population: '394K', type: 'city', avgTemperature: 25, connectivity: 'average', infrastructure: 'average' },
    { id: '168', name: 'Bhilai', state: 'Chhattisgarh', lat: 21.1938, lng: 81.3509, safetyIndex: 49, category: 'moderate', tourismLevel: 'very_low', incidents: 24, population: '625K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },
    { id: '169', name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119, safetyIndex: 42, category: 'moderate', tourismLevel: 'very_low', incidents: 30, population: '518K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },

    // Temple Towns & Pilgrimage Sites
    { id: '170', name: 'Tiruvannamalai', state: 'Tamil Nadu', lat: 12.2253, lng: 79.0747, safetyIndex: 72, category: 'safe', tourismLevel: 'very_high', incidents: 8, population: '145K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '171', name: 'Chidambaram', state: 'Tamil Nadu', lat: 11.3994, lng: 79.6947, safetyIndex: 71, category: 'safe', tourismLevel: 'high', incidents: 9, population: '62K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '172', name: 'Guruvayur', state: 'Kerala', lat: 10.5939, lng: 76.0421, safetyIndex: 81, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '20K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'good', infrastructure: 'excellent' },
    { id: '173', name: 'Sabarimala', state: 'Kerala', lat: 9.4348, lng: 77.0811, safetyIndex: 69, category: 'safe', tourismLevel: 'very_high', incidents: 10, population: '5K', type: 'pilgrimage', avgTemperature: 22, connectivity: 'poor', infrastructure: 'average' },
    { id: '174', name: 'Srirangam', state: 'Tamil Nadu', lat: 10.8624, lng: 78.6918, safetyIndex: 74, category: 'safe', tourismLevel: 'very_high', incidents: 7, population: '156K', type: 'pilgrimage', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },

    // Beach Towns
    { id: '175', name: 'Mamallapuram', state: 'Tamil Nadu', lat: 12.6269, lng: 80.1927, safetyIndex: 76, category: 'very_safe', tourismLevel: 'very_high', incidents: 6, population: '12K', type: 'beach', avgTemperature: 29, connectivity: 'good', infrastructure: 'excellent' },
    { id: '176', name: 'Karwar', state: 'Karnataka', lat: 14.8144, lng: 74.1296, safetyIndex: 78, category: 'very_safe', tourismLevel: 'high', incidents: 5, population: '154K', type: 'beach', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '177', name: 'Murudeshwar', state: 'Karnataka', lat: 14.0942, lng: 74.4840, safetyIndex: 79, category: 'very_safe', tourismLevel: 'high', incidents: 4, population: '6K', type: 'pilgrimage', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '178', name: 'Ratnagiri', state: 'Maharashtra', lat: 16.9902, lng: 73.3120, safetyIndex: 67, category: 'safe', tourismLevel: 'medium', incidents: 11, population: '76K', type: 'beach', avgTemperature: 28, connectivity: 'average', infrastructure: 'average' },

    // Business/IT Hubs
    { id: '179', name: 'Whitefield', state: 'Karnataka', lat: 12.9698, lng: 77.7500, safetyIndex: 75, category: 'safe', tourismLevel: 'low', incidents: 7, population: '300K', type: 'city', avgTemperature: 24, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '180', name: 'Electronic City', state: 'Karnataka', lat: 12.8456, lng: 77.6603, safetyIndex: 74, category: 'safe', tourismLevel: 'very_low', incidents: 7, population: '200K', type: 'city', avgTemperature: 24, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '181', name: 'Hinjewadi', state: 'Maharashtra', lat: 18.5912, lng: 73.7389, safetyIndex: 68, category: 'safe', tourismLevel: 'very_low', incidents: 10, population: '150K', type: 'city', avgTemperature: 25, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '182', name: 'Gachibowli', state: 'Telangana', lat: 17.4239, lng: 78.3480, safetyIndex: 73, category: 'safe', tourismLevel: 'very_low', incidents: 8, population: '200K', type: 'city', avgTemperature: 27, connectivity: 'excellent', infrastructure: 'excellent' },

    // Border Cities
    { id: '183', name: 'Wagah', state: 'Punjab', lat: 31.6051, lng: 74.5724, safetyIndex: 41, category: 'moderate', tourismLevel: 'high', incidents: 31, population: '5K', type: 'heritage', avgTemperature: 23, connectivity: 'average', infrastructure: 'average' },
    { id: '184', name: 'Longewala', state: 'Rajasthan', lat: 26.8333, lng: 71.5000, safetyIndex: 52, category: 'moderate', tourismLevel: 'medium', incidents: 22, population: '2K', type: 'heritage', avgTemperature: 31, connectivity: 'poor', infrastructure: 'poor' },

    // Wildlife Destinations
    { id: '185', name: 'Ranthambore', state: 'Rajasthan', lat: 26.0173, lng: 76.5026, safetyIndex: 64, category: 'safe', tourismLevel: 'very_high', incidents: 13, population: '8K', type: 'adventure', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '186', name: 'Kaziranga', state: 'Assam', lat: 26.5775, lng: 93.1674, safetyIndex: 61, category: 'safe', tourismLevel: 'very_high', incidents: 15, population: '12K', type: 'adventure', avgTemperature: 24, connectivity: 'average', infrastructure: 'good' },
    { id: '187', name: 'Sunderbans', state: 'West Bengal', lat: 21.9497, lng: 89.1833, safetyIndex: 58, category: 'safe', tourismLevel: 'high', incidents: 17, population: '4K', type: 'adventure', avgTemperature: 27, connectivity: 'poor', infrastructure: 'average' },
    { id: '188', name: 'Periyar', state: 'Kerala', lat: 9.4981, lng: 77.2397, safetyIndex: 82, category: 'very_safe', tourismLevel: 'very_high', incidents: 3, population: '15K', type: 'adventure', avgTemperature: 22, connectivity: 'average', infrastructure: 'excellent' },

    // Adventure Destinations
    { id: '189', name: 'Tawang', state: 'Arunachal Pradesh', lat: 27.5860, lng: 91.8737, safetyIndex: 71, category: 'safe', tourismLevel: 'high', incidents: 9, population: '11K', type: 'adventure', avgTemperature: 12, connectivity: 'poor', infrastructure: 'average' },
    { id: '190', name: 'Zanskar', state: 'Ladakh', lat: 33.4734, lng: 76.8512, safetyIndex: 85, category: 'very_safe', tourismLevel: 'high', incidents: 1, population: '14K', type: 'adventure', avgTemperature: 5, connectivity: 'poor', infrastructure: 'poor' },
    { id: '191', name: 'Valley of Flowers', state: 'Uttarakhand', lat: 30.7268, lng: 79.6009, safetyIndex: 89, category: 'very_safe', tourismLevel: 'high', incidents: 1, population: '0K', type: 'adventure', avgTemperature: 8, connectivity: 'poor', infrastructure: 'poor' },
    { id: '192', name: 'Hemkund Sahib', state: 'Uttarakhand', lat: 30.7184, lng: 79.6613, safetyIndex: 87, category: 'very_safe', tourismLevel: 'high', incidents: 1, population: '0K', type: 'pilgrimage', avgTemperature: 6, connectivity: 'poor', infrastructure: 'poor' },

    // More Metropolitan Areas
    { id: '193', name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, safetyIndex: 58, category: 'safe', tourismLevel: 'low', incidents: 17, population: '1.8M', type: 'city', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '194', name: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297, safetyIndex: 62, category: 'safe', tourismLevel: 'low', incidents: 14, population: '1.1M', type: 'city', avgTemperature: 28, connectivity: 'excellent', infrastructure: 'excellent' },
    { id: '195', name: 'Vasai-Virar', state: 'Maharashtra', lat: 19.4912, lng: 72.8054, safetyIndex: 54, category: 'moderate', tourismLevel: 'very_low', incidents: 20, population: '1.2M', type: 'city', avgTemperature: 28, connectivity: 'good', infrastructure: 'average' },

    // Educational Cities
    { id: '196', name: 'Roorkee', state: 'Uttarakhand', lat: 29.8543, lng: 77.8880, safetyIndex: 65, category: 'safe', tourismLevel: 'low', incidents: 13, population: '118K', type: 'city', avgTemperature: 23, connectivity: 'good', infrastructure: 'excellent' },
    { id: '197', name: 'Kharagpur', state: 'West Bengal', lat: 22.3460, lng: 87.2320, safetyIndex: 56, category: 'safe', tourismLevel: 'very_low', incidents: 18, population: '207K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },
    { id: '198', name: 'Pilani', state: 'Rajasthan', lat: 28.3670, lng: 75.6032, safetyIndex: 59, category: 'safe', tourismLevel: 'very_low', incidents: 16, population: '45K', type: 'city', avgTemperature: 27, connectivity: 'average', infrastructure: 'excellent' },

    // Additional Coastal Cities
    { id: '199', name: 'Puri Beach', state: 'Odisha', lat: 19.8135, lng: 85.8312, safetyIndex: 69, category: 'safe', tourismLevel: 'very_high', incidents: 10, population: '201K', type: 'beach', avgTemperature: 28, connectivity: 'good', infrastructure: 'good' },
    { id: '200', name: 'Gopalpur', state: 'Odisha', lat: 19.2667, lng: 84.9000, safetyIndex: 66, category: 'safe', tourismLevel: 'medium', incidents: 12, population: '8K', type: 'beach', avgTemperature: 28, connectivity: 'average', infrastructure: 'average' },

    // Final batch to reach 300
    { id: '201', name: 'Gangtok', state: 'Sikkim', lat: 27.3314, lng: 88.6138, safetyIndex: 76, category: 'very_safe', tourismLevel: 'very_high', incidents: 6, population: '100K', type: 'hill_station', avgTemperature: 16, connectivity: 'average', infrastructure: 'excellent' },
    { id: '202', name: 'Pelling', state: 'Sikkim', lat: 27.2153, lng: 88.2137, safetyIndex: 81, category: 'very_safe', tourismLevel: 'high', incidents: 3, population: '9K', type: 'hill_station', avgTemperature: 14, connectivity: 'poor', infrastructure: 'good' },
    { id: '203', name: 'Yuksom', state: 'Sikkim', lat: 27.3667, lng: 88.2167, safetyIndex: 84, category: 'very_safe', tourismLevel: 'medium', incidents: 2, population: '2K', type: 'adventure', avgTemperature: 12, connectivity: 'poor', infrastructure: 'average' },
    { id: '204', name: 'Kohima', state: 'Nagaland', lat: 25.6751, lng: 94.1086, safetyIndex: 62, category: 'safe', tourismLevel: 'low', incidents: 14, population: '100K', type: 'city', avgTemperature: 19, connectivity: 'poor', infrastructure: 'average' },
    { id: '205', name: 'Dimapur', state: 'Nagaland', lat: 25.9044, lng: 93.7267, safetyIndex: 48, category: 'moderate', tourismLevel: 'very_low', incidents: 25, population: '122K', type: 'city', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },
    { id: '206', name: 'Dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.9120, safetyIndex: 51, category: 'moderate', tourismLevel: 'low', incidents: 23, population: '155K', type: 'city', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },
    { id: '207', name: 'Jorhat', state: 'Assam', lat: 26.7509, lng: 94.2037, safetyIndex: 53, category: 'moderate', tourismLevel: 'low', incidents: 21, population: '154K', type: 'city', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },
    { id: '208', name: 'Tezpur', state: 'Assam', lat: 26.6341, lng: 92.7892, safetyIndex: 55, category: 'moderate', tourismLevel: 'medium', incidents: 19, population: '102K', type: 'heritage', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },
    { id: '209', name: 'Silchar', state: 'Assam', lat: 24.8333, lng: 92.7789, safetyIndex: 49, category: 'moderate', tourismLevel: 'very_low', incidents: 24, population: '172K', type: 'city', avgTemperature: 25, connectivity: 'average', infrastructure: 'average' },
    { id: '210', name: 'Tura', state: 'Meghalaya', lat: 25.5138, lng: 90.2203, safetyIndex: 67, category: 'safe', tourismLevel: 'low', incidents: 11, population: '58K', type: 'hill_station', avgTemperature: 20, connectivity: 'poor', infrastructure: 'average' },
    { id: '211', name: 'Cherrapunji', state: 'Meghalaya', lat: 25.3000, lng: 91.7000, safetyIndex: 73, category: 'safe', tourismLevel: 'high', incidents: 8, population: '11K', type: 'hill_station', avgTemperature: 17, connectivity: 'poor', infrastructure: 'average' },
    { id: '212', name: 'Mawlynnong', state: 'Meghalaya', lat: 25.2667, lng: 91.8833, safetyIndex: 91, category: 'very_safe', tourismLevel: 'high', incidents: 0, population: '0.5K', type: 'heritage', avgTemperature: 18, connectivity: 'poor', infrastructure: 'good' },
    { id: '213', name: 'Dawki', state: 'Meghalaya', lat: 25.2000, lng: 91.7667, safetyIndex: 86, category: 'very_safe', tourismLevel: 'high', incidents: 1, population: '3K', type: 'adventure', avgTemperature: 18, connectivity: 'poor', infrastructure: 'average' },
    { id: '214', name: 'Kaziranga', state: 'Assam', lat: 26.5775, lng: 93.1674, safetyIndex: 61, category: 'safe', tourismLevel: 'very_high', incidents: 15, population: '12K', type: 'adventure', avgTemperature: 24, connectivity: 'average', infrastructure: 'good' },
    { id: '215', name: 'Majuli', state: 'Assam', lat: 26.9510, lng: 94.2224, safetyIndex: 74, category: 'safe', tourismLevel: 'medium', incidents: 7, population: '168K', type: 'heritage', avgTemperature: 24, connectivity: 'poor', infrastructure: 'average' },
    { id: '216', name: 'Haflong', state: 'Assam', lat: 25.1667, lng: 93.0167, safetyIndex: 68, category: 'safe', tourismLevel: 'low', incidents: 10, population: '65K', type: 'hill_station', avgTemperature: 19, connectivity: 'poor', infrastructure: 'average' },
    { id: '217', name: 'Bomdila', state: 'Arunachal Pradesh', lat: 27.2615, lng: 92.4065, safetyIndex: 72, category: 'safe', tourismLevel: 'medium', incidents: 8, population: '8K', type: 'hill_station', avgTemperature: 15, connectivity: 'poor', infrastructure: 'average' },
    { id: '218', name: 'Pasighat', state: 'Arunachal Pradesh', lat: 28.0667, lng: 95.3333, safetyIndex: 65, category: 'safe', tourismLevel: 'low', incidents: 13, population: '24K', type: 'adventure', avgTemperature: 22, connectivity: 'poor', infrastructure: 'average' },
    { id: '219', name: 'Ziro', state: 'Arunachal Pradesh', lat: 27.5444, lng: 93.8347, safetyIndex: 78, category: 'very_safe', tourismLevel: 'medium', incidents: 5, population: '20K', type: 'heritage', avgTemperature: 18, connectivity: 'poor', infrastructure: 'average' },
    { id: '220', name: 'Along', state: 'Arunachal Pradesh', lat: 28.1711, lng: 94.7689, safetyIndex: 69, category: 'safe', tourismLevel: 'low', incidents: 10, population: '15K', type: 'adventure', avgTemperature: 20, connectivity: 'poor', infrastructure: 'average' },

    // More smaller towns across different states
    { id: '221', name: 'Hamirpur', state: 'Himachal Pradesh', lat: 31.6839, lng: 76.5225, safetyIndex: 71, category: 'safe', tourismLevel: 'low', incidents: 9, population: '37K', type: 'town', avgTemperature: 20, connectivity: 'average', infrastructure: 'good' },
    { id: '222', name: 'Una', state: 'Himachal Pradesh', lat: 31.4648, lng: 76.2708, safetyIndex: 69, category: 'safe', tourismLevel: 'low', incidents: 10, population: '20K', type: 'town', avgTemperature: 21, connectivity: 'average', infrastructure: 'average' },
    { id: '223', name: 'Bilaspur', state: 'Himachal Pradesh', lat: 31.3311, lng: 76.7568, safetyIndex: 68, category: 'safe', tourismLevel: 'low', incidents: 11, population: '13K', type: 'town', avgTemperature: 22, connectivity: 'average', infrastructure: 'average' },
    { id: '224', name: 'Chamba', state: 'Himachal Pradesh', lat: 32.5567, lng: 76.1262, safetyIndex: 75, category: 'safe', tourismLevel: 'high', incidents: 7, population: '21K', type: 'heritage', avgTemperature: 17, connectivity: 'average', infrastructure: 'good' },
    { id: '225', name: 'Kinnaur', state: 'Himachal Pradesh', lat: 31.6000, lng: 78.4000, safetyIndex: 82, category: 'very_safe', tourismLevel: 'high', incidents: 3, population: '84K', type: 'adventure', avgTemperature: 12, connectivity: 'poor', infrastructure: 'average' },
    { id: '226', name: 'Lahaul', state: 'Himachal Pradesh', lat: 32.5667, lng: 77.0167, safetyIndex: 85, category: 'very_safe', tourismLevel: 'medium', incidents: 2, population: '31K', type: 'adventure', avgTemperature: 8, connectivity: 'poor', infrastructure: 'poor' },
    { id: '227', name: 'Kargil', state: 'Ladakh', lat: 34.5539, lng: 76.1059, safetyIndex: 47, category: 'moderate', tourismLevel: 'medium', incidents: 26, population: '141K', type: 'adventure', avgTemperature: 10, connectivity: 'poor', infrastructure: 'average' },
    { id: '228', name: 'Nubra Valley', state: 'Ladakh', lat: 34.6667, lng: 77.6667, safetyIndex: 79, category: 'very_safe', tourismLevel: 'high', incidents: 4, population: '12K', type: 'adventure', avgTemperature: 6, connectivity: 'poor', infrastructure: 'poor' },
    { id: '229', name: 'Pangong Tso', state: 'Ladakh', lat: 33.7500, lng: 78.9333, safetyIndex: 88, category: 'very_safe', tourismLevel: 'very_high', incidents: 1, population: '0.5K', type: 'adventure', avgTemperature: 2, connectivity: 'poor', infrastructure: 'poor' },
    { id: '230', name: 'Tso Moriri', state: 'Ladakh', lat: 33.1333, lng: 78.3000, safetyIndex: 90, category: 'very_safe', tourismLevel: 'high', incidents: 0, population: '0.2K', type: 'adventure', avgTemperature: 0, connectivity: 'poor', infrastructure: 'poor' },

    // More Uttar Pradesh towns
    { id: '231', name: 'Fatehpur Sikri', state: 'Uttar Pradesh', lat: 27.0937, lng: 77.6615, safetyIndex: 39, category: 'risky', tourismLevel: 'very_high', incidents: 33, population: '32K', type: 'heritage', avgTemperature: 26, connectivity: 'good', infrastructure: 'good' },
    { id: '232', name: 'Sarnath', state: 'Uttar Pradesh', lat: 25.3811, lng: 83.0230, safetyIndex: 34, category: 'risky', tourismLevel: 'very_high', incidents: 36, population: '5K', type: 'pilgrimage', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '233', name: 'Chitrakoot', state: 'Uttar Pradesh', lat: 25.2000, lng: 80.9000, safetyIndex: 37, category: 'risky', tourismLevel: 'high', incidents: 34, population: '23K', type: 'pilgrimage', avgTemperature: 27, connectivity: 'average', infrastructure: 'average' },
    { id: '234', name: 'Kushinagar', state: 'Uttar Pradesh', lat: 26.7411, lng: 83.8881, safetyIndex: 32, category: 'risky', tourismLevel: 'high', incidents: 38, population: '22K', type: 'pilgrimage', avgTemperature: 26, connectivity: 'average', infrastructure: 'average' },
    { id: '235', name: 'Shravasti', state: 'Uttar Pradesh', lat: 27.5167, lng: 82.0833, safetyIndex: 30, category: 'risky', tourismLevel: 'medium', incidents: 40, population: '12K', type: 'heritage', avgTemperature: 26, connectivity: 'poor', infrastructure: 'average' },

    // More Rajasthan heritage sites
    { id: '236', name: 'Bundi', state: 'Rajasthan', lat: 25.4305, lng: 75.6499, safetyIndex: 58, category: 'safe', tourismLevel: 'high', incidents: 17, population: '104K', type: 'heritage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '237', name: 'Jhalawar', state: 'Rajasthan', lat: 24.5965, lng: 76.1531, safetyIndex: 54, category: 'moderate', tourismLevel: 'medium', incidents: 20, population: '56K', type: 'heritage', avgTemperature: 28, connectivity: 'average', infrastructure: 'average' },
    { id: '238', name: 'Shekhawati', state: 'Rajasthan', lat: 27.8167, lng: 75.1500, safetyIndex: 51, category: 'moderate', tourismLevel: 'high', incidents: 23, population: '45K', type: 'heritage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '239', name: 'Mandawa', state: 'Rajasthan', lat: 28.0513, lng: 75.1567, safetyIndex: 53, category: 'moderate', tourismLevel: 'high', incidents: 21, population: '21K', type: 'heritage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },
    { id: '240', name: 'Nawalgarh', state: 'Rajasthan', lat: 27.8500, lng: 75.2667, safetyIndex: 52, category: 'moderate', tourismLevel: 'high', incidents: 22, population: '45K', type: 'heritage', avgTemperature: 28, connectivity: 'average', infrastructure: 'good' },

    // More Punjab towns
    { id: '241', name: 'Kapurthala', state: 'Punjab', lat: 31.3800, lng: 75.3800, safetyIndex: 45, category: 'moderate', tourismLevel: 'medium', incidents: 28, population: '99K', type: 'heritage', avgTemperature: 24, connectivity: 'good', infrastructure: 'good' },
    { id: '242', name: 'Firozpur', state: 'Punjab', lat: 30.9320, lng: 74.6151, safetyIndex: 38, category: 'risky', tourismLevel: 'low', incidents: 33, population: '110K', type: 'city', avgTemperature: 25, connectivity: 'average', infrastructure: 'average' },
    { id: '243', name: 'Pathankot', state: 'Punjab', lat: 32.2746, lng: 75.6527, safetyIndex: 42, category: 'moderate', tourismLevel: 'low', incidents: 30, population: '174K', type: 'city', avgTemperature: 23, connectivity: 'good', infrastructure: 'average' },
    { id: '244', name: 'Hoshiarpur', state: 'Punjab', lat: 31.5332, lng: 75.9111, safetyIndex: 40, category: 'moderate', tourismLevel: 'low', incidents: 32, population: '169K', type: 'city', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },
    { id: '245', name: 'Moga', state: 'Punjab', lat: 30.8077, lng: 75.1723, safetyIndex: 36, category: 'risky', tourismLevel: 'very_low', incidents: 35, population: '159K', type: 'city', avgTemperature: 24, connectivity: 'average', infrastructure: 'average' },

    // More Haryana cities
    { id: '246', name: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635, safetyIndex: 34, category: 'risky', tourismLevel: 'low', incidents: 36, population: '294K', type: 'heritage', avgTemperature: 25, connectivity: 'good', infrastructure: 'average' },
    { id: '247', name: 'Kurukshetra', state: 'Haryana', lat: 29.9692, lng: 76.8781, safetyIndex: 41, category: 'moderate', tourismLevel: 'very_high', incidents: 31, population: '135K', type: 'pilgrimage', avgTemperature: 25, connectivity: 'good', infrastructure: 'good' },
    { id: '248', name: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217, safetyIndex: 33, category: 'risky', tourismLevel: 'low', incidents: 37, population: '301K', type: 'city', avgTemperature: 27, connectivity: 'good', infrastructure: 'average' },
    { id: '249', name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066, safetyIndex: 31, category: 'risky', tourismLevel: 'very_low', incidents: 39, population: '374K', type: 'city', avgTemperature: 26, connectivity: 'good', infrastructure: 'average' },
    { id: '250', name: 'Sonipat', state: 'Haryana', lat: 28.9931, lng: 77.0151, safetyIndex: 35, category: 'risky', tourismLevel: 'very_low', incidents: 35, population: '214K', type: 'city', avgTemperature: 25, connectivity: 'excellent', infrastructure: 'good' },

    // More Madhya Pradesh
    { id: '251', name: 'Orchha', state: 'Madhya Pradesh', lat: 25.3519, lng: 78.6420, safetyIndex: 61, category: 'safe', tourismLevel: 'very_high', incidents: 15, population: '9K', type: 'heritage', avgTemperature: 26, connectivity: 'average', infrastructure: 'good' },
    { id: '252', name: 'Mandu', state: 'Madhya Pradesh', lat: 22.3667, lng: 75.4000, safetyIndex: 63, category: 'safe', tourismLevel: 'very_high', incidents: 14, population: '7K', type: 'heritage', avgTemperature: 26, connectivity: 'average', infrastructure: 'good' },
    { id: '253', name: 'Sanchi', state: 'Madhya Pradesh', lat: 23.4833, lng: 77.7333, safetyIndex: 65, category: 'safe', tourismLevel: 'very_high', incidents: 12, population: '8K', type: 'heritage', avgTemperature: 26, connectivity: 'average', infrastructure: 'good' },
    { id: '254', name: 'Maheshwar', state: 'Madhya Pradesh', lat: 22.1761, lng: 75.5847, safetyIndex: 62, category: 'safe', tourismLevel: 'high', incidents: 14, population: '24K', type: 'heritage', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' },
    { id: '255', name: 'Omkareshwar', state: 'Madhya Pradesh', lat: 22.2394, lng: 76.1311, safetyIndex: 59, category: 'safe', tourismLevel: 'very_high', incidents: 16, population: '12K', type: 'pilgrimage', avgTemperature: 27, connectivity: 'average', infrastructure: 'good' }

]


// Helper functions
export const getSafetyStats = () => {
  const veryHigh = touristSafetyData.filter(d => d.safetyIndex >= 80).length;
  const high = touristSafetyData.filter(d => d.safetyIndex >= 60 && d.safetyIndex < 80).length;
  const moderate = touristSafetyData.filter(d => d.safetyIndex >= 40 && d.safetyIndex < 60).length;
  const low = touristSafetyData.filter(d => d.safetyIndex >= 25 && d.safetyIndex < 40).length;
  const veryLow = touristSafetyData.filter(d => d.safetyIndex < 25).length;
  
  return { veryHigh, high, moderate, low, veryLow, total: touristSafetyData.length };
};

export const getDataByState = (state: string) => {
  return touristSafetyData.filter(d => d.state === state);
};

export const getDataByType = (type: string) => {
  return touristSafetyData.filter(d => d.type === type);
};

export const getDataBySafetyCategory = (category: string) => {
  return touristSafetyData.filter(d => d.category === category);
};

export const getUniqueStates = () => {
  return Array.from(new Set(touristSafetyData.map(d => d.state))).sort();
};

export const getUniqueTypes = () => {
  return Array.from(new Set(touristSafetyData.map(d => d.type))).sort();
};