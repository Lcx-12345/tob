import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#2d1b4e] to-[#4a1942]">
      {/* 装饰性浮动元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#4ecca3]/20 animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-purple-500/10 animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 rounded-full bg-blue-500/15 animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 rounded-full bg-cyan-400/20 animate-float delay-1500"></div>
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(#4ecca3 1px, transparent 1px), linear-gradient(90deg, #4ecca3 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}></div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-[#4ecca3] to-purple-300 bg-clip-text text-transparent animate-shimmer">
          Creative Developer
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          我专注于创造优雅的用户体验，将设计与技术完美融合，
          打造令人难忘的数字产品。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#works" 
            className="px-8 py-4 bg-[#4ecca3] text-[#1a1a2e] font-semibold rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-[#4ecca3]/30 transition-all duration-300"
          >
            查看作品
          </a>
          <a 
            href="#about" 
            className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white transition-all duration-300"
          >
            了解更多
          </a>
        </div>
      </div>

      {/* 向下滚动提示 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#works" className="text-white/60 hover:text-[#4ecca3] transition-colors">
          <ChevronDown size={40} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;