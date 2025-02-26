import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

const PostManagementPage = () => {
  const router = useRouter();
  const { boardId } = router.query; // URL 파라미터에서 boardId 추출
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // 한 페이지에 10개의 게시글 표시

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // 게시글 목록 조회
  const fetchPosts = async (page) => {
    try {
      const response = await api.get(`/api/admin/posts?page=${page}&size=${pageSize}`);
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('게시글 목록을 불러오는 중 오류 발생:', error);
    }
  };

  // 게시글 삭제
  const deletePost = async (postId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/admin/posts?id=${postId}`);
      fetchPosts(currentPage);
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
    }
  };

  // 페이지 이동
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">게시글 관리</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">제목</th>
            <th className="py-2 px-4 border">작성자</th>
            <th className="py-2 px-4 border">작성일</th>
            <th className="py-2 px-4 border">조회수</th>
            <th className="py-2 px-4 border">액션</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.postId}>
              <td className="py-2 px-4 border text-center">{post.postId}</td>
              <td className="py-2 px-4 border text-center">{post.title}</td>
              <td className="py-2 px-4 border text-center">{post.nickName}</td>
              <td className="py-2 px-4 border text-center">{new Date(post.createAt).toLocaleString()}</td>
              <td className="py-2 px-4 border text-center">{post.views}</td>
              <td className="py-2 px-4 border text-center">
                <button
                  onClick={() => deletePost(post.postId)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          이전
        </button>
        <span className="px-4 py-2">{currentPage + 1} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
          className={`px-4 py-2 rounded ${currentPage + 1 === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          다음
        </button>
      </div>
    </div>
    </AdminLayout>
  );
};

export default PostManagementPage;
