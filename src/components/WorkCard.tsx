import { Work } from '../types';

interface WorkCardProps {
  work: Work;
}

const WorkCard = ({ work }: WorkCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#4ecca3]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#4ecca3]/10">
      {/* 图片容器 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={work.image} 
          alt={work.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent opacity-80"></div>
        
        {/* 悬停时显示的信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-500">
          <span className="inline-block px-3 py-1 bg-[#4ecca3] text-[#1a1a2e] text-xs font-semibold rounded-full mb-3">
            {work.category}
          </span>
          <h3 className="text-xl font-bold text-white mb-2">{work.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{work.description}</p>
        </div>
      </div>
      
      {/* 标签 */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full hover:bg-[#4ecca3]/20 hover:text-[#4ecca3] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkCard;