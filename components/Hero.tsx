import Image from "next/image";

// Hero.tsx
export const Hero = () => {
    return (
        <section className="bg-gray-50 py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Text Content */}
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Welcome to BlogsHub
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Read, comment on, and share blogs within a community of like-minded individuals with a single click.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                                Get Started
                            </button>
                            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Image/Illustration */}
                    <div className="md:w-1/2">
                        <div className="bg-blue-100 rounded-xl p-8 lg:p-12">
                            <Image
                                height={500}
                                width={500}
                                src="/hero.svg"
                                alt="Hero Illustration"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};