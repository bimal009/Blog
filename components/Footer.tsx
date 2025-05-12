// Footer.tsx
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    const footerLinks = [
        {
            title: 'Product',
            links: ['Features', 'Pricing', 'Documentation', 'Guides'],
        },
        {
            title: 'Company',
            links: ['About', 'Blog', 'Careers', 'Contact'],
        },
        {
            title: 'Legal',
            links: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
        },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Brand</h3>
                        <p className="text-sm mb-6">
                            Making the world a better place through innovative solutions.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Github size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Twitter size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Linkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm hover:text-white transition-colors duration-200"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;