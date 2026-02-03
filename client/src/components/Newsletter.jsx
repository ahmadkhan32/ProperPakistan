import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubscribed(true);
            toast.success('Successfully subscribed!');
            setEmail('');
        } catch (error) {
            toast.error('Failed to subscribe. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden py-16 px-4"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-800 dark:via-primary-900 dark:to-dark-900" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Floating shapes */}
            <motion.div
                className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            <div className="relative max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-6"
                >
                    <span>📬</span>
                    <span>Join 5,000+ Pakistani developers</span>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Get Weekly Tech Insights
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                    Stay updated with the latest tutorials, career tips, and industry news tailored for Pakistani developers.
                </p>

                <AnimatePresence mode="wait">
                    {!subscribed ? (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-6 py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-full hover:bg-white/90 disabled:opacity-50 transition flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Subscribe</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center space-x-3 text-white"
                        >
                            <CheckCircle size={32} className="text-green-400" />
                            <span className="text-xl font-semibold">You're subscribed!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-white/60 text-sm mt-6">
                    No spam, unsubscribe anytime. Your privacy matters.
                </p>
            </div>
        </motion.section>
    );
};

export default Newsletter;
