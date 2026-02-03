import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Github, Twitter, MapPin } from 'lucide-react';

const About = () => {
    return (
        <>
            <Helmet>
                <title>About Us - ProperPakistan</title>
                <meta name="description" content="Learn about ProperPakistan's mission to empower Pakistani developers and content creators." />
            </Helmet>

            <div className="bg-gray-50 min-h-screen pb-12">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Pakistan's Digital Future</h1>
                        <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
                            We are building the premier platform for Pakistani developers, writers, and creators to share knowledge and grow together.
                        </p>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="max-w-6xl mx-auto px-4 -mt-10">
                    <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-dark-900 mb-6">Our Mission</h2>
                                <div className="space-y-4 text-lg text-dark-600">
                                    <p>
                                        ProperPakistan was born from a simple vision: to create a dedicated space where the brilliant minds of Pakistan can showcase their expertise to the world.
                                    </p>
                                    <p>
                                        Whether you are a seasoned software engineer, a student just starting out, or a tech enthusiast, this platform is built for you. We believe in the power of community-driven learning and open knowledge sharing.
                                    </p>
                                    <p>
                                        From coding tutorials and freelance tips to career guidance and study abroad opportunities, we cover everything that matters to the modern Pakistani professional.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-video rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center border border-green-200">
                                    <div className="text-center p-6">
                                        <span className="text-6xl mb-4 block">🇵🇰</span>
                                        <h3 className="text-2xl font-bold text-primary-700">Made in Pakistan</h3>
                                        <p className="text-dark-500">For the World</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center text-dark-900 mb-12">Why We Do It</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: '🚀',
                                    title: 'Innovation',
                                    desc: 'Fostering a culture of technical excellence and creative problem-solving across the nation.'
                                },
                                {
                                    icon: '🤝',
                                    title: 'Community',
                                    desc: 'Connecting mentors with learners and building a support network for professional growth.'
                                },
                                {
                                    icon: '💡',
                                    title: 'Knowledge',
                                    desc: 'Making high-quality technical education and career resources accessible to everyone.'
                                }
                            ].map((value, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary-500">
                                    <div className="text-4xl mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold text-dark-900 mb-3">{value.title}</h3>
                                    <p className="text-dark-600">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-dark-900 rounded-2xl p-8 md:p-16 text-center text-white">
                        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                            Have questions, suggestions, or want to contribute? We'd love to hear from you.
                        </p>

                        <div className="flex flex-wrap justify-center gap-8 text-lg">
                            <a href="mailto:contact@properpakistan.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                                <Mail className="w-5 h-5" />
                                contact@properpakistan.com
                            </a>
                            <span className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-5 h-5" />
                                Islamabad, Pakistan
                            </span>
                        </div>

                        <div className="mt-10 flex justify-center gap-6">
                            <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-primary-600 transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-primary-600 transition-colors">
                                <Github className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
