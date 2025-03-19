"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mint", label: "Mint" }
];


export default function Header() {
    const pathname = usePathname();
    return (
        <header className="p-2 md:gap-x-5 z-10 h-24 absolute w-full text-sm md:text-lg bg-sky-950 rounded border-2 border-zinc-500">
            <div className="flex w-full justify-between items-center">
                
                    <Link href="/">
                        <Image className="h-auto m-auto" height={150} width={150} src="/psyencelab.png" alt="Arp Radio" />
                    </Link>
                    <nav className="flex  -mt-8 justify-end">
                        <ul className="flex bg-black/20 p-1 px-4 rounded-lg gap-x-5 border-[1px] border-zinc-200">
                            {navLinks.map((link) => (
                                <li className="nav" key={link.href}>
                                    <Link 
                                        className={pathname === link.href ? "text-zinc-400 text-opacity-60 font-bold" : "text-zinc-300"} 
                                        href={link.href}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
            </div>     <div className="justify-center -mt-8 items-center">
                    <div className="w-fit mx-auto">
                    </div>
                    <div className="font-mono text-center text-xs text-amber-400">
                    </div>
                </div>
        </header>
    );
}