import { LeaderboardEntry, User } from '../types';

const LEADERBOARD_KEY = 'lawmaster_leaderboard';
const USER_KEY = 'lawmaster_user';

export const saveScore = (name: string, score: number) => {
  const entry: LeaderboardEntry = {
    name,
    score,
    date: new Date().toLocaleDateString('vi-VN')
  };

  const existingData = localStorage.getItem(LEADERBOARD_KEY);
  let leaderboard: LeaderboardEntry[] = existingData ? JSON.parse(existingData) : [];
  
  leaderboard.push(entry);
  // Sort desc by score
  leaderboard.sort((a, b) => b.score - a.score);
  // Keep top 20
  leaderboard = leaderboard.slice(0, 20);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};