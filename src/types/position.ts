export interface UserPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export type PositionsMap = Record<string, UserPosition>;

export interface PairDistance {
  userA: string;
  userB: string;
  meters: number;
  km: number;
  miles: number;
}
