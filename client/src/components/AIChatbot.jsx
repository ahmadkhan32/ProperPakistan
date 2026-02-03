import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw, Check, Copy } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const AIChatbot = ({ onContentGenerated, onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI writing assistant. Tell me what kind of blog post you'd like to create. For example:\n\n• \"Write a blog about AI in healthcare\"\n• \"Create an article about freelancing tips for beginners\"\n• \"Generate a post about study abroad scholarships\""
        }
    ]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isGenerating) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsGenerating(true);

        try {
            // Add thinking message
            setMessages(prev => [...prev, { role: 'assistant', content: '✨ Generating your content...', isLoading: true }]);

            const response = await apiService.generatePost({
                topic: input,
                keywords: input.split(' ').slice(0, 5).join(', ')
            });

            // Remove loading message and add response
            setMessages(prev => {
                const filtered = prev.filter(m => !m.isLoading);
                return [...filtered, {
                    role: 'assistant',
                    content: `I've generated a blog post for you!\n\n**Title:** ${response.data.title}\n\n**Excerpt:** ${response.data.excerpt}\n\nYou can preview and edit the full content below, or ask me to regenerate with different instructions.`,
                    hasContent: true
                }];
            });

            setGeneratedContent(response.data);

        } catch (error) {
            console.error('Generation error:', error);
            setMessages(prev => {
                const filtered = prev.filter(m => !m.isLoading);
                return [...filtered, {
                    role: 'assistant',
                    content: '❌ Sorry, I encountered an error generating content. Please try again or check your API configuration.'
                }];
            });
            toast.error('Failed to generate content');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerate = () => {
        setGeneratedContent(null);
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Sure! Tell me what you'd like me to change or give me a new topic to write about."
        }]);
    };

    const handleUseContent = () => {
        if (generatedContent && onContentGenerated) {
            onContentGenerated(generatedContent);
            toast.success('Content added to editor!');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold">AI Writing Assistant</h3>
                        <p className="text-sm text-white/80">Powered by GPT-4</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                    {message.isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="animate-spin" size={16} />
                                            <span>{message.content}</span>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Generated Content Preview */}
            {generatedContent && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t bg-gray-50 p-4"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                            <Sparkles size={18} className="text-yellow-500" />
                            <span>Generated Content Preview</span>
                        </h4>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleRegenerate}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                <RefreshCw size={14} />
                                <span>Regenerate</span>
                            </button>
                            <button
                                onClick={handleUseContent}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                            >
                                <Check size={14} />
                                <span>Use This Content</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border max-h-48 overflow-y-auto">
                        <h5 className="font-bold text-lg mb-2">{generatedContent.title}</h5>
                        <p className="text-gray-600 text-sm mb-3">{generatedContent.excerpt}</p>
                        <div className="flex items-center space-x-2">
                            {generatedContent.tags?.slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Input */}
            <div className="border-t p-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Describe the blog post you want to create..."
                        className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={isGenerating}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isGenerating}
                        className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2"
                    >
                        {isGenerating ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    AI responses may not always be accurate. Review content before publishing.
                </p>
            </div>
        </div>
    );
};

export default AIChatbot;
