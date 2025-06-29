// Enum untuk ElectionState
export enum ElectionState {
  Created = 0,
  Active = 1,
  Paused = 2,
  Ended = 3,
  Canceled = 4
}

// Enum untuk VotingType
export enum VotingType {
  SingleChoice = 0,
  MultipleChoice = 1
}

// Interface untuk data pemilihan
export interface Election {
  id: number;
  title: string;
  description: string;
  admin: string;
  startTime: bigint;
  endTime: bigint;
  state: ElectionState;
  votingType: VotingType;
  candidateCount: number;
  totalVotes: number;
  requiresRegistration: boolean;
  resultsVisible: boolean;
}

// Tipe data untuk kandidat
export interface Candidate {
  id: number;
  name: string;
  description: string;
  voteCount: number;
}
