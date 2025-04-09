import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/axios';

const CategorySidebar = () => {
  const [categoriesWithBoards, setCategoriesWithBoards] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categories } = await api.get('/api/categories/top6');
        const { data: boards } = await api.get('/api/boards/main');

        const groupedBoards = boards.reduce((acc, board) => {
          const { categoryId } = board;
          if (!acc[categoryId]) acc[categoryId] = [];
          acc[categoryId].push(board);
          return acc;
        }, {});

        const merged = categories.map(category => ({
          ...category,
          boards: groupedBoards[category.categoryId] || []
        }));

        setCategoriesWithBoards(merged);
      } catch (err) {
        console.error('사이드바 데이터 로딩 실패:', err);
      }
    };

    fetchData();
  }, []);

  return (

      <aside className="w-full sm:w-60 bg-white shadow-md p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">카테고리</h2>
        <ul className="space-y-2">
          {categoriesWithBoards.map((category) => {
            const isOpen = openCategoryId === category.categoryId;
            return (
                <li key={category.categoryId} className="group">
                  <button
                      onClick={() => setOpenCategoryId(isOpen ? null : category.categoryId)}
                      className="w-full text-left flex justify-between items-center px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <span className="text-gray-800 group-hover:text-blue-600 font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500 group-hover:text-blue-600">
              {isOpen ? '▲' : '▼'}
            </span>
                  </button>

                  {/* 보드 리스트 with 애니메이션 */}
                  <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <ul className="ml-3 pl-3 border-l border-blue-100 space-y-1">
                      {category.boards.length > 0 ? (
                          category.boards.map((board) => (
                              <li key={board.boardId}>
                                <Link
                                    href={{
                                      pathname: `/boards/${board.boardId}/posts`,
                                      query: { boardTitle: board.title }
                                    }}
                                    className="block text-sm text-gray-700 hover:text-blue-600 hover:underline transition pl-1"
                                >
                                  • {board.title}
                                </Link>
                              </li>
                          ))
                      ) : (
                          <li className="text-sm text-gray-400 ml-1">게시판 없음</li>
                      )}
                    </ul>
                  </div>
                </li>
            );
          })}
        </ul>
      </aside>


  );
};

export default CategorySidebar;
