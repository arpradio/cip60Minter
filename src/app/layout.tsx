import './globals.css';

export const metadata = {
  title: 'CIP-60 Music Token Minter',
  description: 'A CIP-60 music token minting script collection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className="flex flex-col ">{children}</body>
    </html>
  );
}