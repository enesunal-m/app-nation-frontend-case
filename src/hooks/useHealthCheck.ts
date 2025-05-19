import useSWR from 'swr';
import axios from 'axios';

const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds

export const useHealthCheck = () => {
  const { data, error, isLoading } = useSWR(
    'health-check',
    async () => {
      try {
        const response = await axios.get('https://api.app-nation-case.live/api/health');
        return response.data;
      } catch (error) {
        throw new Error('Backend service is not available');
      }
    },
    {
      refreshInterval: HEALTH_CHECK_INTERVAL,
      revalidateOnFocus: true,
      dedupingInterval: HEALTH_CHECK_INTERVAL,
    }
  );

  return {
    isHealthy: data?.status === 'ok',
    isLoading,
    error,
  };
}; 