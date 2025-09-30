import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import initialClubs from '../data/clubs';

const STORAGE_KEY = 'university-clubs-data';

const ClubsContext = createContext();

const cloneInitialClubs = () => initialClubs.map((club) => ({
  ...club,
  members: club.members ? [...club.members] : [],
  activities: club.activities ? [...club.activities] : [],
  upcomingEvents: club.upcomingEvents ? [...club.upcomingEvents] : [],
  resources: club.resources ? [...club.resources] : [],
}));

const loadClubs = () => {
  if (typeof window === 'undefined') {
    return cloneInitialClubs();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Не удалось загрузить клубы из localStorage:', error);
  }

  return cloneInitialClubs();
};

export const ClubsProvider = ({ children }) => {
  const [clubs, setClubs] = useState(loadClubs);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized || typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs));
    } catch (error) {
      console.warn('Не удалось сохранить клубы в localStorage:', error);
    }
  }, [clubs, initialized]);

  const getClubById = useCallback((clubId) => clubs.find((club) => club._id === clubId) || null, [clubs]);

  const addClub = useCallback((clubData) => {
    const newClub = {
      _id: `club-${Date.now()}`,
      name: clubData.name,
      description: clubData.description,
      category: clubData.category,
      createdAt: new Date().toISOString(),
      createdBy: clubData.createdBy,
      members: clubData.members ? [...clubData.members] : [],
      activities: clubData.activities ? [...clubData.activities] : [],
      upcomingEvents: clubData.upcomingEvents ? [...clubData.upcomingEvents] : [],
      resources: clubData.resources ? [...clubData.resources] : [],
    };

    setClubs((prev) => [...prev, newClub]);
    return newClub;
  }, []);

  const updateClub = useCallback((clubId, updates) => {
    let updatedClub = null;

    setClubs((prev) => prev.map((club) => {
      if (club._id !== clubId) {
        return club;
      }

      updatedClub = {
        ...club,
        ...updates,
      };

      return updatedClub;
    }));

    return updatedClub;
  }, []);

  const joinClub = useCallback((clubId, member) => {
    setClubs((prev) => prev.map((club) => {
      if (club._id !== clubId) {
        return club;
      }

      const isAlreadyMember = club.members.some((existingMember) => existingMember._id === member._id);
      if (isAlreadyMember) {
        return club;
      }

      return {
        ...club,
        members: [...club.members, member],
      };
    }));
  }, []);

  const leaveClub = useCallback((clubId, memberId) => {
    setClubs((prev) => prev.map((club) => {
      if (club._id !== clubId) {
        return club;
      }

      return {
        ...club,
        members: club.members.filter((member) => member._id !== memberId),
      };
    }));
  }, []);

  const value = useMemo(() => ({
    clubs,
    initialized,
    getClubById,
    addClub,
    updateClub,
    joinClub,
    leaveClub,
  }), [clubs, initialized, getClubById, addClub, updateClub, joinClub, leaveClub]);

  return (
    <ClubsContext.Provider value={value}>
      {children}
    </ClubsContext.Provider>
  );
};

export const useClubs = () => {
  const context = useContext(ClubsContext);

  if (!context) {
    throw new Error('useClubs должен использоваться внутри ClubsProvider');
  }

  return context;
};
