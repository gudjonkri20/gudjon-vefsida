// Import OpenAI with CommonJS syntax for better compatibility with Netlify Functions
const { OpenAI } = require("openai");

// Suppress punycode deprecation warning
process.noDeprecation = true;

// Polyfill global for Node.js environments where it might not be defined
if (typeof global === 'undefined') {
  global = {};
}

exports.handler = async function(event, context) {
  console.log("Function invoked with method:", event.httpMethod);
  
  // Handle OPTIONS request for CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || "{}");
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          error: "Invalid request body", 
          details: "Could not parse JSON" 
        }),
      };
    }

    const { message, aboutContent } = requestBody;

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    if (!aboutContent || aboutContent.trim() === '') {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "About content is required" }),
      };
    }

    // Debug API key information
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
    console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
    console.log("OPENAI_API_KEY first 4 chars:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 4) : "none");
    
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      
      // Generate a fallback response
      const fallbackResponse = generateLocalResponse(message, aboutContent);
      
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          response: fallbackResponse,
          warning: "Using fallback response generator (API key not configured)"
        }),
      };
    }

    // Initialize OpenAI client with CommonJS configuration
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: false // Ensure server-side only
    });
    
    console.log("Sending request to OpenAI API with model: gpt-3.5-turbo");
    
    // Split the about content into chunks to find the most relevant information
    const chunks = splitTextIntoChunks(aboutContent);
    const relevantChunks = findRelevantChunks(message, chunks, 3);
    const contextualInfo = relevantChunks.join('\n\n---\n\n');
    
    try {
      // Use the chat completions API with gpt-3.5-turbo
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a personal assistant for Guðjón Kristjánsson. Answer questions based on the following information about him: 
            
            ${contextualInfo}
            
            Always respond as if you are representing Guðjón. When referring to him, use "Guðjón" or "he" rather than "I". 
            
            Be helpful, friendly, and professional. If you don't know the answer to a question, say so politely and suggest asking about topics that are covered in his profile.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      console.log("OpenAI Response received from gpt-3.5-turbo");
      
      const botResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ response: botResponse }),
      };
    } catch (openaiError) {
      console.error("OpenAI API Error:", openaiError);
      
      // Generate a fallback response
      const fallbackResponse = generateLocalResponse(message, aboutContent);
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          response: fallbackResponse,
          warning: "Using fallback response generator (OpenAI API error)"
        }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : String(error) 
      }),
    };
  }
};

// Generate a local response based on the query and about content
function generateLocalResponse(query, aboutContent) {
  try {
    const lowerQuery = query.toLowerCase();
    
    // Split the content into chunks
    const chunks = splitTextIntoChunks(aboutContent);
    
    // Find relevant chunks
    const relevantChunks = findRelevantChunks(query, chunks);
    
    if (relevantChunks.length === 0) {
      // Handle case where no relevant chunks were found
      return "I don't have specific information about that. Would you like to know about Guðjón's education, work experience, technical skills, or languages?";
    }
    
    // Extract sections using more robust regex patterns
    const extractSection = (sectionName) => {
      try {
        const regex = new RegExp(`## ${sectionName}[\\s\\S]*?((?=## )|$)`, 'i');
        const match = aboutContent.match(regex);
        return match ? match[0] : null;
      } catch (error) {
        console.error(`Error extracting section ${sectionName}:`, error);
        return null;
      }
    };
    
    // Check for common question types
    if (lowerQuery.includes('experience') || lowerQuery.includes('work') || lowerQuery.includes('job') || lowerQuery.includes('career')) {
      const workSection = extractSection('Work Experience');
      if (workSection) {
        return `Here's information about Guðjón's work experience:\n${workSection.replace(/## Work Experience/i, '').trim()}`;
      }
    }
    
    if (lowerQuery.includes('education') || lowerQuery.includes('study') || lowerQuery.includes('degree') || 
        lowerQuery.includes('university') || lowerQuery.includes('school') || lowerQuery.includes('college')) {
      const educationSection = extractSection('Education');
      if (educationSection) {
        return `Here's information about Guðjón's education:\n${educationSection.replace(/## Education/i, '').trim()}`;
      }
    }
    
    if (lowerQuery.includes('skill') || lowerQuery.includes('technology') || lowerQuery.includes('tech') || 
        lowerQuery.includes('programming') || lowerQuery.includes('language') || lowerQuery.includes('framework')) {
      const skillsSection = extractSection('Technical Skills');
      if (skillsSection) {
        return `Here are Guðjón's technical skills:\n${skillsSection.replace(/## Technical Skills/i, '').trim()}`;
      }
    }
    
    // Basic greetings
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! I'm Guðjón's personal assistant. How can I help you today?";
    }
    
    if (lowerQuery.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about Guðjón?";
    }
    
    // If we have relevant chunks but no specific section match, create a response from the chunks
    const relevantInfo = relevantChunks.map(chunk => {
      // Try to extract a section title if present
      const sectionMatch = chunk.match(/^#+\s+(.*?)$/m);
      const sectionTitle = sectionMatch ? sectionMatch[1] : "Relevant information";
      
      // Clean up the chunk for presentation
      const cleanedChunk = chunk.replace(/^#+\s+.*?$/m, '').trim();
      
      return `**${sectionTitle}**\n${cleanedChunk}`;
    }).join('\n\n');
    
    return `Here's what I found about "${query}":\n\n${relevantInfo}`;
  } catch (error) {
    console.error("Error in generateLocalResponse:", error);
    return "I'm sorry, I encountered an error while processing your question. Could you try asking something else about Guðjón's background or experience?";
  }
}

// Split text into chunks of roughly equal size
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

// Simple keyword-based search to find relevant chunks
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