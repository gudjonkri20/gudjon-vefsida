const { OpenAI } = require("openai");

// Suppress punycode deprecation warning
process.noDeprecation = true;

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

    // Generate a simple response based on keywords in the query
    const simpleResponse = generateSimpleResponse(message, aboutContent);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ 
        response: simpleResponse,
        note: "This is a response from the Netlify function"
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    
    // Generate a simple response based on keywords as fallback
    try {
      const { message, aboutContent } = JSON.parse(event.body || "{}");
      const simpleResponse = generateSimpleResponse(message, aboutContent);
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          response: simpleResponse,
          note: "This is a fallback response due to an API error"
        }),
      };
    } catch (fallbackError) {
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
        console.error(`Error extracting section ${sectionName}:`, error);
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
    console.error("Error in generateSimpleResponse:", error);
    return "I'm sorry, I encountered an error while processing your question. Could you try asking something else about Guðjón's background or experience?";
  }
}