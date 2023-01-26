export interface WinnerInfo {
  id: number;
  wins: number;
  time: number;
}

export interface WinnersInfo {
  items: WinnerInfo[];
  count: string;
}
