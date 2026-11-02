import { SKILL_TAXONOMY } from './skillTaxonomy'

export interface ExtractedSkill {
  skillName: string
  domain: string
}

export function extractSkillsFromText(text: string): ExtractedSkill[] {
  const foundSkills = new Map<string, ExtractedSkill>()
  const lowerText = text.toLowerCase()

  // Loop through every skill in our taxonomy
  for (const skillDef of SKILL_TAXONOMY) {
    // Check all aliases (e.g., "js", "react.js")
    for (const alias of skillDef.aliases) {
      // Simple word boundary check to avoid partial matches
      const regex = new RegExp(`\\b${alias}\\b`, 'i')
      if (regex.test(lowerText)) {
        foundSkills.set(skillDef.canonical, {
          skillName: skillDef.canonical,
          domain: skillDef.domain
        })
        break // Move to next skill if found
      }
    }
  }

  return Array.from(foundSkills.values())
}