# DemokrasiChain - Sistem Pemilihan Berbasis Blockchain

![DemokrasiChain Logo](https://via.placeholder.com/200x60/0A1233/FFFFFF?text=DemokrasiChain)

Aplikasi ini merupakan frontend untuk sistem voting berbasis blockchain yang dibangun dengan Next.js dan terintegrasi dengan smart contract Solidity yang diterapkan pada Monad testnet. DemokrasiChain memungkinkan pembuatan, pengelolaan, dan partisipasi dalam pemilihan yang transparan, terdesentralisasi, dan aman.

## Fitur Utama

- 🔒 **Keamanan Blockchain** - Semua data pemilihan tercatat dalam blockchain Monad untuk keamanan dan transparansi
- 👥 **Koneksi Wallet** - Integrasi RainbowKit untuk koneksi wallet yang mudah
- 🗳️ **Berbagai Jenis Pemilihan** - Mendukung pemilihan single-choice dan multiple-choice
- 👤 **Manajemen Pemilih** - Opsional pendaftaran pemilih untuk kontrol akses
- 📊 **Tampilan Hasil** - Hasil pemilihan dapat dikonfigurasi untuk transparansi atau privasi
- 🌐 **Bahasa Indonesia** - Antarmuka dalam Bahasa Indonesia

## Teknologi

- **Frontend**: Next.js 15.3.3, TypeScript, TailwindCSS, GSAP
- **Web3**: RainbowKit, Wagmi, Viem
- **UI Components**: Radix UI, react-hot-toast
- **Smart Contract**: Solidity 0.8.20 (Foundry)
- **Blockchain**: Monad Testnet

## Persiapan

### Prasyarat

- Node.js 18.0.0 atau yang lebih baru
- Dompet web3 (MetaMask, dll.) dengan testnet Monad yang telah dikonfigurasi
- Project ID WalletConnect (untuk koneksi wallet)

### Pengaturan Lingkungan

1. Buat file `.env.local` di root direktori proyek
2. Tambahkan variabel lingkungan berikut:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address_on_monad
```

### Instalasi

```bash
# Clone repositori
git clone https://your-repo-url/demokratichain.git
cd demokratichain/voting-dapp

# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Akses aplikasi di [http://localhost:3000](http://localhost:3000)

## Penggunaan

### Koneksi Wallet

1. Klik tombol "Connect Wallet" di pojok kanan atas
2. Pilih wallet Anda (MetaMask, dll.)
3. Konfirmasi koneksi ke jaringan Monad testnet

### Melihat Pemilihan

1. Setelah wallet terhubung, klik "Pemilihan" di menu navigasi
2. Jelajahi daftar pemilihan yang tersedia
3. Klik pada pemilihan untuk melihat detailnya

### Memberikan Suara

1. Buka halaman detail pemilihan
2. Pilih satu atau beberapa kandidat (tergantung jenis pemilihan)
3. Klik "Berikan Suara"
4. Konfirmasi transaksi di wallet Anda

### Membuat Pemilihan Baru (Admin)

1. Klik "Buat Pemilihan" di menu navigasi
2. Isi formulir dengan informasi pemilihan:
   - Judul dan deskripsi
   - Waktu mulai dan berakhir
   - Jenis pemilihan (single/multiple choice)
   - Pengaturan registrasi dan visibilitas hasil
3. Tambahkan kandidat (minimal 2)
4. Klik "Buat Pemilihan" dan konfirmasi transaksi

## Struktur Proyek

```
voting-dapp/
├── app/                    # Routes dan halaman Next.js
│   ├── page.tsx            # Halaman utama
│   ├── pemilihan/          # Halaman daftar dan detail pemilihan
│   └── buat-pemilihan/     # Halaman admin untuk membuat pemilihan
├── components/             # Komponen UI reusable
│   ├── ui/                 # Komponen UI dasar
│   └── election/           # Komponen khusus untuk pemilihan
├── config/                 # Konfigurasi web3 dan ABI
├── types/                  # Type definitions
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## Kontrak Pintar

Frontend ini berinteraksi dengan kontrak pintar `VotingSystem.sol` yang diimplementasikan di direktori `voting-contract` (terpisah dari proyek ini).

### Alamat Kontrak

Kontrak VotingSystem yang digunakan dalam aplikasi ini dikerahkan di Monad Testnet dengan alamat:

```
0x0000000000000000000000000000000000000000  # Ganti dengan alamat sebenarnya setelah deployment
```

## Kontribusi

Kontribusi selalu diterima! Silakan fork repositori ini, buat branch baru, dan ajukan pull request.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
