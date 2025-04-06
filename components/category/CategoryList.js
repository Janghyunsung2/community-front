import React from 'react';
import CategorySidebar from './CategorySidebar';

const CategoryList = ({ categoriesWithBoards }) => {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <CategorySidebar categories={categoriesWithBoards} />
      <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-auto">
        {/* ... 기존 내용 ... */}
      </main>
    </div>
  );
};

export default CategoryList;

