import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

const NewBoardPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(false);
  const [categories, setCategories] = useState([]); // 모든 카테고리 목록
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // 선택된 카테고리 ID

  // 모든 카테고리 불러오기
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리 목록을 불러오는 중 오류 발생:', error);
    }
  };

  // 게시판 등록 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !selectedCategoryId) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await api.post('/api/admin/boards', {
        title,
        description,
        active,
        categoryId: selectedCategoryId,
      });
      alert('게시판이 등록되었습니다.');
      router.push('/admin/board'); // 게시판 목록 페이지로 이동
    } catch (error) {
      console.error('게시판 등록 중 오류 발생:', error);
      alert('게시판 등록에 실패했습니다.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">새 게시판 등록</h1>
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-100">
          <div className="mb-4">
            <label className="block font-semibold">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
              placeholder="게시판 제목 입력"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              placeholder="게시판 설명 입력"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">활성화 여부</label>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="mr-2"
            />
            활성화
          </div>

          <div className="mb-4">
            <label className="block font-semibold">카테고리 선택</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              등록
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/boards')}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewBoardPage;
