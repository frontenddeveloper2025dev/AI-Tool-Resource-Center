import { table } from '@devvai/devv-code-backend';

export const sampleTools = [
  {
    tool_name: 'ChatGPT',
    category: 'text_generation',
    description: 'Advanced conversational AI for text generation, coding, and problem-solving',
    website_url: 'https://chat.openai.com',
    average_rating: 4.5,
    total_reviews: 156,
    five_star_count: 89,
    four_star_count: 45,
    three_star_count: 15,
    two_star_count: 5,
    one_star_count: 2,
    trending: 'hot',
    featured: 'true',
    last_updated: new Date().toISOString()
  },
  {
    tool_name: 'DALL-E 3',
    category: 'image_generation',
    description: 'AI-powered image generation from text descriptions',
    website_url: 'https://openai.com/dall-e-3',
    average_rating: 4.3,
    total_reviews: 98,
    five_star_count: 52,
    four_star_count: 31,
    three_star_count: 10,
    two_star_count: 3,
    one_star_count: 2,
    trending: 'rising',
    featured: 'true',
    last_updated: new Date().toISOString()
  },
  {
    tool_name: 'Midjourney',
    category: 'image_generation',
    description: 'Independent research lab producing AI-generated artworks',
    website_url: 'https://www.midjourney.com',
    average_rating: 4.7,
    total_reviews: 234,
    five_star_count: 178,
    four_star_count: 42,
    three_star_count: 10,
    two_star_count: 3,
    one_star_count: 1,
    trending: 'hot',
    featured: 'true',
    last_updated: new Date().toISOString()
  },
  {
    tool_name: 'Claude',
    category: 'text_generation',
    description: 'AI assistant by Anthropic for helpful, harmless, and honest conversations',
    average_rating: 4.4,
    total_reviews: 87,
    five_star_count: 45,
    four_star_count: 28,
    three_star_count: 10,
    two_star_count: 3,
    one_star_count: 1,
    trending: 'rising',
    featured: 'false',
    last_updated: new Date().toISOString()
  },
  {
    tool_name: 'Stable Diffusion',
    category: 'image_generation',
    description: 'Open-source deep learning text-to-image model',
    average_rating: 4.2,
    total_reviews: 145,
    five_star_count: 67,
    four_star_count: 48,
    three_star_count: 20,
    two_star_count: 7,
    one_star_count: 3,
    trending: 'stable',
    featured: 'false',
    last_updated: new Date().toISOString()
  },
  {
    tool_name: 'Whisper',
    category: 'speech_recognition',
    description: 'Automatic speech recognition system by OpenAI',
    average_rating: 4.6,
    total_reviews: 76,
    five_star_count: 48,
    four_star_count: 20,
    three_star_count: 6,
    two_star_count: 1,
    one_star_count: 1,
    trending: 'stable',
    featured: 'false',
    last_updated: new Date().toISOString()
  }
];

export const sampleReviews = [
  {
    tool_name: 'ChatGPT',
    category: 'text_generation',
    rating: 5,
    review_text: 'Absolutely incredible tool for productivity. I use it daily for coding, writing, and problem-solving. The responses are coherent and helpful.',
    reviewer_name: 'Alex Developer',
    reviewer_email: 'alex@example.com',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    helpful_votes: 12,
    verified_user: 'true',
    pros: JSON.stringify(['Fast responses', 'Great for coding', 'Versatile use cases']),
    cons: JSON.stringify(['Can be verbose sometimes', 'Requires fact-checking'])
  },
  {
    tool_name: 'ChatGPT',
    category: 'text_generation',
    rating: 4,
    review_text: 'Very useful for brainstorming and getting unstuck on problems. Sometimes gives outdated information but overall excellent.',
    reviewer_name: 'Sarah Writer',
    reviewer_email: 'sarah@example.com',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful_votes: 8,
    verified_user: 'true',
    pros: JSON.stringify(['Creative suggestions', 'Good explanations', 'Easy to use']),
    cons: JSON.stringify(['Knowledge cutoff', 'Sometimes confident when wrong'])
  },
  {
    tool_name: 'Midjourney',
    category: 'image_generation',
    rating: 5,
    review_text: 'The quality of images generated is simply stunning. Perfect for creative projects and concept art. The Discord interface takes some getting used to though.',
    reviewer_name: 'Mike Artist',
    reviewer_email: 'mike@example.com',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    helpful_votes: 15,
    verified_user: 'true',
    pros: JSON.stringify(['Exceptional image quality', 'Great for artistic work', 'Active community']),
    cons: JSON.stringify(['Discord-only interface', 'Can be expensive', 'Learning curve'])
  },
  {
    tool_name: 'DALL-E 3',
    category: 'image_generation',
    rating: 4,
    review_text: 'Great integration with ChatGPT and produces high-quality images. Good at following detailed prompts but can be hit or miss.',
    reviewer_name: 'Emma Designer',
    reviewer_email: 'emma@example.com',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpful_votes: 6,
    verified_user: 'true',
    pros: JSON.stringify(['ChatGPT integration', 'High resolution', 'Good prompt understanding']),
    cons: JSON.stringify(['Limited style control', 'Can refuse some prompts'])
  }
];

export async function seedDatabase() {
  try {
    console.log('Seeding tool ratings...');
    for (const tool of sampleTools) {
      await table.addItem('evtx4xudlnnk', tool);
    }

    console.log('Seeding reviews...');
    for (const review of sampleReviews) {
      await table.addItem('evtx4fco5u68', review);
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}