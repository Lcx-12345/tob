import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import WorkCard from '@/components/WorkCard';
import { works, skills } from '@/data/portfolioData';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>
      
      {/* Works Section */}
      <section id="works" className="py-20 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[#4ecca3] to-purple-300 bg-clip-text text-transparent">
              精选作品
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-body">
              探索我最近完成的一些项目，每个作品都融入了独特的设计理念和技术实现。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work, index) => (
              <div 
                key={work.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <WorkCard work={work} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#2d1b4e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-[#4ecca3] to-purple-300 bg-clip-text text-transparent">
                关于我
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed font-body">
                我是一名热爱设计的全栈开发者，专注于创造美观且功能强大的数字产品。
                我相信优秀的设计应该是形式与功能的完美结合，让用户在使用产品的同时获得愉悦的体验。
              </p>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed font-body">
                拥有5年以上的开发经验，我曾与多个团队合作，参与从概念设计到产品上线的完整流程。
              </p>
              
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#4ecca3] hover:text-[#1a1a2e] transition-all duration-300"
                >
                  <Github size={24} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#4ecca3] hover:text-[#1a1a2e] transition-all duration-300"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#4ecca3] hover:text-[#1a1a2e] transition-all duration-300"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-8 text-white">技能专长</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 font-medium">{skill.name}</span>
                      <span className="text-[#4ecca3] font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 group-hover:shadow-lg"
                        style={{ 
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, ${skill.color}, #4ecca3)`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#4a1942]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-[#4ecca3] to-purple-300 bg-clip-text text-transparent">
            让我们一起合作
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto font-body">
            有一个有趣的项目？或者只是想打个招呼？随时联系我！
          </p>
          
          <a 
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#4ecca3] text-[#1a1a2e] font-bold text-lg rounded-lg hover:scale-105 hover:shadow-xl hover:shadow-[#4ecca3]/30 transition-all duration-300 font-accent"
          >
            <Mail size={24} />
            发送邮件
            <ExternalLink size={20} />
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-[#1a1a2e] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Portfolio. 用心设计，用爱创造。
          </p>
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}