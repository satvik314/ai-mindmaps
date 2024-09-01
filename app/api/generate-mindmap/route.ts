import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const MindmapNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  title: z.string(),
  description: z.string().nullable(),
  children: z.array(MindmapNodeSchema).default([])
}));

const MindmapSchema = z.object({
  title: z.string(),
  root: MindmapNodeSchema
});

export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  console.log('Received topic:', topic);

  try {
    const { object: mindmapData } = await generateObject({
      model: groq('llama-3.1-70b-versatile'),
      system: "You are an AI assistant specialized in creating detailed and informative mindmaps. When given a topic, generate a structured mindmap as a JSON object. Include descriptive titles and informative descriptions for each node. Aim for depth and breadth in the mindmap structure.",
      prompt: `Create a comprehensive and detailed mindmap for the topic: "${topic}". Include a main title, a root node, and at least three levels of child nodes where applicable. Provide informative descriptions for each node.`,
      schema: MindmapSchema,
    });

    console.log('Generated mindmap data:', JSON.stringify(mindmapData, null, 2));
    return NextResponse.json(mindmapData);
  } catch (error) {
    console.error('Error generating mindmap:', error);
    return NextResponse.json({ error: 'Failed to generate mindmap' }, { status: 500 });
  }
}