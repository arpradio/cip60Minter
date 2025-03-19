import './globals.css';
import Header from '@/components/header';

export const metadata = {
  title: 'CIP-60 Music Tokens',
  description: 'A CIP-60 music token minting and explorer application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className="flex flex-col h-screen]"><Header/><div className="mt-20">{children}</div></body>
    </html>
  );
}