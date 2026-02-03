import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, FileText, PenTool, ArrowRight } from 'lucide-react';
import AIChatbot from './AIChatbot';
import PdfUpload from './PdfUpload';

const PostCreationModal = ({ isOpen, onClose, onContentReady }) => {
    const [selectedMode, setSelectedMode] = useState(null);

    const modes = [
        {
            id: 'ai',
            title: 'AI Chatbot',
            description: 'Chat with AI to generate your blog post',
            icon: Bot,
            color: 'from-purple-600 to-purple-700',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            id: 'manual',
            title: 'Manual Editor',
            description: 'Write your post from scratch',
            icon: PenTool,
            color: 'from-green-600 to-green-700',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            id: 'pdf',
            title: 'Upload PDF',
            description: 'Convert a document to blog post',
            icon: FileText,
            color: 'from-blue-600 to-blue-700',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    ];

    const handleContentGenerated = (content) => {
        if (onContentReady) {
            onContentReady(content);
        }
        onClose();
    };

    const handleModeSelect = (modeId) => {
        if (modeId === 'manual') {
            // Go directly to editor without content
            handleContentGenerated(null);
        } else {
            setSelectedMode(modeId);
        }
    };

    const handleBack = () => {
        setSelectedMode(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {selectedMode ? (
                                    <>
                                        <button
                                            onClick={handleBack}
                                            className="text-gray-400 hover:text-gray-600 mr-2"
                                        >
                                            ←
                                        </button>
                                        {modes.find(m => m.id === selectedMode)?.title}
                                    </>
                                ) : (
                                    'Create New Post'
                                )}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {selectedMode
                                    ? modes.find(m => m.id === selectedMode)?.description
                                    : 'Choose how you want to create your post'
                                }
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                        <AnimatePresence mode="wait">
                            {!selectedMode ? (
                                /* Mode Selection */
                                <motion.div
                                    key="selection"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="grid gap-4"
                                >
                                    {modes.map((mode) => (
                                        <motion.button
                                            key={mode.id}
                                            onClick={() => handleModeSelect(mode.id)}
                                            className={`w-full p-6 ${mode.bgColor} rounded-xl text-left hover:shadow-md transition-all group`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-14 h-14 ${mode.iconBg} rounded-xl flex items-center justify-center`}>
                                                        <mode.icon className={mode.iconColor} size={28} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">{mode.title}</h3>
                                                        <p className="text-gray-600">{mode.description}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-transform" size={24} />
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            ) : selectedMode === 'ai' ? (
                                /* AI Chatbot */
                                <motion.div
                                    key="ai"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <AIChatbot
                                        onContentGenerated={handleContentGenerated}
                                        onClose={onClose}
                                    />
                                </motion.div>
                            ) : selectedMode === 'pdf' ? (
                                /* PDF Upload */
                                <motion.div
                                    key="pdf"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <PdfUpload
                                        onContentExtracted={handleContentGenerated}
                                        onClose={onClose}
                                    />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PostCreationModal;
