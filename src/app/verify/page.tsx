'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const redirect = searchParams.get('redirect') || '/';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      api.verifyEmail(token)
        .then((res) => {
          setStatus('success');
          setMessage(typeof res === 'string' ? res : 'Email verified successfully!');
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.message || 'Verification failed. The link may be invalid or expired.');
        });
    } else {
      setStatus('error');
      setMessage('No verification token found.');
    }
  }, [token]);

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-card-border shadow-xl text-center">
      {status === 'loading' && (
        <div className="space-y-4">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto" />
          <h1 className="text-2xl font-bold dark:text-white">Verifying your email...</h1>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we activate your account.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold dark:text-white">Account Activated!</h1>
          <p className="text-gray-500 dark:text-gray-400">{message}</p>
          <div className="pt-4">
            <Link
              href={`/login?redirect=${redirect}`}
              className="inline-block w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold dark:text-white">Verification Failed</h1>
          <p className="text-gray-500 dark:text-gray-400">{message}</p>
          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-block w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Try Signing Up Again
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar onSearchChange={() => {}} onCartToggle={() => {}} onMenuToggle={() => {}} />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-card-border shadow-xl flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
