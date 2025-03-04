/**
 * Text processing utilities for the chatbot
 */

// Extract a section from the about content
export function extractSection(content: string, sectionName: string): string | null {
  try {
    const regex = new RegExp(`## ${sectionName}[\\s\\S]*?((?=## )|$)`, 'i');
    const match = content.match(regex);
    return match ? match[0].replace(new RegExp(`## ${sectionName}`, 'i'), '').trim() : null;
  } catch (error) {
    console.error(`Error extracting section ${sectionName}:`, error);
    return null;
  }
}

// Generate a simple response based on keywords in the query
export function generateLocalResponse(query: string, aboutContent: string): string {
  try {
    const lowerQuery = query.toLowerCase();
    
    // Basic greetings
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! I'm Guðjón's personal assistant. How can I help you today?";
    }
    
    if (lowerQuery.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about Guðjón?";
    }
    
    // Check for common question types
    if (lowerQuery.includes('experience') || lowerQuery.includes('work') || lowerQuery.includes('job') || lowerQuery.includes('career')) {
      const workSection = extractSection(aboutContent, 'Work Experience');
      if (workSection) {
        return `Here's information about Guðjón's work experience:\n\n${workSection}`;
      }
    }
    
    if (lowerQuery.includes('education') || lowerQuery.includes('study') || lowerQuery.includes('degree') || 
        lowerQuery.includes('university') || lowerQuery.includes('school') || lowerQuery.includes('college')) {
      const educationSection = extractSection(aboutContent, 'Education');
      if (educationSection) {
        return `Here's information about Guðjón's education:\n\n${educationSection}`;
      }
    }
    
    if (lowerQuery.includes('skill') || lowerQuery.includes('technology') || lowerQuery.includes('tech') || 
        lowerQuery.includes('programming') || lowerQuery.includes('language') || lowerQuery.includes('framework')) {
      const skillsSection = extractSection(aboutContent, 'Technical Skills');
      if (skillsSection) {
        return `Here are Guðjón's technical skills:\n\n${skillsSection}`;
      }
    }
    
    if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('phone') || 
        lowerQuery.includes('reach') || lowerQuery.includes('linkedin')) {
      const contactSection = extractSection(aboutContent, 'Contact');
      if (contactSection) {
        return `Here's how you can contact Guðjón:\n\n${contactSection}`;
      }
    }
    
    if (lowerQuery.includes('language') || lowerQuery.includes('speak') || lowerQuery.includes('english') || 
        lowerQuery.includes('icelandic') || lowerQuery.includes('danish')) {
      const languageSection = extractSection(aboutContent, 'Languages');
      if (languageSection) {
        return `Here are the languages Guðjón speaks:\n\n${languageSection}`;
      }
    }
    
    if (lowerQuery.includes('personal') || lowerQuery.includes('about') || lowerQuery.includes('who')) {
      const personalSection = extractSection(aboutContent, 'Personal Overview');
      if (personalSection) {
        return `Here's some personal information about Guðjón:\n\n${personalSection}`;
      }
    }
    
    // Default response if no specific match
    return "I don't have specific information about that. Would you like to know about Guðjón's education, work experience, technical skills, or languages?";
  } catch (error) {
    console.error("Error in generateLocalResponse:", error);
    return "I'm sorry, I encountered an error while processing your question. Could you try asking something else about Guðjón's background or experience?";
  }
}