'use client';

import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Footer from "@/components/footer";
import Header from "@/components/header/client";
import Wrapper from "@/components/wrapper";
import {LayoutProps} from "@/types/layoutProps";
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

export default function MainLayout({ children, params: { lng } }: LayoutProps) {
  const { status } = useSession();

  return (
    <div className="flex overflow-y-hidden justify-center bg-white dark:bg-neutral-800">
      <AnimatePresence>
        {status === 'loading' && <FullLoadingScreen />}
      </AnimatePresence>
      <Header lng={lng} />
      <main className="flex flex-col w-full overflow-y-auto h-screen items-center mt-16">
        <Wrapper>
          {children}
        </Wrapper>
        <Footer />
      </main>
    </div>
  );
}

function FullLoadingScreen() {
    const [progress, setProgress] = useState(0);
    const controls = useAnimation();
    useEffect(() => {
        // Explicitly type timer as number
        let timer: number;
      
        // Start the animation
        controls.start({ opacity: 1 }).then(() => {
          // Animation completed
          setProgress(100);
        });
      
        // Simulate loading progress
        const updateProgress = () => {
          setProgress((oldProgress) => {
            const newProgress = oldProgress + 10;
            if (newProgress > 100) {
              clearInterval(timer);
              return 100;
            }
            return newProgress;
          });
        };
      
        timer = window.setInterval(updateProgress, 50); // Adjust the interval as needed
      
        return () => window.clearInterval(timer);
      }, [controls]);
      
  const overlayVariants = {
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4, delay: 0.3 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 z-[101] flex-col gap-2"
      variants={overlayVariants}
      initial="animate" // Use animate for the initial state to apply the defined opacity
      animate="animate"
      exit="exit"
      aria-live="polite" // Accessibility improvement
    >
       <div className="relative w-[30%]">
         <Progress value={progress} className="w-full dark:bg-gray-400 h-4" />
         <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-200 dark:text-zinc-800">
           {progress}%
         </div>
       </div>
       <div>Loading...</div>
    </motion.div>
  );
}
