const Navigation = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-2xl font-bold bg-gradient-to-r from-[#4ecca3] to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform font-accent"
            >
              Portfolio
            </button>
          </div>
          
          {/* 导航链接 */}
          <div className="hidden md:flex items-center space-x-8 font-navigation">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-gray-300 hover:text-[#4ecca3] transition-colors"
            >
              首页
            </button>
            <button 
              onClick={() => scrollToSection('works')}
              className="text-gray-300 hover:text-[#4ecca3] transition-colors"
            >
              作品
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-[#4ecca3] transition-colors"
            >
              关于
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 bg-[#4ecca3] text-[#1a1a2e] font-semibold rounded-lg hover:scale-105 transition-transform font-accent"
            >
              联系我
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;