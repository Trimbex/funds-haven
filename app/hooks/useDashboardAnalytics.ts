'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCurrentUserID } from '@/app/api/general';
import { DashboardAnalytics } from '@/app/server/dashboard/analytics';

interface UseDashboardAnalyticsReturn {
  analytics: DashboardAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Simple cache with 2 minute expiry
const cache = new Map<string, { data: DashboardAnalytics; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export function useDashboardAnalytics(): UseDashboardAnalyticsReturn {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get User ID using the hook
  const userResponse = useCurrentUserID();

  const fetchAnalytics = useCallback(async (userId: string, useCache = true) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check cache first
      if (useCache) {
        const cached = cache.get(userId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setAnalytics(cached.data);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`/api/dashboard/analytics?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
        // Cache the result
        cache.set(userId, { data: data.analytics, timestamp: Date.now() });
      } else {
        setError(data.message || 'Failed to fetch dashboard analytics');
      }
    } catch (err) {
      setError('An error occurred while fetching dashboard analytics');
      console.error('Dashboard analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (userResponse.userId) {
      // Clear cache for this user and force fresh fetch
      cache.delete(userResponse.userId);
      await fetchAnalytics(userResponse.userId, false);
    }
  }, [userResponse.userId, fetchAnalytics]);

  // Fetch analytics when user ID is available
  useEffect(() => {
    if (userResponse.success && userResponse.userId) {
      fetchAnalytics(userResponse.userId);
    } else if (!userResponse.success && userResponse.message !== "Session is loading.") {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [userResponse, fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch,
  };
} 