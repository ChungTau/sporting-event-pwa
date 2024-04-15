'use client';

import SessionGuard from "@/components/SessionGuard";
import {darker_grotesque} from "@/lib/font";
import {cn} from "@/lib/utils";
import {ChildrenProps} from "@/types/childrenProps";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "next-themes";
import {MapProvider} from 'react-map-gl';
import { Toaster } from "@/components/ui/sonner";
import { Toaster as T2 } from "@/components/ui/toaster";

export default function BodyLayout({children} : ChildrenProps) {
    return (
        <body
            suppressHydrationWarning
            className={cn(`min-h-screen bg-white text-zinc-800 overflow-y-hidden dark:bg-zinc-800 dark:text-white ${darker_grotesque.className} antialiased overflow-y-hidden`, darker_grotesque.variable)}>
            <SessionProvider refetchInterval={4 * 60}>
                <SessionGuard>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange={false}>
                        <MapProvider>
                            {children}
                            <Toaster />
                            <T2/>
                        </MapProvider>
                    </ThemeProvider>
                </SessionGuard>
            </SessionProvider>
            
        </body>
    );
}