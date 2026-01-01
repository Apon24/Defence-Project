import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  GeoJSON,
} from "react-leaflet";
import {
  TreePine,
  AlertTriangle,
  TrendingUp,
  Leaf,
  Droplets,
  Wind,
  Award,
  X,
  Sparkles,
  Activity,
  MapPin,
  Target,
  BarChart3,
  Navigation,
  Locate,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { plantingApi } from "../lib/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const bangladeshBounds: [[number, number], [number, number]] = [
  [20.5, 88.0],
  [26.8, 92.5],
];

interface EnvironmentalZone {
  id: number;
  name: string;
  dbId?: string; // MongoDB _id for API calls
  district: string;
  lat: number;
  lng: number;
  urgencyLevel: "critical" | "high" | "medium" | "low";
  deforestationRate: number;
  soilErosion: string;
  pollutionIndex: number;
  population: string;
  treesNeeded: number;
  environmentalFacts: string[];
  localSpecies: string[];
}

const environmentalZones: EnvironmentalZone[] = [
  {
    id: 1,
    name: "Sundarbans Buffer Zone",
    district: "Khulna",
    lat: 22.5,
    lng: 89.5,
    urgencyLevel: "critical",
    deforestationRate: 3.8,
    soilErosion: "Severe",
    pollutionIndex: 82,
    population: "4.5M",
    treesNeeded: 50000,
    environmentalFacts: [
      "Largest mangrove forest in the world",
      "UNESCO World Heritage Site under threat",
      "Critical tiger habitat disappearing",
      "Coastal erosion affecting 5000 hectares annually",
    ],
    localSpecies: ["Sundari", "Gewa", "Keora", "Passur"],
  },
  {
    id: 2,
    name: "Chattogram Hill Tracts",
    district: "Rangamati",
    lat: 23.0,
    lng: 92.0,
    urgencyLevel: "critical",
    deforestationRate: 4.2,
    soilErosion: "Extreme",
    pollutionIndex: 75,
    population: "1.6M",
    treesNeeded: 45000,
    environmentalFacts: [
      "Jhum cultivation causing rapid soil loss",
      "70% forest cover lost in 40 years",
      "Indigenous communities affected",
      "Biodiversity hotspot at risk",
    ],
    localSpecies: ["Teak", "Gamar", "Chapalish", "Jarul"],
  },
  {
    id: 3,
    name: "Sylhet Tea Gardens",
    district: "Sylhet",
    lat: 24.8949,
    lng: 91.8687,
    urgencyLevel: "high",
    deforestationRate: 2.9,
    soilErosion: "High",
    pollutionIndex: 68,
    population: "3.5M",
    treesNeeded: 35000,
    environmentalFacts: [
      "Wetland ecosystem degradation",
      "Chemical runoff from tea plantations",
      "Haor basin vulnerable to flooding",
      "Migratory bird habitat threatened",
    ],
    localSpecies: ["Shimul", "Koroi", "Neem", "Rain Tree"],
  },
  {
    id: 4,
    name: "Dhaka Metropolitan Area",
    district: "Dhaka",
    lat: 23.8103,
    lng: 90.4125,
    urgencyLevel: "critical",
    deforestationRate: 5.5,
    soilErosion: "Moderate",
    pollutionIndex: 168,
    population: "21M",
    treesNeeded: 100000,
    environmentalFacts: [
      "World's 2nd most polluted city (AQI 168)",
      "Only 8% green cover remaining",
      "Urban heat island effect worsening",
      "4°C temperature increase by 2050",
    ],
    localSpecies: ["Neem", "Mahogany", "Rain Tree", "Krishnachura"],
  },
  {
    id: 5,
    name: "Barishal Coastal Belt",
    district: "Barishal",
    lat: 22.701,
    lng: 90.3535,
    urgencyLevel: "high",
    deforestationRate: 3.5,
    soilErosion: "Severe",
    pollutionIndex: 71,
    population: "8.3M",
    treesNeeded: 40000,
    environmentalFacts: [
      "Cyclone vulnerable area",
      "Salinity intrusion affecting agriculture",
      "River bank erosion displacing thousands",
      "Mangrove restoration critical",
    ],
    localSpecies: ["Coconut", "Betel Nut", "Golpata", "Keora"],
  },
  {
    id: 6,
    name: "Kurigram Char Lands",
    district: "Kurigram",
    lat: 25.8073,
    lng: 89.636,
    urgencyLevel: "high",
    deforestationRate: 3.2,
    soilErosion: "Extreme",
    pollutionIndex: 55,
    population: "2.1M",
    treesNeeded: 30000,
    environmentalFacts: [
      "Annual flooding destroys settlements",
      "Riverbank erosion most severe in country",
      "Climate refugee crisis emerging",
      "Soil fertility declining rapidly",
    ],
    localSpecies: ["Kadam", "Shimul", "Sishu", "Akashmoni"],
  },
  {
    id: 7,
    name: "Chittagong Port Area",
    district: "Chittagong",
    lat: 22.3569,
    lng: 91.7832,
    urgencyLevel: "critical",
    deforestationRate: 4.0,
    soilErosion: "High",
    pollutionIndex: 142,
    population: "8.4M",
    treesNeeded: 55000,
    environmentalFacts: [
      "Busiest port causing heavy pollution",
      "Ship-breaking yards toxic waste",
      "Air quality hazardous 180 days/year",
      "Coastal forest cover reduced by 60%",
    ],
    localSpecies: ["Jarul", "Debdaru", "Champa", "Bakul"],
  },
  {
    id: 8,
    name: "Rajshahi Barind Tract",
    district: "Rajshahi",
    lat: 24.3745,
    lng: 88.6042,
    urgencyLevel: "high",
    deforestationRate: 3.0,
    soilErosion: "High",
    pollutionIndex: 88,
    population: "2.6M",
    treesNeeded: 38000,
    environmentalFacts: [
      "Drought-prone region worsening",
      "Groundwater depletion critical",
      "Mango cultivation under threat",
      "Desertification indicators present",
    ],
    localSpecies: ["Mango", "Litchi", "Jackfruit", "Mahogany"],
  },
  {
    id: 9,
    name: "Mymensingh Haor Basin",
    district: "Mymensingh",
    lat: 24.7471,
    lng: 90.4203,
    urgencyLevel: "medium",
    deforestationRate: 2.5,
    soilErosion: "Moderate",
    pollutionIndex: 72,
    population: "5.6M",
    treesNeeded: 28000,
    environmentalFacts: [
      "Flash flooding increasing",
      "Wetland biodiversity declining",
      "Fish breeding grounds threatened",
      "Water hyacinth invasion",
    ],
    localSpecies: ["Hijol", "Koroch", "Shimul", "Bon Begun"],
  },
  {
    id: 10,
    name: "Cox's Bazar Refugee Area",
    district: "Cox's Bazar",
    lat: 21.4272,
    lng: 92.0058,
    urgencyLevel: "high",
    deforestationRate: 6.5,
    soilErosion: "Severe",
    pollutionIndex: 65,
    population: "2.8M",
    treesNeeded: 42000,
    environmentalFacts: [
      "Fastest deforestation in Bangladesh",
      "6000 acres of forest cleared for camps",
      "Elephant corridors disrupted",
      "Landslide risk increased 400%",
    ],
    localSpecies: ["Jarul", "Gamari", "Agar", "Chapalish"],
  },
];

