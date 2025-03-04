// Simple Edge Function that uses fetch directly instead of the OpenAI SDK

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

    // Check for API key
    if (!context.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      // Fall back to simple response generation
      const simpleResponse = generateSimpleResponse(message, aboutContent);
      return new Response(
        JSON.stringify({ 
          response: simpleResponse,
          note: "This is a fallback response due to missing API key"
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

    try {
      // Use fetch directly to call OpenAI API instead of using the SDK
      // This avoids Node.js compatibility issues in the Edge runtime
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o", // Upgraded from gpt-4 to gpt-4o
          messages: [
            {
              role: "system",
              content: `You are a personal assistant for Guðjón Kristjánsson. Answer questions based on the following information about him: 
              
              ${aboutContent}
              
              Always respond as if you are representing Guðjón. When referring to him, use "Guðjón" or "he" rather than "I". 
              
              Be helpful, friendly, and professional. If you don't know the answer to a question, say so politely and suggest asking about topics that are covered in his profile.
              
              Keep your responses concise and to the point.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        throw new Error(`OpenAI API error: ${openaiResponse.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await openaiResponse.json();
      const botResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

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
      // Fall back to simple response generation
      const simpleResponse = generateSimpleResponse(message, aboutContent);
      return new Response(
        JSON.stringify({ 
          response: simpleResponse,
          note: "This is a fallback response due to an API error"
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
    
    // Generate a simple response based on keywords as fallback
    try {
      const { message, aboutContent } = await request.json();
      const simpleResponse = generateSimpleResponse(message, aboutContent);
      
      return new Response(
        JSON.stringify({ 
          response: simpleResponse,
          note: "This is a fallback response due to an API error"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (fallbackError) {
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
  }
};

// Generate a simple response based on keywords in the query (fallback)
function generateSimpleResponse(query, aboutContent) {
  try {
    const lowerQuery = query.toLowerCase();
    
    // Basic greetings
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! I'm Guðjón's personal assistant. How can I help you today?";
    }
    
    if (lowerQuery.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about Guðjón?";
    }
    
    // Extract sections using regex patterns
    const extractSection = (sectionName) => {
      try {
        const regex = new RegExp(`## ${sectionName}[\\s\\S]*?((?=## )|$)`, 'i');
        const match = aboutContent.match(regex);
        return match ? match[0].replace(new RegExp(`## ${sectionName}`, 'i'), '').trim() : null;
      } catch (error) {
        return null;
      }
    };
    
    // Check for common question types
    if (lowerQuery.includes('experience') || lowerQuery.includes('work') || lowerQuery.includes('job') || lowerQuery.includes('career')) {
      const workSection = extractSection('Work Experience');
      if (workSection) {
        return `Here's information about Guðjón's work experience:\n\n${workSection}`;
      }
    }
    
    if (lowerQuery.includes('education') || lowerQuery.includes('study') || lowerQuery.includes('degree') || 
        lowerQuery.includes('university') || lowerQuery.includes('school') || lowerQuery.includes('college')) {
      const educationSection = extractSection('Education');
      if (educationSection) {
        return `Here's information about Guðjón's education:\n\n${educationSection}`;
      }
    }
    
    if (lowerQuery.includes('skill') || lowerQuery.includes('technology') || lowerQuery.includes('tech') || 
        lowerQuery.includes('programming') || lowerQuery.includes('language') || lowerQuery.includes('framework')) {
      const skillsSection = extractSection('Technical Skills');
      if (skillsSection) {
        return `Here are Guðjón's technical skills:\n\n${skillsSection}`;
      }
    }
    
    if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('phone') || 
        lowerQuery.includes('reach') || lowerQuery.includes('linkedin')) {
      const contactSection = extractSection('Contact');
      if (contactSection) {
        return `Here's how you can contact Guðjón:\n\n${contactSection}`;
      }
    }
    
    if (lowerQuery.includes('language') || lowerQuery.includes('speak') || lowerQuery.includes('english') || 
        lowerQuery.includes('icelandic') || lowerQuery.includes('danish')) {
      const languageSection = extractSection('Languages');
      if (languageSection) {
        return `Here are the languages Guðjón speaks:\n\n${languageSection}`;
      }
    }
    
    if (lowerQuery.includes('personal') || lowerQuery.includes('about') || lowerQuery.includes('who')) {
      const personalSection = extractSection('Personal Overview');
      if (personalSection) {
        return `Here's some personal information about Guðjón:\n\n${personalSection}`;
      }
    }
    
    // Default response if no specific match
    return "I don't have specific information about that. Would you like to know about Guðjón's education, work experience, technical skills, or languages?";
  } catch (error) {
    return "I'm sorry, I encountered an error while processing your question. Could you try asking something else about Guðjón's background or experience?";
  }
}

export const config = {
  path: "/api/chat-edge"
};