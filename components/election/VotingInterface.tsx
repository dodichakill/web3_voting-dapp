'use client';

import { CandidateCard } from './CandidateCard';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { votingSystemAbi } from '@/config/votingSystemAbi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Tipe data untuk kandidat
interface Candidate {
  id: number;
  name: string;
  description: string;
  voteCount: number;
}

interface VotingInterfaceProps {
  electionId: bigint;
  contractAddress: `0x${string}`;
  candidates: Candidate[];
  totalVotes: number;
  isMultipleChoice: boolean;
  showResults: boolean;
  canVote: boolean;
  onVoteComplete: () => void;
}

export function VotingInterface({
  electionId,
  contractAddress,
  candidates,
  totalVotes,
  isMultipleChoice,
  showResults,
  canVote,
  onVoteComplete
}: VotingInterfaceProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  
  // Reset selected candidates when election changes
  useEffect(() => {
    setSelectedCandidates([]);
  }, [electionId]);
  
  // Handler untuk memilih/membatalkan kandidat
  const handleSelectCandidate = (candidateId: number) => {
    if (!canVote) return;
    
    setSelectedCandidates(prev => {
      // Jika sudah dipilih, batalkan pilihan
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      
      // Jika single choice, ganti pilihan
      if (!isMultipleChoice) {
        return [candidateId];
      }
      
      // Jika multiple choice, tambahkan ke pilihan
      return [...prev, candidateId];
    });
  };
  
  // Setup wagmi hook untuk vote
  const { writeContract, isPending, data: hash } = useWriteContract();
  
  // Tunggu transaksi selesai
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  
  // Handler untuk submit vote
  const handleVoteSubmit = async () => {
    if (selectedCandidates.length === 0) {
      toast.error('Pilih setidaknya satu kandidat');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!isMultipleChoice) {
        // Single choice
        writeContract({
          address: contractAddress,
          abi: votingSystemAbi,
          functionName: 'castVote',
          args: [electionId, BigInt(selectedCandidates[0])]
        });
      } else {
        // Multiple choice
        writeContract({
          address: contractAddress,
          abi: votingSystemAbi,
          functionName: 'castMultipleVotes',
          args: [electionId, selectedCandidates.map(id => BigInt(id))]
        });
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Gagal memberikan suara. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };
  
  // Effect untuk menangani status transaksi
  useEffect(() => {
    if (isConfirmed) {
      toast.success('Suara berhasil diberikan!');
      onVoteComplete();
      setIsSubmitting(false);
    }
  }, [isConfirmed, onVoteComplete]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        {showResults ? 'Hasil Pemilihan' : 'Daftar Kandidat'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            id={candidate.id}
            name={candidate.name}
            description={candidate.description}
            voteCount={candidate.voteCount}
            isSelected={selectedCandidates.includes(candidate.id)}
            onSelect={handleSelectCandidate}
            totalVotes={totalVotes}
            showResults={showResults}
            isMultipleChoice={isMultipleChoice}
          />
        ))}
      </div>
      
      {canVote && !showResults && (
        <div className="mt-8">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleVoteSubmit}
            disabled={selectedCandidates.length === 0 || isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>Berikan Suara {isMultipleChoice && selectedCandidates.length > 0 ? `(${selectedCandidates.length})` : ''}</>
            )}
          </Button>
          
          {isMultipleChoice && (
            <p className="text-xs text-gray-400 mt-2">
              *Anda dapat memilih lebih dari satu kandidat dalam pemilihan ini.
            </p>
          )}
        </div>
      )}
      
      {!canVote && !showResults && (
        <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg text-center">
          <p className="text-blue-300">
            Anda tidak dapat memberikan suara dalam pemilihan ini.
          </p>
        </div>
      )}
    </div>
  );
}
