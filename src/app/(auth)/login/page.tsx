'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  useEffect(() => {
    // If already authenticated, redirect to dashboard or callback URL
    if (!isLoading && isAuthenticated) {
      router.push(callbackUrl || '/dashboard');
    }
  }, [isAuthenticated, isLoading, router, callbackUrl]);

  // Don't render the form while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Only render the form if not authenticated
  if (!isAuthenticated) {
  return <LoginForm />;
  }

  return null; // Will redirect in useEffect
}