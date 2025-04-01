import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import AdminLayout from '../../components/AdminLayout';

const MemberPage = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchMembers(currentPage);
  }, [currentPage]);

  const fetchMembers = async (page) => {
    try {
      const response = await api.get(`/api/admin/member?page=${page}&size=${pageSize}`);
      setMembers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('회원 목록을 불러오는 중 오류 발생:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">회원 목록</h1>
          <table className="min-w-full bg-white border">
            <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">유저네임</th>
              <th className="py-2 px-4 border">닉네임</th>
              <th className="py-2 px-4 border">이메일</th>
              <th className="py-2 px-4 border">전화번호</th>
              <th className="py-2 px-4 border">상태</th>
              <th className="py-2 px-4 border">성별</th>
              <th className="py-2 px-4 border">역할</th>
            </tr>
            </thead>
            <tbody>
            {members.map((member) => (
                <tr key={member.id}>
                  <td className="py-2 px-4 border text-center">{member.id}</td>
                  <td className="py-2 px-4 border text-center">{member.username}</td>
                  <td className="py-2 px-4 border text-center">{member.nickname}</td>
                  <td className="py-2 px-4 border text-center">{member.email}</td>
                  <td className="py-2 px-4 border text-center">{member.phone}</td>
                  <td className="py-2 px-4 border text-center">{member.status}</td>
                  <td className="py-2 px-4 border text-center">{member.gender}</td>
                  <td className="py-2 px-4 border text-center">{member.role}</td>
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

export default MemberPage;
