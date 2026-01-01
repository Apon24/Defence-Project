/**
 * Complete Database Seeding Script for Eco Track Bangladesh
 *
 * Run this script to set up a fresh database with all seed data.
 * Usage: node seedAll.js
 *
 * This script will:
 * 1. Clear all existing data
 * 2. Create admin and test users
 * 3. Seed badges, blog posts, quiz questions
 * 4. Add planting areas, eco locations, and events
 * 5. Add sample user activities (trees, challenges, carbon footprints)
 */

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
    fullName: "Super Admin",
    email: "paulapon2222@gmail.com",
    password: "01876968988",
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
  {
    fullName: "Murad Hasan",
    email: "murad@example.com",
    password: "Password123!",
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

// ============ ECO LOCATIONS ============
const ecoLocations = [
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

// ============ ECO EVENTS ============
const ecoEvents = [
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

// ============ PLANTING AREAS ============
const plantingAreas = [
  {
    title: "Sundarbans Buffer Zone",
    description:
      "Largest mangrove forest in the world. UNESCO World Heritage Site under threat. Critical tiger habitat disappearing.",
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
      "Jhum cultivation causing rapid soil loss. 70% forest cover lost in 40 years. Biodiversity hotspot at risk.",
    latitude: 23.0,
    longitude: 92.0,
    district: "Rangamati",
    division: "Chattogram",
    problemType: "Deforestation",
    isPlanted: false,
  },
  {
    title: "Sylhet Tea Gardens",
    description:
      "Wetland ecosystem degradation. Chemical runoff from tea plantations. Migratory bird habitat threatened.",
    latitude: 24.8949,
    longitude: 91.8687,
    district: "Sylhet",
    division: "Sylhet",
    problemType: "Pollution",
    isPlanted: false,
  },
  {
    title: "Dhaka Metropolitan Area",
    description:
      "World's 2nd most polluted city. Only 8% green cover remaining. Urban heat island effect worsening.",
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
      "Cyclone vulnerable area. Salinity intrusion affecting agriculture. River bank erosion displacing thousands.",
    latitude: 22.701,
    longitude: 90.3535,
    district: "Barishal",
    division: "Barishal",
    problemType: "Coastal Erosion",
    isPlanted: false,
  },
  {
    title: "Kurigram Char Lands",
    description:
      "Annual flooding destroys settlements. Riverbank erosion most severe in country. Climate refugee crisis emerging.",
    latitude: 25.8073,
    longitude: 89.636,
    district: "Kurigram",
    division: "Rangpur",
    problemType: "Flood Erosion",
    isPlanted: false,
  },
  {
    title: "Chittagong Port Area",
    description:
      "Busiest port causing heavy pollution. Ship-breaking yards toxic waste. Air quality hazardous 180 days/year.",
    latitude: 22.3569,
    longitude: 91.7832,
    district: "Chittagong",
    division: "Chattogram",
    problemType: "Industrial Pollution",
    isPlanted: false,
  },
  {
    title: "Rajshahi Barind Tract",
    description:
      "Drought-prone region worsening. Groundwater depletion critical. Desertification indicators present.",
    latitude: 24.3745,
    longitude: 88.6042,
    district: "Rajshahi",
    division: "Rajshahi",
    problemType: "Drought",
    isPlanted: false,
  },
  {
    title: "Mymensingh Haor Basin",
    description:
      "Flash flooding increasing. Wetland biodiversity declining. Fish breeding grounds threatened.",
    latitude: 24.7471,
    longitude: 90.4203,
    district: "Mymensingh",
    division: "Mymensingh",
    problemType: "Wetland Degradation",
    isPlanted: false,
  },
  {
    title: "Cox's Bazar Refugee Area",
    description:
      "Fastest deforestation in Bangladesh. 6000 acres of forest cleared for camps. Landslide risk increased 400%.",
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
    questionText: "কোনটি নবায়নযোগ্য শক্তির উৎস?",
    difficulty: "easy",
    category: "Energy",
    points: 10,
    explanation: "সৌরশক্তি একটি অফুরন্ত এবং পরিবেশবান্ধব শক্তির উৎস।",
    answers: [
      { answerText: "কয়লা", isCorrect: false, orderIndex: 0 },
      { answerText: "প্রাকৃতিক গ্যাস", isCorrect: false, orderIndex: 1 },
      { answerText: "সৌরশক্তি", isCorrect: true, orderIndex: 2 },
      { answerText: "পেট্রোলিয়াম", isCorrect: false, orderIndex: 3 },
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
      { answerText: "Oxygen", isCorrect: false, orderIndex: 0 },
      { answerText: "Carbon dioxide", isCorrect: true, orderIndex: 1 },
      { answerText: "Nitrogen", isCorrect: false, orderIndex: 2 },
      { answerText: "Helium", isCorrect: false, orderIndex: 3 },
    ],
  },
  {
    questionText: "বাংলাদেশে সুন্দরবন কোন ধরনের বন?",
    difficulty: "medium",
    category: "Biodiversity",
    points: 15,
    explanation: "সুন্দরবন বিশ্বের বৃহত্তম ম্যানগ্রোভ বন।",
    answers: [
      { answerText: "চিরহরিৎ বন", isCorrect: false, orderIndex: 0 },
      { answerText: "ম্যানগ্রোভ বন", isCorrect: true, orderIndex: 1 },
      { answerText: "পর্ণমোচী বন", isCorrect: false, orderIndex: 2 },
      { answerText: "বৃষ্টির বন", isCorrect: false, orderIndex: 3 },
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
    questionText: "একটি প্লাস্টিক বোতল পচতে কত সময় লাগে?",
    difficulty: "hard",
    category: "Pollution",
    points: 20,
    explanation:
      "প্লাস্টিক বোতল পচতে প্রায় ৪৫০ বছর বা তার বেশি সময় লাগতে পারে।",
    answers: [
      { answerText: "১০ বছর", isCorrect: false, orderIndex: 0 },
      { answerText: "৫০ বছর", isCorrect: false, orderIndex: 1 },
      { answerText: "১০০ বছর", isCorrect: false, orderIndex: 2 },
      { answerText: "৪৫০ বছর", isCorrect: true, orderIndex: 3 },
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
      { answerText: "Paper", isCorrect: false, orderIndex: 0 },
      { answerText: "Food scraps", isCorrect: false, orderIndex: 1 },
      { answerText: "Styrofoam", isCorrect: true, orderIndex: 2 },
      { answerText: "Cotton", isCorrect: false, orderIndex: 3 },
    ],
  },
  {
    questionText: "বিশ্ব পরিবেশ দিবস কবে পালিত হয়?",
    difficulty: "easy",
    category: "General Awareness",
    points: 10,
    explanation: "প্রতি বছর ৫ জুন বিশ্ব পরিবেশ দিবস পালিত হয়।",
    answers: [
      { answerText: "২১ ফেব্রুয়ারি", isCorrect: false, orderIndex: 0 },
      { answerText: "৫ জুন", isCorrect: true, orderIndex: 1 },
      { answerText: "১৬ ডিসেম্বর", isCorrect: false, orderIndex: 2 },
      { answerText: "১ জানুয়ারি", isCorrect: false, orderIndex: 3 },
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
      { answerText: "100 liters", isCorrect: false, orderIndex: 0 },
      { answerText: "500 liters", isCorrect: false, orderIndex: 1 },
      { answerText: "1,000 liters", isCorrect: false, orderIndex: 2 },
      { answerText: "Over 5,000 liters", isCorrect: true, orderIndex: 3 },
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
      { answerText: "ডিজেল ইঞ্জিন", isCorrect: false, orderIndex: 0 },
      { answerText: "কয়লা বিদ্যুৎ কেন্দ্র", isCorrect: false, orderIndex: 1 },
      { answerText: "ইলেকট্রিক যান (EV)", isCorrect: true, orderIndex: 2 },
      { answerText: "গ্যাস জেনারেটর", isCorrect: false, orderIndex: 3 },
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
      { answerText: "Drinking", isCorrect: false, orderIndex: 0 },
      { answerText: "Toilet flushing", isCorrect: true, orderIndex: 1 },
      { answerText: "Dishwashing", isCorrect: false, orderIndex: 2 },
      { answerText: "Laundry", isCorrect: false, orderIndex: 3 },
    ],
  },
  {
    questionText: "বাংলাদেশের কোন জেলা চায়ের জন্য বিখ্যাত?",
    difficulty: "easy",
    category: "Agriculture",
    points: 10,
    explanation: "সিলেট এবং মৌলভীবাজার অঞ্চল চায়ের জন্য বিখ্যাত।",
    answers: [
      { answerText: "ঢাকা", isCorrect: false, orderIndex: 0 },
      { answerText: "সিলেট", isCorrect: true, orderIndex: 1 },
      { answerText: "রাজশাহী", isCorrect: false, orderIndex: 2 },
      { answerText: "খুলনা", isCorrect: false, orderIndex: 3 },
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
      { answerText: "Agriculture", isCorrect: false, orderIndex: 0 },
      { answerText: "Energy", isCorrect: true, orderIndex: 1 },
      { answerText: "Waste", isCorrect: false, orderIndex: 2 },
      { answerText: "Forestry", isCorrect: false, orderIndex: 3 },
    ],
  },
];

// ============ MAIN SEEDING FUNCTION ============
const seedAll = async () => {
  try {
    console.log("\n🌿 Eco Track Bangladesh - Complete Database Seeding\n");
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

    // Find Murad user for sample data
    const muradUser = createdUsers.find((u) => u.email === "murad@example.com");
    const muradId = muradUser ? muradUser._id : createdUsers[0]._id;

    // Create badges
    console.log("\n🏆 Creating badges...");
    await Badge.insertMany(badges);
    console.log(`   ✅ Created ${badges.length} badges`);

    // Create blog posts
    console.log("\n📝 Creating blog posts...");
    await BlogPost.insertMany(blogPosts);
    console.log(`   ✅ Created ${blogPosts.length} blog posts`);

    // Create planting areas
    console.log("\n🗺️  Creating planting areas...");
    const createdAreas = await PlantingArea.create(plantingAreas);
    console.log(`   ✅ Created ${createdAreas.length} planting areas`);

    // Create eco locations
    console.log("\n📍 Creating eco locations...");
    await EcoLocation.insertMany(ecoLocations);
    console.log(`   ✅ Created ${ecoLocations.length} eco locations`);

    // Create eco events
    console.log("\n📅 Creating eco events...");
    await EcoEvent.insertMany(ecoEvents);
    console.log(`   ✅ Created ${ecoEvents.length} eco events`);

    // Create quiz questions
    console.log("\n❓ Creating quiz questions...");
    await QuizQuestion.insertMany(quizQuestions);
    console.log(`   ✅ Created ${quizQuestions.length} quiz questions`);

    // Create sample planted trees
    console.log("\n🌳 Creating sample planted trees...");
    const plantedTrees = await PlantedTree.create([
      {
        plantingAreaId: createdAreas[0]._id,
        treeType: "Mango",
        plantedBy: muradId,
      },
      {
        plantingAreaId: createdAreas[0]._id,
        treeType: "Neem",
        plantedBy: muradId,
      },
      {
        plantingAreaId: createdAreas[0]._id,
        treeType: "Jackfruit",
        plantedBy: muradId,
      },
    ]);
    console.log(`   ✅ Created ${plantedTrees.length} planted trees`);

    // Create sample challenges
    console.log("\n🎯 Creating sample challenges...");
    const challenges = await DailyChallenge.create([
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
    console.log(`   ✅ Created ${challenges.length} challenges`);

    // Create sample carbon footprints
    console.log("\n💨 Creating sample carbon footprints...");
    const footprints = await CarbonFootprint.create([
      {
        userId: muradId,
        electricityKwh: 100,
        transportationKm: 50,
        wasteKg: 10,
        totalCo2Kg: 250,
        category: "Medium",
      },
    ]);
    console.log(`   ✅ Created ${footprints.length} carbon footprints`);

    // Summary
    console.log("\n" + "━".repeat(50));
    console.log("🎉 Complete Database Seeding Successful!\n");
    console.log("📊 Summary:");
    console.log(`   • Users: ${createdUsers.length}`);
    console.log(`   • Badges: ${badges.length}`);
    console.log(`   • Blog Posts: ${blogPosts.length}`);
    console.log(`   • Planting Areas: ${createdAreas.length}`);
    console.log(`   • Eco Locations: ${ecoLocations.length}`);
    console.log(`   • Eco Events: ${ecoEvents.length}`);
    console.log(`   • Quiz Questions: ${quizQuestions.length}`);
    console.log(`   • Planted Trees: ${plantedTrees.length}`);
    console.log(`   • Challenges: ${challenges.length}`);
    console.log(`   • Carbon Footprints: ${footprints.length}`);
    console.log("\n📌 Login Credentials:");
    console.log("   Admin: imurad2020@gmail.com / 11223344");
    console.log("   Admin: admin@ecotrack.com / admin123");
    console.log("   Test:  test@ecotrack.com / test1234");
    console.log("   User:  murad@example.com / Password123!");
    console.log("\n🚀 You can now start the server with: bun dev\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    process.exit(1);
  }
};

seedAll();
