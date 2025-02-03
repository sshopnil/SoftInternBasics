"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import './styles.css';

const navLinks = [
    {name: "Home", href:'/'},
    {name: "Register", href:'/register'},
    {name: "Login", href:'/login'},
  ]

export default function GlobalNavigation(){
    const pathname = usePathname();

    return (
        <div>
            {navLinks.map((link)=>{
                const isActive = pathname === link.href; 
          return (
            <Link className={isActive ? 'font-bold mr-4': 'text-blue-500 mr-4'} href={link.href} key={link.name}>{link.name}</Link>
          )
        })}
        </div>
    )
}