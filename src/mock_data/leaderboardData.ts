export interface LeaderboardItem {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
}

const generateLeaderboardData = (count: number): LeaderboardItem[] => {
  const data: LeaderboardItem[] = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      id: `user-${i}`,
      rank: i,
      name: `User ${i}`,
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      points: 10000 - i * 50 + Math.floor(Math.random() * 40),
    });
  }
  return data;
};

export const leaderboardData = generateLeaderboardData(100);

export const currentUser: LeaderboardItem = {
  id: "current-user",
  rank: 42,
  name: "You",
  avatar: "https://i.pravatar.cc/150?u=current-user",
  points: 7850,
};
