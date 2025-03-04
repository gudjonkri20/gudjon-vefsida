/**
 * Text processing utilities for the chatbot
 */

// Split text into chunks of roughly equal size
export function splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 100): string[] {
  const chunks: string[] = [];
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
export function findRelevantChunks(query: string, chunks: string[], topK: number = 3): string[] {
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

// Generate a local response based on the query and about content
export function generateLocalResponse(query: string, aboutContent: string): string {
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
    const extractSection = (sectionName: string): string | null => {
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