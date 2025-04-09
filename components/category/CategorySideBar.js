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
    <aside className="w-full sm:w-48 bg-white shadow-md p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">카테고리</h2>
      <ul className="space-y-3">
        {categoriesWithBoards.map((category) => {
          const isOpen = openCategoryId === category.categoryId;
          return (
            <li key={category.categoryId}>
              <button
                onClick={() =>
                  setOpenCategoryId(isOpen ? null : category.categoryId)
                }
                className="w-full text-left text-gray-800 font-medium flex justify-between items-center hover:text-blue-600"
              >
                <span>{category.name}</span>
                <span className="text-sm">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <ul className="mt-2 ml-2 space-y-1 transition-all">
                  {category.boards.length > 0 ? (
                    category.boards.map((board) => (
                      <li key={board.boardId}>
                        <Link
                          href={{
                            pathname: `/boards/${board.boardId}/posts`,
                            query: { boardTitle: board.title }
                          }}
                          className="block text-sm text-blue-500 hover:underline pl-2"
                        >
                          {board.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400 ml-2">게시판 없음</li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default CategorySidebar;