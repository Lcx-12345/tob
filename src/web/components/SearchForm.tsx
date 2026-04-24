import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (keyword: string, platform: string, pages: number) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('手机');
  const [platform, setPlatform] = useState('all');
  const [pages, setPages] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, platform, parseInt(pages));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
          搜索关键词
        </label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="请输入搜索关键词"
        />
      </div>

      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
          电商平台
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">全部平台</option>
          <option value="jd">京东</option>
          <option value="taobao">淘宝</option>
          <option value="pdd">拼多多</option>
        </select>
      </div>

      <div>
        <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
          页码数
        </label>
        <input
          type="number"
          id="pages"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          min="1"
          max="10"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '搜索中...' : '开始搜索'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
