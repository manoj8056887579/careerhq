export interface TestScore {
  total: number;
  percentage: number;
  maxScore: number;
}

export function calculateTestScore(
  answers: Record<number, string>,
  totalQuestions: number
): TestScore {
  // Count how many questions were answered
  const answeredCount = Object.keys(answers).length;
  
  // For the new multiple choice format, we give 2 points per answered question
  const total = answeredCount * 2;
  const maxScore = totalQuestions * 2;
  const percentage = Math.round((total / maxScore) * 100);
  
  return { total, percentage, maxScore };
}
