import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a blog post using OpenAI GPT-4
 * @route POST /api/ai/generate-post
 * @access Private/Admin
 */
export const generatePost = async (req, res) => {
    try {
        const { title, topic, keywords, categoryName } = req.body;

        // Validation
        if (!title || !topic) {
            return res.status(400).json({
                success: false,
                message: 'Title and topic are required'
            });
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.'
            });
        }

        console.log(`🤖 Generating AI post: "${title}"`);

        // Build comprehensive prompt
        const systemPrompt = `You are a professional blog content writer for ProperPakistan.com. 
Write high-quality, engaging, and SEO-optimized blog posts in a conversational yet informative tone.
Format your response as valid HTML with proper semantic tags (h2, h3, p, ul, ol, strong, em).
Include relevant headings, subheadings, and well-structured paragraphs.`;

        const userPrompt = `Write a comprehensive blog post with the following details:

Title: ${title}
Topic: ${topic}
${keywords ? `Keywords to include: ${keywords}` : ''}
${categoryName ? `Category: ${categoryName}` : ''}

Requirements:
- Article length: 1000-1500 words
- Include an engaging introduction
- Use 3-5 main sections with descriptive headings (h2 tags)
- Add relevant subheadings (h3 tags) where appropriate
- Write in a clear, accessible style
- Include actionable insights or takeaways
- End with a strong conclusion
- Format using HTML tags (h2, h3, p, ul, ol, strong, em)

Write the article now:`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Cost-effective and fast
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7, // Balanced creativity
            max_tokens: 2500, // ~1500 words
        });

        const generatedContent = completion.choices[0].message.content;

        // Generate SEO metadata
        const seoPrompt = `Based on this blog post title "${title}" and topic "${topic}", generate:
1. An SEO-optimized title (under 60 characters)
2. A meta description (under 160 characters)
3. 5 relevant tags (comma-separated)

Format your response as JSON:
{
  "seoTitle": "...",
  "seoDescription": "...",
  "tags": "tag1, tag2, tag3, tag4, tag5"
}`;

        const seoCompletion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: seoPrompt }],
            temperature: 0.5,
            max_tokens: 200,
        });

        let seoData;
        try {
            seoData = JSON.parse(seoCompletion.choices[0].message.content);
        } catch (e) {
            // Fallback if JSON parsing fails
            seoData = {
                seoTitle: title.substring(0, 60),
                seoDescription: `Read our comprehensive guide about ${topic}`,
                tags: keywords || 'blog, article'
            };
        }

        // Generate excerpt (first 200 characters of content without HTML)
        const excerpt = generatedContent
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .substring(0, 200)
            .trim() + '...';

        console.log('✅ AI post generated successfully');

        res.json({
            success: true,
            data: {
                content: generatedContent,
                excerpt: excerpt,
                seoTitle: seoData.seoTitle,
                seoDescription: seoData.seoDescription,
                tags: seoData.tags,
                generatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ OpenAI API Error:', error);

        // Handle specific OpenAI errors
        if (error.code === 'insufficient_quota') {
            return res.status(402).json({
                success: false,
                message: 'OpenAI API quota exceeded. Please check your billing.'
            });
        }

        if (error.code === 'invalid_api_key') {
            return res.status(401).json({
                success: false,
                message: 'Invalid OpenAI API key. Please check your configuration.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to generate post with AI',
            error: error.message
        });
    }
};
