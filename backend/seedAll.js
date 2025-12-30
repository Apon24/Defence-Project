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
  QuizQuestion,
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

const questions = [
  {
    questionText: "কোনটি নবায়নযোগ্য শক্তির উৎস?",
    difficulty: "easy",
    category: "Energy",
    points: 10,
    explanation: "সৌরশক্তি একটি অফুরন্ত এবং পরিবেশবান্ধব শক্তির উৎস।",
    answers: [
      { answerText: "কয়লা", isCorrect: false },
      { answerText: "প্রাকৃতিক গ্যাস", isCorrect: false },
      { answerText: "সৌরশক্তি", isCorrect: true },
      { answerText: "পেট্রোলিয়াম", isCorrect: false },
    ],
  },
  {
    questionText:
      "Which gas is primarily responsible for the greenhouse effect?",
    difficulty: "easy",
    category: "Climate Change",
    points: 10,
    explanation:
      "Carbon dioxide (CO2) is the primary greenhouse gas emitted through human activities.",
    answers: [
      { answerText: "Oxygen", isCorrect: false },
      { answerText: "Carbondioxide", isCorrect: true },
      { answerText: "Nitrogen", isCorrect: false },
      { answerText: "Helium", isCorrect: false },
    ],
  },
  {
    questionText: "বাংলাদেশে সুন্দরবন কোন ধরনের বন?",
    difficulty: "medium",
    category: "Biodiversity",
    points: 15,
    explanation: "সুন্দরবন বিশ্বের বৃহত্তম ম্যানগ্রোভ বন।",
    answers: [
      { answerText: "চিরহরিৎ বন", isCorrect: false },
      { answerText: "ম্যানগ্রোভ বন", isCorrect: true },
      { answerText: "পর্ণমোচী বন", isCorrect: false },
      { answerText: "বৃষ্টির বন", isCorrect: false },
    ],
  },
  {
    questionText: "What is the 3R principle of waste management?",
    difficulty: "medium",
    category: "Waste Management",
    points: 15,
    explanation:
      "Reduce, Reuse, and Recycle are the three key components of sustainable waste management.",
    answers: [
      { answerText: "Read, Write, Recall", isCorrect: false },
      { answerText: "Reduce, Reuse, Recycle", isCorrect: true },
      { answerText: "Run, Rest, Repeat", isCorrect: false },
      { answerText: "Repair, Remake, Recover", isCorrect: false },
    ],
  },
  {
    questionText: "একটি প্লাস্টিক বোতল পচতে কত সময় লাগে?",
    difficulty: "hard",
    category: "Pollution",
    points: 20,
    explanation:
      "প্লাস্টিক বোতল পচতে প্রায় ৪৫০ বছর বা তার বেশি সময় লাগতে পারে।",
    answers: [
      { answerText: "১০ বছর", isCorrect: false },
      { answerText: "৫০ বছর", isCorrect: false },
      { answerText: "১০০ বছর", isCorrect: false },
      { answerText: "৪৫০ বছর", isCorrect: true },
    ],
  },
  {
    questionText: "Which of the following is NOT a biodegradable material?",
    difficulty: "easy",
    category: "Waste Management",
    points: 10,
    explanation:
      "Styrofoam is a synthetic plastic that does not biodegrade easily.",
    answers: [
      { answerText: "Paper", isCorrect: false },
      { answerText: "Food scraps", isCorrect: false },
      { answerText: "Styrofoam", isCorrect: true },
      { answerText: "Cotton", isCorrect: false },
    ],
  },
  {
    questionText: "বিশ্ব পরিবেশ দিবস কবে পালিত হয়?",
    difficulty: "easy",
    category: "General Awareness",
    points: 10,
    explanation: "প্রতি বছর ৫ জুন বিশ্ব পরিবেশ দিবস পালিত হয়।",
    answers: [
      { answerText: "২১ ফেব্রুয়ারি", isCorrect: false },
      { answerText: "৫ জুন", isCorrect: true },
      { answerText: "১৬ ডিসেম্বর", isCorrect: false },
      { answerText: "১ জানুয়ারি", isCorrect: false },
    ],
  },
  {
    questionText: "How much water can a dripping tap waste in a year?",
    difficulty: "medium",
    category: "Water Conservation",
    points: 15,
    explanation:
      "A dripping tap can waste huge amounts of water over time, estimated around 5,500 liters/year for a typical slow drip.",
    answers: [
      { answerText: "100 liters", isCorrect: false },
      { answerText: "500 liters", isCorrect: false },
      { answerText: "1,000 liters", isCorrect: false },
      { answerText: "Over 5,000 liters", isCorrect: true },
    ],
  },
  {
    questionText: "কোন প্রযুক্তিটি কার্বন নির্গমন কমায়?",
    difficulty: "medium",
    category: "Technology",
    points: 15,
    explanation:
      "ইলেকট্রিক যান (EV) জীবাশ্ম জ্বালানি ব্যবহার করে না, তাই সরাসরি কার্বন নির্গমন করে না।",
    answers: [
      { answerText: "ডিজেল ইঞ্জিন", isCorrect: false },
      { answerText: "কয়লা বিদ্যুৎ কেন্দ্র", isCorrect: false },
      { answerText: "ইলেকট্রিক যান (EV)", isCorrect: true },
      { answerText: "গ্যাস জেনারেটর", isCorrect: false },
    ],
  },
  {
    questionText: "What represents the largest share of household water use?",
    difficulty: "hard",
    category: "Water Conservation",
    points: 20,
    explanation:
      "Toilet flushing accounts for the largest share of indoor water use.",
    answers: [
      { answerText: "Drinking", isCorrect: false },
      { answerText: "Toilet flushing", isCorrect: true },
      { answerText: "Dishwashing", isCorrect: false },
      { answerText: "Laundry", isCorrect: false },
    ],
  },
  {
    questionText: "বাংলাদেশের কোন জেলা চায়ের জন্য বিখ্যাত?",
    difficulty: "easy",
    category: "Agriculture",
    points: 10,
    explanation: "সিলেট এবং মৌলভীবাজার অঞ্চল চায়ের জন্য বিখ্যাত।",
    answers: [
      { answerText: "ঢাকা", isCorrect: false },
      { answerText: "সিলেট", isCorrect: true },
      { answerText: "রাজশাহী", isCorrect: false },
      { answerText: "খুলনা", isCorrect: false },
    ],
  },
  {
    questionText: "Which sector emits the most greenhouse gases globally?",
    difficulty: "hard",
    category: "Climate Change",
    points: 20,
    explanation:
      "Energy (electricity, heat, transport) contributes the most to global emissions.",
    answers: [
      { answerText: "Agriculture", isCorrect: false },
      { answerText: "Energy", isCorrect: true },
      { answerText: "Waste", isCorrect: false },
      { answerText: "Forestry", isCorrect: false },
    ],
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
    await QuizQuestion.deleteMany({});

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

    console.log("Seeding Quiz Questions...");
    await QuizQuestion.insertMany(questions);

    console.log("Data Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error Seeding Data:", error);
    process.exit(1);
  }
};

seedAll();
