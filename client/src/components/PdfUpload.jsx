import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Sparkles, X } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const PdfUpload = ({ onContentExtracted, onClose }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [extractedContent, setExtractedContent] = useState(null);
    const [convertToBlog, setConvertToBlog] = useState(true);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setExtractedContent(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('convertToBlog', convertToBlog.toString());

            const response = await apiService.uploadPdf(formData);

            if (response.data.success) {
                setExtractedContent(response.data.data);
                toast.success('File processed successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to process file');
            }

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload file');
            toast.error('Failed to process file');
        } finally {
            setUploading(false);
        }
    };

    const handleUseContent = () => {
        if (extractedContent && onContentExtracted) {
            onContentExtracted({
                content: extractedContent.blogPost || extractedContent.extractedText,
                title: '',
                excerpt: extractedContent.summary || ''
            });
            toast.success('Content added to editor!');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold">PDF/Document Upload</h3>
                        <p className="text-sm text-white/80">Extract content from documents</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                            ? 'border-blue-500 bg-blue-50'
                            : file
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        }`}
                >
                    <input {...getInputProps()} />

                    <AnimatePresence mode="wait">
                        {file ? (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-3"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="text-green-600" size={32} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                        setExtractedContent(null);
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Remove file
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-3"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Upload className="text-gray-400" size={32} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">
                                        {isDragActive ? 'Drop your file here' : 'Drag & drop your PDF or DOCX'}
                                    </p>
                                    <p className="text-sm text-gray-500">or click to browse (max 10MB)</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Options */}
                {file && !extractedContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 space-y-4"
                    >
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={convertToBlog}
                                onChange={(e) => setConvertToBlog(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-medium text-gray-700 flex items-center space-x-2">
                                    <Sparkles size={16} className="text-yellow-500" />
                                    <span>Convert to blog post with AI</span>
                                </span>
                                <p className="text-sm text-gray-500">AI will format and enhance the content</p>
                            </div>
                        </label>

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    <span>Process Document</span>
                                </>
                            )}
                        </button>
                    </motion.div>
                )}

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
                    >
                        <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                        <div>
                            <p className="font-medium text-red-800">Upload Failed</p>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Extracted Content Preview */}
                {extractedContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 space-y-4"
                    >
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="text-green-600" size={20} />
                                <span className="font-medium text-green-800">Content Extracted Successfully!</span>
                            </div>
                            <p className="text-sm text-green-700">
                                {extractedContent.numPages} page(s) processed
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto border">
                            <h4 className="font-medium text-gray-800 mb-2">Preview:</h4>
                            <div
                                className="text-sm text-gray-600 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: (extractedContent.blogPost || extractedContent.extractedText).substring(0, 500) + '...'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleUseContent}
                            className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center space-x-2"
                        >
                            <CheckCircle size={20} />
                            <span>Use This Content</span>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PdfUpload;
