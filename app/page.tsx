'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Vote, Shield, Lock, Zap } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Home() {
  const { isConnected } = useAccount();
  const [showHeroAnimation, setShowHeroAnimation] = useState(false);

  // GSAP animations
  useEffect(() => {
    setShowHeroAnimation(true);

    if (showHeroAnimation) {
      // Hero section animation
      const heroTl = gsap.timeline();
      
      heroTl.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
      
      heroTl.from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5');
      
      heroTl.from('.hero-buttons', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.5');

      // Features animation
      gsap.from('.feature-card', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
        }
      });

      // Stats animation
      gsap.from('.stat-item', {
        scale: 0.9,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      });
    }
  }, [showHeroAnimation]);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Vote size={40} className="text-white" />
            </div>
            
            <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              DemokrasiChain
            </h1>
            
            <p className="hero-description max-w-2xl text-lg mb-8 text-gray-300">
              Platform voting berbasis blockchain yang <span className="text-blue-400">aman</span>, <span className="text-purple-400">transparan</span>, 
              dan <span className="text-pink-400">terdesentralisasi</span>. Berpartisipasilah dalam pemilihan tanpa kekhawatiran tentang manipulasi data.
            </p>
            
            <div className="hero-buttons flex flex-wrap gap-4 justify-center">
              {isConnected ? (
                <>
                  <Link href="/pemilihan">
                    <Button variant="gradient" size="xl" className="animate-pulse">
                      Lihat Pemilihan
                    </Button>
                  </Link>
                  <Link href="/buat-pemilihan">
                    <Button variant="outline" size="xl">
                      Buat Pemilihan Baru
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="p-4 bg-blue-900/30 rounded-lg border border-blue-700 text-blue-200">
                  Hubungkan wallet Anda untuk mengakses fitur pemilihan
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Fitur Unggulan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Shield size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Keamanan Terjamin</h3>
              <p className="text-gray-400">
                Smart contract kami menjamin suara Anda tercatat dengan aman dan tidak dapat dimanipulasi.
              </p>
            </div>
            
            <div className="feature-card bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Lock size={28} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparansi Total</h3>
              <p className="text-gray-400">
                Semua data pemilihan tersimpan di blockchain dan dapat diaudit secara publik.
              </p>
            </div>
            
            <div className="feature-card bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <Vote size={28} className="text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mudah Digunakan</h3>
              <p className="text-gray-400">
                Antarmuka yang ramah pengguna memungkinkan siapa saja dapat berpartisipasi dalam pemilihan.
              </p>
            </div>
            
            <div className="feature-card bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                <Zap size={28} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hasil Instan</h3>
              <p className="text-gray-400">
                Dapatkan hasil pemilihan secara instan setelah periode voting berakhir.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item flex flex-col items-center p-6 bg-gradient-to-br from-blue-900/20 to-blue-600/10 rounded-xl border border-blue-800/40">
              <span className="text-4xl md:text-5xl font-bold text-blue-400">2,500+</span>
              <span className="text-sm mt-2 text-blue-200">Pengguna Aktif</span>
            </div>
            
            <div className="stat-item flex flex-col items-center p-6 bg-gradient-to-br from-purple-900/20 to-purple-600/10 rounded-xl border border-purple-800/40">
              <span className="text-4xl md:text-5xl font-bold text-purple-400">150+</span>
              <span className="text-sm mt-2 text-purple-200">Pemilihan Berjalan</span>
            </div>
            
            <div className="stat-item flex flex-col items-center p-6 bg-gradient-to-br from-pink-900/20 to-pink-600/10 rounded-xl border border-pink-800/40">
              <span className="text-4xl md:text-5xl font-bold text-pink-400">500K+</span>
              <span className="text-sm mt-2 text-pink-200">Suara Tercatat</span>
            </div>
            
            <div className="stat-item flex flex-col items-center p-6 bg-gradient-to-br from-indigo-900/20 to-indigo-600/10 rounded-xl border border-indigo-800/40">
              <span className="text-4xl md:text-5xl font-bold text-indigo-400">99.9%</span>
              <span className="text-sm mt-2 text-indigo-200">Keamanan Terjamin</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Untuk <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Memulai?</span>
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Hubungkan wallet Anda dan mulailah menggunakan platform voting terdesentralisasi yang aman dan transparan.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {isConnected ? (
                <Link href="/pemilihan">
                  <Button variant="gradient" size="xl">
                    Jelajahi Pemilihan
                  </Button>
                </Link>
              ) : (
                <p className="p-4 bg-blue-900/30 rounded-lg border border-blue-700 text-blue-200">
                  Hubungkan wallet Anda untuk memulai
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
