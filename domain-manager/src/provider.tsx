
'use client';
import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 5,


        staleTime: 1000 * 60 * 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}


    </QueryClientProvider>
  );
}