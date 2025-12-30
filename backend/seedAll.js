import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  User,
  Badge,
  BlogPost,
  EcoLocation,
  EcoEvent,
  PlantingArea,
  PlantedTree,
  DailyChallenge,
  CarbonFootprint,
} from "./models/index.js";
import connectDB from "./config/db.js";

dotenv.config();

const dummyUsers = [
  {
    fullName: "Admin User",
    email: "admin@ecotrack.com",
    password: "Password123!",
    role: "admin",
    isVerified: true,
  },
  {
    fullName: "Super Admin",
    email: "paulapon2222@gmail.com",
    password: "01876968988",
    role: "admin",
    isVerified: true,
  },
  {
    fullName: "Murad Hasan",
    email: "murad@example.com",
    password: "Password123!",
    role: "user",
    isVerified: true,
  },
];

const dummyBadges = [
  {
    name: "Eco Rookie",
    description: "Completed your first carbon footprint calculation",
    icon: "https://api.dicebear.com/7.x/icons/svg?seed=rookie",
    requirement: "First calculation",
  },
  {
    name: "Tree Planter",
    description: "Planted your first virtual tree",
    icon: "https://api.dicebear.com/7.x/icons/svg?seed=tree",
    requirement: "First tree planted",
  },
  {
    name: "Quiz Master",
    description: "Scored 100% in a quiz",
    icon: "https://api.dicebear.com/7.x/icons/svg?seed=quiz",
    requirement: "Perfect quiz score",
  },
];

const dummyBlogPosts = [
  {
    title: "How to Reduce Your Carbon Footprint in Bangladesh",
    content:
      "Bangladesh is one of the most vulnerable countries to climate change. Here are some simple steps you can take locally to reduce your impact, from using public transport to reducing plastic waste in Dhaka.",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000",
    excerpt: "Practical tips for a sustainable lifestyle in Bangladesh.",
    author: "Eco Track Team",
  },
  {
    title: "Protecting the Sundarbans",
    content:
      "The Sundarbans, the world's largest mangrove forest, is crucial for Bangladesh's ecosystem. Learn about the importance of mangrove conservation and how we can support local initiatives.",
    imageUrl:
      "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=1000",
    excerpt: "Deep dive into mangrove conservation.",
    author: "Eco Track Team",
  },
];

const dummyLocations = [
  {
    name: "Ramna Park Waste Collection Point",
    description:
      "Central collection point for recyclable materials in Ramna Park.",
    category: "Recycling Center",
    latitude: 23.738,
    longitude: 90.4,
    city: "Dhaka",
  },
  {
    name: "Bashundhara Eco-Friendly Hub",
    description:
      "A community space dedicated to sustainable living and composting.",
    category: "Community Garden",
    latitude: 23.818,
    longitude: 90.43,
    city: "Dhaka",
  },
];

const dummyEvents = [
  {
    title: "Dhaka Coastal Cleanup",
    description:
      "Join us for a massive cleanup drive along the riverbanks of Buriganga.",
    eventType: "Cleanup",
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    locationName: "Buriganga Riverfront, Sadarghat",
    latitude: 23.705,
    longitude: 90.395,
    city: "Dhaka",
    district: "Dhaka",
    division: "Dhaka",
    organizer: "Eco Track Bangladesh",
  },
  {
    title: "Sustainable Living Workshop",
    description: "Workshop on urban gardening and waste management at home.",
    eventType: "Workshop",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    locationName: "Dhanmondi, Dhaka",
    latitude: 23.7461,
    longitude: 90.3742,
    city: "Dhaka",
    district: "Dhaka",
    division: "Dhaka",
    organizer: "Green Earth BD",
  },
];

const dummyPlantingAreas = [
  {
    title: "Dhaka North Afforestation",
    description: "Restoring green cover in the northern part of the city.",
    latitude: 23.8103,
    longitude: 90.4125,
    district: "Dhaka",
    division: "Dhaka",
    problemType: "Urbanization",
    isPlanted: true,
  },
];

const seedAll = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();
    console.log("Connected!");

    // Clear existing data
    console.log("Cleaning up existing data...");
    await User.deleteMany({});
    await Badge.deleteMany({});
    await BlogPost.deleteMany({});
    await EcoLocation.deleteMany({});
    await EcoEvent.deleteMany({});
    await PlantingArea.deleteMany({});
    await PlantedTree.deleteMany({});
    await DailyChallenge.deleteMany({});
    await CarbonFootprint.deleteMany({});

    // Seed Data
    console.log("Seeding Users...");
    const users = await User.create(dummyUsers);
    const muradId = users[1]._id;

    console.log("Seeding Badges...");
    await Badge.insertMany(dummyBadges);

    console.log("Seeding Blog Posts...");
    await BlogPost.insertMany(dummyBlogPosts);

    console.log("Seeding Locations...");
    await EcoLocation.insertMany(dummyLocations);

    console.log("Seeding Events...");
    await EcoEvent.insertMany(dummyEvents);

    console.log("Seeding Planting Areas and Trees...");
    const areas = await PlantingArea.create(dummyPlantingAreas);
    await PlantedTree.create([
      { plantingAreaId: areas[0]._id, treeType: "Mango", plantedBy: muradId },
      { plantingAreaId: areas[0]._id, treeType: "Neem", plantedBy: muradId },
      {
        plantingAreaId: areas[0]._id,
        treeType: "Jackfruit",
        plantedBy: muradId,
      },
    ]);

    console.log("Seeding Challenges...");
    await DailyChallenge.create([
      {
        userId: muradId,
        challengeName: "No Plastic Day",
        completed: true,
        completedAt: new Date(),
      },
      {
        userId: muradId,
        challengeName: "Use Public Transport",
        completed: true,
        completedAt: new Date(),
      },
      {
        userId: muradId,
        challengeName: "Plant a Tree",
        completed: true,
        completedAt: new Date(),
      },
    ]);

    console.log("Seeding Carbon Footprints...");
    await CarbonFootprint.create([
      {
        userId: muradId,
        electricityKwh: 100,
        transportationKm: 50,
        wasteKg: 10,
        totalCo2Kg: 250,
        category: "Medium",
      },
    ]);

    console.log("Data Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error Seeding Data:", error);
    process.exit(1);
  }
};

seedAll();
