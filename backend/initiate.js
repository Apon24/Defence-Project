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
    isVerified: true,
  },
  {
    fullName: "Murad Hasan",
    email: "imurad2020@gmail.com",
    password: "11223344",
    role: "admin",
    isVerified: true,
  },
  {
    fullName: "Test User",
    email: "test@ecotrack.com",
    password: "test1234",
    role: "user",
    isVerified: true,
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

// ============ BLOG POSTS ============
const blogPosts = [
  {
    title: "How to Reduce Your Carbon Footprint in Bangladesh",
    content:
      "Bangladesh is one of the most vulnerable countries to climate change. Here are some simple steps you can take locally to reduce your impact:\n\n1. **Use Public Transport**: Dhaka's traffic contributes significantly to air pollution. Use buses, trains, or rickshaws when possible.\n\n2. **Reduce Plastic Use**: Carry reusable bags and avoid single-use plastics. Bangladesh banned plastic bags in 2002 - let's honor that law!\n\n3. **Conserve Water**: Install water-efficient fixtures and fix leaky taps.\n\n4. **Support Local Farmers**: Buy locally grown food to reduce transportation emissions.\n\n5. **Plant Trees**: Join community tree-planting drives in your area.",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000",
    excerpt: "Practical tips for a sustainable lifestyle in Bangladesh.",
    author: "Eco Track Team",
  },
  {
    title: "Protecting the Sundarbans: Our Natural Heritage",
    content:
      "The Sundarbans, the world's largest mangrove forest, is crucial for Bangladesh's ecosystem. Spanning over 10,000 square kilometers, it serves as a natural barrier against cyclones and is home to the Royal Bengal Tiger.\n\n**Threats Facing the Sundarbans:**\n- Climate change and rising sea levels\n- Industrial pollution from nearby factories\n- Illegal logging and poaching\n- Increased salinity in water\n\n**What You Can Do:**\n- Support eco-tourism initiatives\n- Donate to conservation organizations\n- Spread awareness about mangrove importance\n- Report illegal activities to authorities",
    imageUrl:
      "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=1000",
    excerpt:
      "Deep dive into the importance of mangrove conservation in Bangladesh.",
    author: "Eco Track Team",
  },
  {
    title: "The Plastic Crisis in Bangladesh Rivers",
    content:
      "Bangladesh's rivers are suffocating under plastic waste. The Buriganga, Turag, and other major rivers have become dumping grounds for industrial and household waste.\n\n**The Scale of the Problem:**\n- Over 3,000 tons of plastic waste generated daily in Dhaka alone\n- Only 37% of plastic is recycled\n- Microplastics are entering our food chain through fish\n\n**Solutions We Need:**\n1. Enforce existing plastic bans strictly\n2. Invest in waste management infrastructure\n3. Promote biodegradable alternatives\n4. Community-led river cleanup initiatives\n5. Corporate responsibility for packaging",
    imageUrl:
      "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=1000",
    excerpt:
      "Examining the devastating impact of plastic pollution on our waterways.",
    author: "Eco Track Team",
  },
  {
    title: "Urban Gardening: Growing Green in Dhaka",
    content:
      "Despite being one of the world's most densely populated cities, Dhaka has a growing urban gardening movement.\n\n**Benefits of Urban Gardening:**\n- Reduces urban heat island effect\n- Improves air quality\n- Provides fresh, organic produce\n- Creates community bonds\n- Reduces stress and improves mental health\n\n**Getting Started:**\n- Start with easy plants like tomatoes, chillies, and herbs\n- Use recycled containers as pots\n- Collect rainwater for irrigation\n- Compost kitchen waste for fertilizer\n- Join rooftop gardening communities on Facebook",
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=1000",
    excerpt:
      "A guide to starting your own urban garden in Bangladesh's capital.",
    author: "Eco Track Team",
  },
  {
    title: "Climate Refugees: Bangladesh's Growing Crisis",
    content:
      "Bangladesh is at the forefront of the climate refugee crisis. Rising sea levels and extreme weather events are displacing millions.\n\n**The Statistics Are Alarming:**\n- 17% of Bangladesh could be underwater by 2050\n- Over 20 million people may become climate refugees\n- Coastal erosion destroys homes yearly\n- Salinity intrusion is ruining farmland\n\n**Adaptation Strategies:**\n- Floating gardens and homes\n- Salt-tolerant crop varieties\n- Early warning systems for disasters\n- Planned relocation programs\n- International climate finance\n\nEvery action we take to reduce emissions helps prevent this future.",
    imageUrl:
      "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?auto=format&fit=crop&q=80&w=1000",
    excerpt: "Understanding the human cost of climate change in Bangladesh.",
    author: "Eco Track Team",
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

    // Create users (password will be hashed by User model pre-save hook)
    console.log("👤 Creating users...");
    const createdUsers = await User.create(users);
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

    // Create blog posts
    console.log("\n📝 Creating blog posts...");
    await BlogPost.insertMany(blogPosts);
    console.log(`   ✅ Created ${blogPosts.length} blog posts`);

    // Summary
    console.log("\n" + "━".repeat(50));
    console.log("🎉 Clean Database Initialization Complete!\n");
    console.log("📊 Summary:");
    console.log(`   • Users: ${createdUsers.length}`);
    console.log(`   • Badges: ${badges.length}`);
    console.log(`   • Planting Areas: ${createdAreas.length}`);
    console.log(`   • Quiz Questions: ${quizQuestions.length}`);
    console.log(`   • Blog Posts: ${blogPosts.length}`);
    console.log("");
    console.log("📭 Empty Collections (starting from 0):");
    console.log("   • Trees Planted: 0");
    console.log("   • Challenges: 0");
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
