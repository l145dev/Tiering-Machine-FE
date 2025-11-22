import { calculatePayout } from "../utils/odds";

const createBet = (
  id: number,
  description: string,
  creator: string,
  target: string,
  duration: string,
  optionAPercentage: number,
  wager: number = 100
) => {
  const optionBPercentage = 100 - optionAPercentage;
  return {
    id,
    description,
    creator,
    target,
    duration,
    wager,
    optionA: {
      payout: calculatePayout(optionAPercentage, wager),
      percentage: optionAPercentage,
    },
    optionB: {
      payout: calculatePayout(optionBPercentage, wager),
      percentage: optionBPercentage,
    },
  };
};

export const bettingData = [
  createBet(
    1,
    "will delete production DB",
    "User 1",
    "User 2",
    "2d",
    10, // Low chance
    50 // Wager
  ),
  createBet(
    2,
    "will wear a clown suit to the meeting",
    "User 5",
    "User 2",
    "1d",
    30,
    100
  ),
  createBet(
    3,
    "will push to main without review",
    "User 9",
    "User 1",
    "4h",
    40,
    200
  ),
  createBet(
    4,
    "will fix the bug on first try",
    "User 3",
    "User 80",
    "6h",
    5,
    20
  ),
  createBet(
    5,
    "will survive the spicy noodle challenge",
    "User 4",
    "User 2",
    "3d",
    50,
    100
  ),
  createBet(
    6,
    "will accidentally reply all",
    "User 6",
    "User 60",
    "1w",
    25,
    75
  ),
  createBet(
    7,
    "will find the missing semicolon in < 1 hour",
    "User 7",
    "User 85",
    "1h",
    60,
    150
  ),
  createBet(8, "will win the hackathon", "User 8", "User 96", "2d", 1, 10),
  createBet(
    9,
    "will sleep through the standup",
    "User 9",
    "User 64",
    "12h",
    15,
    50
  ),
  createBet(
    10,
    "will use light mode for a whole day",
    "User 10",
    "User 67",
    "1d",
    5,
    25
  ),
  createBet(
    11,
    "will get coffee spilled on them",
    "User 11",
    "User 68",
    "3d",
    20,
    60
  ),
  createBet(
    12,
    "will mention 'AI' in the next 5 mins",
    "User 12",
    "User 69",
    "5m",
    80,
    500
  ),
  createBet(13, "will break the build", "User 45", "User 36", "1d", 35, 100),
  createBet(
    14,
    "will eat lunch at their desk",
    "User 46",
    "User 71",
    "4h",
    90,
    200
  ),
  createBet(
    15,
    "will say 'It works on my machine'",
    "User 47",
    "User 54",
    "2d",
    70,
    120
  ),
  createBet(16, "will forget to unmute", "User 48", "User 55", "1h", 60, 80),
  createBet(17, "will deploy on Friday", "User 49", "User 32", "5d", 10, 40),
  createBet(18, "will use Vim", "User 50", "User 56", "1w", 15, 50),
  createBet(
    19,
    "will ask a question already answered in docs",
    "User 51",
    "User 51",
    "1d",
    55,
    100
  ),
  createBet(20, "will become a meme", "User 30", "User 90", "1mo", 2, 10),
];
