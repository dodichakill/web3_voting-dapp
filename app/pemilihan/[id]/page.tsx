'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ElectionInfo } from '@/components/election/ElectionInfo';
import { VotingInterface } from '@/components/election/VotingInterface';
import { Button } from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';
import { useAccount, useContractRead } from 'wagmi';
import { readContract } from '@wagmi/core';
import { votingSystemAbi } from '@/config/votingSystemAbi';
import { useState, useEffect } from 'react';
import { Election, ElectionState, VotingType, Candidate } from '@/types/election';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Contract address (ganti dengan alamat kontrak setelah deploy)
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function ElectionDetail() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const electionId = BigInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Fungsi untuk mengambil data pemilihan dan kandidat
  async function fetchElectionData() {
    try {
      setLoading(true);
      setError(null);
      
      // Ambil informasi pemilihan
      const electionInfo = await readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: votingSystemAbi,
        functionName: 'getElectionInfo',
        args: [electionId]
      }) as [string, string, string, bigint, bigint, number, number, number, number, boolean, boolean];
      
      // Ambil data kandidat
      const candidateCount = Number(electionInfo[7]);
      const candidates: Candidate[] = [];
      
      for (let i = 1; i <= candidateCount; i++) {
        try {
          const candidateInfo = await readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: votingSystemAbi,
            functionName: 'getCandidateInfo',
            args: [electionId, BigInt(i)]
          }) as [string, string, number];
          
          candidates.push({
            id: i,
            name: candidateInfo[0],
            description: candidateInfo[1],
            voteCount: Number(candidateInfo[2])
          });
        } catch (err) {
          console.error(`Error fetching candidate ${i}:`, err);
        }
      }
      
      // Cek apakah pengguna terdaftar (jika pemilihan memerlukan registrasi)
      let registered = false;
      if (electionInfo[9] && address) { // requiresRegistration dan address ada
        try {
          registered = await readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: votingSystemAbi,
            functionName: 'isRegisteredVoter',
            args: [electionId, address]
          }) as boolean;
        } catch (err) {
          console.error('Error checking voter registration:', err);
        }
      }
      
      // Cek apakah pengguna sudah memilih
      let voted = false;
      if (address) {
        try {
          voted = await readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: votingSystemAbi,
            functionName: 'hasVoted',
            args: [electionId, address]
          }) as boolean;
        } catch (err) {
          console.error('Error checking if voted:', err);
        }
      }
      
      // Set state dengan data yang diperoleh
      setElection({
        id: Number(params.id),
        title: electionInfo[0],
        description: electionInfo[1],
        admin: electionInfo[2],
        startTime: electionInfo[3],
        endTime: electionInfo[4],
        state: electionInfo[5] as ElectionState,
        votingType: electionInfo[6] as VotingType,
        candidateCount: candidateCount,
        totalVotes: Number(electionInfo[8]),
        requiresRegistration: electionInfo[9],
        resultsVisible: electionInfo[10]
      });
      
      setCandidates(candidates);
      setIsRegistered(registered);
      setHasVoted(voted);
      
    } catch (err) {
      console.error('Error fetching election data:', err);
      setError('Gagal memuat data pemilihan. Silakan coba lagi nanti.');
      toast.error('Gagal memuat data pemilihan');
    } finally {
      setLoading(false);
    }
  }
  
  // Load election data on component mount
  useEffect(() => {
    if (isConnected) {
      fetchElectionData();
    }
  }, [isConnected, params.id]);

  // Handler ketika voting selesai dilakukan
  const handleVoteComplete = () => {
    setHasVoted(true);
    fetchElectionData(); // Refresh data
  };
  
  // Menentukan apakah hasil harus ditampilkan
  const showResults = election?.resultsVisible && (election.state === ElectionState.Ended || hasVoted);
  
  // Menentukan apakah pengguna dapat memberikan suara
  const canVote = 
    election?.state === ElectionState.Active && 
    isConnected &&
    !hasVoted && 
    (!election.requiresRegistration || isRegistered);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />
      
      <section className="pt-36 pb-20 px-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <Link href="/pemilihan" className="flex items-center text-blue-400 hover:text-blue-300">
              <ArrowLeft size={16} className="mr-1" />
              <span>Kembali ke Daftar Pemilihan</span>
            </Link>
          </div>
          
          {!isConnected ? (
            <div className="text-center p-10 bg-blue-900/20 border border-blue-800 rounded-xl">
              <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Wallet Belum Terhubung</h2>
              <p className="text-gray-300 mb-6">
                Silakan hubungkan wallet Anda untuk melihat detail pemilihan.
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
              <p className="text-gray-400">Memuat detail pemilihan...</p>
            </div>
          ) : error ? (
            <div className="text-center p-10 bg-red-900/20 border border-red-800 rounded-xl">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchElectionData()}
                className="mx-auto"
              >
                Coba Lagi
              </Button>
            </div>
          ) : election ? (
            <div>
              <ElectionInfo
                title={election.title}
                description={election.description}
                admin={election.admin}
                startTime={election.startTime}
                endTime={election.endTime}
                state={election.state}
                totalVotes={election.totalVotes}
                requiresRegistration={election.requiresRegistration}
                isRegistered={isRegistered}
                hasVoted={hasVoted}
              />
              
              <VotingInterface
                electionId={electionId}
                contractAddress={CONTRACT_ADDRESS as `0x${string}`}
                candidates={candidates}
                totalVotes={election.totalVotes}
                isMultipleChoice={election.votingType === VotingType.MultipleChoice}
                showResults={Boolean(showResults)}
                canVote={Boolean(canVote)}
                onVoteComplete={handleVoteComplete}
              />
            </div>
          ) : null}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
