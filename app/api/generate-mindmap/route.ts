import { NextResponse } from 'next/server';

// This is a mock function. Replace it with your actual AI-powered mindmap generation logic
function generateMindmap(topic: string) {
  return {
    root: {
      title: topic,
      description: `This is a mindmap about ${topic}`,
      children: [
        {
          title: `Aspect 1 of ${topic}`,
          description: 'Description of aspect 1',
          children: [
            { title: 'Sub-aspect 1.1', description: 'Description of sub-aspect 1.1' },
            { title: 'Sub-aspect 1.2', description: 'Description of sub-aspect 1.2' },
          ]
        },
        {
          title: `Aspect 2 of ${topic}`,
          description: 'Description of aspect 2',
          children: [
            { title: 'Sub-aspect 2.1', description: 'Description of sub-aspect 2.1' },
            { title: 'Sub-aspect 2.2', description: 'Description of sub-aspect 2.2' },
          ]
        },
      ]
    }
  };
}

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const mindmapData = generateMindmap(topic);
    
    return NextResponse.json(mindmapData);
  } catch (error) {
    console.error('Error in generate-mindmap API:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the mindmap.' },
      { status: 500 }
    );
  }
}