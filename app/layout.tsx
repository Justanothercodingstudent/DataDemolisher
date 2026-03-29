import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FRC Legends // Mission Control',
  description: 'Elite robotics platform blending mission control analytics with cinematic team storytelling.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
