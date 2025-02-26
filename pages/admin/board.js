import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import AdminLayout from '../../components/AdminLayout';

const BoardPage = () => {
  const [boards, setBoards] = useState([]);
  const [editBoardId, setEditBoardId] = useState(null);
  const [editBoardData, setEditBoardData] = useState({ title: '', description: '', active: false });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // 한 페이지에 10개 게시판 표시

  useEffect(() => {
    fetchBoards(currentPage);
  }, [currentPage]);

  // 게시판 목록 불러오기
  const fetchBoards = async (page) => {
    try {
      const response = await api.get(`/api/admin/boards?page=${page}&size=${pageSize}`);
      setBoards(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('게시판 목록을 불러오는 중 오류 발생:', error);
    }
  };

  // 게시판 삭제
  const deleteBoard = async (id) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/admin/boards?id=${id}`);
      fetchBoards(currentPage);
    } catch (error) {
      console.error('게시판 삭제 중 오류 발생:', error);
    }
  };

  // 게시판 수정
  const updateBoard = async (id) => {
    try {
      await api.put(`/api/admin/boards?id=${id}`, editBoardData);
      setEditBoardId(null);
      setEditBoardData({ title: '', description: '', active: false });
      fetchBoards(currentPage);
    } catch (error) {
      console.error('게시판 수정 중 오류 발생:', error);
    }
  };

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditBoardData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">게시판 관리</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">제목</th>
            <th className="py-2 px-4 border">설명</th>
            <th className="py-2 px-4 border">활성화 여부</th>
            <th className="py-2 px-4 border">액션</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board.id}>
              <td className="py-2 px-4 border text-center">{board.id}</td>
              <td className="py-2 px-4 border text-center">
                {editBoardId === board.id ? (
                  <input
                    type="text"
                    name="title"
                    value={editBoardData.title}
                    onChange={handleInputChange}
                    className="border p-1"
                  />
                ) : (
                  board.title
                )}
              </td>
              <td className="py-2 px-4 border text-center">
                {editBoardId === board.id ? (
                  <input
                    type="text"
                    name="description"
                    value={editBoardData.description}
                    onChange={handleInputChange}
                    className="border p-1"
                  />
                ) : (
                  board.description
                )}
              </td>
              <td className="py-2 px-4 border text-center">
                {editBoardId === board.id ? (
                  <input
                    type="checkbox"
                    name="active"
                    checked={editBoardData.active}
                    onChange={handleInputChange}
                  />
                ) : board.active ? '활성화' : '비활성화'}
              </td>
              <td className="py-2 px-4 border text-center">
                {editBoardId === board.id ? (
                  <>
                    <button
                      onClick={() => updateBoard(board.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditBoardId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditBoardId(board.id);
                        setEditBoardData({
                          title: board.title,
                          description: board.description,
                          active: board.active,
                        });
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteBoard(board.id)}
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

export default BoardPage;
