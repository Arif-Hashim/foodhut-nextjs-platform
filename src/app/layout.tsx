import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FoodHut - Multi-Vendor Food & Home-Chef Ordering Platform',
  description: 'RESTful Food Ordering API & Frontend built with Next.js, MongoDB, and JWT Authentication.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
