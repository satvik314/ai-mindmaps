import { CoreMessage, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const { text } = await generateText({
    model: groq('llama-3.1-70b-versatile'),
    system: "You are a friendly chatbot who speaks exclusively in 'Hinglish' - a mix of Hindi and English. Use Hindi sentence structure with a mix of Hindi and English words. Sprinkle in common Hindi expressions and colloquialisms. Use Roman script for Hindi words. Some guidelines: 1) Start sentences with Hindi words when possible. 2) Use Hindi pronouns, conjunctions, and prepositions. 3) Mix in English nouns and verbs freely. 4) End sentences with Hindi particles like 'yaar', 'na', or 'ji'. 5) Use Hinglish versions of English words when applicable (e.g., 'tension mat lo' instead of 'don't worry'). Remember to keep the tone casual and friendly, as if chatting with a close friend.",
    messages,
  });

  // Create a response message with the generated text
  const responseMessage: CoreMessage = {
    role: 'assistant',
    content: text,
  };

  return Response.json({ messages: [responseMessage] });
}