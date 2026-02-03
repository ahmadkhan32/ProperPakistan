import { motion } from 'framer-motion';
import { Film, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CinematicModeButton = ({ className = '' }) => {
    return (
        <Link to="/cinematic">
            <motion.button
                className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-xl transition-all ${className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Film size={18} />
                <span className="font-semibold">Cinematic Mode</span>
                <Sparkles size={14} className="animate-pulse" />
            </motion.button>
        </Link>
    );
};

export default CinematicModeButton;
