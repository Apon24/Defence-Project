import BlogPost from '../models/BlogPost.js';

// Sample environmental blog posts from online sources
// In production, you would fetch from RSS feeds, news APIs, or web scraping
const ENVIRONMENTAL_NEWS_SOURCES = [
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
    excerpt: 'Bangladesh unveils comprehensive climate adaptation strategy to protect millions from climate impacts.'
  },
  {
    title: 'Solar Power Revolution Transforms Rural Bangladesh',
    content: `Rural communities across Bangladesh are experiencing a solar energy revolution, with millions of households now powered by clean, renewable energy. This transformation has brought electricity to remote areas previously off the grid.

The success of Bangladesh's solar home system program has made it a model for other developing nations. Over 6 million solar home systems have been installed, providing clean energy to approximately 20 million people.

Benefits include:
- Reduced reliance on fossil fuels
- Lower greenhouse gas emissions
- Improved quality of life in rural areas
- Economic opportunities through solar entrepreneurship

The program has also created thousands of jobs in the renewable energy sector, contributing to sustainable economic development while addressing climate change.`,
    author: 'Renewable Energy Today',
    imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
    sourceUrl: 'https://example.com/solar-bangladesh',
    sourceName: 'Renewable Energy Today',
    isExternal: true,
    excerpt: 'Millions of rural Bangladeshis now have access to clean solar energy, transforming lives and reducing emissions.'
  },
  {
    title: 'Plastic Waste Crisis: Bangladesh Rivers Under Threat',
    content: `Bangladesh's rivers are facing an unprecedented plastic pollution crisis. Major waterways including the Buriganga, Turag, and Shitalakshya are choked with plastic waste, threatening aquatic ecosystems and public health.

Recent studies show that Bangladesh generates over 3,000 tons of plastic waste daily, with a significant portion ending up in rivers and waterways. The problem is particularly acute in urban areas like Dhaka.

Environmental groups are calling for urgent action:
- Implementation of plastic waste management systems
- Promotion of reusable alternatives
- Public awareness campaigns
- Strict enforcement of waste disposal regulations

Several initiatives are underway, including community cleanup programs and partnerships with international organizations to develop sustainable waste management solutions.`,
    author: 'Water & Environment Journal',
    imageUrl: 'https://images.pexels.com/photos/3856033/pexels-photo-3856033.jpeg',
    sourceUrl: 'https://example.com/plastic-pollution-bangladesh',
    sourceName: 'Water & Environment Journal',
    isExternal: true,
    excerpt: 'Urgent action needed as plastic waste threatens Bangladesh\'s vital river systems and aquatic life.'
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
    excerpt: 'Mangrove restoration in the Sundarbans protects communities and sequesters carbon.'
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
    excerpt: 'Rooftop gardens and community plots are bringing sustainable food production to Bangladesh\'s capital.'
  },
  {
    title: 'Bangladesh Advances in Climate Finance Access',
    content: `Bangladesh has made significant progress in accessing international climate finance, securing funding for adaptation and mitigation projects. The country has become a leader among developing nations in climate finance mobilization.

Recent achievements include:
- Access to Green Climate Fund resources
- Development of climate finance tracking systems
- Transparent reporting mechanisms
- Successful project implementation

These funds support critical initiatives including flood management, renewable energy, and climate-resilient infrastructure. The success demonstrates how developing countries can effectively access and utilize climate finance to build resilience.`,
    author: 'Climate Finance Watch',
    imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    sourceUrl: 'https://example.com/climate-finance-bangladesh',
    sourceName: 'Climate Finance Watch',
    isExternal: true,
    excerpt: 'Bangladesh leads developing nations in accessing and utilizing international climate finance.'
  }
];

// @desc    Fetch and import blog posts from online sources
// This function simulates fetching from RSS feeds or news APIs
export const fetchAndImportBlogPosts = async () => {
  try {
    const importedPosts = [];
    const errors = [];

    for (const postData of ENVIRONMENTAL_NEWS_SOURCES) {
      try {
        // Check if post already exists (by title)
        const existingPost = await BlogPost.findOne({ title: postData.title });
        
        if (existingPost) {
          console.log(`Post "${postData.title}" already exists, skipping...`);
          continue;
        }

        // Create new blog post
        const newPost = await BlogPost.create({
          title: postData.title,
          content: postData.content,
          author: postData.author,
          imageUrl: postData.imageUrl,
          sourceUrl: postData.sourceUrl,
          sourceName: postData.sourceName,
          isExternal: postData.isExternal,
          excerpt: postData.excerpt,
          publishedAt: new Date()
        });

        importedPosts.push(newPost);
        console.log(`Imported: ${postData.title}`);
      } catch (error) {
        console.error(`Error importing post "${postData.title}":`, error);
        errors.push({ title: postData.title, error: error.message });
      }
    }

    return {
      success: true,
      imported: importedPosts.length,
      errors: errors.length,
      details: {
        importedPosts,
        errors
      }
    };
  } catch (error) {
    console.error('Error in fetchAndImportBlogPosts:', error);
    throw error;
  }
};

// @desc    Fetch latest blog posts (can be called periodically)
export const fetchLatestBlogPosts = async () => {
  // In production, this would:
  // 1. Connect to RSS feeds or news APIs
  // 2. Parse articles
  // 3. Filter for environmental/Bangladesh-related content
  // 4. Import new articles
  
  return await fetchAndImportBlogPosts();
};

