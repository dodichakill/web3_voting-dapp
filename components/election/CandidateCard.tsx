"use client";

import { Button } from "@/components/ui/Button";
import { Check, User } from "lucide-react";
import { useState } from "react";

interface CandidateCardProps {
  id: number;
  name: string;
  description: string;
  voteCount: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
  totalVotes: number;
  showResults: boolean;
  isMultipleChoice: boolean;
}

export function CandidateCard({
  id,
  name,
  description,
  voteCount,
  isSelected,
  onSelect,
  totalVotes,
  showResults,
  isMultipleChoice,
}: CandidateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const percentage =
    totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <div
      className={`relative p-6 rounded-xl transition-all duration-300 ${
        isSelected
          ? "bg-blue-900/30 border-2 border-blue-500"
          : "bg-gray-900/50 border border-gray-800 hover:border-blue-500/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Check size={16} className="text-white" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
          <User size={24} className="text-gray-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <p className="text-sm text-gray-400 mb-4">{description}</p>

          {showResults && (
            <div className="mt-2 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Perolehan suara:</span>
                <span className="font-bold text-blue-400">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {voteCount} suara
              </div>
            </div>
          )}

          {!showResults && (
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(id)}
              className="mt-2"
            >
              {isMultipleChoice
                ? isSelected
                  ? "Batalkan Pilihan"
                  : "Pilih Kandidat"
                : isSelected
                ? "Kandidat Dipilih"
                : "Pilih Kandidat"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
