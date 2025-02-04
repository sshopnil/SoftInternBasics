"use client";
import { useTheme } from "@/components/theme-provider";

export default function ClientRoutePage(){
    const theme = useTheme();
    return (
        <div>
            <h1 style={{color: theme.colors.primary}}>This is a Client page</h1>
        </div>
    )
}