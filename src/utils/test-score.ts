export interface TestScore {
  total: number;
  percentage: number;
  maxScore: number;
}

export function calculateTestScore(
  answers: Record<number, string>,
  totalQuestions: number
): TestScore {
  const scoreMap = { Never: 0, Sometimes: 1, Always: 2 };
  const total = Object.values(answers).reduce(
    (sum, answer) => sum + (scoreMap[answer as keyof typeof scoreMap] || 0),
    0
  );
  const maxScore = totalQuestions * 2;
  const percentage = Math.round((total / maxScore) * 100);
  return { total, percentage, maxScore };
}
