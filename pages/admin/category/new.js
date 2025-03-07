import React, { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axios';
import AdminLayout from '@/components/AdminLayout';

const NewCategoryPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const router = useRouter();

  const addCategory = async () => {
    if (!categoryName.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }
    try {
      await api.post('/api/admin/categories', { name: categoryName});
      alert('카테고리가 등록되었습니다.');
      router.push('/admin/category'); // 등록 후 목록 페이지로 이동
    } catch (error) {
      console.error('카테고리 추가 중 오류 발생:', error);
      alert('카테고리 추가에 실패했습니다.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">새 카테고리 등록</h1>
        <div className="p-4 border rounded bg-gray-100">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="카테고리 이름 입력"
            className="border p-2 w-full mb-4"
          />
          <button
            onClick={addCategory}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            등록
          </button>
          <button
            onClick={() => router.push('/admin/categories')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            취소
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewCategoryPage;
