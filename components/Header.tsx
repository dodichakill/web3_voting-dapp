'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Vote, VoteIcon, Home, Plus } from 'lucide-react';
import { useAccount } from 'wagmi';
import gsap from 'gsap';

export function Header() {
  const { isConnected } = useAccount();
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek scroll untuk header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animasi logo dengan GSAP
  useEffect(() => {
    const logoTl = gsap.timeline({ repeat: -1, repeatDelay: 5 });
    logoTl.to('#logo-icon', { 
      rotation: 360, 
      duration: 3,
      ease: 'power1.inOut'
    });
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md py-3 shadow-lg' 
          : 'bg-black/20 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
            <VoteIcon id="logo-icon" size={24} className="text-white" />
          </div>
          <div className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            DemokrasiChain
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {isConnected && (
            <>
              <Link href="/">
                <Button variant="ghost" className="flex gap-2 items-center">
                  <Home size={18} />
                  <span className="hidden md:inline">Beranda</span>
                </Button>
              </Link>
              <Link href="/pemilihan">
                <Button variant="ghost" className="flex gap-2 items-center">
                  <Vote size={18} />
                  <span className="hidden md:inline">Pemilihan</span>
                </Button>
              </Link>
              <Link href="/buat-pemilihan">
                <Button variant="gradient" size="sm" className="flex gap-2 items-center">
                  <Plus size={18} />
                  <span className="hidden md:inline">Buat Pemilihan</span>
                </Button>
              </Link>
            </>
          )}
          
          <ConnectButton 
            chainStatus="icon" 
            showBalance={false} 
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </header>
  );
}
