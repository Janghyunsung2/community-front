import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import AdminLayout from '../../components/AdminLayout';

const CommentManagementPage = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // 한 페이지에 10개의 댓글 표시

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);

  // 댓글 목록 조회 (모든 댓글)
  const fetchComments = async (page) => {
    try {
      const response = await api.get(`/api/admin/posts/comments?page=${page}&size=${pageSize}`);
      setComments(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('댓글 목록을 불러오는 중 오류 발생:', error);
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/admin/posts/comments?id=${commentId}`);
      fetchComments(currentPage);
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
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
      <h1 className="text-2xl font-bold mb-4">댓글 관리</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">내용</th>
            <th className="py-2 px-4 border">작성자</th>
            <th className="py-2 px-4 border">작성일</th>
            <th className="py-2 px-4 border">좋아요 수</th>
            <th className="py-2 px-4 border">액션</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.contentId}>
              <td className="py-2 px-4 border text-center">{comment.contentId}</td>
              <td className="py-2 px-4 border text-center">{comment.content}</td>
              <td className="py-2 px-4 border text-center">{comment.nickName}</td>
              <td className="py-2 px-4 border text-center">{new Date(comment.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border text-center">{comment.contentLikes}</td>
              <td className="py-2 px-4 border text-center">
                <button
                  onClick={() => deleteComment(comment.contentId)}
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

export default CommentManagementPage;
