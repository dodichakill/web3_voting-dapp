import { ElectionState, VotingType, Election, Candidate } from '../types/election';

// Generate mock wallet addresses for testing
const generateRandomAddress = () => {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 40; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Addresses for testing
export const mockAddresses = {
  admin: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  voters: [
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
  ],
  contract: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
};

// Current timestamp and future timestamps for election periods
const now = Math.floor(Date.now() / 1000);
const oneDay = 86400;
const oneWeek = oneDay * 7;

// Mock elections data
export const mockElections: Election[] = [
  {
    id: 1,
    title: 'Pemilihan Ketua RT 03',
    description: 'Pemilihan ketua RT periode 2025-2028 untuk wilayah RT 03 RW 05 Kelurahan Sukamaju',
    admin: mockAddresses.admin,
    startTime: BigInt(now - oneDay * 2), // Started 2 days ago
    endTime: BigInt(now + oneWeek), // Ends in a week
    state: ElectionState.Active,
    votingType: VotingType.SingleChoice,
    candidateCount: 3,
    totalVotes: 45,
    requiresRegistration: true,
    resultsVisible: false
  },
  {
    id: 2,
    title: 'Pemilihan Ketua OSIS SMA Cerdas',
    description: 'Pemilihan ketua OSIS SMA Cerdas periode 2025-2026',
    admin: mockAddresses.admin,
    startTime: BigInt(now - oneDay * 5), // Started 5 days ago
    endTime: BigInt(now - oneDay), // Ended yesterday
    state: ElectionState.Ended,
    votingType: VotingType.SingleChoice,
    candidateCount: 4,
    totalVotes: 328,
    requiresRegistration: false,
    resultsVisible: true
  },
  {
    id: 3,
    title: 'Pemilihan Tema Ulang Tahun Perusahaan',
    description: 'Pilih tema untuk acara ulang tahun PT Maju Bersama ke-10',
    admin: mockAddresses.voters[0],
    startTime: BigInt(now + oneDay), // Starts tomorrow
    endTime: BigInt(now + oneDay * 5), // Runs for 5 days
    state: ElectionState.Created,
    votingType: VotingType.MultipleChoice,
    candidateCount: 5,
    totalVotes: 0,
    requiresRegistration: false,
    resultsVisible: true
  },
  {
    id: 4,
    title: 'Pemilihan Lokasi Gathering Tim',
    description: 'Pilih lokasi untuk acara gathering tim di bulan Agustus 2025',
    admin: mockAddresses.voters[1],
    startTime: BigInt(now - oneDay * 10), // Started 10 days ago
    endTime: BigInt(now - oneDay * 3), // Ended 3 days ago
    state: ElectionState.Ended,
    votingType: VotingType.SingleChoice,
    candidateCount: 3,
    totalVotes: 24,
    requiresRegistration: true,
    resultsVisible: true
  },
  {
    id: 5,
    title: 'Referendum Pembangunan Taman Kota',
    description: 'Voting untuk persetujuan pembangunan taman kota di lahan bekas pabrik',
    admin: mockAddresses.admin,
    startTime: BigInt(now - oneDay * 3), // Started 3 days ago
    endTime: BigInt(now + oneDay * 7), // Runs for 7 more days
    state: ElectionState.Active,
    votingType: VotingType.SingleChoice,
    candidateCount: 2,
    totalVotes: 156,
    requiresRegistration: true,
    resultsVisible: false
  }
];

// Mock candidates data
export const mockCandidates: Record<number, Candidate[]> = {
  // Candidates for election 1
  1: [
    {
      id: 1,
      name: 'Budi Santoso',
      description: 'Warga RT 03 sejak 2015, bekerja sebagai pengusaha lokal',
      voteCount: 18
    },
    {
      id: 2,
      name: 'Dewi Anggraini',
      description: 'Aktif dalam kegiatan sosial lingkungan, bekerja sebagai guru',
      voteCount: 15
    },
    {
      id: 3,
      name: 'Heru Prasetyo',
      description: 'Pensiunan PNS, pernah menjabat sebagai Ketua RT periode 2020-2023',
      voteCount: 12
    }
  ],
  
  // Candidates for election 2
  2: [
    {
      id: 1,
      name: 'Anisa Wijaya',
      description: 'Kelas 11 IPA, aktif di ekstrakurikuler PMR dan Debat',
      voteCount: 98
    },
    {
      id: 2,
      name: 'Dimas Pratama',
      description: 'Kelas 11 IPS, ketua klub basket sekolah',
      voteCount: 124
    },
    {
      id: 3,
      name: 'Faisal Rahman',
      description: 'Kelas 10, bendahara OSIS periode sebelumnya',
      voteCount: 56
    },
    {
      id: 4,
      name: 'Gita Savitri',
      description: 'Kelas 11 IPA, aktif di tim olimpiade matematika',
      voteCount: 50
    }
  ],
  
  // Candidates for election 3
  3: [
    {
      id: 1,
      name: 'Tropical Paradise',
      description: 'Tema dengan nuansa pantai dan tropis',
      voteCount: 0
    },
    {
      id: 2,
      name: 'Retro 90s',
      description: 'Tema dengan nuansa nostalgia tahun 90-an',
      voteCount: 0
    },
    {
      id: 3,
      name: 'Future Tech',
      description: 'Tema futuristik dengan teknologi canggih',
      voteCount: 0
    },
    {
      id: 4,
      name: 'Elegant Gala',
      description: 'Tema pesta formal dengan dress code black tie',
      voteCount: 0
    },
    {
      id: 5,
      name: 'Cultural Festival',
      description: 'Tema festival budaya nusantara',
      voteCount: 0
    }
  ],
  
  // Candidates for election 4
  4: [
    {
      id: 1,
      name: 'Bali',
      description: 'Resort di Ubud dengan pemandangan sawah',
      voteCount: 10
    },
    {
      id: 2,
      name: 'Bandung',
      description: 'Villa di daerah Lembang dengan aktivitas outbound',
      voteCount: 8
    },
    {
      id: 3,
      name: 'Lombok',
      description: 'Resort pinggir pantai dengan aktivitas snorkeling',
      voteCount: 6
    }
  ],
  
  // Candidates for election 5
  5: [
    {
      id: 1,
      name: 'Setuju',
      description: 'Mendukung pembangunan taman kota untuk ruang terbuka hijau',
      voteCount: 86
    },
    {
      id: 2,
      name: 'Tidak Setuju',
      description: 'Lebih memilih lahan digunakan untuk fasilitas publik lain',
      voteCount: 70
    }
  ]
};

// Mock voter data
export const mockVoterStatus: Record<string, Record<number, {
  isRegistered: boolean;
  hasVoted: boolean;
  weight: number;
}>> = {
  [mockAddresses.voters[0]]: {
    1: { isRegistered: true, hasVoted: true, weight: 1 },
    2: { isRegistered: true, hasVoted: true, weight: 1 },
    3: { isRegistered: false, hasVoted: false, weight: 0 },
    4: { isRegistered: true, hasVoted: true, weight: 1 },
    5: { isRegistered: true, hasVoted: false, weight: 1 },
  },
  [mockAddresses.voters[1]]: {
    1: { isRegistered: true, hasVoted: false, weight: 1 },
    2: { isRegistered: true, hasVoted: true, weight: 1 },
    5: { isRegistered: true, hasVoted: true, weight: 1 },
  },
};

// Mock voter choices
export const mockVoterChoices: Record<string, Record<number, number[]>> = {
  [mockAddresses.voters[0]]: {
    1: [2], // Voted for candidate 2 in election 1
    2: [2], // Voted for candidate 2 in election 2
    4: [1], // Voted for candidate 1 in election 4
  },
  [mockAddresses.voters[1]]: {
    2: [3], // Voted for candidate 3 in election 2
    5: [1], // Voted for candidate 1 in election 5
  },
};

// Function to simulate getting election count from the contract
export function getMockElectionCount(): number {
  return mockElections.length;
}

// Function to simulate getting all elections from the contract
export function getMockElections(): Election[] {
  return mockElections;
}

// Function to simulate getting a specific election by ID
export function getMockElectionById(id: number): Election | undefined {
  return mockElections.find(election => election.id === id);
}

// Function to simulate getting candidates for a specific election
export function getMockCandidatesByElectionId(electionId: number): Candidate[] {
  return mockCandidates[electionId] || [];
}

// Function to simulate getting voter status
export function getMockVoterStatus(
  voter: string,
  electionId: number
): { isRegistered: boolean; hasVoted: boolean; weight: number } {
  return (
    mockVoterStatus[voter]?.[electionId] || 
    { isRegistered: false, hasVoted: false, weight: 0 }
  );
}

// Function to simulate getting voter choices
export function getMockVoterChoices(
  voter: string,
  electionId: number
): number[] {
  return mockVoterChoices[voter]?.[electionId] || [];
}

// Function to get all registered voters for an election
export function getMockRegisteredVoters(electionId: number): { address: string; isRegistered: boolean; hasVoted: boolean; weight: number }[] {
  const votersList: { address: string; isRegistered: boolean; hasVoted: boolean; weight: number }[] = [];
  
  // Iterate through all known voters to find those registered for this election
  Object.keys(mockVoterStatus).forEach(address => {
    if (mockVoterStatus[address][electionId]?.isRegistered) {
      votersList.push({
        address,
        isRegistered: true,
        hasVoted: mockVoterStatus[address][electionId].hasVoted,
        weight: mockVoterStatus[address][electionId].weight
      });
    }
  });
  
  return votersList;
}

// Function to register a voter for an election
export function mockRegisterVoter(
  electionId: number, 
  voterAddress: string, 
  weight: number = 1
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Check if election exists
      const election = getMockElectionById(electionId);
      if (!election) {
        throw new Error('Election not found');
      }
      
      // Check if caller is admin (not implemented in mock)
      
      // Create voter entry if it doesn't exist
      if (!mockVoterStatus[voterAddress]) {
        mockVoterStatus[voterAddress] = {};
      }
      
      // Check if voter is already registered
      if (mockVoterStatus[voterAddress][electionId]?.isRegistered) {
        throw new Error('Voter already registered');
      }
      
      // Register voter
      mockVoterStatus[voterAddress][electionId] = {
        isRegistered: true,
        hasVoted: false,
        weight: weight
      };
      
      setTimeout(() => resolve(true), 300);
    } catch (error) {
      reject(error);
    }
  });
}

