'use client';

import { Heart, Github } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-black/0 via-black/50 to-black mt-20 py-12 text-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              DemokrasiChain
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Platform pemilihan berbasis blockchain yang aman, transparan, dan terdesentralisasi. 
              Dirancang untuk memberikan pengalaman voting yang tak bisa dimanipulasi.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Tautan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/pemilihan" className="hover:text-blue-400 transition-colors">
                  Daftar Pemilihan
                </Link>
              </li>
              <li>
                <Link href="/buat-pemilihan" className="hover:text-blue-400 transition-colors">
                  Buat Pemilihan Baru
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Powered By</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://monad.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Monad Blockchain
                </a>
              </li>
              <li>
                <a 
                  href="https://nextjs.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Next.js
                </a>
              </li>
              <li>
                <a 
                  href="https://www.rainbowkit.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  RainbowKit
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span>&copy; {currentYear} DemokrasiChain.</span>
            <span className="flex items-center">
              Dibuat dengan <Heart size={14} className="mx-1 text-red-500" /> oleh Tim 2
            </span>
          </p>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
