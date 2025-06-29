'use client';

import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface CandidateFormData {
  name: string;
  description: string;
}

interface CandidateFormProps {
  onAdd: (candidate: CandidateFormData) => void;
  onRemove: (index: number) => void;
  candidates: CandidateFormData[];
}

export function CandidateForm({ onAdd, onRemove, candidates }: CandidateFormProps) {
  const [newCandidate, setNewCandidate] = useState<CandidateFormData>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const handleChange = (field: keyof CandidateFormData, value: string) => {
    setNewCandidate(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateCandidate = () => {
    const newErrors: {
      name?: string;
      description?: string;
    } = {};
    
    if (!newCandidate.name.trim()) {
      newErrors.name = 'Nama kandidat diperlukan';
    }
    
    if (!newCandidate.description.trim()) {
      newErrors.description = 'Deskripsi kandidat diperlukan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateCandidate()) {
      onAdd(newCandidate);
      setNewCandidate({
        name: '',
        description: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Kandidat</h3>
      
      {/* Form untuk menambah kandidat */}
      <div className="p-4 bg-gray-900/70 rounded-lg border border-gray-800">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Tambah Kandidat Baru</h4>
        <FormInput 
          label="Nama Kandidat"
          placeholder="Masukkan nama kandidat"
          value={newCandidate.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />
        
        <FormTextarea 
          label="Deskripsi Kandidat"
          placeholder="Masukkan deskripsi kandidat"
          value={newCandidate.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
        />
        
        <Button 
          variant="blue"
          onClick={handleAdd}
          className="mt-2"
        >
          Tambahkan Kandidat
        </Button>
      </div>
      
      {/* Daftar kandidat yang sudah ditambahkan */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">Kandidat Terdaftar ({candidates.length})</h4>
        {candidates.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Belum ada kandidat yang ditambahkan</p>
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div>
                  <h5 className="font-medium">{candidate.name}</h5>
                  <p className="text-sm text-gray-400">{candidate.description}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