// Function to remove a voter from an election
export function mockRemoveVoter(
  electionId: number, 
  voterAddress: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Check if election exists
      const election = getMockElectionById(electionId);
      if (!election) {
        throw new Error('Election not found');
      }
      
      // Check if voter is registered
      if (!mockVoterStatus[voterAddress]?.[electionId]?.isRegistered) {
        throw new Error('Voter not registered');
      }
      
      // Check if voter has voted
      if (mockVoterStatus[voterAddress][electionId].hasVoted) {
        throw new Error('Cannot remove voter after they\'ve voted');
      }
      
      // Remove voter
      mockVoterStatus[voterAddress][electionId].isRegistered = false;
      
      setTimeout(() => resolve(true), 300);
    } catch (error) {
      reject(error);
    }
  });
}

// Interface for mock voting function parameters
interface MockVoteParams {
  electionId: number;
  candidateIds: number[];
  voterAddress: string;
  isMultipleChoice: boolean;
}

// Function to simulate casting a vote on the blockchain
export async function mockVote({
  electionId,
  candidateIds,
  voterAddress,
  isMultipleChoice
}: MockVoteParams): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Check if the election exists
      const election = getMockElectionById(electionId);
      if (!election) {
        throw new Error('Election not found');
      }
      
      // Check if the election is active
      if (election.state !== ElectionState.Active) {
        throw new Error('Election is not active');
      }
      
      // Check if voter is registered (if required)
      const voterStatus = getMockVoterStatus(voterAddress, electionId);
      if (election.requiresRegistration && !voterStatus.isRegistered) {
        throw new Error('Voter is not registered for this election');
      }
      
      // Check if voter has already voted
      if (voterStatus.hasVoted) {
        throw new Error('Voter has already cast their vote');
      }
      
      // Validate vote choice(s)
      if (candidateIds.length === 0) {
        throw new Error('No candidates selected');
      }
      
      // For single choice elections, ensure only one candidate is selected
      if (!isMultipleChoice && candidateIds.length > 1) {
        throw new Error('Only one candidate can be selected in this election');
      }
      
      // Update the vote counts for selected candidates
      for (const candidateId of candidateIds) {
        const candidateExists = mockCandidates[electionId]?.some(c => c.id === candidateId);
        if (!candidateExists) {
          throw new Error(`Candidate with ID ${candidateId} not found`);
        }
        
        // Increase vote count for the candidate
        const candidateIndex = mockCandidates[electionId].findIndex(c => c.id === candidateId);
        if (candidateIndex !== -1) {
          mockCandidates[electionId][candidateIndex].voteCount += 1;
        }
      }
      
      // Update total votes count in the election
      const electionIndex = mockElections.findIndex(e => e.id === electionId);
      if (electionIndex !== -1) {
        mockElections[electionIndex].totalVotes += 1;
      }
      
      // Mark voter as having voted
      if (!mockVoterStatus[voterAddress]) {
        mockVoterStatus[voterAddress] = {};
      }
      
      mockVoterStatus[voterAddress][electionId] = {
        ...voterStatus,
        hasVoted: true,
        isRegistered: true,
        weight: 1
      };
      
      // Record voter choices
      if (!mockVoterChoices[voterAddress]) {
        mockVoterChoices[voterAddress] = {};
      }
      
      mockVoterChoices[voterAddress][electionId] = candidateIds;
      
      // Simulate blockchain confirmation delay
      setTimeout(() => {
        resolve();
      }, 500);
      
    } catch (error) {
      reject(error);
    }
  });
}
