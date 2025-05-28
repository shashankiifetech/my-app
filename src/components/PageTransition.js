'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setDisplayChildren(children); // only update when route changes
  }, [pathname, children]);

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={pathname} // optional: if using shallow components, it's okay
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
}
