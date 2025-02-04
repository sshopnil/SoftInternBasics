"use client";
import { useTheme } from "@/components/theme-provider";
import { clientSideFunction } from "@/utils/client-utils";
export default function ClientRoutePage(){
    const theme = useTheme();
    const result = clientSideFunction(); //this function will work only on clients, otherwise give errors
    return (
        <div>
            <h1 style={{color: theme.colors.primary}}>This is a Client page</h1>
            <h2>{result}</h2>
        </div>
    )
}