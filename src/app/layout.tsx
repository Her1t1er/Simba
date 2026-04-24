'use client';

import React, { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";

// Use environment variable for Google Client ID
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

if (!GOOGLE_CLIENT_ID && typeof window !== 'undefined') {
  console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google Login will not work.");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useSettingsStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
