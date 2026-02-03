import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 z-[100]"
            style={{ width: `${progress}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.1 }}
        />
    );
};

export default ReadingProgress;
