"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormToggle } from "@/components/ui/FormToggle";
import { Button } from "@/components/ui/Button";
import {
  CandidateForm,
  CandidateFormData,
} from "@/components/election/CandidateForm";
import { votingSystemAbi } from "@/config/votingSystemAbi";
import { AlertTriangle, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

// Contract address (ganti dengan alamat kontrak setelah deploy)
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function CreateElectionPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [requiresRegistration, setRequiresRegistration] = useState(true);
  const [resultsVisible, setResultsVisible] = useState(true);
  const [candidates, setCandidates] = useState<CandidateFormData[]>([]);

  // Error state
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    candidates?: string;
  }>({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup minimum date/time for datetime-local inputs
  const [minStartTime, setMinStartTime] = useState("");
  const [minEndTime, setMinEndTime] = useState("");

  // Format date for datetime-local input
  const formatDateForDatetimeLocal = (date: Date): string => {
    return date.toISOString().slice(0, 16);
  };

  // Convert datetime-local string to Unix timestamp
  const dateToTimestamp = (dateString: string): number => {
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  useEffect(() => {
    // Set minimum start time to now
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Add 5 minutes buffer
    setMinStartTime(formatDateForDatetimeLocal(now));

    // If start time is set, ensure end time is after start time
    if (startTime) {
      const startDate = new Date(startTime);
      startDate.setMinutes(startDate.getMinutes() + 5); // Minimum 5 minutes duration
      setMinEndTime(formatDateForDatetimeLocal(startDate));
    }
  }, [startTime]);

  // Handler untuk menambah kandidat
  const handleAddCandidate = (candidate: CandidateFormData) => {
    setCandidates([...candidates, candidate]);
    // Clear candidates error if exists
    if (errors.candidates) {
      setErrors((prev) => ({ ...prev, candidates: undefined }));
    }
  };

  // Handler untuk menghapus kandidat
  const handleRemoveCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  // Setup wagmi hook untuk contract write
  const { writeContract, isPending, data: hash } = useWriteContract();

  // Tunggu transaksi selesai
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Validasi form
  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      startTime?: string;
      endTime?: string;
      candidates?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "Judul pemilihan diperlukan";
    }

    if (!description.trim()) {
      newErrors.description = "Deskripsi pemilihan diperlukan";
    }

    if (!startTime) {
      newErrors.startTime = "Waktu mulai diperlukan";
    }

    if (!endTime) {
      newErrors.endTime = "Waktu berakhir diperlukan";
    } else if (startTime && new Date(endTime) <= new Date(startTime)) {
      newErrors.endTime = "Waktu berakhir harus setelah waktu mulai";
    }

    if (candidates.length < 2) {
      newErrors.candidates = "Setidaknya 2 kandidat diperlukan untuk pemilihan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect untuk menangani status transaksi pembuatan pemilihan
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Pemilihan berhasil dibuat!");
      // Redirect ke halaman pemilihan setelah berhasil
      // Idealnya mendapatkan electionId dari event transaksi
      // Untuk contoh ini, kembali ke daftar pemilihan
      router.push("/pemilihan");
      setIsSubmitting(false);
    }
  }, [isConfirmed, router]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon perbaiki kesalahan pada form");
      return;
    }

    try {
      setIsSubmitting(true);

      // Buat pemilihan
      const startTimestamp = BigInt(dateToTimestamp(startTime));
      const endTimestamp = BigInt(dateToTimestamp(endTime));

      // Menggunakan writeContract dari Wagmi v2
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: votingSystemAbi,
        functionName: "createElection",
        args: [
          title,
          description,
          startTimestamp,
          endTimestamp,
          isMultipleChoice ? 1 : 0, // VotingType.SingleChoice = 0, VotingType.MultipleChoice = 1
          isMultipleChoice ? BigInt(candidates.length) : BigInt(1), // maxVotesPerVoter: jika multiple choice bisa semua kandidat, jika single choice hanya 1
          requiresRegistration,
          resultsVisible,
        ],
      });

      // Kandidat akan ditambahkan setelah pemilihan dibuat dan mendapatkan ID pemilihan dari event
      // Event handler akan menangani redirect setelah transaksi dikonfirmasi
    } catch (error: any) {
      console.error("Error creating election:", error);
      toast.error(
        error.message || "Gagal membuat pemilihan. Silakan coba lagi."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />

      <section className="pt-36 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Buat Pemilihan Baru
            </h1>
            <p className="text-gray-400">
              Buat pemilihan baru dan tambahkan kandidat untuk memulai proses
              voting berbasis blockchain.
            </p>
          </div>

          {!isConnected ? (
            <div className="text-center p-10 bg-blue-900/20 border border-blue-800 rounded-xl">
              <AlertTriangle
                size={48}
                className="mx-auto text-yellow-500 mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Wallet Belum Terhubung</h2>
              <p className="text-gray-300 mb-6">
                Silakan hubungkan wallet Anda untuk membuat pemilihan baru.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Detail Pemilihan */}
              <div className="p-6 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">
                  Informasi Pemilihan
                </h2>

                <FormInput
                  label="Judul Pemilihan"
                  placeholder="Masukkan judul pemilihan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                  required
                />

                <FormTextarea
                  label="Deskripsi Pemilihan"
                  placeholder="Masukkan deskripsi lengkap pemilihan"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={errors.description}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    type="datetime-local"
                    label="Waktu Mulai"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min={minStartTime}
                    error={errors.startTime}
                    required
                  />

                  <FormInput
                    type="datetime-local"
                    label="Waktu Berakhir"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    min={minEndTime}
                    error={errors.endTime}
                    required
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <FormToggle
                    label="Pemilihan Multi-Pilihan"
                    helperText="Aktifkan untuk memungkinkan pemilih memilih lebih dari satu kandidat"
                    defaultChecked={isMultipleChoice}
                    onChange={setIsMultipleChoice}
                  />

                  <FormToggle
                    label="Memerlukan Registrasi"
                    helperText="Aktifkan jika pemilih harus terdaftar terlebih dahulu sebelum dapat memberikan suara"
                    defaultChecked={requiresRegistration}
                    onChange={setRequiresRegistration}
                  />

                  <FormToggle
                    label="Hasil Terlihat"
                    helperText="Aktifkan untuk memungkinkan pemilih melihat hasil setelah memberikan suara"
                    defaultChecked={resultsVisible}
                    onChange={setResultsVisible}
                  />
                </div>
              </div>

              {/* Kandidat */}
              <div className="p-6 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl">
                <CandidateForm
                  onAdd={handleAddCandidate}
                  onRemove={handleRemoveCandidate}
                  candidates={candidates}
                />

                {errors.candidates && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.candidates}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <Link href="/pemilihan">
                  <Button variant="outline" type="button">
                    Kembali
                  </Button>
                </Link>

                <Button
                  variant="gradient"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>Buat Pemilihan</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
