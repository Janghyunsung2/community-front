import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axios';
import AdminLayout from '../../components/AdminLayout';


const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  // ✅ 상태 추가
  const [editDisplayOrder, setEditDisplayOrder] = useState('');
  const router = useRouter();

  // 카테고리 목록 불러오기
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리를 불러오는 중 오류 발생:', error);
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/api/admin/categories?id=${id}`);
      fetchCategories();
    } catch (error) {
      console.error('카테고리 삭제 중 오류 발생:', error);
    }
  };

  // 카테고리 수정
  const updateCategory = async (id) => {
    try {
      await api.put(`/api/admin/categories?id=${id}`, {
        name: editCategoryName,
        displayOrder: parseInt(editDisplayOrder),
      });
      setEditCategoryId(null);
      setEditCategoryName('');
      setEditDisplayOrder('')
      fetchCategories();
      window.location.reload();
    } catch (error) {
      console.error('카테고리 수정 중 오류 발생:', error);
    }
  };

  return (
    <AdminLayout>
      <button
        onClick={() => router.push('/admin/category/new')}
        className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
      >
        새 카테고리 등록
      </button>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">카테고리 관리</h1>
        <table className="min-w-full bg-white border">
          <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">카테고리 이름</th>
            <th className="py-2 px-4 border">순서</th>
            {/* 추가 */}
            <th className="py-2 px-4 border">액션</th>
          </tr>
          </thead>
          <tbody>
          {categories.map((category) => (
              <tr key={category.id}>
                <td className="py-2 px-4 border text-center">{category.id}</td>
                <td className="py-2 px-4 border text-center">
                  {editCategoryId === category.id ? (
                      <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="border p-1"
                      />
                  ) : (
                      category.name
                  )}
                </td>

                {/* ✅ displayOrder 추가 */}
                <td className="py-2 px-4 border text-center">
                  {editCategoryId === category.id ? (
                      <input
                          type="number"
                          value={editDisplayOrder}
                          onChange={(e) => setEditDisplayOrder(e.target.value)}
                          className="border p-1 w-20 text-center"
                      />
                  ) : (
                      category.displayOrder
                  )}
                </td>

                <td className="py-2 px-4 border text-center">
                  {editCategoryId === category.id ? (
                      <>
                        <button
                            onClick={() => updateCategory(category.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        >
                          저장
                        </button>
                        <button
                            onClick={() => {
                              setEditCategoryId(null);
                              setEditCategoryName('');
                              setEditDisplayOrder('');
                            }}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          취소
                        </button>
                      </>
                  ) : (
                      <>
                        <button
                            onClick={() => {
                              setEditCategoryId(category.id);
                              setEditCategoryName(category.name);
                              setEditDisplayOrder(category.displayOrder);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                        >
                          수정
                        </button>
                        <button
                            onClick={() => deleteCategory(category.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          삭제
                        </button>
                      </>
                  )}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default CategoryPage;
