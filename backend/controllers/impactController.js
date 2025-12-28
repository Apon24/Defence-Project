import User from "../models/User.js";
import PlantedTree from "../models/PlantedTree.js";
import DailyChallenge from "../models/DailyChallenge.js";
import CarbonFootprint from "../models/CarbonFootprint.js";

export const getImpactStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const treeCount = await PlantedTree.countDocuments();
    const challengeCount = await DailyChallenge.countDocuments({
      completed: true,
    });

    // Estimate CO2 saved:
    // - 10kg per tree (annual absorption estimate)
    // - 5kg per completed challenge (conservative estimate)
    // - 100g per carbon footprint calculation (awareness bonus - optional, maybe not)
    // Let's stick to trees and challenges for "Saved"
    const co2Saved = treeCount * 10 + challengeCount * 5;

    res.json({
      users: userCount,
      trees: treeCount,
      challenges: challengeCount,
      co2Saved: co2Saved,
    });
  } catch (error) {
    console.error("Error fetching impact stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
