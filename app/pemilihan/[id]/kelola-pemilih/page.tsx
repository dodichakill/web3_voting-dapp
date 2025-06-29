'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ArrowLeft, Loader2, Users, AlertTriangle, Check, X, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Import mock data
import {
  getMockElectionById,
  getMockRegisteredVoters,
  mockRegisterVoter,
  mockRemoveVoter,
  mockAddresses
} from '@/config/mockContractData';
import { Election, ElectionState } from '@/types/election';

export default function KelolaVoterPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const electionId = Number(params.id);

  const [election, setElection] = useState<Election | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Voters
  const [voters, setVoters] = useState<{
    address: string;
    isRegistered: boolean;
    hasVoted: boolean;
    weight: number;
  }[]>([]);
  
  // Form state
  const [newVoterAddress, setNewVoterAddress] = useState('');
  const [newVoterWeight, setNewVoterWeight] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load election and voter data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Get election data
      const electionData = getMockElectionById(electionId);
      if (!electionData) {
        setError('Pemilihan tidak ditemukan');
        return;
      }
      
      setElection(electionData);
      
      // Check if current user is admin
      const isUserAdmin = !!address && 
        (address.toLowerCase() === electionData.admin.toLowerCase());
      setIsAdmin(isUserAdmin); // Now isUserAdmin is guaranteed to be a boolean
      
      // If not admin, show error
      if (!isUserAdmin) {
        setError('Anda tidak memiliki izin untuk mengakses halaman ini');
        return;
      }
      
      // Get voters
      const registeredVoters = getMockRegisteredVoters(electionId);
      setVoters(registeredVoters);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Gagal memuat data. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [isConnected, electionId]);
  
  // Handle register new voter
  const handleRegisterVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVoterAddress) {
      toast.error('Alamat wallet tidak boleh kosong');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await mockRegisterVoter(
        electionId, 
        newVoterAddress, 
        newVoterWeight
      );
      
      toast.success('Pemilih berhasil terdaftar');
      setNewVoterAddress('');
      setNewVoterWeight(1);
      
      // Refresh voter list
      const registeredVoters = getMockRegisteredVoters(electionId);
      setVoters(registeredVoters);
      
    } catch (err: any) {
      console.error('Error registering voter:', err);
      toast.error(err.message || 'Gagal mendaftarkan pemilih');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle remove voter
  const handleRemoveVoter = async (voterAddress: string) => {
    try {
      setIsSubmitting(true);
      
      await mockRemoveVoter(electionId, voterAddress);
      
      toast.success('Pemilih berhasil dihapus');
      
      // Refresh voter list
      const registeredVoters = getMockRegisteredVoters(electionId);
      setVoters(registeredVoters);
      
    } catch (err: any) {
      console.error('Error removing voter:', err);
      toast.error(err.message || 'Gagal menghapus pemilih');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />
      
      <section className="pt-36 pb-20 px-4">
        <div className="container mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link href={`/pemilihan/${electionId}`} className="flex items-center text-blue-400 hover:text-blue-300">
              <ArrowLeft size={16} className="mr-1" />
              <span>Kembali ke Detail Pemilihan</span>
            </Link>
          </div>
          
          {/* Page heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Kelola Pemilih
              </h1>
              {election && (
                <p className="text-gray-400 mb-2">
                  {election.title}
                </p>
              )}
            </div>
          </div>
          
          {/* Main content */}
          {!isConnected ? (
            <div className="text-center p-10 bg-blue-900/20 border border-blue-800 rounded-xl">
              <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Wallet Belum Terhubung</h2>
              <p className="text-gray-300 mb-6">
                Silakan hubungkan wallet Anda untuk mengelola pemilih.
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
              <p className="text-gray-400">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="text-center p-10 bg-red-900/20 border border-red-800 rounded-xl">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <Button 
                variant="outline" 
                onClick={fetchData}
                className="mx-auto"
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Form to add new voter */}
              <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Users size={20} className="mr-2 text-blue-400" />
                  Tambah Pemilih Baru
                </h2>
                
                <form onSubmit={handleRegisterVoter} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="voterAddress" className="block text-sm font-medium text-gray-300 mb-1">
                        Alamat Wallet
                      </label>
                      <input
                        type="text"
                        id="voterAddress"
                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="0x..."
                        value={newVoterAddress}
                        onChange={(e) => setNewVoterAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="voterWeight" className="block text-sm font-medium text-gray-300 mb-1">
                        Bobot Suara
                      </label>
                      <input
                        type="number"
                        id="voterWeight"
                        min={1}
                        max={10}
                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        value={newVoterWeight}
                        onChange={(e) => setNewVoterWeight(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="gradient"
                      disabled={isSubmitting || !newVoterAddress}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Plus size={18} className="mr-2" />
                          Tambah Pemilih
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              
              {/* Voters list */}
              <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Daftar Pemilih Terdaftar
                </h2>
                
                {voters.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Belum ada pemilih yang terdaftar.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left border-b border-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-gray-400">No</th>
                          <th className="px-4 py-2 text-gray-400">Alamat Wallet</th>
                          <th className="px-4 py-2 text-gray-400">Bobot</th>
                          <th className="px-4 py-2 text-gray-400">Status</th>
                          <th className="px-4 py-2 text-gray-400">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voters.map((voter, index) => (
                          <tr key={voter.address} className="border-b border-gray-800">
                            <td className="px-4 py-3">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="font-mono">{formatAddress(voter.address)}</span>
                                <button 
                                  className="ml-2 text-gray-500 hover:text-blue-400"
                                  onClick={() => {
                                    navigator.clipboard.writeText(voter.address);
                                    toast.success('Alamat disalin ke clipboard');
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3">{voter.weight}</td>
                            <td className="px-4 py-3">
                              {voter.hasVoted ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-300 border border-green-700">
                                  <Check size={12} className="mr-1" />
                                  Sudah Memilih
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/60 text-blue-300 border border-blue-700">
                                  Belum Memilih
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveVoter(voter.address)}
                                disabled={voter.hasVoted || isSubmitting}
                                className={voter.hasVoted ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                <Trash2 size={14} className="mr-1" />
                                Hapus
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {voters.length > 0 && (
                  <p className="text-sm text-gray-400 mt-4">
                    Total: {voters.length} pemilih terdaftar
                  </p>
                )}
              </div>
              
              {/* Information */}
              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
                <h3 className="font-medium mb-2">Informasi Penting:</h3>
                <ul className="list-disc list-inside text-sm space-y-2 text-gray-300">
                  <li>Pemilih yang sudah memberikan suara tidak dapat dihapus dari daftar.</li>
                  <li>Bobot suara memengaruhi kontribusi suara pemilih terhadap hasil akhir (default: 1).</li>
                  <li>Pastikan alamat wallet pemilih sudah benar sebelum ditambahkan.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
