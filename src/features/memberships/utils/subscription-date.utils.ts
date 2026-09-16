export function calculateSubscriptionEndDate(
  startDate: string,
  durationDays: number,
): string {
  const date = new Date(`${startDate}T00:00:00`);

  date.setDate(date.getDate() + durationDays - 1);

  return date.toISOString().split("T")[0];
}

export function calculateRenewalStartDate(
  previousEndDate: string,
): string {
  const date = new Date(`${previousEndDate}T00:00:00`);

  date.setDate(date.getDate() + 1);

  return date.toISOString().split("T")[0];
}