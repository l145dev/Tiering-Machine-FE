/**
 * Calculates the total payout (Wager + Profit) based on probability and wager amount.
 * Fair odds calculation: Payout = Wager * (100 / Probability)
 *
 * @param probability Percentage chance of winning (0-100)
 * @param wager Amount wagered (default 100)
 * @returns Total payout amount
 */
export const calculatePayout = (
  probability: number,
  wager: number = 100
): number => {
  if (probability <= 0) return wager * 100; // Impossible odds, huge payout
  if (probability >= 100) return Math.round(wager * 1.01); // Guaranteed win, tiny profit

  // Standard decimal odds = 100 / probability
  // Payout = Wager * Decimal Odds
  const decimalOdds = 100 / probability;
  const payout = Math.round(wager * decimalOdds);

  return payout;
};
