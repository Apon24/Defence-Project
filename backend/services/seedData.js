import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Badge from '../models/Badge.js';
import BlogPost from '../models/BlogPost.js';
import EcoLocation from '../models/EcoLocation.js';
import QuizQuestion from '../models/QuizQuestion.js';

dotenv.config();

const badges = [
  { name: 'First Steps', description: 'Complete your first quiz', icon: 'Award', requirement: 'quiz_count_1' },
  { name: 'Quiz Master', description: 'Complete 10 quizzes', icon: 'Trophy', requirement: 'quiz_count_10' },
  { name: 'Carbon Aware', description: 'Calculate your carbon footprint', icon: 'Leaf', requirement: 'carbon_calc_1' },
  { name: 'Eco Warrior', description: 'Complete 5 daily challenges', icon: 'Target', requirement: 'challenge_count_5' },
  { name: 'Week Streak', description: 'Complete challenges for 7 days in a row', icon: 'Calendar', requirement: 'challenge_streak_7' },
  { name: 'Community Member', description: 'Make your first community post', icon: 'Users', requirement: 'post_count_1' },
  { name: 'Carbon Reducer', description: 'Reduce your footprint by 10%', icon: 'TrendingDown', requirement: 'carbon_reduction_10' }
];

const blogPosts = [
  {
    title: 'Climate Change Impact on Bangladesh',
    content: `Bangladesh is one of the most climate-vulnerable countries in the world. Rising sea levels threaten coastal communities, while extreme weather events are becoming more frequent. This article explores the challenges and solutions for building climate resilience in Bangladesh.

The country faces multiple climate threats including cyclones, floods, and rising temperatures. With 70% of the nation less than one meter above sea level, millions of people are at risk from coastal flooding and storm surges.

Key challenges include:
- Displacement of coastal communities
- Loss of agricultural productivity
- Increased health risks from extreme heat
- Damage to infrastructure and economy

However, Bangladesh is also becoming a leader in climate adaptation, with innovative solutions like floating gardens, cyclone shelters, and early warning systems. Community-based adaptation programs are helping vulnerable populations build resilience.`,
    imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    author: 'Dr. Rashid Ahmed',
    excerpt: 'Exploring the challenges and innovative solutions for building climate resilience in one of the world\'s most vulnerable nations.',
    publishedAt: new Date()
  },
  {
    title: 'Plastic Pollution in Bangladesh Rivers',
    content: `Our rivers are facing a severe plastic pollution crisis. From Dhaka to Chittagong, plastic waste clogs waterways and harms aquatic life. Learn about initiatives to reduce plastic use and promote sustainable alternatives across Bangladesh.

The Buriganga, Turag, and Shitalakshya rivers are among the most polluted waterways in the world. Daily, thousands of tons of plastic waste enter these rivers, threatening both aquatic ecosystems and human health.

The crisis stems from:
- Rapid urbanization and population growth
- Lack of proper waste management systems
- Single-use plastic dependency
- Limited recycling infrastructure

Several initiatives are making progress, including community cleanup programs, plastic bag bans, and promotion of jute-based alternatives. Public awareness campaigns are also encouraging behavioral change.`,
    imageUrl: 'https://images.pexels.com/photos/3856033/pexels-photo-3856033.jpeg',
    author: 'Ayesha Khan',
    excerpt: 'Understanding the plastic pollution crisis in Bangladesh\'s rivers and the initiatives working to address it.',
    publishedAt: new Date()
  },
  {
    title: 'Solar Energy Revolution in Rural Bangladesh',
    content: `Solar home systems have transformed rural Bangladesh, bringing clean electricity to millions. This success story showcases how renewable energy can drive sustainable development and improve lives in off-grid communities.

Over 6 million solar home systems have been installed across rural Bangladesh, providing clean energy to approximately 20 million people. This program has become a model for other developing nations seeking to expand energy access.

Key achievements include:
- Bringing electricity to remote off-grid areas
- Reducing reliance on kerosene and diesel
- Creating thousands of jobs in the solar sector
- Improving quality of life and economic opportunities

The program demonstrates how renewable energy can simultaneously address climate change, energy poverty, and economic development.`,
    imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
    author: 'Md. Karim',
    excerpt: 'How solar home systems are transforming rural communities and providing clean energy access to millions.',
    publishedAt: new Date()
  },
  {
    title: 'Bangladesh Launches Ambitious Climate Adaptation Plan',
    content: `Bangladesh has unveiled a comprehensive climate adaptation strategy aimed at protecting millions of citizens from rising sea levels and extreme weather events. The plan includes investments in coastal protection, early warning systems, and sustainable agriculture practices.

The government's initiative comes as the country faces increasing threats from climate change. With 70% of the nation less than one meter above sea level, Bangladesh is particularly vulnerable to flooding and storm surges.

Key components of the plan include:
- Construction of climate-resilient infrastructure
- Promotion of climate-smart agriculture
- Development of renewable energy projects
- Community-based adaptation programs

Experts say this plan represents a significant step forward in Bangladesh's climate resilience efforts, though implementation will require substantial international support and funding.`,
    author: 'Environmental News Network',
    imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    sourceUrl: 'https://example.com/climate-adaptation-bangladesh',
    sourceName: 'Environmental News Network',
    isExternal: true,
    excerpt: 'Bangladesh unveils comprehensive climate adaptation strategy to protect millions from climate impacts.',
    publishedAt: new Date()
  },
  {
    title: 'Mangrove Restoration Project Protects Coastal Communities',
    content: `A large-scale mangrove restoration project in the Sundarbans is helping protect coastal communities from cyclones and storm surges while sequestering carbon and supporting biodiversity.

The Sundarbans, the world's largest mangrove forest, acts as a natural barrier against extreme weather events. However, deforestation and climate change have threatened this critical ecosystem.

The restoration project involves:
- Planting millions of mangrove saplings
- Community engagement and education
- Sustainable livelihood programs
- Research and monitoring

Early results show promising signs of ecosystem recovery, with increased biodiversity and improved protection for nearby communities. The project demonstrates how nature-based solutions can address both climate mitigation and adaptation.`,
    author: 'Conservation International',
    imageUrl: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg',
    sourceUrl: 'https://example.com/mangrove-restoration',
    sourceName: 'Conservation International',
    isExternal: true,
    excerpt: 'Mangrove restoration in the Sundarbans protects communities and sequesters carbon.',
    publishedAt: new Date()
  },
  {
    title: 'Urban Farming Movement Grows in Dhaka',
    content: `A growing urban farming movement in Dhaka is helping residents grow fresh vegetables while reducing food miles and promoting sustainable living. Rooftop gardens, community plots, and vertical farming systems are transforming the city's landscape.

The movement addresses multiple challenges:
- Food security in urban areas
- Reducing carbon footprint of food transportation
- Improving air quality
- Creating green spaces in dense urban environments

Community organizations and local government are supporting the initiative through training programs, seed distribution, and policy support. The movement is particularly popular among young professionals and families seeking healthier, more sustainable lifestyles.`,
    author: 'Urban Sustainability Magazine',
    imageUrl: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg',
    sourceUrl: 'https://example.com/urban-farming-dhaka',
    sourceName: 'Urban Sustainability Magazine',
    isExternal: true,
    excerpt: 'Rooftop gardens and community plots are bringing sustainable food production to Bangladesh\'s capital.',
    publishedAt: new Date()
  }
];

