'use client';

import React, { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
