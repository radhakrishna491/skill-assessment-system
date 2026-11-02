export interface MatchResult {
    score: number
    matchedSkills: string[]
    missingSkills: string[]
  }
  
  export function calculateTeamMatch(
    studentSkills: string[], 
    requiredSkills: string[]
  ): MatchResult {
    // Normalize strings to lowercase for comparison
    const studentSet = new Set(studentSkills.map(s => s.toLowerCase()))
    const requiredSet = requiredSkills.map(s => s.toLowerCase())
  
    const matched: string[] = []
    const missing: string[] = []
  
    for (const reqSkill of requiredSet) {
      if (studentSet.has(reqSkill)) {
        matched.push(reqSkill)
      } else {
        missing.push(reqSkill)
      }
    }
  
    // Calculate score (0.0 to 1.0)
    // Score = (matched skills) / (total required skills)
    const score = requiredSet.length === 0 ? 0 : matched.length / requiredSet.length
  
    return {
      score: Math.round(score * 100) / 100, // Round to 2 decimal places
      matchedSkills: matched,
      missingSkills: missing
    }
  }