import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * RichTextEditor - A wrapper around ReactQuill for React 19
 * Uses useMemo to prevent re-rendering issues
 */
const RichTextEditor = ({ value, onChange, className = '', placeholder = 'Write your content here...', ...props }) => {
    // Quill modules configuration
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'blockquote', 'code-block',
        'align',
        'link', 'image'
    ];

    return (
        <div className={`rich-text-editor-wrapper ${className}`}>
            <ReactQuill
                value={value || ''}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                theme="snow"
                {...props}
            />
        </div>
    );
};

export default RichTextEditor;
