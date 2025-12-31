/**
 * Database Initialization Script for Eco Track Bangladesh (Clean Start)
 *
 * Run this script to set up a fresh database with minimal seed data.
 * Usage: node initiate.js
 *
 * This script will:
 * 1. Clear all existing data
 * 2. Create admin and test users (for login)
 * 3. Seed planting areas (required for tree planting feature)
 * 4. Add badges
 * 5. Add quiz questions
 *
 * Everything else starts at 0 (trees, challenges, blog posts, etc.)
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

// ============ USERS ============
const users = [
  {
    fullName: "Admin User",
    email: "admin@ecotrack.com",
    password: "admin123",
    role: "admin",
    isEmailVerified: true,
  },
  {
    fullName: "Murad Hasan",
    email: "imurad2020@gmail.com",
    password: "11223344",
    role: "admin",
    isEmailVerified: true,
  },
  {
    fullName: "Test User",
    email: "test@ecotrack.com",
    password: "test123",
    role: "user",
    isEmailVerified: true,
  },
];

// ============ BADGES ============
const badges = [
  {
    name: "Eco Rookie",
    description: "Completed your first carbon footprint calculation",
    icon: "🌱",
    requirement: "First calculation",
  },
  {
    name: "Tree Planter",
    description: "Planted your first virtual tree",
    icon: "🌳",
    requirement: "First tree planted",
  },
  {
    name: "Quiz Master",
    description: "Scored 100% in a quiz",
    icon: "🏆",
    requirement: "Perfect quiz score",
  },
  {
    name: "Carbon Warrior",
    description: "Reduced carbon footprint for 7 consecutive days",
    icon: "⚔️",
    requirement: "7-day streak",
  },
  {
    name: "Community Leader",
    description: "Made 10 community posts",
    icon: "👥",
    requirement: "10 posts",
  },
];

// ============ PLANTING AREAS (required for tree planting) ============
const plantingAreas = [
  {
    title: "Sundarbans Buffer Zone",
    description:
      "Largest mangrove forest in the world. UNESCO World Heritage Site.",
    latitude: 22.5,
    longitude: 89.5,
    district: "Khulna",
    division: "Khulna",
    problemType: "Coastal Erosion",
    isPlanted: false,
  },
  {
    title: "Chattogram Hill Tracts",
    description:
      "Jhum cultivation causing rapid soil loss. Biodiversity hotspot.",
    latitude: 23.0,
    longitude: 92.0,
    district: "Rangamati",
    division: "Chattogram",
    problemType: "Deforestation",
    isPlanted: false,
  },
  {
    title: "Sylhet Tea Gardens",
    description: "Wetland ecosystem degradation. Migratory bird habitat.",
    latitude: 24.8949,
    longitude: 91.8687,
    district: "Sylhet",
    division: "Sylhet",
    problemType: "Pollution",
    isPlanted: false,
  },
  {
    title: "Dhaka Metropolitan Area",
    description: "World's 2nd most polluted city. Only 8% green cover.",
    latitude: 23.8103,
    longitude: 90.4125,
    district: "Dhaka",
    division: "Dhaka",
    problemType: "Urbanization",
    isPlanted: false,
  },
  {
    title: "Barishal Coastal Belt",
    description:
      "Cyclone vulnerable area. Salinity intrusion affecting agriculture.",
    latitude: 22.701,
    longitude: 90.3535,
    district: "Barishal",
    division: "Barishal",
    problemType: "Coastal Erosion",
    isPlanted: false,
  },
  {
    title: "Kurigram Char Lands",
    description: "Annual flooding. Riverbank erosion most severe in country.",
    latitude: 25.8073,
    longitude: 89.636,
    district: "Kurigram",
    division: "Rangpur",
    problemType: "Flood Erosion",
    isPlanted: false,
  },
  {
    title: "Chittagong Port Area",
    description: "Ship-breaking yards toxic waste. Air quality hazardous.",
    latitude: 22.3569,
    longitude: 91.7832,
    district: "Chittagong",
    division: "Chattogram",
    problemType: "Industrial Pollution",
    isPlanted: false,
  },
  {
    title: "Rajshahi Barind Tract",
    description: "Drought-prone region. Groundwater depletion critical.",
    latitude: 24.3745,
    longitude: 88.6042,
    district: "Rajshahi",
    division: "Rajshahi",
    problemType: "Drought",
    isPlanted: false,
  },
  {
    title: "Mymensingh Haor Basin",
    description: "Flash flooding increasing. Wetland biodiversity declining.",
    latitude: 24.7471,
    longitude: 90.4203,
    district: "Mymensingh",
    division: "Mymensingh",
    problemType: "Wetland Degradation",
    isPlanted: false,
  },
  {
    title: "Cox's Bazar Refugee Area",
    description: "Fastest deforestation in Bangladesh. Landslide risk high.",
    latitude: 21.4272,
    longitude: 92.0058,
    district: "Cox's Bazar",
    division: "Chattogram",
    problemType: "Deforestation",
    isPlanted: false,
  },
];

// ============ QUIZ QUESTIONS ============
const quizQuestions = [
  {
    questionText:
      "Which gas is primarily responsible for the greenhouse effect?",
    difficulty: "easy",
    category: "Climate Change",
    points: 10,
    explanation: "Carbon dioxide (CO2) is the primary greenhouse gas.",
    answers: [
      { answerText: "Oxygen", isCorrect: false, orderIndex: 0 },
      { answerText: "Carbon dioxide", isCorrect: true, orderIndex: 1 },
      { answerText: "Nitrogen", isCorrect: false, orderIndex: 2 },
      { answerText: "Helium", isCorrect: false, orderIndex: 3 },
    ],
  },
  {
    questionText: "What is the 3R principle of waste management?",
    difficulty: "medium",
    category: "Waste Management",
    points: 15,
    explanation: "Reduce, Reuse, and Recycle are the three key components.",
    answers: [
      { answerText: "Read, Write, Recall", isCorrect: false, orderIndex: 0 },
      { answerText: "Reduce, Reuse, Recycle", isCorrect: true, orderIndex: 1 },
      { answerText: "Run, Rest, Repeat", isCorrect: false, orderIndex: 2 },
      {
        answerText: "Repair, Remake, Recover",
        isCorrect: false,
        orderIndex: 3,
      },
    ],
  },
  {
    questionText: "How long does a plastic bottle take to decompose?",
    difficulty: "hard",
    category: "Pollution",
    points: 20,
    explanation: "Plastic bottles can take approximately 450 years or more.",
    answers: [
      { answerText: "10 years", isCorrect: false, orderIndex: 0 },
      { answerText: "50 years", isCorrect: false, orderIndex: 1 },
      { answerText: "100 years", isCorrect: false, orderIndex: 2 },
      { answerText: "450 years", isCorrect: true, orderIndex: 3 },
    ],
  },
  {
    questionText: "Which of the following is NOT a biodegradable material?",
    difficulty: "easy",
    category: "Waste Management",
    points: 10,
    explanation: "Styrofoam is a synthetic plastic that does not biodegrade.",
    answers: [
      { answerText: "Paper", isCorrect: false, orderIndex: 0 },
      { answerText: "Food scraps", isCorrect: false, orderIndex: 1 },
      { answerText: "Styrofoam", isCorrect: true, orderIndex: 2 },
      { answerText: "Cotton", isCorrect: false, orderIndex: 3 },
    ],
  },
  {
    questionText: "When is World Environment Day celebrated?",
    difficulty: "easy",
    category: "General Awareness",
    points: 10,
    explanation: "World Environment Day is celebrated on June 5th every year.",
    answers: [
      { answerText: "February 21", isCorrect: false, orderIndex: 0 },
      { answerText: "June 5", isCorrect: true, orderIndex: 1 },
      { answerText: "December 16", isCorrect: false, orderIndex: 2 },
      { answerText: "January 1", isCorrect: false, orderIndex: 3 },
    ],
  },
];

// ============ MAIN INITIALIZATION FUNCTION ============
const initiate = async () => {
  try {
    console.log("\n🌿 Eco Track Bangladesh - Clean Database Initialization\n");
    console.log("━".repeat(50));

    console.log("📡 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Connected to MongoDB!\n");

    // Clear all existing data
    console.log("🧹 Clearing ALL existing data...");
    await Promise.all([
      User.deleteMany({}),
      Badge.deleteMany({}),
      BlogPost.deleteMany({}),
      EcoLocation.deleteMany({}),
      EcoEvent.deleteMany({}),
      PlantingArea.deleteMany({}),
      PlantedTree.deleteMany({}),
      DailyChallenge.deleteMany({}),
      CarbonFootprint.deleteMany({}),
      QuizQuestion.deleteMany({}),
    ]);
    console.log("✅ All collections cleared!\n");

    // Hash passwords and create users
    console.log("👤 Creating users...");
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    const createdUsers = await User.create(hashedUsers);
    console.log(`   ✅ Created ${createdUsers.length} users`);
    users.forEach((u) => console.log(`      - ${u.email} / ${u.password}`));

    // Create badges
    console.log("\n🏆 Creating badges...");
    await Badge.insertMany(badges);
    console.log(`   ✅ Created ${badges.length} badges`);

    // Create planting areas (needed for tree planting feature)
    console.log("\n🗺️  Creating planting areas...");
    const createdAreas = await PlantingArea.create(plantingAreas);
    console.log(`   ✅ Created ${createdAreas.length} planting areas`);

    // Create quiz questions
    console.log("\n❓ Creating quiz questions...");
    await QuizQuestion.insertMany(quizQuestions);
    console.log(`   ✅ Created ${quizQuestions.length} quiz questions`);

    // Summary
    console.log("\n" + "━".repeat(50));
    console.log("🎉 Clean Database Initialization Complete!\n");
    console.log("📊 Summary:");
    console.log(`   • Users: ${createdUsers.length}`);
    console.log(`   • Badges: ${badges.length}`);
    console.log(`   • Planting Areas: ${createdAreas.length}`);
    console.log(`   • Quiz Questions: ${quizQuestions.length}`);
    console.log("");
    console.log("📭 Empty Collections (starting from 0):");
    console.log("   • Trees Planted: 0");
    console.log("   • Challenges: 0");
    console.log("   • Blog Posts: 0");
    console.log("   • Eco Locations: 0");
    console.log("   • Eco Events: 0");
    console.log("   • Carbon Footprints: 0");
    console.log("\n📌 Login Credentials:");
    console.log("   Admin: imurad2020@gmail.com / 11223344");
    console.log("   Test:  test@ecotrack.com / test123");
    console.log("\n🚀 You can now start the server with: bun dev\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during initialization:", error);
    process.exit(1);
  }
};

initiate();
