const BASE_URL = "http://10.30.64.227:8080/api";

export interface ApiEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  reward: number;
  creator: {
    id: number;
    username: string;
    tier: {
      id: number;
      name: string;
    };
  };
}

export interface ApiBet {
  id: number;
  description: string;
  creator: string | { username: string };
  target: string;
  wagerPoints: number;
  payoutPoints: number;
  lossPoints: number;
  actualOutcome: boolean | null;
  time: string;
}

export interface ApiLeaderboardEntry {
  id: number;
  rank: number;
  name: string;
  points: number;
}

export interface LoginRequest {
  citizenNumber: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  rank: number;
  username: string;
  total_points: number;
  tier: string;
}

export interface ReportRequest {
  targetId: number;
  reason: string;
}

export interface ReportResponse {
  target: string;
  reporter: string;
  target_points_lost: number;
  report_points_earned: number;
}

export interface LogEntry {
  id: number;
  username: string;
  details: string;
  logTime: string;
}

export interface TierResponse {
  tier: "dreg" | "citizen" | "elite" | null;
}

export const fetchEvents = async (): Promise<ApiEvent[]> => {
  const response = await fetch(`${BASE_URL}/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const fetchBets = async (): Promise<ApiBet[]> => {
  const response = await fetch(`${BASE_URL}/bets`);
  if (!response.ok) {
    throw new Error("Failed to fetch bets");
  }
  return response.json();
};

export const fetchLeaderboard = async (): Promise<ApiLeaderboardEntry[]> => {
  const response = await fetch(`${BASE_URL}/leaderboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return response.json();
};

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
};

export const reportCitizen = async (
  reporterId: number,
  data: ReportRequest
): Promise<ReportResponse> => {
  const response = await fetch(`${BASE_URL}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Citizen-Id": reporterId.toString(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Report failed");
  }
  return response.json();
};

export const fetchUserLogs = async (userId: number): Promise<LogEntry[]> => {
  const response = await fetch(`${BASE_URL}/logs/user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user logs");
  }
  return response.json();
};

export const fetchTierByUsername = async (
  username: string
): Promise<TierResponse> => {
  const response = await fetch(
    `${BASE_URL}/tier?username=${encodeURIComponent(username)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tier");
  }
  return response.json();
};

export const setDebugScore = async (citizenId: number, score: number) => {
  const response = await fetch(`${BASE_URL}/bets/debug/set-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ citizenId, score }),
  });
  if (!response.ok) {
    throw new Error("Failed to set debug score");
  }
  return response.json();
};