const bangladeshTreeTypes = [
  {
    name: "Mahogany",
    emoji: "🌳",
    co2Absorption: 28,
    growthRate: "Fast",
    nativeStatus: "Naturalized",
  },
  {
    name: "Neem",
    emoji: "🌿",
    co2Absorption: 25,
    growthRate: "Medium",
    nativeStatus: "Native",
  },
  {
    name: "Rain Tree",
    emoji: "🌲",
    co2Absorption: 30,
    growthRate: "Fast",
    nativeStatus: "Naturalized",
  },
  {
    name: "Mango",
    emoji: "🥭",
    co2Absorption: 22,
    growthRate: "Slow",
    nativeStatus: "Native",
  },
  {
    name: "Jackfruit",
    emoji: "🍈",
    co2Absorption: 20,
    growthRate: "Medium",
    nativeStatus: "Native",
  },
  {
    name: "Shimul",
    emoji: "🌸",
    co2Absorption: 24,
    growthRate: "Fast",
    nativeStatus: "Native",
  },
  {
    name: "Krishnachura",
    emoji: "🔥",
    co2Absorption: 26,
    growthRate: "Medium",
    nativeStatus: "Naturalized",
  },
  {
    name: "Banyan",
    emoji: "🌴",
    co2Absorption: 35,
    growthRate: "Very Slow",
    nativeStatus: "Native",
  },
];

