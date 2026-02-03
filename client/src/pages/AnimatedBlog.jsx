import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { apiService } from '../services/api';
import '../styles/animated.css';

gsap.registerPlugin(Observer);

const AnimatedSections = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const observerRef = useRef(null);

    // Fetch posts
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { data } = await apiService.getPosts({
                    limit: 6,
                    status: 'published',
                });
                setPosts(data?.posts || []);
            } catch (err) {
                console.error('Failed to load posts:', err);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    // GSAP animation
    useLayoutEffect(() => {
        if (!posts.length || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.animated-section');
            const images = gsap.utils.toArray('.bg');
            const headings = gsap.utils.toArray('.section-heading');

            let currentIndex = 0;
            let animating = false;

            gsap.set(sections, { autoAlpha: 0 });
            gsap.set(sections[0], { autoAlpha: 1 });

            gsap.set('.outer', { yPercent: 100 });
            gsap.set('.inner', { yPercent: -100 });

            const gotoSection = (index, direction) => {
                if (animating) return;
                animating = true;

                index = gsap.utils.wrap(0, sections.length, index);
                const d = direction === -1 ? -1 : 1;

                const tl = gsap.timeline({
                    defaults: { duration: 1.2, ease: 'power2.inOut' },
                    onComplete: () => (animating = false),
                });

                if (index !== currentIndex) {
                    tl.to(images[currentIndex], {
                        yPercent: -15 * d,
                        opacity: 0,
                    });
                }

                gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

                tl.fromTo(
                    sections[index].querySelector('.outer'),
                    { yPercent: 100 * d },
                    { yPercent: 0 },
                    0
                )
                    .fromTo(
                        sections[index].querySelector('.inner'),
                        { yPercent: -100 * d },
                        { yPercent: 0 },
                        0
                    )
                    .fromTo(
                        images[index],
                        { yPercent: 15 * d, opacity: 0 },
                        { yPercent: 0, opacity: 1 },
                        0
                    )
                    .fromTo(
                        headings[index],
                        { y: 120 * d, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1 },
                        0.25
                    );

                if (currentIndex !== index) {
                    gsap.set(sections[currentIndex], { autoAlpha: 0 });
                }

                currentIndex = index;
            };

            observerRef.current = Observer.create({
                target: containerRef.current,
                type: 'wheel,touch,pointer',
                wheelSpeed: -1,
                tolerance: 12,
                onUp: () => gotoSection(currentIndex + 1, 1),
                onDown: () => gotoSection(currentIndex - 1, -1),
            });
        }, containerRef);

        return () => {
            observerRef.current?.kill();
            ctx.revert();
        };
    }, [posts]);

    const handlePostClick = (slug) => {
        navigate(`/blog/${slug}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <span className="text-white text-xl animate-pulse">
                    Loading cinematic experience…
                </span>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="animated-blog-wrapper">
            {/* Header */}
            <header className="animated-header">
                <div className="header-logo">ProperPakistan</div>
                <button
                    onClick={() => navigate('/')}
                    className="exit-animated-btn"
                >
                    Exit Cinematic Mode
                </button>
            </header>

            {/* Sections */}
            {posts.map((post, i) => (
                <section
                    key={post.id}
                    className="animated-section"
                    onClick={() => handlePostClick(post.slug)}
                >
                    <div className="outer">
                        <div className="inner">
                            <div
                                className="bg"
                                style={{
                                    backgroundImage: `linear-gradient(
                                        180deg,
                                        rgba(0,0,0,0.65),
                                        rgba(0,0,0,0.15)
                                    ), url(${post.cover_image || post.image})`,
                                }}
                            >
                                <div className="section-content">
                                    <h2 className="section-heading">
                                        {post.title}
                                    </h2>

                                    {post.excerpt && (
                                        <p className="section-excerpt">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    <div className="section-meta">
                                        {post.category && (
                                            <span className="category-badge">
                                                {post.category.name}
                                            </span>
                                        )}
                                        <span>
                                            {post.reading_time || 5} min read
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            <div className="scroll-hint">
                <span>Scroll</span>
                <div className="scroll-indicator" />
            </div>
        </div>
    );
};

export default AnimatedSections;
