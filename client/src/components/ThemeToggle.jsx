import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative w-12 h-12 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center hover:scale-110 transition-transform"
            whileTap={{ scale: 0.9 }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: darkMode ? 360 : 0,
                    scale: darkMode ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Moon className="text-yellow-400" size={20} />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    rotate: darkMode ? 0 : 360,
                    scale: darkMode ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Sun className="text-yellow-500" size={20} />
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
