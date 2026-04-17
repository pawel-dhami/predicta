/**
 * src/hooks/useProfile.jsx
 *
 * React Context that loads and exposes the `profiles` row for the
 * currently authenticated user from Supabase.
 *
 * Exposes:
 *   linkedinData    — raw scraped LinkedIn profile (or null)
 *   aiAnalysis      — Groq-generated placement analysis (or null)
 *   verifiedSkills  — array of { tag, verified?, unverified? } (or null)
 *   loading         — true while the initial DB fetch is in-flight
 *   error           — any error from the DB fetch
 *   refetch()       — re-fetch the profile from Supabase (call after writes)
 *   clearProfile()  — reset all state to null (e.g. on sign-out)
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

const ProfileContext = createContext({
  linkedinData: null,
  aiAnalysis: null,
  verifiedSkills: null,
  loading: true,
  error: null,
  refetch: () => {},
  clearProfile: () => {},
});

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [linkedinData, setLinkedinData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [verifiedSkills, setVerifiedSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      // Not logged in — reset and stop loading
      setLinkedinData(null);
      setAiAnalysis(null);
      setVerifiedSkills(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('linkedin_data, ai_analysis, verified_skills')
        .eq('user_id', user.id)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        // PGRST116 = "no rows found" — not an error, just no profile yet
        throw dbError;
      }

      setLinkedinData(data?.linkedin_data ?? null);
      setAiAnalysis(data?.ai_analysis ?? null);
      setVerifiedSkills(data?.verified_skills ?? null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch on mount and whenever user changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const clearProfile = useCallback(() => {
    setLinkedinData(null);
    setAiAnalysis(null);
    setVerifiedSkills(null);
    setError(null);
  }, []);

  return (
    <ProfileContext.Provider value={{
      linkedinData,
      aiAnalysis,
      verifiedSkills,
      loading,
      error,
      refetch: fetchProfile,
      clearProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
