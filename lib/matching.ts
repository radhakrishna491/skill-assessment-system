export interface TeamRequirement {
  skill: string
  weight: number
}

export interface MatchResult {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  explanation: string
}

export function calculateTeamMatch(
  studentSkills: { skillName: string, level: number }[], 
  teamRequirements: any[] // Changed to 'any[]' to handle old and new data formats safely
): MatchResult {
  
  let totalWeight = 0
  let achievedWeight = 0
  const matched: string[] = []
  const missing: string[] = []

  const studentSkillMap = new Map(
    studentSkills.map(s => [s.skillName.toLowerCase(), s.level])
  )

  for (const req of teamRequirements) {
    // SAFEGUARD: If the DB still has an old string format, handle it
    const skillName = typeof req === 'string' ? req : req?.skill;
    const weight = typeof req === 'string' ? 1 : (req?.weight || 1);

    if (!skillName) continue; // Skip if the skill name is somehow missing

    totalWeight += weight

    const studentLevel = studentSkillMap.get(skillName.toLowerCase())

    if (studentLevel) {
      const proficiencyMultiplier = studentLevel / 5 
      achievedWeight += (weight * proficiencyMultiplier)
      matched.push(`${skillName} (Level ${studentLevel})`)
    } else {
      missing.push(`${skillName} (Weight: ${weight})`)
    }
  }

  const score = totalWeight === 0 ? 0 : achievedWeight / totalWeight

  const explanation = `Student achieved ${Math.round(score * 100)}% of the weighted requirements. 
  Matched: ${matched.length > 0 ? matched.join(', ') : 'None'}. 
  Missing critical skills: ${missing.length > 0 ? missing.join(', ') : 'None'}.`

  return {
    score: Math.round(score * 100) / 100,
    matchedSkills: matched,
    missingSkills: missing,
    explanation: explanation
  }
}