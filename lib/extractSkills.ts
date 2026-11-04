import { SKILL_TAXONOMY } from './skillTaxonomy'
import natural from 'natural'

// Initialize the TF-IDF algorithm
const TfIdf = natural.TfIdf
const tfidf = new TfIdf()

export interface ExtractedSkill {
  skillName: string
  domain: string
  confidence: number
}

export function extractSkillsFromText(text: string): ExtractedSkill[] {
  if (!text || text.trim().length === 0) return []

  // 1. Add the document to the TF-IDF engine
  tfidf.addDocument(text.toLowerCase())
  
  const foundSkills = new Map<string, ExtractedSkill>()

  // 2. Tokenize the text to count occurrences
  const tokenizer = new natural.WordTokenizer()
  const tokens = tokenizer.tokenize(text.toLowerCase())
  const totalWords = tokens.length

  // 3. Loop through our taxonomy
  for (const skillDef of SKILL_TAXONOMY) {
    let occurrences = 0

    // Check all aliases for this skill
    for (const alias of skillDef.aliases) {
      // Count how many times this alias appears in the text
      const regex = new RegExp(`\\b${alias}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) occurrences += matches.length
    }

    if (occurrences > 0) {
      // Calculate a "Confidence Score" (0.0 to 1.0)
      // If the skill appears frequently relative to the document size, confidence is higher
      let confidence = Math.min((occurrences / totalWords) * 15, 0.99)
      
      // Boost confidence if it's mentioned multiple times
      if (occurrences >= 3) confidence = Math.max(confidence, 0.85)
      if (occurrences >= 5) confidence = 0.99

      // Round to 2 decimals
      confidence = Math.round(confidence * 100) / 100

      foundSkills.set(skillDef.canonical, {
        skillName: skillDef.canonical,
        domain: skillDef.domain,
        confidence
      })
    }
  }

  // Return as array, sorted by highest confidence first
  return Array.from(foundSkills.values()).sort((a, b) => b.confidence - a.confidence)
}