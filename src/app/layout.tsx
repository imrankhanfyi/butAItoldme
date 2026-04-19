import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ButAIToldMe — See what AI tells the other side',
  description: 'Expose AI sycophancy by seeing how the same model validates both sides of a relationship conflict.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
