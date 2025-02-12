"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import './styles.css';

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Cube Color", href: "/cubecolor" },
    { name: "Instancing", href: "/instancing" },
];

export default function GlobalNavigation() {
    const pathname = usePathname(); // Get the current pathname

    return (
        <nav className="p-4 bg-gray-100 shadow-md">
            <div className="flex space-x-4">
                {navLinks.map((link) => {
                    // Check if the link is active
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`mr-4 px-3 py-2 rounded-md transition duration-300 ${
                                isActive
                                    ? "font-bold text-black bg-blue-300"
                                    : "text-blue-500 hover:text-blue-700"
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
