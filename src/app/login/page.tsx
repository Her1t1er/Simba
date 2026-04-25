'use client';

import React, { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/utils/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.login({ email, password });
      login({
        name: response.name,
        email: response.email,
        role: response.role
      }, response.token);
      router.push(redirect);
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await api.googleAuth(credentialResponse.credential);
      login({
        name: response.name,
        email: response.email,
        role: response.role
      }, response.token);
      router.push(redirect);
    } catch (error) {
      console.error("Google Auth failed:", error);
      alert("Failed to authenticate with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-card-border shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-black dark:text-white mb-2">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400">Login to your Simba account</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
              alert("Google Sign-In was unsuccessful.");
            }}
            text="signin_with"
            shape="rectangular"
            width="100%"
            size="large"
          />
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-card-border"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or with email</span>
          <div className="flex-grow border-t border-card-border"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" size="sm" className="text-sm font-bold text-orange-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Login <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-card-border text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href={`/signup?redirect=${redirect}`} className="text-orange-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar onSearchChange={() => {}} onCartToggle={() => {}} onMenuToggle={() => {}} />

      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-card-border shadow-xl flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
