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

// Helper function to escape special regex characters (like the + in C++)
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractSkillsFromText(text: string): ExtractedSkill[] {
  if (!text || text.trim().length === 0) return []

  tfidf.addDocument(text.toLowerCase())
  
  const foundSkills = new Map<string, ExtractedSkill>()

  const tokenizer = new natural.WordTokenizer()
  const tokens = tokenizer.tokenize(text.toLowerCase())
  const totalWords = tokens.length

  for (const skillDef of SKILL_TAXONOMY) {
    let occurrences = 0

    for (const alias of skillDef.aliases) {
      // Escape special characters before creating the regex
      const safeAlias = escapeRegExp(alias)
      const regex = new RegExp(`\\b${safeAlias}\\b`, 'gi')
      
      const matches = text.match(regex)
      if (matches) occurrences += matches.length
    }

    if (occurrences > 0) {
      let confidence = Math.min((occurrences / totalWords) * 15, 0.99)
      
      if (occurrences >= 3) confidence = Math.max(confidence, 0.85)
      if (occurrences >= 5) confidence = 0.99

      confidence = Math.round(confidence * 100) / 100

      foundSkills.set(skillDef.canonical, {
        skillName: skillDef.canonical,
        domain: skillDef.domain,
        confidence
      })
    }
  }

  return Array.from(foundSkills.values()).sort((a, b) => b.confidence - a.confidence)
}