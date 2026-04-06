export type LiveData = {
  ranking: number;
  winRate: number;
  epa: {
    auto: number;
    teleop: number;
    total: number;
  };
  matchHistory: Array<{
    key: string;
    result: 'W' | 'L' | 'T';
    predictedWin: number;
  }>;
};
