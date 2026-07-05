import { motion, AnimatePresence } from 'motion/react';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 flex flex-col items-center"
          >
            <div className="mb-4 rounded-2xl bg-emerald-500 p-4 shadow-lg shadow-emerald-500/20">
              <Wallet className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">
              fintracker
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center"
          >
            <p className="text-xl font-medium text-zinc-300">
              Stop Guessing. Start Tracking
            </p>
            <p className="mt-1 text-zinc-500">
              Spend smarter, flex later
            </p>
          </motion.div>

          {/* Footer Credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="absolute bottom-12 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              developed & designed by parasu raman
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
