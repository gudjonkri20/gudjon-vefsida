// Simple implementation for edge functions that doesn't rely on OpenAI SDK
// This avoids the global reference issues

// Helper functions for text processing
function splitTextIntoChunks(text, chunkSize = 1000, overlap = 100) {
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + chunkSize;
    
    // If we're not at the end of the text, try to find a good break point
    if (endIndex < text.length) {
      // Look for paragraph breaks, line breaks, or sentence endings
      const breakPoints = [
        text.lastIndexOf('\n\n', endIndex), // Paragraph break
        text.lastIndexOf('\n', endIndex),   // Line break
        text.lastIndexOf('. ', endIndex),   // Sentence ending
        text.lastIndexOf('? ', endIndex),   // Question ending
        text.lastIndexOf('! ', endIndex),   // Exclamation ending
      ].filter(point => point > startIndex && point < endIndex);
      
      if (breakPoints.length > 0) {
        // Use the latest break point
        endIndex = Math.max(...breakPoints) + 1;
      }
    } else {
      endIndex = text.length;
    }
    
    // Add the chunk
    chunks.push(text.substring(startIndex, endIndex).trim());
    
    // Move start index for next chunk, accounting for overlap
    startIndex = endIndex - overlap;
    
    // Make sure we're making progress
    if (startIndex >= text.length || endIndex === startIndex) {
      break;
    }
  }
  
  return chunks;
}

function findRelevantChunks(query, chunks, topK = 3) {
  // Normalize and tokenize the query
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery.split(/\s+/).filter(token => token.length > 3);
  
  // Score each chunk based on keyword matches
  const scoredChunks = chunks.map(chunk => {
    const normalizedChunk = chunk.toLowerCase();
    let score = 0;
    
    // Score based on exact query match
    if (normalizedChunk.includes(normalizedQuery)) {
      score += 10;
    }
    
    // Score based on individual keyword matches
    for (const token of queryTokens) {
      if (token.length > 3) { // Only consider meaningful words
        const matches = normalizedChunk.match(new RegExp(`\\b${token}\\b`, 'gi'));
        if (matches) {
          score += matches.length;
        }
      }
    }
    
    // Bonus for section headers that match query terms
    const sectionMatches = normalizedChunk.match(/^#+\s+.*$/gm);
    if (sectionMatches) {
      for (const section of sectionMatches) {
        for (const token of queryTokens) {
          if (section.toLowerCase().includes(token)) {
            score += 5;
          }
        }
      }
    }
    
    return { chunk, score };
  });
  
  // Sort by score and take top K
  const sortedChunks = scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
  
  return sortedChunks;
}

// Generate a simple fallback response if OpenAI API fails
function generateFallbackResponse(query, aboutContent) {
  try {
    const lowerQuery = query.toLowerCase();
    
    // Split the content into chunks
    const chunks = splitTextIntoChunks(aboutContent);
    
    // Find relevant chunks
    const relevantChunks = findRelevantChunks(query, chunks);
    
    if (relevantChunks.length === 0) {
      return "I don't have specific information about that. Would you like to know about Guðjón's education, work experience, technical skills, or languages?";
    }
    
    // Basic response based on relevant chunks
    return `Here's what I found about "${query}":\n\n${relevantChunks.join('\n\n---\n\n')}`;
  } catch (error) {
    return "I'm sorry, I encountered an error while processing your question. Could you try asking something else about Guðjón's background or experience?";
  }
}

export default async (request, context) => {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    // Parse the request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request body", 
          details: "Could not parse JSON" 
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const { message, aboutContent } = requestBody;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (!aboutContent || aboutContent.trim() === '') {
      return new Response(
        JSON.stringify({ error: "About content is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Log environment variables for debugging (without exposing sensitive data)
    console.log("Environment variables available:", Object.keys(context.env).join(", "));
    console.log("OPENAI_API_KEY exists:", !!context.env.OPENAI_API_KEY);
    
    // Check for API key
    if (!context.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in edge function environment");
      
      // Generate a fallback response instead of failing
      const fallbackResponse = generateFallbackResponse(message, aboutContent);
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          warning: "Using fallback response generator (API key not configured)"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Use direct fetch to OpenAI API instead of the SDK
    console.log("Sending request to OpenAI API with model: gpt-3.5-turbo");
    
    // Split the about content into chunks to find the most relevant information
    const chunks = splitTextIntoChunks(aboutContent);
    const relevantChunks = findRelevantChunks(message, chunks, 3);
    const contextualInfo = relevantChunks.join('\n\n---\n\n');
    
    try {
      // Make direct API call to OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a personal assistant for Guðjón Kristjánsson. Answer questions based on the following information about him: 
              
              ${contextualInfo}
              
              Always respond as if you are representing Guðjón. When referring to him, use "Guðjón" or "he" rather than "I". 
              
              Be helpful, friendly, and professional. If you don't know the answer to a question, say so politely and suggest asking about topics that are covered in his profile.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }

      const openaiData = await openaiResponse.json();
      console.log("OpenAI Response received from gpt-3.5-turbo");
      
      const botResponse = openaiData.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      return new Response(
        JSON.stringify({ response: botResponse }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (openaiError) {
      console.error("OpenAI API Error:", openaiError);
      
      // Generate a fallback response
      const fallbackResponse = generateFallbackResponse(message, aboutContent);
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          warning: "Using fallback response generator (OpenAI API error)"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

export const config = {
  path: "/api/chat-edge"
};