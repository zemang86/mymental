'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, Globe, Loader2 } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { ProfessionalCard, type Professional } from '@/components/referral/professional-card';

export default function ReferralsPage() {
  const router = useRouter();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale] = useState<'en' | 'ms'>('en');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [acceptingOnly, setAcceptingOnly] = useState(true);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [professionals, searchQuery, selectedLocation, selectedSpecialization, selectedLanguage, acceptingOnly]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/referral/professionals');
      const data = await response.json();

      if (data.success) {
        setProfessionals(data.professionals);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...professionals];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.credentials?.toLowerCase().includes(query) ||
          p.bio?.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((p) =>
        p.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Specialization filter
    if (selectedSpecialization) {
      filtered = filtered.filter((p) =>
        p.specializations.includes(selectedSpecialization)
      );
    }

    // Language filter
    if (selectedLanguage) {
      filtered = filtered.filter((p) => p.languages.includes(selectedLanguage));
    }

    // Accepting patients only
    if (acceptingOnly) {
      filtered = filtered.filter((p) => p.accepting_patients);
    }

    setFilteredProfessionals(filtered);
  };

  const handleRequestReferral = (professional: Professional) => {
    // Navigate to referral request form with professional ID
    router.push(`/referrals/request?professionalId=${professional.id}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedSpecialization('');
    setSelectedLanguage('');
    setAcceptingOnly(true);
  };

  // Extract unique values for filters
  const uniqueLocations = Array.from(
    new Set(professionals.map((p) => p.location).filter(Boolean))
  ).sort();

  const uniqueSpecializations = Array.from(
    new Set(professionals.flatMap((p) => p.specializations))
  ).sort();

  const uniqueLanguages = Array.from(
    new Set(professionals.flatMap((p) => p.languages))
  ).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              {locale === 'ms' ? 'Direktori Profesional' : 'Professional Directory'}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {locale === 'ms'
                ? 'Cari profesional kesihatan mental yang disahkan untuk menyokong perjalanan anda'
                : 'Find verified mental health professionals to support your journey'}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="mb-8">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {locale === 'ms' ? 'Tapis' : 'Filters'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder={locale === 'ms' ? 'Cari...' : 'Search...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">{locale === 'ms' ? 'Semua Lokasi' : 'All Locations'}</option>
                      {uniqueLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Specialization */}
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">{locale === 'ms' ? 'Semua Kepakaran' : 'All Specializations'}</option>
                      {uniqueSpecializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language */}
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">{locale === 'ms' ? 'Semua Bahasa' : 'All Languages'}</option>
                      {uniqueLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Accepting patients checkbox */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptingOnly}
                      onChange={(e) => setAcceptingOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    {locale === 'ms' ? 'Menerima pesakit sahaja' : 'Accepting patients only'}
                  </label>

                  <GlassButton variant="ghost" size="sm" onClick={resetFilters}>
                    {locale === 'ms' ? 'Set Semula' : 'Reset Filters'}
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <GlassCard className="max-w-md mx-auto">
                <div className="p-8">
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    {locale === 'ms'
                      ? 'Tiada profesional dijumpai. Cuba ubah penapis anda.'
                      : 'No professionals found. Try adjusting your filters.'}
                  </p>
                  <GlassButton variant="secondary" onClick={resetFilters}>
                    {locale === 'ms' ? 'Set Semula Penapis' : 'Reset Filters'}
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <>
              {/* Results count */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-neutral-600 dark:text-neutral-400 mb-4"
              >
                {locale === 'ms'
                  ? `Menunjukkan ${filteredProfessionals.length} profesional`
                  : `Showing ${filteredProfessionals.length} professional${
                      filteredProfessionals.length !== 1 ? 's' : ''
                    }`}
              </motion.p>

              {/* Professional cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessionals.map((professional, index) => (
                  <motion.div
                    key={professional.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProfessionalCard
                      professional={professional}
                      onRequestReferral={handleRequestReferral}
                      locale={locale}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
