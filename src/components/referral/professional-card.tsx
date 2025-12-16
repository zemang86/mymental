'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Video, Users, Clock, DollarSign, Globe } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui';

export interface Professional {
  id: string;
  name: string;
  credentials?: string;
  specializations: string[];
  contact_type: string[];
  phone?: string;
  email?: string;
  location?: string;
  address?: string;
  languages: string[];
  accepting_patients: boolean;
  session_fee_range?: string;
  availability?: string;
  bio?: string;
  bio_ms?: string;
}

interface ProfessionalCardProps {
  professional: Professional;
  onRequestReferral: (professional: Professional) => void;
  locale?: 'en' | 'ms';
}

export function ProfessionalCard({
  professional,
  onRequestReferral,
  locale = 'en',
}: ProfessionalCardProps) {
  const bio = locale === 'ms' && professional.bio_ms ? professional.bio_ms : professional.bio;

  const specializationLabels: Record<string, { en: string; ms: string }> = {
    anxiety: { en: 'Anxiety', ms: 'Kebimbangan' },
    depression: { en: 'Depression', ms: 'Kemurungan' },
    trauma: { en: 'Trauma', ms: 'Trauma' },
    ptsd: { en: 'PTSD', ms: 'PTSD' },
    ocd: { en: 'OCD', ms: 'OCD' },
    stress: { en: 'Stress', ms: 'Tekanan' },
    relationship: { en: 'Relationships', ms: 'Perhubungan' },
    family: { en: 'Family', ms: 'Keluarga' },
  };

  const contactTypeIcons = {
    in_person: Users,
    phone: Phone,
    video: Video,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="hover:border-primary-300 transition-colors">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                {professional.name}
              </h3>
              {professional.credentials && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {professional.credentials}
                </p>
              )}
            </div>
            {professional.accepting_patients && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                {locale === 'ms' ? 'Menerima Pesakit' : 'Accepting Patients'}
              </span>
            )}
          </div>

          {/* Specializations */}
          {professional.specializations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {professional.specializations.map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs rounded-full"
                >
                  {specializationLabels[spec]?.[locale] || spec}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-3">
              {bio}
            </p>
          )}

          {/* Details Grid */}
          <div className="space-y-2 mb-4 text-sm">
            {professional.location && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{professional.location}</span>
              </div>
            )}

            {professional.languages.length > 0 && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span>{professional.languages.join(', ')}</span>
              </div>
            )}

            {professional.contact_type.length > 0 && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <div className="flex gap-1">
                  {professional.contact_type.map((type) => {
                    const Icon = contactTypeIcons[type as keyof typeof contactTypeIcons];
                    return Icon ? <Icon key={type} className="w-4 h-4" /> : null;
                  })}
                </div>
                <span>
                  {professional.contact_type
                    .map((t) => {
                      if (t === 'in_person') return locale === 'ms' ? 'Secara Bersemuka' : 'In-Person';
                      if (t === 'phone') return locale === 'ms' ? 'Telefon' : 'Phone';
                      if (t === 'video') return locale === 'ms' ? 'Video' : 'Video';
                      return t;
                    })
                    .join(', ')}
                </span>
              </div>
            )}

            {professional.session_fee_range && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span>{professional.session_fee_range}</span>
              </div>
            )}

            {professional.availability && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{professional.availability}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <GlassButton
            variant="primary"
            className="w-full"
            onClick={() => onRequestReferral(professional)}
            disabled={!professional.accepting_patients}
          >
            {locale === 'ms' ? 'Minta Rujukan' : 'Request Referral'}
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}
