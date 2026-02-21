import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroCarousel({ isAuthenticated, user, onGetStarted, onExploreCourses }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      image: '/images/headerimg.jpeg',
      title: 'WELCOME TO HBIU',
      description: 'Unlock Your Path To Success With HBIU',
      accent: 'Success'
    },
    {
      id: 2,
      image: '/images/hero-slide-2.png',
      title: 'WELCOME TO HBIU',
      description: 'Designed With The Highest Quality In Mind',
      accent: 'Quality'
    },
    {
      id: 3,
      image: '/images/hero-slide-3.png',
      title: 'WELCOME TO HBIU',
      description: 'Accessible Quality Programs',
      accent: 'Quality'
    },
    {
      id: 4,
      image: '/images/hero-slide-4.png',
      title: 'Transform Your Future',
      description: 'World-Class Education in over 150 Different Languages',
      accent: 'Education'
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-4 text-[#fca31c] font-semibold text-sm md:text-base">
                    <span>🎓</span>
                    <span>WELCOME TO HBIU</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                    {slide.id === 1 && (
                      <>Unlock Your Path To <span className="text-[#fca31c]">Success</span> With HBIU</>
                    )}
                    {slide.id === 2 && (
                      <>Designed With The <span className="text-[#fca31c]">Highest Quality</span> In Mind</>
                    )}
                    {slide.id === 3 && (
                      <><span className="text-[#fca31c]">Accessible Quality</span> Programs</>
                    )}
                    {slide.id === 4 && (
                      <>Transform Your Future</>
                    )}
                  </h2>
                  
                  {/* Description */}
                  <div className="text-base md:text-lg lg:text-xl text-gray-100 mb-8 leading-relaxed font-medium max-w-xl">
                    {slide.id === 1 && (
                      <>HBIU courses are available to anyone who meets our entrance requirements. We require comprehensive study, self-discipline, and demonstration of comprehension.</>
                    )}
                    {slide.id === 2 && (
                      <>HBIU ensures that students not only meet but exceed their learning goals. Backed by strong testimonials from past participants, the courses are praised for their depth, structure, and the ability to foster self-discipline.</>
                    )}
                    {slide.id === 3 && (
                      <>HBIU programs are accessible to those who meet our entry qualifications. We emphasise rigorous learning, self-motivation, and the ability to demonstrate a clear grasp of the course material.</>
                    )}
                    {slide.id === 4 && (
                      <>World-Class Education in over 150 Different Languages</>
                    )}
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#fca31c] to-[#012759] hover:from-[#e89a0f] hover:to-[#010a1f] text-white text-lg px-10 py-6 shadow-2xl font-semibold transition-all duration-300 hover:shadow-xl"
                      onClick={onGetStarted}
                    >
                      {isAuthenticated && user ? 'Go to Dashboard' : 'Get Started Free'}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    {!(isAuthenticated && user) && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="text-white border-2 border-white hover:bg-white/20 text-lg px-10 py-6 bg-black/30 backdrop-blur-sm transition-all duration-300"
                        onClick={onExploreCourses}
                      >
                        <ChevronRight className="w-5 h-5 mr-2" />
                        Explore Courses
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            

          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-10 bg-[#fca31c]'
                : 'w-3 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 z-20 text-white/70 text-sm font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  );
}