const ecoLocations = [
  { name: 'Dhaka Recycling Center', description: 'Main recycling facility accepting paper, plastic, and metal waste', latitude: 23.8103, longitude: 90.4125, category: 'Recycling Center', city: 'Dhaka' },
  { name: 'Ramna Park', description: 'Historic green space in the heart of Dhaka, perfect for eco-walks', latitude: 23.7379, longitude: 90.3958, category: 'Park', city: 'Dhaka' },
  { name: 'Chittagong Beach Cleanup Point', description: 'Regular beach cleanup initiative meeting point', latitude: 22.3569, longitude: 91.7832, category: 'Cleanup Site', city: 'Chittagong' },
  { name: 'Botanical Garden Mirpur', description: 'National botanical garden with diverse plant species', latitude: 23.8069, longitude: 90.3635, category: 'Park', city: 'Dhaka' },
  { name: 'Sylhet Tea Garden', description: 'Organic tea plantation promoting sustainable agriculture', latitude: 24.8949, longitude: 91.8687, category: 'Eco Farm', city: 'Sylhet' }
];

const quizQuestions = [
  {
    questionText: 'What percentage of plastic waste in Bangladesh is recycled?',
    difficulty: 'medium',
    category: 'Waste Management',
    points: 10,
    explanation: 'Only about 30% of plastic waste is recycled in Bangladesh, highlighting the need for better waste management systems.',
    answers: [
      { answerText: '10%', isCorrect: false, orderIndex: 0 },
      { answerText: '30%', isCorrect: true, orderIndex: 1 },
      { answerText: '50%', isCorrect: false, orderIndex: 2 },
      { answerText: '70%', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'Which renewable energy source is most suitable for rural Bangladesh?',
    difficulty: 'easy',
    category: 'Energy',
    points: 10,
    explanation: 'Solar energy is most suitable for rural Bangladesh due to abundant sunlight and decreasing costs of solar panels.',
    answers: [
      { answerText: 'Wind Energy', isCorrect: false, orderIndex: 0 },
      { answerText: 'Solar Energy', isCorrect: true, orderIndex: 1 },
      { answerText: 'Hydroelectric Power', isCorrect: false, orderIndex: 2 },
      { answerText: 'Geothermal Energy', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'How many liters of water does an average person in Dhaka use per day?',
    difficulty: 'hard',
    category: 'Water Conservation',
    points: 15,
    explanation: 'The average person in Dhaka uses approximately 120-150 liters of water per day, much of which could be conserved.',
    answers: [
      { answerText: '50-70 liters', isCorrect: false, orderIndex: 0 },
      { answerText: '80-100 liters', isCorrect: false, orderIndex: 1 },
      { answerText: '120-150 liters', isCorrect: true, orderIndex: 2 },
      { answerText: '200-250 liters', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'What is the main cause of air pollution in Dhaka?',
    difficulty: 'easy',
    category: 'Air Quality',
    points: 10,
    explanation: 'Vehicle emissions and brick kilns are the main causes of air pollution in Dhaka, contributing to poor air quality.',
    answers: [
      { answerText: 'Industrial factories', isCorrect: false, orderIndex: 0 },
      { answerText: 'Vehicle emissions and brick kilns', isCorrect: true, orderIndex: 1 },
      { answerText: 'Household waste burning', isCorrect: false, orderIndex: 2 },
      { answerText: 'Power plants', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'How much carbon dioxide does an average tree absorb per year?',
    difficulty: 'medium',
    category: 'Climate Change',
    points: 10,
    explanation: 'An average tree absorbs about 21 kg of CO2 per year, making tree planting an effective climate action.',
    answers: [
      { answerText: '10 kg per year', isCorrect: false, orderIndex: 0 },
      { answerText: '21 kg per year', isCorrect: true, orderIndex: 1 },
      { answerText: '50 kg per year', isCorrect: false, orderIndex: 2 },
      { answerText: '100 kg per year', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'What is the primary greenhouse gas responsible for climate change?',
    difficulty: 'easy',
    category: 'Climate Change',
    points: 10,
    explanation: 'Carbon dioxide (CO2) is the primary greenhouse gas responsible for climate change, mainly from burning fossil fuels.',
    answers: [
      { answerText: 'Oxygen', isCorrect: false, orderIndex: 0 },
      { answerText: 'Carbon Dioxide', isCorrect: true, orderIndex: 1 },
      { answerText: 'Nitrogen', isCorrect: false, orderIndex: 2 },
      { answerText: 'Hydrogen', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'How long does it take for a plastic bottle to decompose in nature?',
    difficulty: 'medium',
    category: 'Waste Management',
    points: 10,
    explanation: 'A plastic bottle takes approximately 450 years to decompose, making plastic waste a major environmental concern.',
    answers: [
      { answerText: '50 years', isCorrect: false, orderIndex: 0 },
      { answerText: '100 years', isCorrect: false, orderIndex: 1 },
      { answerText: '450 years', isCorrect: true, orderIndex: 2 },
      { answerText: '1000 years', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: "What percentage of Bangladesh's population is at risk from climate change impacts?",
    difficulty: 'hard',
    category: 'Climate Change',
    points: 15,
    explanation: "Approximately 70% of Bangladesh's population is at risk from climate change impacts, particularly from flooding and sea level rise.",
    answers: [
      { answerText: '30%', isCorrect: false, orderIndex: 0 },
      { answerText: '50%', isCorrect: false, orderIndex: 1 },
      { answerText: '70%', isCorrect: true, orderIndex: 2 },
      { answerText: '90%', isCorrect: false, orderIndex: 3 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Badge.deleteMany({});
    await BlogPost.deleteMany({});
    await EcoLocation.deleteMany({});
    await QuizQuestion.deleteMany({});

    // Seed data
    await Badge.insertMany(badges);
    console.log('Badges seeded');

    await BlogPost.insertMany(blogPosts);
    console.log('Blog posts seeded');

    await EcoLocation.insertMany(ecoLocations);
    console.log('Eco locations seeded');

    await QuizQuestion.insertMany(quizQuestions);
    console.log('Quiz questions seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

