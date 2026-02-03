import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-xl font-bold">PP</span>
                            </div>
                            <span className="text-lg font-bold">
                                Proper<span className="text-primary-400">Pakistan</span>
                            </span>
                        </div>
                        <p className="text-dark-300 text-sm leading-relaxed">
                            Your trusted source for quality content on technology, education, freelancing, and study abroad opportunities in Pakistan.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/category/technology" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    Technology
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/education" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    Education
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/freelancing" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    Freelancing
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/study-abroad" className="text-dark-300 hover:text-primary-400 transition text-sm">
                                    Study Abroad
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-dark-300 text-sm mb-4">
                            Subscribe to get the latest updates and articles.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 rounded-lg bg-dark-800 text-white border border-dark-700 focus:border-primary-500 focus:outline-none text-sm"
                            />
                            <button className="btn btn-primary text-sm">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-dark-400 text-sm">
                        © {currentYear} ProperPakistan.com. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:info@properpakistan.com" className="text-dark-400 hover:text-primary-400 transition">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
