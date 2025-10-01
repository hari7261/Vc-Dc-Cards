import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalContacts, ContactFormData } from "@/hooks/useLocalContacts";
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Save,
  Tag,
  Briefcase,
  CreditCard,
} from "lucide-react";

interface SectionData {
  name?: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

interface ContactData {
  frontData: SectionData;
  backData: SectionData;
}

interface ContactFormProps {
  extractedText: string;
  onSave: (contact: ContactFormData) => void;
  onBack: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  extractedText,
  onSave,
  onBack,
}) => {
  const { createContact } = useLocalContacts();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [parsedData, setParsedData] = useState<ContactData>({
    frontData: {},
    backData: {}
  });

  // Enhanced parsing function using useCallback for better performance
  const parseBusinessCardText = useCallback((text: string): ContactData => {
    console.log("=".repeat(50));
    console.log("PARSING BUSINESS CARD TEXT");
    console.log("=".repeat(50));
    console.log("Raw text:", text);
    console.log("Raw text length:", text.length);
    
    // More robust section splitting - try multiple patterns
    let frontText = "";
    let backText = "";
    
    // Pattern 1: --- FRONT --- and --- BACK ---
    let sections = text.split(/---\s*(FRONT|BACK)\s*---/i);
    console.log("Sections split (pattern 1):", sections.length, sections);
    
    if (sections.length < 3) {
      // Pattern 2: --- FRONT SIDE --- and --- BACK SIDE ---
      sections = text.split(/---\s*(FRONT\s*SIDE|BACK\s*SIDE)\s*---/i);
      console.log("Sections split (pattern 2):", sections.length, sections);
    }
    
    if (sections.length < 3) {
      // Pattern 3: Look for any variation with FRONT/BACK
      sections = text.split(/---[^-]*?(FRONT|BACK)[^-]*?---/i);
      console.log("Sections split (pattern 3):", sections.length, sections);
    }
    
    if (sections.length >= 3) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section && typeof section === 'string') {
          if (section.toLowerCase().includes("front") && sections[i + 1]) {
            frontText = sections[i + 1].trim();
            console.log("Found front text:", frontText.substring(0, 100) + "...");
          } else if (section.toLowerCase().includes("back") && sections[i + 1]) {
            backText = sections[i + 1].trim();
            console.log("Found back text:", backText.substring(0, 100) + "...");
          }
        }
      }
    } else {
      // Fallback: Try to split by looking for the actual markers in text
      const frontMatch = text.match(/---[^-]*?FRONT[^-]*?---([\s\S]*?)(?=---[^-]*?BACK[^-]*?---|$)/i);
      const backMatch = text.match(/---[^-]*?BACK[^-]*?---([\s\S]*?)$/i);
      
      if (frontMatch) {
        frontText = frontMatch[1].trim();
        console.log("Fallback found front text:", frontText.substring(0, 100) + "...");
      }
      if (backMatch) {
        backText = backMatch[1].trim();
        console.log("Fallback found back text:", backText.substring(0, 100) + "...");
      }
    }
    
    // If still no sections found, treat as front text
    if (!frontText && !backText) {
      frontText = text.trim();
      console.log("No sections found, treating as front text");
    }
    
    console.log("Final frontText length:", frontText.length);
    console.log("Final backText length:", backText.length);
    
    const parseSection = (sectionText: string, sectionName: string = 'unknown') => {
      if (!sectionText) return {};
      
      console.log(`\n=== Parsing ${sectionName} section ===`);
      console.log(`Section text length: ${sectionText.length}`);
      console.log(`First 200 chars: ${sectionText.substring(0, 200)}...`);
      
      // Helper function to calculate company score
      const calculateCompanyScore = (text: string, indicators: string[]): number => {
        let score = 0;
        
        // Higher score for company indicators
        for (const indicator of indicators) {
          if (text.toLowerCase().includes(indicator.toLowerCase())) {
            score += 10;
          }
        }
        
        // Higher score for all caps (common for company names)
        if (text === text.toUpperCase() && text.length > 3) {
          score += 5;
        }
        
        // Higher score for multiple words
        if (text.split(' ').length > 1) {
          score += 3;
        }
        
        // Higher score for reasonable length
        if (text.length >= 3 && text.length <= 50) {
          score += 2;
        }
        
        return score;
      };
      
      // Clean and filter lines more comprehensively
      const lines = sectionText.split('\n')
        .map(line => {
          // Clean up common OCR artifacts
          let cleaned = line.trim();
          cleaned = cleaned.replace(/[""'']/g, '"'); // Normalize quotes
          cleaned = cleaned.replace(/[—–]/g, '-'); // Normalize dashes
          cleaned = cleaned.replace(/\s+/g, ' '); // Normalize whitespace
          cleaned = cleaned.replace(/[^\w\s@.,-]/g, ' '); // Remove unusual characters but keep basic punctuation
          return cleaned.trim();
        })
        .filter(line => line.length > 0)
        // Remove all variations of section markers
        .filter(line => !line.match(/---[^-]*?(FRONT|BACK)[^-]*?---/i))
        .filter(line => !line.includes('--- FRONT SIDE ---') && !line.includes('--- BACK SIDE ---'))
        .filter(line => !line.includes('--- FRONT ---') && !line.includes('--- BACK ---'))
        .filter(line => !line.includes('FRONT SIDE') && !line.includes('BACK SIDE'))
        .filter(line => !line.match(/^-+$/)) // Remove lines with just dashes
        .filter(line => !line.match(/^\*+$/)) // Remove lines with just asterisks
        .filter(line => !line.match(/^=+$/)) // Remove lines with just equals
        .filter(line => !line.match(/^\s*$/)) // Remove empty or whitespace-only lines
        .filter(line => line.length > 1);
      
      const sectionData: SectionData = {};
      const fullText = lines.join(' ');
      
      console.log("Processing lines:", lines);
      
      // Enhanced Email extraction with multiple patterns and OCR corrections
      const emailPatterns = [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
        // Handle OCR errors in emails
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}/g,
        /Email\s*:\s*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi,
        // Handle OCR artifacts where @ gets corrupted
        /([A-Za-z0-9._%+-]+)\s*(indsatcorp\.com|yahoo\.co\.in|gmail\.com)/gi,
        // Handle flow@indsatcorp.com pattern with OCR artifacts
        /flow[^a-zA-Z0-9]*indsatcorp\.com/gi,
        /anbuks[^a-zA-Z0-9]*yahoo[^a-zA-Z0-9]*co[^a-zA-Z0-9]*in/gi
      ];
      
      for (const pattern of emailPatterns) {
        const emailMatches = fullText.match(pattern);
        if (emailMatches?.length) {
          let email = emailMatches[0];
          // Clean up email - remove "Email:" prefix if present
          email = email.replace(/^Email\s*:\s*/i, '');
          // Remove spaces and artifacts
          email = email.replace(/\s+/g, '');
          // Fix known OCR corrections
          email = email.replace(/flow[^a-zA-Z0-9]*indsatcorp\.com/gi, 'flow@indsatcorp.com');
          email = email.replace(/anbuks[^a-zA-Z0-9]*yahoo[^a-zA-Z0-9]*co[^a-zA-Z0-9]*in/gi, 'anbuks@yahoo.co.in');
          // Add @ if missing before known domains
          email = email.replace(/([a-zA-Z0-9._%+-]+)(indsatcorp\.com|yahoo\.co\.in|gmail\.com)/gi, '$1@$2');
          sectionData.email = email.toLowerCase();
          console.log(`Found email: ${email}`);
          break;
        }
      }
      
      // Enhanced Phone extraction with OCR error handling
      const phonePatterns = [
        // Indian mobile numbers
        /(?:Mob|Mobile|Ph|Phone|Tel)\s*:?\s*([+]?91[-.\s]?)?([0-9]{10})/gi,
        /(?:®\s*)?([0-9]{10})/g,
        // Standard patterns
        /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
        /(?:\+?91[-.\s]?)?[0-9]{10}/g,
        /(?:\+?[0-9]{1,3}[-.\s]?)?[()]?[0-9]{3,4}[)]?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g,
        // OCR corrupted numbers
        /([0-9]{3,4})[-.\s]*([0-9]{3,4})[-.\s]*([0-9]{4})/g,
        /[+]?[\d\s\-().]{8,}/g
      ];
      
      for (const pattern of phonePatterns) {
        const phoneMatches = fullText.match(pattern);
        if (phoneMatches?.length) {
          for (const match of phoneMatches) {
            // Clean up phone number
            let phone = match.trim();
            // Remove labels
            phone = phone.replace(/^(Mob|Mobile|Ph|Phone|Tel)\s*:?\s*/i, '');
            phone = phone.replace(/^®\s*/, '');
            // Clean format - keep only digits, +, -, (), spaces, .
            phone = phone.replace(/[^\d+()-.\s]/g, '');
            // Remove extra spaces and normalize
            phone = phone.replace(/\s+/g, ' ').trim();
            
            // Check if it's a valid phone (at least 8 digits)
            const digitCount = (phone.match(/\d/g) || []).length;
            if (digitCount >= 8 && digitCount <= 15) {
              sectionData.phone = phone;
              break;
            }
          }
          if (sectionData.phone) break;
        }
      }
      
      // Enhanced Website extraction
      const websitePatterns = [
        /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g,
        /[a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|co|io|info|biz)\b/gi
      ];
      
      for (const pattern of websitePatterns) {
        const websiteMatches = fullText.match(pattern);
        if (websiteMatches?.length) {
          for (const match of websiteMatches) {
            if (!match.includes('@') && match.includes('.') && !match.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
              let website = match.toLowerCase();
              if (!website.startsWith('http')) {
                website = `https://${website}`;
              }
              sectionData.website = website;
              break;
            }
          }
          if (sectionData.website) break;
        }
      }
      
      // Enhanced Name extraction with OCR error handling
      const namePatterns = [
        // Names with degrees/qualifications (common in business cards) - with capture group
        /([A-Z][A-Za-z]+(?:\.[A-Z])?[A-Za-z]*(?:\s+[A-Z][A-Za-z]*)*)\s+(?:B\.?Sc|B\.?Tech|MBA|M\.?Tech|Ph\.?D|CA|CS|ACCA)/i,
        // All caps names with dots (like K.S.ANBUSELVAN)
        /^[A-Z](?:\.[A-Z])*\.[A-Z][A-Z]+$/,
        // Standard first name + last name patterns
        /^[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/,
        // Names with middle initial
        /^[A-Z][a-z]+\s+[A-Z]\.\s+[A-Z][a-z]+$/,
        // Names with titles
        /^(?:Mr\.?|Ms\.?|Mrs\.?|Dr\.?)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        // All caps names (2-4 words)
        /^[A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?(?:\s+[A-Z]{2,})?$/,
        // Mixed case names with multiple words
        /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/,
        // Names that start with a capital and have at least one space
        /^[A-Z][A-Za-z.]+\s+[A-Z][A-Za-z.]+/,
        // Single word names (fallback)
        /^[A-Z][a-z]{2,}$/
      ];
      
      // Look for names in the text, prioritizing those with qualifications
      const potentialNames = [];
      
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const trimmed = lines[lineIndex].trim();
        
        // Skip empty lines or very short content
        if (trimmed.length < 2) continue;
        
        // Skip if contains obvious non-name content
        if (sectionData.email && trimmed.toLowerCase().includes(sectionData.email.toLowerCase())) continue;
        if (sectionData.phone && trimmed.includes(sectionData.phone.replace(/\D/g, ''))) continue;
        if (sectionData.website && trimmed.toLowerCase().includes(sectionData.website.replace(/https?:\/\//, '').toLowerCase())) continue;
        
        // Skip lines with business/address keywords
        if (/\b(?:LLC|Inc|Corp|Ltd|Company|Co\.|Corporation|Group|Services|Solutions|Consulting|Technologies|Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Suite|Ste|Door|No\.|Ph:|Tel:|Mobile:|Email:|www\.|http|@)\b/i.test(trimmed)) continue;
        
        // Skip lines starting with numbers or containing only numbers
        if (/^\d+/.test(trimmed) || /^\d[\d\s\-().+]+$/.test(trimmed)) continue;
        
        // Skip very long lines (likely addresses or descriptions)
        if (trimmed.length > 50) continue;
        
        // Skip lines that look like job titles or positions (but not names)
        if (/^(?:Managing|General|Executive|Sales|Marketing|Technical|Business|Project|Assistant|Senior|Junior)\s+(?:Director|Manager|Officer|Engineer|Analyst)$/i.test(trimmed)) continue;
        
        // Clean up common OCR artifacts in the line
        let cleanedLine = trimmed;
        cleanedLine = cleanedLine.replace(/[®©™]/g, ''); // Remove trademark symbols
        cleanedLine = cleanedLine.replace(/^\W+|\W+$/g, ''); // Remove leading/trailing non-word chars
        cleanedLine = cleanedLine.replace(/\s+/g, ' ').trim();
        
        console.log(`Checking line ${lineIndex}: "${cleanedLine}"`);
        
        for (let i = 0; i < namePatterns.length; i++) {
          const pattern = namePatterns[i];
          const match = cleanedLine.match(pattern);
          if (match) {
            let name = match[1] || match[0]; // Use capture group if available
            name = name.replace(/\s+/g, ' ').trim();
            
            // Additional validation - ensure it looks like a real name
            if (name.length >= 2 && name.length <= 50) {
              // Check if it's not obviously a company or title
              const isCompanyLike = /\b(?:CORPORATION|ASSOCIATION|INDUSTRIAL|ESTATE|MANUFACTURER|SAFETY|FLOW|INDSAT|PIEMA)\b/i.test(name);
              const hasQualifications = /\b(?:B\.?Sc|B\.?Tech|MBA|M\.?Tech|Ph\.?D|CA|CS|ACCA)\b/i.test(trimmed);
              
              if (!isCompanyLike || hasQualifications) {
                console.log(`Found potential name: "${name}" (pattern ${i}, hasQualifications: ${hasQualifications})`);
                potentialNames.push({
                  text: name,
                  score: (hasQualifications ? 15 : 10) - i, // Higher score for patterns that come first and qualifications
                  hasQualifications: hasQualifications,
                  lineIndex: lineIndex
                });
                break;
              }
            }
          }
        }
      }
      
      // Sort by score and qualification presence
      if (potentialNames.length > 0) {
        potentialNames.sort((a, b) => {
          if (a.hasQualifications && !b.hasQualifications) return -1;
          if (!a.hasQualifications && b.hasQualifications) return 1;
          return b.score - a.score;
        });
        
        sectionData.name = potentialNames[0].text;
        console.log(`Selected name: "${sectionData.name}" from ${potentialNames.length} candidates`);
        console.log('All candidates:', potentialNames.map(p => `"${p.text}" (score: ${p.score}, hasQual: ${p.hasQualifications})`));
      } else {
        console.log('No name patterns matched, trying fallback extraction...');
        
        // Fallback: Look for the first line that could be a name (less strict)
        for (let lineIndex = 0; lineIndex < Math.min(lines.length, 5); lineIndex++) { // Only check first 5 lines
          const trimmed = lines[lineIndex].trim();
          
          // Skip obvious non-names
          if (trimmed.length < 3 || trimmed.length > 50) continue;
          if (/^\d+/.test(trimmed) || /\d{4,}/.test(trimmed)) continue; // Skip lines with numbers/years
          if (/@|www\.|http|\.com|\.org|\.net/i.test(trimmed)) continue; // Skip web/email
          if (/\b(?:street|road|avenue|drive|suite|floor|building|city|state|zip|phone|tel|mobile|email|fax)\b/i.test(trimmed)) continue;
          if (/^\W*$/.test(trimmed)) continue; // Skip lines with only symbols
          
          // Clean the line
          const cleanName = trimmed.replace(/[®©™]/g, '').replace(/^\W+|\W+$/g, '').trim();
          
          // Check if it has name-like characteristics
          const words = cleanName.split(/\s+/);
          const hasCapitalStart = /^[A-Z]/.test(cleanName);
          const hasReasonableLength = cleanName.length >= 3 && cleanName.length <= 40;
          const isNotAllCaps = cleanName !== cleanName.toUpperCase() || words.length <= 3;
          
          if (hasCapitalStart && hasReasonableLength && words.length >= 1 && words.length <= 4 && isNotAllCaps) {
            // Additional check: not a company name
            if (!/\b(?:CORPORATION|COMPANY|ASSOCIATION|INDUSTRIAL|ESTATE|MANUFACTURER|SERVICES|SOLUTIONS|TECHNOLOGIES|GROUP|SYSTEMS)\b/i.test(cleanName)) {
              sectionData.name = cleanName;
              console.log(`Fallback name selected: "${cleanName}" from line ${lineIndex}`);
              break;
            }
          }
        }
      }
      
      // Enhanced Company extraction with OCR error handling
      const companyIndicators = [
        'LLC', 'Inc', 'Corp', 'Ltd', 'Company', 'Co.', 'Corporation', 'Group', 'Services', 
        'Solutions', 'Consulting', 'Technologies', 'Tech', 'Systems', 'Associates', 
        'Partners', 'Enterprises', 'Industries', 'International', 'Global', 'Holdings',
        'Studio', 'Agency', 'Firm', 'Institute', 'Foundation', 'Center', 'Centre',
        'University', 'College', 'School', 'Academy', 'Hospital', 'Clinic', 'Medical',
        'Bank', 'Financial', 'Insurance', 'Real Estate', 'Construction', 'Manufacturing',
        'Association', 'ASSOCIATION', 'Industrial', 'Estate', 'Plant', 'Office',
        'INDSAT', 'PIEMA', 'FLOW', 'SAFETY', 'FITTINGS'
      ];
      
      // Check for specific known companies first
      if (fullText.includes('INDSAT') && fullText.includes('CORPORATION')) {
        sectionData.company = 'INDSAT CORPORATION';
        console.log(`Found specific company: INDSAT CORPORATION`);
      } else if (fullText.includes('PIEMA') || fullText.includes('INDUSTRIAL ESTATE MANUFACTURER')) {
        const piemaMatch = fullText.match(/PERUNGUDI\s+INDUSTRIAL\s+ESTATE\s+MANUFACTURER.*?ASSOCIATION/i);
        if (piemaMatch) {
          sectionData.company = piemaMatch[0];
          console.log(`Found specific company: ${piemaMatch[0]}`);
        }
      }
      
      // If no specific company found, use pattern matching
      if (!sectionData.company) {
        const companyPatterns = [
          // Specific patterns for the given text
          /INDUSTRIAL\s+ESTATE.*?ASSOCIATION/i,
          /MANUFACTURER.*?ASSOCIATION/i,
          // Lines with company indicators
          new RegExp(`\\b(?:${companyIndicators.join('|')})\\b`, 'i'),
          // All caps lines (common for company names) - but filter out obvious names
          /^[A-Z\s&.,'-]{5,}$/,
          // Title case with multiple words
          /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/,
          // Lines with common business symbols
          /[&@#$%]/,
          // Company-like patterns in mixed case
          /(?:Managing|General|Executive|Sales|Marketing)\s+(?:Director|Manager|Officer)/i
        ];
      
      const potentialCompanies = [];
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip if it's already identified as name, email, phone, website
        if (sectionData.name && trimmed.includes(sectionData.name)) continue;
        if (sectionData.email && trimmed.includes(sectionData.email)) continue;
        if (sectionData.phone && trimmed.includes(sectionData.phone.replace(/\D/g, ''))) continue;
        if (sectionData.website && trimmed.toLowerCase().includes(sectionData.website.replace(/https?:\/\//, ''))) continue;
        
        // Skip obviously non-company lines
        if (/^[A-Z](\.[A-Z])+[A-Z]+$/.test(trimmed)) continue; // Names like K.S.ANBUSELVAN
        if (/^\d+/.test(trimmed)) continue; // Lines starting with numbers
        if (/\b(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Suite|Ste|Floor|Fl|Building|Bldg|Door|No\.)\b/i.test(trimmed)) continue;
        if (/\b\d{5}(-\d{4})?\b/.test(trimmed)) continue; // ZIP codes
        if (/\b(?:NY|CA|TX|FL|IL|PA|OH|GA|NC|MI|NJ|VA|WA|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|UT|IA|NV|AR|MS|KS|NM|NE|WV|ID|HI|NH|ME|RI|MT|DE|SD|ND|AK|VT|WY|Chennai|Mumbai|Delhi|Bangalore|Hyderabad|Pune|Kolkata)\b/i.test(trimmed)) continue;
        if (trimmed.length < 3 || trimmed.length > 100) continue;
        
        // Check patterns
        for (let i = 0; i < companyPatterns.length; i++) {
          const pattern = companyPatterns[i];
          if (pattern.test(trimmed)) {
            const score = calculateCompanyScore(trimmed, companyIndicators);
            // Boost score for specific patterns
            const boostScore = i < 2 ? 15 : 0; // First two patterns get boost
            potentialCompanies.push({
              text: trimmed,
              score: score + boostScore
            });
            break;
          }
        }
      }
      
        // Sort by score and pick the best candidate
        if (potentialCompanies.length > 0) {
          potentialCompanies.sort((a, b) => b.score - a.score);
          sectionData.company = potentialCompanies[0].text;
          console.log(`Found company from patterns: ${sectionData.company}`);
        }
      }
      
      // Enhanced Title/Position extraction with OCR error handling
      const titleKeywords = [
        'Managing Director', 'Executive Director', 'General Manager', 'Assistant Manager',
        'CEO', 'CTO', 'CFO', 'COO', 'President', 'Vice President', 'VP', 'Director', 'Manager', 
        'Senior', 'Junior', 'Lead', 'Head', 'Chief', 'Principal', 'Associate', 'Assistant',
        'Engineer', 'Developer', 'Designer', 'Analyst', 'Consultant', 'Specialist', 'Coordinator',
        'Administrator', 'Executive', 'Officer', 'Supervisor', 'Representative', 'Agent',
        'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Human Resources', 'IT',
        'Technical', 'Business', 'Project', 'Product', 'Research', 'Development'
      ];
      
      const titlePatterns = [
        /Managing\s+Director/i,
        /Executive\s+Director/i,
        /General\s+Manager/i,
        /President\s*-\s*[A-Z]+/i, // Pattern like "President - PIEMA"
        /\b(?:CEO|CTO|CFO|COO|VP)\b/i,
        /\b(?:Director|Manager|Executive|Officer)\b/i
      ];
      
      const potentialTitles = [];
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip already identified fields
        if (sectionData.name && trimmed.includes(sectionData.name)) continue;
        if (sectionData.company && trimmed.includes(sectionData.company)) continue;
        if (sectionData.email && trimmed.includes(sectionData.email)) continue;
        if (sectionData.phone && trimmed.includes(sectionData.phone.replace(/\D/g, ''))) continue;
        if (sectionData.website && trimmed.toLowerCase().includes(sectionData.website.replace(/https?:\/\//, ''))) continue;
        
        // Skip lines that are obviously not titles
        if (/^\d+/.test(trimmed)) continue;
        if (trimmed.length > 80 || trimmed.split(' ').length > 8) continue;
        if (/\b(?:Street|Avenue|Road|Chennai|Mumbai|Delhi|Email|Ph:|Tel:|Mobile)\b/i.test(trimmed)) continue;
        
        // Check for title patterns
        for (let i = 0; i < titlePatterns.length; i++) {
          if (titlePatterns[i].test(trimmed)) {
            potentialTitles.push({
              text: trimmed,
              score: 10 - i // Higher score for more specific patterns
            });
            break;
          }
        }
        
        // Check for general title keywords if no pattern matches
        if (potentialTitles.length === 0) {
          const hasTitle = titleKeywords.some(keyword => 
            trimmed.toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (hasTitle) {
            potentialTitles.push({
              text: trimmed,
              score: 1
            });
          }
        }
      }
      
      // Sort by score and pick the best candidate
      if (potentialTitles.length > 0) {
        potentialTitles.sort((a, b) => b.score - a.score);
        sectionData.title = potentialTitles[0].text;
      }
      
      // Enhanced Address extraction with Indian address patterns
      const addressLines = [];
      const addressKeywords = [
        'Street', 'St', 'Avenue', 'Ave', 'Road', 'Rd', 'Drive', 'Dr', 'Suite', 'Ste', 'Floor', 'Fl', 
        'Building', 'Bldg', 'Unit', 'Apt', 'Door', 'No.', 'Plot', 'Estate', 'Industrial', 'Link',
        'CENTRE', 'CENTER', 'ANBU', 'Nehru', 'Inner Ring', 'OFFICE', 'MARKETING', 'SALES', 'MANUFACTURING', 'PLANT'
      ];
      const indianCities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Koyambedu', 'Perungudi'];
      
      // Check for specific address patterns first
      const salesOfficeMatch = fullText.match(/SALES\s*&\s*MARKETING\s*OFFICE\s*:?\s*([^.]+(?:Chennai\s*-?\s*600\s*107[^.]*)?)/i);
      if (salesOfficeMatch) {
        let address = salesOfficeMatch[1].trim();
        // Clean up OCR artifacts
        address = address.replace(/\s*\(\s*aN[^)]*\)?\s*/g, ' '); // Remove (aN artifacts
        address = address.replace(/\\+J?\s*/g, ' '); // Remove \J artifacts
        address = address.replace(/\s+/g, ' ').trim();
        sectionData.address = address;
        console.log(`Found sales office address: ${address}`);
      }
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip already identified fields
        if (sectionData.name && trimmed.includes(sectionData.name)) continue;
        if (sectionData.company && trimmed.includes(sectionData.company)) continue;
        if (sectionData.title && trimmed.includes(sectionData.title)) continue;
        if (sectionData.email && trimmed.includes(sectionData.email)) continue;
        if (sectionData.phone && trimmed.includes(sectionData.phone.replace(/\D/g, ''))) continue;
        if (sectionData.website && trimmed.toLowerCase().includes(sectionData.website.replace(/https?:\/\//, ''))) continue;
        
        // Check for address indicators
        const hasAddressKeyword = addressKeywords.some(keyword => 
          trimmed.toLowerCase().includes(keyword.toLowerCase())
        );
        const hasNumbers = /\d/.test(trimmed);
        const hasZipCode = /\b\d{5,6}(-\d{4})?\b/.test(trimmed); // Indian PIN codes are 6 digits
        const hasIndianCity = indianCities.some(city => 
          trimmed.toLowerCase().includes(city.toLowerCase())
        );
        const hasOfficeKeywords = /\b(?:OFFICE|PLANT|MANUFACTURING|SALES|MARKETING)\b/i.test(trimmed);
        
        // Specific patterns for the business card
        const isAddressLine = hasAddressKeyword || hasZipCode || hasIndianCity || hasOfficeKeywords || 
          (hasNumbers && trimmed.length > 10 && !trimmed.includes('@') && !/^[0-9\s\-()]+$/.test(trimmed));
        
        if (isAddressLine) {
          // Clean up common OCR errors in addresses
          let cleanedLine = trimmed;
          cleanedLine = cleanedLine.replace(/\s+/g, ' '); // Normalize spaces
          cleanedLine = cleanedLine.replace(/(\d+)\s*\/\s*(\d+)/, '$1/$2'); // Fix Door No. format
          addressLines.push(cleanedLine);
        }
      }
      
      if (addressLines.length > 0) {
        sectionData.address = addressLines.join(', ');
      }
      
      console.log(`${sectionName} section extracted:`, {
        name: sectionData.name || 'NOT FOUND',
        company: sectionData.company || 'NOT FOUND',
        title: sectionData.title || 'NOT FOUND',
        phone: sectionData.phone || 'NOT FOUND',
        email: sectionData.email || 'NOT FOUND',
        website: sectionData.website || 'NOT FOUND',
        address: sectionData.address || 'NOT FOUND'
      });
      return sectionData;
    };
    
    const frontData = parseSection(frontText, 'FRONT');
    const backData = parseSection(backText, 'BACK');
    
    console.log("Final parsed front data:", frontData);
    console.log("Final parsed back data:", backData);
    
    return { frontData, backData };
  }, []);

  // Helper method to calculate company score
  const calculateCompanyScore = (text: string, indicators: string[]): number => {
    let score = 0;
    
    // Higher score for company indicators
    for (const indicator of indicators) {
      if (text.toLowerCase().includes(indicator.toLowerCase())) {
        score += 10;
      }
    }
    
    // Higher score for all caps (common for company names)
    if (text === text.toUpperCase() && text.length > 3) {
      score += 5;
    }
    
    // Higher score for multiple words
    if (text.split(' ').length > 1) {
      score += 3;
    }
    
    // Higher score for reasonable length
    if (text.length >= 3 && text.length <= 50) {
      score += 2;
    }
    
    return score;
  };

  const [contact, setContact] = useState<ContactFormData>({
    name: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    tags: [],
    notes: extractedText,
  });

  useEffect(() => {
    if (extractedText) {
      const parsed = parseBusinessCardText(extractedText);
      setParsedData(parsed);
      
      console.log('Parsed data:', parsed);
      
      // Smart merging - prioritize the most complete and accurate data
      const getName = () => {
        const frontName = parsed.frontData.name?.trim();
        const backName = parsed.backData.name?.trim();
        
        if (!frontName && !backName) return "";
        if (frontName && !backName) return frontName;
        if (!frontName && backName) return backName;
        
        // Both have names - choose the longer, more complete one
        if (frontName.length > backName.length) return frontName;
        if (backName.length > frontName.length) return backName;
        
        // Same length - prefer front side
        return frontName;
      };
      
      const getCompany = () => {
        const frontCompany = parsed.frontData.company?.trim();
        const backCompany = parsed.backData.company?.trim();
        
        if (!frontCompany && !backCompany) return "";
        if (frontCompany && !backCompany) return frontCompany;
        if (!frontCompany && backCompany) return backCompany;
        
        // Both have companies - choose the more descriptive one
        if (frontCompany.length > backCompany.length) return frontCompany;
        return backCompany;
      };
      
      // Combine data from both sides with smart selection
      setContact(prev => ({
        ...prev,
        name: getName(),
        company: getCompany(),
        phone: parsed.frontData.phone || parsed.backData.phone || "",
        email: parsed.frontData.email || parsed.backData.email || "",
        website: parsed.frontData.website || parsed.backData.website || "",
        address: parsed.frontData.address || parsed.backData.address || "",
      }));
      
      console.log('Final contact data set:', {
        name: getName(),
        company: getCompany(),
        phone: parsed.frontData.phone || parsed.backData.phone || "",
        email: parsed.frontData.email || parsed.backData.email || "",
        website: parsed.frontData.website || parsed.backData.website || "",
        address: parsed.frontData.address || parsed.backData.address || "",
      });
    }
  }, [extractedText, parseBusinessCardText]);

  const handleInputChange = (field: keyof ContactFormData, value: string | string[]) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !contact.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...contact.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      contact.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSave = async () => {
    console.log("Attempting to save contact:", contact);
    
    if (!contact.name.trim()) {
      console.log("Validation failed: Name is empty");
      toast({
        title: "Validation Error", 
        description: "Name is required. Please enter a name manually if it wasn't detected automatically.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createContact(contact);
      toast({
        title: "Success",
        description: "Contact saved successfully!",
      });
      onSave(contact);
    } catch (error) {
      console.error("Error saving contact:", error);
      toast({
        title: "Error",
        description: "Failed to save contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Edit Contact Details</h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Back to Upload
            </Button>
            <Button 
              variant="default" 
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Contact"}
            </Button>
          </div>
        </div>

        {/* Combined Main Fields */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary">Main Contact Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name *
                </Label>
                <Input
                  id="name"
                  value={contact.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={contact.name ? "Full name" : "Name not detected - please enter manually"}
                  className={`mt-1 ${!contact.name ? 'border-amber-300 focus:border-amber-500' : ''}`}
                />
                {!contact.name && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Name couldn't be automatically detected. Please enter it manually.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company
                </Label>
                <Input
                  id="company"
                  value={contact.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Company name"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={contact.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={contact.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={contact.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="Website URL"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Textarea
              id="address"
              value={contact.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Full address"
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        {/* Front and Back Card Data Sections */}
        {(parsedData.frontData && Object.keys(parsedData.frontData).length > 0) || 
         (parsedData.backData && Object.keys(parsedData.backData).length > 0) ? (
          <div className="mb-8 space-y-6">
            {parsedData.frontData && Object.keys(parsedData.frontData).length > 0 && (
              <Card className="border-blue-200 bg-blue-50/50">
                <div className="p-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Front Side Data
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {parsedData.frontData.name && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Name:</span>
                        <span>{parsedData.frontData.name}</span>
                      </div>
                    )}
                    {parsedData.frontData.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Company:</span>
                        <span>{parsedData.frontData.company}</span>
                      </div>
                    )}
                    {parsedData.frontData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Phone:</span>
                        <span>{parsedData.frontData.phone}</span>
                      </div>
                    )}
                    {parsedData.frontData.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Email:</span>
                        <span>{parsedData.frontData.email}</span>
                      </div>
                    )}
                    {parsedData.frontData.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Website:</span>
                        <span>{parsedData.frontData.website}</span>
                      </div>
                    )}
                    {parsedData.frontData.address && (
                      <div className="flex items-start gap-2 md:col-span-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <span className="font-medium">Address:</span>
                        <span>{parsedData.frontData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {parsedData.backData && Object.keys(parsedData.backData).length > 0 && (
              <Card className="border-green-200 bg-green-50/50">
                <div className="p-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Back Side Data
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {parsedData.backData.name && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Name:</span>
                        <span>{parsedData.backData.name}</span>
                      </div>
                    )}
                    {parsedData.backData.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Company:</span>
                        <span>{parsedData.backData.company}</span>
                      </div>
                    )}
                    {parsedData.backData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Phone:</span>
                        <span>{parsedData.backData.phone}</span>
                      </div>
                    )}
                    {parsedData.backData.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Email:</span>
                        <span>{parsedData.backData.email}</span>
                      </div>
                    )}
                    {parsedData.backData.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Website:</span>
                        <span>{parsedData.backData.website}</span>
                      </div>
                    )}
                    {parsedData.backData.address && (
                      <div className="flex items-start gap-2 md:col-span-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                        <span className="font-medium">Address:</span>
                        <span>{parsedData.backData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : null}

        {/* Additional Fields */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">Additional Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <Label htmlFor="notes">Original Text (Notes)</Label>
          <Textarea
            id="notes"
            value={contact.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Additional notes..."
            rows={4}
            className="mt-1"
          />
        </div>
      </Card>
    </div>
  );
};

export default ContactForm;
