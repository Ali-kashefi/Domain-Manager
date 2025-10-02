"use client"
import { GETAllDOMAINS } from '../services/httpMethode';
import { useQuery } from '@tanstack/react-query';

// Custom hook to fetch all domains using TanStack Query.
function useGetAllDomains() {
  // Call useQuery hook to manage data fetching state.
  const { 
        error, 
        isLoading, 
        data, 
        mutate: refetch // Include mutate/refetch function from useQuery for simplicity (renaming 'mutate' to 'refetch' is common for query hooks in user context)
    } = useQuery({
        queryKey: ["get-alldomains"], // Unique key for caching and fetching.
        queryFn: GETAllDOMAINS,     // The async function that performs the API call.
        retry: 1,                   // Retry failed query up to 1 time.
        refetchOnWindowFocus: true, // Automatically refetch when the window regains focus.
    });
    
    // Return essential state and the ability to refetch manually.
    return {
        error, 
        isLoading, 
        data,
        mutate: refetch // Exporting the refetch function under the name 'mutate' for consistency with other hooks in your project (as seen in Home.js).
    }
}

export default useGetAllDomains