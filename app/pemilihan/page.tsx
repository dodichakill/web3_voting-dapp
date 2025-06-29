'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Vote, Calendar, Clock, User, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import toast from 'react-hot-toast';

// Import mock data for development
import { getMockElections, mockAddresses } from '@/config/mockContractData';

// Contract address (ganti dengan alamat kontrak setelah deploy)
const CONTRACT_ADDRESS = mockAddresses.contract;

// Enum untuk ElectionState
enum ElectionState {
  Created = 0,
  Active = 1,
  Paused = 2,
  Ended = 3,
  Canceled = 4
}

// Enum untuk VotingType
enum VotingType {
  SingleChoice = 0,
  MultipleChoice = 1
}

// Interface untuk data pemilihan
interface Election {
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

export default function ElectionsPage() {
  const { address, isConnected } = useAccount();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data pemilihan dari mock data
  async function fetchElections() {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get elections from mock data
      const mockElections = getMockElections();
      setElections(mockElections);
      
    } catch (err) {
      console.error("Error fetching elections:", err);
      setError("Gagal memuat daftar pemilihan. Silakan coba lagi nanti.");
      toast.error("Gagal memuat data pemilihan");
    } finally {
      setLoading(false);
    }
  }

  // Load elections on component mount
  useEffect(() => {
    if (isConnected) {
      fetchElections();
    }
  }, [isConnected]);

  // GSAP animations
  useEffect(() => {
    if (!loading && elections.length > 0) {
      gsap.from('.election-card', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [loading, elections]);

  // Format timestamp ke tanggal yang dapat dibaca
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status badge berdasarkan state
  const getStatusBadge = (state: ElectionState) => {
    switch (state) {
      case ElectionState.Created:
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-900/60 text-blue-300 border border-blue-700">Dibuat</span>;
      case ElectionState.Active:
        return <span className="px-2 py-1 rounded-full text-xs bg-green-900/60 text-green-300 border border-green-700">Aktif</span>;
      case ElectionState.Paused:
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-900/60 text-yellow-300 border border-yellow-700">Dijeda</span>;
      case ElectionState.Ended:
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-900/60 text-purple-300 border border-purple-700">Selesai</span>;
      case ElectionState.Canceled:
        return <span className="px-2 py-1 rounded-full text-xs bg-red-900/60 text-red-300 border border-red-700">Dibatalkan</span>;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />
      
      <section className="pt-36 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Daftar Pemilihan
              </h1>
              <p className="text-gray-400">
                Lihat dan ikuti pemilihan yang sedang aktif
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link href="/buat-pemilihan">
                <Button variant="gradient">Buat Pemilihan Baru</Button>
              </Link>
            </div>
          </div>
          
          {!isConnected ? (
            <div className="text-center p-10 bg-blue-900/20 border border-blue-800 rounded-xl">
              <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Wallet Belum Terhubung</h2>
              <p className="text-gray-300 mb-6">
                Silakan hubungkan wallet Anda untuk melihat daftar pemilihan yang tersedia.
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
              <p className="text-gray-400">Memuat daftar pemilihan...</p>
            </div>
          ) : error ? (
            <div className="text-center p-10 bg-red-900/20 border border-red-800 rounded-xl">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchElections()}
                className="mx-auto"
              >
                Coba Lagi
              </Button>
            </div>
          ) : elections.length === 0 ? (
            <div className="text-center p-10 bg-gray-900/20 border border-gray-800 rounded-xl">
              <Vote size={48} className="mx-auto text-gray-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Tidak Ada Pemilihan</h2>
              <p className="text-gray-300 mb-6">
                Saat ini belum ada pemilihan yang tersedia. Mulai buat pemilihan baru sekarang!
              </p>
              <Link href="/buat-pemilihan">
                <Button variant="gradient" className="mx-auto">Buat Pemilihan</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elections.map((election) => (
                <Link 
                  key={election.id} 
                  href={`/pemilihan/${election.id}`}
                  className="election-card block"
                >
                  <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 hover:border-blue-600/50 rounded-xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Vote size={20} className="text-blue-400" />
                      </div>
                      {getStatusBadge(election.state)}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{election.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{election.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar size={14} className="mr-2 text-blue-400" />
                        <span>Mulai: {formatDate(election.startTime)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock size={14} className="mr-2 text-purple-400" />
                        <span>Selesai: {formatDate(election.endTime)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <User size={14} className="mr-2 text-green-400" />
                        <span>Kandidat: {election.candidateCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                      <div className="text-sm">
                        <span className="text-blue-400 font-semibold">{election.totalVotes}</span>
                        <span className="text-gray-400 ml-1">suara</span>
                      </div>
                      <div className="flex items-center text-blue-400 text-sm font-medium">
                        <span>Lihat Detail</span>
                        <ChevronRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
