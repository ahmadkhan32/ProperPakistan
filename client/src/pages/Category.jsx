import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';

const Category = () => {
    const { slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [slug]);

    const loadData = async () => {
        try {
            const categoryRes = await apiService.getCategoryBySlug(slug);
            setCategory(categoryRes.data.category);

            const postsRes = await apiService.getPosts({ category: slug });
            setPosts(postsRes.data.posts || []);
        } catch (error) {
            console.error('Error loading category:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <SEO title={category?.name} description={category?.description} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-2 rounded-full mb-4 text-4xl">
                        {category?.icon}
                    </div>
                    <h1 className="text-4xl font-bold text-dark-900 mb-4">{category?.name}</h1>
                    <p className="text-lg text-dark-600 max-w-2xl mx-auto">{category?.description}</p>
                </div>

                {posts.length === 0 ? (
                    <p className="text-center text-dark-500 py-20">No posts in this category yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Category;
