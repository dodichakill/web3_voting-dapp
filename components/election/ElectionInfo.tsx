'use client';

import { Calendar, Clock, User, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ElectionState } from '@/types/election';

interface ElectionInfoProps {
  title: string;
  description: string;
  admin: string;
  startTime: bigint;
  endTime: bigint;
  state: ElectionState;
  totalVotes: number;
  requiresRegistration: boolean;
  isRegistered: boolean;
  hasVoted: boolean;
}

export function ElectionInfo({
  title,
  description,
  admin,
  startTime,
  endTime,
  state,
  totalVotes,
  requiresRegistration,
  isRegistered,
  hasVoted
}: ElectionInfoProps) {
  
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
        return <span className="px-3 py-1 rounded-full text-sm bg-blue-900/60 text-blue-300 border border-blue-700">Dibuat</span>;
      case ElectionState.Active:
        return <span className="px-3 py-1 rounded-full text-sm bg-green-900/60 text-green-300 border border-green-700">Aktif</span>;
      case ElectionState.Paused:
        return <span className="px-3 py-1 rounded-full text-sm bg-yellow-900/60 text-yellow-300 border border-yellow-700">Dijeda</span>;
      case ElectionState.Ended:
        return <span className="px-3 py-1 rounded-full text-sm bg-purple-900/60 text-purple-300 border border-purple-700">Selesai</span>;
      case ElectionState.Canceled:
        return <span className="px-3 py-1 rounded-full text-sm bg-red-900/60 text-red-300 border border-red-700">Dibatalkan</span>;
      default:
        return null;
    }
  };

  const isActiveOrEnded = state === ElectionState.Active || state === ElectionState.Ended;
  const canVote = isActiveOrEnded && (!requiresRegistration || isRegistered) && !hasVoted;
  const showRegistrationWarning = requiresRegistration && !isRegistered && state === ElectionState.Active;
  const isActive = state === ElectionState.Active;
  const isEnded = state === ElectionState.Ended;
  const showVotingComplete = hasVoted && (isActive || isEnded);
  
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {getStatusBadge(state)}
      </div>
      
      <p className="text-gray-300 mb-6">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center text-gray-400">
          <Calendar size={18} className="mr-2 text-blue-400" />
          <span className="text-sm">Mulai: {formatDate(startTime)}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <Clock size={18} className="mr-2 text-purple-400" />
          <span className="text-sm">Selesai: {formatDate(endTime)}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <Users size={18} className="mr-2 text-green-400" />
          <span className="text-sm">Total Suara: {totalVotes}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <User size={18} className="mr-2 text-yellow-400" />
          <span className="text-sm">Admin: {`${admin.substring(0, 6)}...${admin.substring(38)}`}</span>
        </div>
      </div>

      {/* Status pemilih */}
      <div className="mt-6 space-y-4">
        {showRegistrationWarning && (
          <div className="flex items-center p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg">
            <AlertTriangle size={20} className="text-yellow-500 mr-2" />
            <span className="text-sm text-yellow-200">
              Pemilihan ini memerlukan registrasi. Anda belum terdaftar sebagai pemilih.
            </span>
          </div>
        )}

        {showVotingComplete && (
          <div className="flex items-center p-3 bg-green-900/30 border border-green-800 rounded-lg">
            <CheckCircle2 size={20} className="text-green-500 mr-2" />
            <span className="text-sm text-green-200">
              Anda telah memberikan suara dalam pemilihan ini.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