const createPulsingIcon = (color: string, size: number = 32) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute animate-ping w-${size / 4} h-${
      size / 4
    } rounded-full bg-${color}-500 opacity-75"></div>
        <div class="relative w-${size / 4} h-${
      size / 4
    } rounded-full bg-${color}-600 border-2 border-white shadow-lg"></div>
      </div>
    `,
    className: "custom-pulsing-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const createTreeIcon = () => {
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="text-2xl animate-bounce-slow filter drop-shadow-lg">🌳</div>
        <div class="absolute inset-0 animate-ping opacity-50">✨</div>
      </div>
    `,
    className: "custom-tree-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Bangladesh GeoJSON boundary (simplified polygon)
const bangladeshGeoJSON: GeoJSON.Feature = {
  type: "Feature",
  properties: { name: "Bangladesh" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [88.0844, 20.5959],
        [88.2696, 21.7036],
        [88.9245, 22.2526],
        [89.0507, 22.0559],
        [88.8886, 21.6906],
        [89.0507, 21.8744],
        [89.3352, 21.902],
        [89.4189, 22.0559],
        [89.5776, 21.9536],
        [89.8468, 22.0395],
        [90.2318, 21.8358],
        [90.5868, 22.3925],
        [90.4716, 22.7044],
        [90.6069, 22.9114],
        [91.0784, 22.8716],
        [91.1621, 23.5038],
        [91.4678, 23.6847],
        [91.5851, 24.0902],
        [92.2504, 24.8949],
        [92.4746, 24.9449],
        [92.3848, 25.1837],
        [91.7996, 25.1475],
        [91.2416, 25.1372],
        [90.4476, 25.1577],
        [89.9166, 25.2697],
        [89.8329, 25.9655],
        [88.9245, 26.2454],
        [88.4254, 26.5665],
        [88.1029, 26.5872],
        [88.0463, 25.9963],
        [88.1798, 25.7968],
        [88.0463, 25.0118],
        [88.6826, 24.2711],
        [88.6528, 23.6313],
        [88.3304, 23.5038],
        [88.1029, 23.6619],
        [88.0463, 23.9726],
        [88.0844, 24.5019],
        [88.7376, 24.2711],
        [89.0507, 24.2813],
        [88.9245, 24.0798],
        [88.7663, 24.021],
        [88.7376, 23.8297],
        [88.8886, 23.1947],
        [88.5661, 22.8112],
        [88.9245, 22.4052],
        [88.6528, 22.15],
        [88.3592, 21.9947],
        [88.0844, 21.7036],
        [88.0844, 20.5959],
      ],
    ],
  },
};

