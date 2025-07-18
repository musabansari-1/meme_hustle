const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

async function generateAICaption(memeTitle, tags) {
  try {
    const prompt = `Generate a funny and engaging caption for a meme with the title: "${memeTitle}" and relevant tags: ${tags.join(', ')}. Keep it concise and within 20 words.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating AI caption:", error);
    return ""; // Return empty string on error
  }
}

async function generateAIVibe(memeTitle, tags) {
  try {
    const prompt = `Describe the overall vibe or mood of a meme with the title: "${memeTitle}" and relevant tags: ${tags.join(', ')}. Use 2-3 words. Examples: 'Wholesome Fun', 'Dark Humor', 'Relatable Chaos'.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating AI vibe:", error);
    return ""; // Return empty string on error
  }
}

module.exports = { generateAICaption, generateAIVibe }; 