import '../styles/globals.css';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Fyn Timing',
  description: 'Hospitality’s Most Responsive POS + Booking Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="bg-gray-900 text-white min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}