// User location marker icon - blue pulsing dot
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
        <div class="absolute w-8 h-8 rounded-full bg-blue-400 opacity-50 animate-pulse"></div>
        <div class="relative w-4 h-4 rounded-full bg-blue-600 border-3 border-white shadow-lg" style="box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);"></div>
      </div>
    `,
    className: "user-location-marker",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bangladeshBounds, { padding: [50, 50] });
    map.setMinZoom(6);
    map.setMaxZoom(12);
  }, [map]);
  return null;
}

// Component to handle user location
function UserLocationMarker({
  userLocation,
}: {
  userLocation: [number, number] | null;
}) {
  const map = useMap();

  const flyToLocation = useCallback(() => {
    if (userLocation) {
      map.flyTo(userLocation, 10, { duration: 1.5 });
    }
  }, [map, userLocation]);

  if (!userLocation) return null;

  return (
    <Marker
      position={userLocation}
      icon={createUserLocationIcon()}
      zIndexOffset={1000}>
      <Popup>
        <div className="text-center p-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-600">Your Location</span>
          </div>
          <p className="text-xs text-gray-600">
            {userLocation[0].toFixed(4)}°N, {userLocation[1].toFixed(4)}°E
          </p>
          <button
            onClick={flyToLocation}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors">
            Center Map
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

interface PlantedTree {
  id: number;
  zone: EnvironmentalZone;
  treeType: (typeof bangladeshTreeTypes)[0];
  date: string;
  userName?: string;
}

export const Map = () => {
  const { plantTree } = useApp();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<EnvironmentalZone | null>(
    null
  );
  const [showTreeSelector, setShowTreeSelector] = useState(false);
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastPlantedTree, setLastPlantedTree] = useState<PlantedTree | null>(
    null
  );
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [dbPlantingAreas, setDbPlantingAreas] = useState<any[]>([]);
  const [isPlanting, setIsPlanting] = useState(false);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Check if location is within Bangladesh bounds
        if (
          latitude >= 20.5 &&
          latitude <= 26.8 &&
          longitude >= 88.0 &&
          longitude <= 92.5
        ) {
          setUserLocation([latitude, longitude]);
          setLocationError(null);
        } else {
          // setLocationError("Your location is outside Bangladesh");
          // Still show the location but without blocking error
          setUserLocation([latitude, longitude]);
          setLocationError(null);
        }
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("Failed to get location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Request location on mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    const saved = localStorage.getItem("environmentalTreesPlanted");
    if (saved) {
      setPlantedTrees(JSON.parse(saved));
    }
  }, []);

  // Fetch planting areas from database and map to local zones
  useEffect(() => {
    const fetchPlantingAreas = async () => {
      try {
        const response = await plantingApi.getAreas();
        if (response.success && response.data) {
          setDbPlantingAreas(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch planting areas:", error);
      }
    };
    fetchPlantingAreas();
  }, []);

  const getDistrictStats = () => {
    const stats: { [key: string]: number } = {};
    plantedTrees.forEach((tree) => {
      const district = tree.zone.district;
      stats[district] = (stats[district] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  const getTotalCO2Saved = () => {
    return plantedTrees.reduce(
      (sum, tree) => sum + tree.treeType.co2Absorption,
      0
    );
  };

  const getTotalTreesNeeded = () => {
    return environmentalZones.reduce((sum, zone) => sum + zone.treesNeeded, 0);
  };

  const getProgressPercentage = () => {
    return Math.min((plantedTrees.length / getTotalTreesNeeded()) * 100, 100);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      default:
        return "blue";
    }
  };

  const getUrgencyRadius = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return 35000;
      case "high":
        return 25000;
      case "medium":
        return 15000;
      default:
        return 8000;
    }
  };

  const handleZoneClick = (zone: EnvironmentalZone) => {
    setSelectedZone(zone);
    setShowTreeSelector(true);
  };

  const handleTreePlant = async (treeType: (typeof bangladeshTreeTypes)[0]) => {
    if (selectedZone && !isPlanting) {
      setIsPlanting(true);

      // Find the matching DB planting area by name
      const dbArea = dbPlantingAreas.find(
        (area) =>
          area.title === selectedZone.name ||
          (area.latitude === selectedZone.lat &&
            area.longitude === selectedZone.lng)
      );

      try {
        // Save to backend database if we have a matching planting area
        if (dbArea) {
          await plantingApi.plantTree({
            plantingAreaId: dbArea._id,
            treeType: treeType.name,
            notes: `Planted in ${selectedZone.name} - ${selectedZone.district}`,
          });
        }

        // Create local tree record for UI
        const newTree: PlantedTree = {
          id: Date.now(),
          zone: selectedZone,
          treeType: treeType,
          date: new Date().toISOString(),
          userName: user?.fullName,
        };

        setPlantedTrees((prev) => {
          const updated = [...prev, newTree];
          localStorage.setItem(
            "environmentalTreesPlanted",
            JSON.stringify(updated)
          );
          return updated;
        });

        plantTree({
          id: newTree.id,
          area: {
            id: selectedZone.id,
            name: selectedZone.name,
            lat: selectedZone.lat,
            lng: selectedZone.lng,
            pollution: selectedZone.pollutionIndex.toString(),
            population: selectedZone.population,
            description: selectedZone.environmentalFacts[0],
          },
          treeType: treeType,
          date: newTree.date,
          co2Absorption: treeType.co2Absorption,
        });

        setLastPlantedTree(newTree);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000);

        // Dispatch custom event to notify other components (like Home) to update
        window.dispatchEvent(new CustomEvent("tree-planted"));
      } catch (error) {
        console.error("Failed to plant tree:", error);
      } finally {
        setIsPlanting(false);
        setShowTreeSelector(false);
        setSelectedZone(null);
      }
    }
  };

  const getZoneTreeCount = (zoneId: number) => {
    return plantedTrees.filter((t) => t.zone.id === zoneId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-800 dark:to-teal-800 py-6 px-4 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Leaf className="w-10 h-10" />
                  {language === "bn"
                    ? "বাংলাদেশ পরিবেশ পর্যবেক্ষণ সিস্টেম"
                    : "Bangladesh Environmental Monitoring System"}
                </h1>
                <p className="text-green-100 text-sm md:text-base">
                  {language === "bn"
                    ? "রিয়েল-টাইম বনভূমি ক্ষয় ট্র্যাকিং ও বনায়ন উদ্যোগ"
                    : "Real-time deforestation tracking & reforestation initiative"}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSidePanel(!showSidePanel)}
                className="hidden md:block bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all">
                {showSidePanel
                  ? language === "bn"
                    ? "পরিসংখ্যান লুকান"
                    : "Hide Stats"
                  : language === "bn"
                  ? "পরিসংখ্যান দেখান"
                  : "Show Stats"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
              <TreePine className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">{plantedTrees.length}</div>
              <div className="text-xs opacity-90">
                {language === "bn" ? "গাছ লাগানো হয়েছে" : "Trees Planted"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
              <AlertTriangle className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">
                {
                  environmentalZones.filter(
                    (z) => z.urgencyLevel === "critical"
                  ).length
                }
              </div>
              <div className="text-xs opacity-90">
                {language === "bn" ? "সংকটপূর্ণ এলাকা" : "Critical Zones"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg">
              <Wind className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">{getTotalCO2Saved()}</div>
              <div className="text-xs opacity-90">
                {language === "bn" ? "কেজি CO₂ সঞ্চয়" : "kg CO₂ Saved"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
              <Target className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">
                {getTotalTreesNeeded().toLocaleString()}
              </div>
              <div className="text-xs opacity-90">
                {language === "bn" ? "লক্ষ্য গাছ" : "Target Trees"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-4 text-white shadow-lg">
              <Award className="w-6 h-6 mb-2 opacity-80" />
              <div className="text-2xl font-bold">
                {getProgressPercentage().toFixed(3)}%
              </div>
              <div className="text-xs opacity-90">
                {language === "bn" ? "অগ্রগতি" : "Progress"}
              </div>
            </motion.div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                {language === "bn"
                  ? "বাংলাদেশ বনায়ন অগ্রগতি"
                  : "Bangladesh Reforestation Progress"}
              </h3>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {plantedTrees.length} / {getTotalTreesNeeded().toLocaleString()}{" "}
                {language === "bn" ? "গাছ" : "trees"}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-green-500/20">
                <div className="h-[600px] relative">
                  <MapContainer
                    center={[23.8, 90.3]}
                    zoom={7}
                    style={{ height: "100%", width: "100%" }}
                    maxBounds={bangladeshBounds}
                    maxBoundsViscosity={1.0}
                    zoomControl={false}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="© OpenStreetMap contributors"
                    />
                    <FitBounds />

                    {/* Bangladesh Boundary */}
                    <GeoJSON
                      data={bangladeshGeoJSON}
                      style={{
                        color: "#059669",
                        weight: 3,
                        fillColor: "#10b981",
                        fillOpacity: 0.05,
                        dashArray: "5, 5",
                      }}
                    />

                    {/* User Location */}
                    <UserLocationMarker userLocation={userLocation} />

                    {environmentalZones.map((zone) => {
                      const treeCount = getZoneTreeCount(zone.id);
                      const isCompleted = treeCount > 0;

                      return (
                        <React.Fragment key={zone.id}>
                          <Circle
                            center={[zone.lat, zone.lng]}
                            radius={getUrgencyRadius(zone.urgencyLevel)}
                            pathOptions={{
                              color: isCompleted
                                ? "#10b981"
                                : `#${
                                    zone.urgencyLevel === "critical"
                                      ? "ef4444"
                                      : zone.urgencyLevel === "high"
                                      ? "f97316"
                                      : zone.urgencyLevel === "medium"
                                      ? "eab308"
                                      : "3b82f6"
                                  }`,
                              fillColor: isCompleted
                                ? "#10b981"
                                : `#${
                                    zone.urgencyLevel === "critical"
                                      ? "ef4444"
                                      : zone.urgencyLevel === "high"
                                      ? "f97316"
                                      : zone.urgencyLevel === "medium"
                                      ? "eab308"
                                      : "3b82f6"
                                  }`,
                              fillOpacity: isCompleted ? 0.15 : 0.25,
                              weight: 2,
                              opacity: 0.6,
                            }}
                          />
                          <Marker
                            position={[zone.lat, zone.lng]}
                            icon={
                              isCompleted
                                ? createTreeIcon()
                                : createPulsingIcon(
                                    getUrgencyColor(zone.urgencyLevel)
                                  )
                            }>
                            <Popup maxWidth={350} className="custom-popup">
                              <div className="p-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3
                                      className={`text-lg font-bold ${
                                        isCompleted
                                          ? "text-green-600"
                                          : "text-red-600"
                                      } mb-1`}>
                                      {zone.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {zone.district} District
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      zone.urgencyLevel === "critical"
                                        ? "bg-red-100 text-red-700"
                                        : zone.urgencyLevel === "high"
                                        ? "bg-orange-100 text-orange-700"
                                        : zone.urgencyLevel === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {zone.urgencyLevel.toUpperCase()}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 mb-1">
                                      <Activity className="w-3 h-3" />
                                      <span className="font-semibold">
                                        {language === "bn"
                                          ? "বন উজাড়"
                                          : "Deforestation"}
                                      </span>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                      {zone.deforestationRate}% /
                                      {language === "bn" ? "বছর" : "year"}
                                    </div>
                                  </div>
                                  <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 mb-1">
                                      <Droplets className="w-3 h-3" />
                                      <span className="font-semibold">
                                        {language === "bn"
                                          ? "মাটি ক্ষয়"
                                          : "Soil Erosion"}
                                      </span>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                      {zone.soilErosion}
                                    </div>
                                  </div>
                                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
                                      <Wind className="w-3 h-3" />
                                      <span className="font-semibold">
                                        {language === "bn"
                                          ? "বায়ু মান"
                                          : "AQI"}
                                      </span>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                      {zone.pollutionIndex}
                                    </div>
                                  </div>
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                                      <TreePine className="w-3 h-3" />
                                      <span className="font-semibold">
                                        {language === "bn"
                                          ? "এখানে গাছ"
                                          : "Trees Here"}
                                      </span>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                      {treeCount}
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {language === "bn"
                                      ? "পরিবেশগত তথ্য:"
                                      : "Environmental Facts:"}
                                  </h4>
                                  <ul className="text-xs space-y-1">
                                    {zone.environmentalFacts
                                      .slice(0, 2)
                                      .map((fact, i) => (
                                        <li
                                          key={i}
                                          className="text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                          <span className="text-red-500 mt-0.5">
                                            •
                                          </span>
                                          <span>{fact}</span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>

                                {!isCompleted && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleZoneClick(zone);
                                    }}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                                    <TreePine className="w-4 h-4" />
                                    {language === "bn"
                                      ? "এখানে গাছ লাগান"
                                      : "Plant Tree Here"}
                                  </button>
                                )}

                                {isCompleted && (
                                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 text-center">
                                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                                      <Sparkles className="w-4 h-4" />
                                      <span>
                                        {treeCount}{" "}
                                        {language === "bn"
                                          ? "টি গাছ লাগানো হয়েছে!"
                                          : `Tree${
                                              treeCount > 1 ? "s" : ""
                                            } Planted!`}{" "}
                                        🌳
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Popup>
                          </Marker>
                        </React.Fragment>
                      );
                    })}
                  </MapContainer>

                  <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 shadow-xl z-[1000]">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">
                      {language === "bn" ? "মানচিত্র লেজেন্ড" : "Map Legend"}
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {language === "bn"
                            ? "সংকটপূর্ণ এলাকা"
                            : "Critical Zone"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {language === "bn"
                            ? "উচ্চ অগ্রাধিকার"
                            : "High Priority"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {language === "bn"
                            ? "মাঝারি অগ্রাধিকার"
                            : "Medium Priority"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌳</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {language === "bn"
                            ? "গাছ লাগানো হয়েছে"
                            : "Tree Planted"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {language === "bn"
                            ? "আপনার অবস্থান"
                            : "Your Location"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location Button */}
                  <div className="absolute bottom-4 right-4 z-[1000]">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={getUserLocation}
                      disabled={locationLoading}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl transition-all ${
                        locationLoading
                          ? "bg-gray-400 cursor-wait"
                          : userLocation
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white font-semibold`}>
                      {locationLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>
                            {language === "bn"
                              ? "খোঁজা হচ্ছে..."
                              : "Locating..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Locate className="w-5 h-5" />
                          <span>
                            {userLocation
                              ? language === "bn"
                                ? "আমার অবস্থান"
                                : "My Location"
                              : language === "bn"
                              ? "আমাকে খুঁজুন"
                              : "Find Me"}
                          </span>
                        </>
                      )}
                    </motion.button>

                    {locationError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 px-3 py-2 bg-red-500 text-white text-xs rounded-lg shadow-lg">
                        {locationError}
                      </motion.div>
                    )}

                    {userLocation && !locationError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 px-3 py-2 bg-blue-500 text-white text-xs rounded-lg shadow-lg text-center">
                        📍 {userLocation[0].toFixed(2)}°N,{" "}
                        {userLocation[1].toFixed(2)}°E
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {showSidePanel && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {language === "bn"
                        ? "জেলা র‍্যাংকিং"
                        : "District Rankings"}
                    </h3>
                    <div className="space-y-2">
                      {getDistrictStats()
                        .slice(0, 5)
                        .map(([district, count], index) => (
                          <div
                            key={district}
                            className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">
                                #{index + 1}
                              </span>
                              <span className="text-sm">{district}</span>
                            </div>
                            <span className="font-bold">{count} 🌳</span>
                          </div>
                        ))}
                      {getDistrictStats().length === 0 && (
                        <p className="text-white/70 text-sm text-center py-4">
                          {language === "bn"
                            ? "এখনও কোনো গাছ লাগানো হয়নি। প্রথম হোন!"
                            : "No trees planted yet. Be the first!"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      {language === "bn"
                        ? "সাম্প্রতিক কার্যকলাপ"
                        : "Recent Activity"}
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {plantedTrees
                        .slice(-5)
                        .reverse()
                        .map((tree) => (
                          <div
                            key={tree.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">
                                {tree.treeType.emoji}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {tree.treeType.name}
                              </span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {tree.zone.district} •{" "}
                              {new Date(tree.date).toLocaleDateString(
                                language === "bn" ? "bn-BD" : "en-US"
                              )}
                            </div>
                          </div>
                        ))}
                      {plantedTrees.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                          {language === "bn"
                            ? "কার্যকলাপ দেখতে গাছ লাগানো শুরু করুন"
                            : "Start planting trees to see activity here"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg">
                    <h3 className="text-sm font-bold mb-2">
                      {language === "bn" ? "আপনার প্রভাব" : "Your Impact"}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="opacity-90">
                          {language === "bn"
                            ? "মোট অবদান:"
                            : "Total Contribution:"}
                        </span>
                        <span className="font-bold">
                          {plantedTrees.length}{" "}
                          {language === "bn" ? "গাছ" : "trees"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-90">
                          {language === "bn" ? "CO₂ অফসেট:" : "CO₂ Offset:"}
                        </span>
                        <span className="font-bold">
                          {getTotalCO2Saved()}{" "}
                          {language === "bn" ? "কেজি/বছর" : "kg/year"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-90">
                          {language === "bn"
                            ? "সাহায্যকৃত জেলা:"
                            : "Districts Helped:"}
                        </span>
                        <span className="font-bold">
                          {getDistrictStats().length}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showTreeSelector && selectedZone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[10000]"
              onClick={() => setShowTreeSelector(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <TreePine className="w-6 h-6 text-green-600" />
                      {language === "bn"
                        ? "গাছের ধরন নির্বাচন করুন"
                        : "Select Tree Type"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedZone.name}, {selectedZone.district}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTreeSelector(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {bangladeshTreeTypes.map((tree) => (
                    <motion.button
                      key={tree.name}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTreePlant(tree)}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 rounded-xl p-4 text-left transition-all shadow-md hover:shadow-xl">
                      <div className="text-4xl mb-2">{tree.emoji}</div>
                      <div className="font-bold text-gray-900 dark:text-white mb-1">
                        {tree.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div>
                          CO₂: {tree.co2Absorption}{" "}
                          {language === "bn" ? "কেজি/বছর" : "kg/yr"}
                        </div>
                        <div>
                          {language === "bn" ? "বৃদ্ধি:" : "Growth:"}{" "}
                          {tree.growthRate}
                        </div>
                        <div className="text-green-600 dark:text-green-400 font-semibold">
                          {tree.nativeStatus}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <Leaf className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {language === "bn"
                        ? `${
                            selectedZone.district
                          } এর জন্য প্রস্তাবিত প্রজাতি: ${selectedZone.localSpecies.join(
                            ", "
                          )}`
                        : `Recommended species for ${
                            selectedZone.district
                          }: ${selectedZone.localSpecies.join(", ")}`}
                    </span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAnimation && lastPlantedTree && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10001]">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-8xl mb-4">
                  {lastPlantedTree.treeType.emoji}
                </motion.div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {language === "bn"
                    ? "সফলভাবে গাছ লাগানো হয়েছে! 🎉"
                    : "Tree Planted Successfully! 🎉"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {lastPlantedTree.treeType.name}{" "}
                  {language === "bn"
                    ? `${lastPlantedTree.zone.district}-এ`
                    : `in ${lastPlantedTree.zone.district}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  +{lastPlantedTree.treeType.co2Absorption}{" "}
                  {language === "bn"
                    ? "কেজি CO₂/বছর সঞ্চয়"
                    : "kg CO₂/year saved"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
