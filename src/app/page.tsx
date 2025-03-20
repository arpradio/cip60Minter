import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-[#03215f] via-[#008a7a] to-[#460084] p-4">
      <div className="bg-black/80 p-8 rounded-lg shadow-xl border-2 border-white max-w-4xl w-full">
        <div className="text-center mb-3">
          <h1 className="text-3xl font-bold text-[#228fa7] mt-4 text-shadow">
            Music Token Minting
          </h1>
          <h2 className="text-xl font-mono text-white">Be Your Own Minter!</h2>
          <p className="text-white/80 italic text-xs">
            A collection of CIP60-compliant music token minting scripts.
          </p>

          <h1 className="text-center mt-6 text-gray-100 font-mono font-bold">
            Choose a Mint Form
          </h1>
          <div className="flex justify-evenly text-lg m-4 font-bold text-amber-300">
            <Link href="/single">
              <div className="hover:text-blue-600" title="A single song">Single</div>
            </Link>
            <Link href="/multiple">
              <div className="hover:text-blue-600" title="Multiple songs of different artists">Multiple</div>
            </Link>
            <Link href="/album">
              <div className="hover:text-blue-600" title="Multiple songs of the same artist">Album/EP</div>
            </Link>
          </div>

          <div className="mt-12">
            <h2 className="text-xs text-gray-300">Powered by</h2>
            <a href="https://gamechanger.finance/" target="_blank">
              <Image className="m-auto mt-2 border-gray-400 border-[1px]" src="/gc.png" width={400} height={400} alt="GameChanger" />
              <label className="text-amber-400 text-sm cursor-pointer">GameChanger Wallet</label>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
