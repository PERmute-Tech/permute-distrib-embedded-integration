import { ReactNode } from 'react';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import '@/app/globals.css';
import { isProductionGated } from '@/lib/gating';

export const metadata: Metadata = {
  title: 'Patrimoine Conseil — Espace souscription',
  description: 'Simulateur de CRM partenaire — parcours de transfert PMD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  if (isProductionGated()) {
    notFound();
  }

  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
