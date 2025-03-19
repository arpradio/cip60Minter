import { Music4, Album, Library, Layers } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  return (
    <main className="min-h-screen bg-black py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-6xl mx-auto">
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/mint/single">
            <div className="bg-gray-900 rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all hover:translate-y-[-4px] group">
              <div className="flex items-center justify-center mb-6">
                <Music4 size={48} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Single Track
              </h2>
              <p className="text-gray-300 text-center">
                Mint individual tracks with full metadata support
              </p>
            </div>
          </Link>

          <Link href="/mint/multiple">
            <div className="bg-gray-900  rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all hover:translate-y-[-4px] group">
              <div className="flex items-center justify-center mb-6">
                <Layers size={48} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Multiple Tracks
              </h2>
              <p className="text-gray-300 text-center">
                Create tokens for multiple independent tracks
              </p>
            </div>
          </Link>

          <Link href="/mint/album">
            <div className="bg-gray-900  rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all hover:translate-y-[-4px] group">
              <div className="flex items-center justify-center mb-6">
                <Album size={48} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Album/EP
              </h2>
              <p className="text-gray-300 text-center">
                Mint complete albums with shared metadata
              </p>
            </div>
          </Link>
        </div>

        <Link href="/assets">
          <div className="mt-8 bg-gray-900  rounded-xl p-8 border border-white/10 hover:border-white/30 transition-all hover:translate-y-[-4px] group">
            <div className="flex items-center justify-center mb-6">
              <Library size={48} className="text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
            <h2 className="text-2xl font-bold  text-white text-center mb-4">
              Token Library
            </h2>
            <p className="text-gray-300 text-center">
              Browse and manage your CIP-60 music token collection
            </p>
          </div>
        </Link>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Built leveraging CIP-60 standards for music NFTs on Cardano</p>
          <p className="mt-2 flex float-right">© 2025 The Psyence Lab LLC</p>
        </div>
      </div>
    </main>
  );
}