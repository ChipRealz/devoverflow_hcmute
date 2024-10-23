import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
      const { question } = await request.json();
  
      if (!question) {
        throw new Error('Question not provided');
      }
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable assistant that provides quality information.',
            },
            {
              role: 'user',
              content: `Tell me ${question}`,
            },
          ],
        }),
      });
  
      const responseData = await response.json();
  
      // Log the full response for debugging
      console.log('API Response:', responseData);
  
      const reply = responseData.choices?.[0]?.message?.content;
  
      if (!reply) {
        return NextResponse.json({ error: 'No reply from AI' });
      }
  
      return NextResponse.json({ reply });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ error: error.message });
    }
  };
  