import mongoose from "mongoose";
import dotenv from "dotenv";
import QuizQuestion from "./models/QuizQuestion.js";
import connectDB from "./config/db.js";

dotenv.config();

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

const seedQuestions = async () => {
  try {
    await connectDB();

    // Optional: Clear existing questions to avoid duplicates if needed, or just append
    // await QuizQuestion.deleteMany({});

    await QuizQuestion.insertMany(questions);

    console.log("Quiz questions seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding questions:", error);
    process.exit(1);
  }
};

seedQuestions();
