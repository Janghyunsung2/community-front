// CommentSection.js
import React, { useState, useEffect } from 'react';
import api from '@/utils/axios';
import {useAuth} from "@/contexts/AuthContext";
import Link from 'next/link';


const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [commentGroups, setCommentGroups] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 댓글 목록 불러오기
  useEffect(() => {
    api.get(`/api/posts/${postId}/comments`)
      .then((res) => {
        console.log('댓글 데이터:', res.data);
        setCommentGroups(res.data);
      })
      .catch((err) => console.error('댓글 불러오기 실패:', err));
  }, [postId]);

  const handleCreateComment = (parentId = null, content) => {
    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    api.post(`/api/posts/${postId}/comments`, { parentId, content }, { withCredentials: true })
      .then(() => {
        setNewComment('');
        return api.get(`/api/posts/${postId}/comments`);
      })
      .then((res) => setCommentGroups(res.data))
      .catch((err) => console.error('댓글 생성 실패:', err));
  };

  const handleUpdateComment = (commentId, updatedContent) => {
    if (!updatedContent.trim()) {
      alert('수정할 내용을 입력해주세요.');
      return;
    }
    api.put(`/api/comments/${commentId}`, { content: updatedContent }, { withCredentials: true })
      .then(() => api.get(`/api/posts/${postId}/comments`))
      .then((res) => setCommentGroups(res.data))
      .catch((err) => console.error('댓글 수정 실패:', err));
  };

  const handleDeleteComment = (commentId) => {
    api.delete(`/api/comments/${commentId}`, { withCredentials: true })
      .then(() => api.get(`/api/posts/${postId}/comments`))
      .then((res) => setCommentGroups(res.data))
      .catch((err) => console.error('댓글 삭제 실패:', err));
  };

  // 루트 댓글과 대댓글을 렌더링하는 함수
    const renderCommentGroup = (group) => {
        const { rootDto, childrenDtos } = group;

        return (
            <div key={rootDto.contentId} className="mb-6 border rounded-lg p-4 shadow-sm bg-white">
                {/* 루트 댓글 */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-800">{rootDto.nickName}</span>
                        <span className="text-sm text-gray-400">{formatDate(rootDto.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap mb-2">
                        {rootDto.status === 'ACTIVE' ? rootDto.content
                            : rootDto.status === 'ADMIN_DELETE' ? '관리자에 의해 삭제된 댓글입니다.'
                                : '삭제된 댓글입니다.'}
                    </p>
                    {rootDto.status === 'ACTIVE' && user?.nickname === rootDto.nickName && (
                        <div className="space-x-2">
                            <button
                                onClick={() => {
                                    const updated = prompt('수정할 내용을 입력하세요:', rootDto.content);
                                    if (updated !== null) handleUpdateComment(rootDto.contentId, updated);
                                }}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDeleteComment(rootDto.contentId)}
                                className="text-sm text-red-500 hover:underline"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>

                {/* 대댓글 작성 폼 */}
                <div className="mt-4">
                    {user ? (
                        <>
      <textarea
          id={`reply-${rootDto.contentId}`}
          placeholder="대댓글을 입력하세요"
          className="w-full border rounded p-2 text-sm resize-none"
          rows={2}
      />
                            <button
                                onClick={() => {
                                    const textarea = document.getElementById(`reply-${rootDto.contentId}`);
                                    if (textarea) {
                                        const content = textarea.value;
                                        handleCreateComment(rootDto.contentId, content);
                                        textarea.value = '';
                                    }
                                }}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                대댓글 작성
                            </button>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">
                            <Link href="/login" className="text-blue-600 hover:underline">로그인</Link> 후 대댓글을 작성할 수 있습니다.
                        </p>
                    )}
                </div>


                {/* 대댓글 리스트 */}
                {childrenDtos && childrenDtos.length > 0 &&(
                    <div className="mt-4 pl-4 border-l border-gray-200 space-y-3">
                        {childrenDtos.map((child) => (
                            <div key={child.contentId} className="bg-gray-50 p-3 rounded border">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-gray-700">{child.nickName}</span>
                                    <span className="text-sm text-gray-400">{formatDate(child.createdAt)}</span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap mb-2">
                                    {child.status === 'ACTIVE' ? child.content
                                        : child.status === 'ADMIN_DELETE' ? '관리자에 의해 삭제된 댓글입니다.'
                                            : '삭제된 댓글입니다.'}
                                </p>
                                {child.status === 'ACTIVE' && user?.nickname === rootDto.nickName && (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => {
                                                const updated = prompt('수정할 내용을 입력하세요:', child.content);
                                                if (updated !== null) handleUpdateComment(child.contentId, updated);
                                            }}
                                            className="text-sm text-blue-500 hover:underline"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(child.contentId)}
                                            className="text-sm text-red-500 hover:underline"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }



    return (

      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">댓글</h3>

        {/* 댓글 작성 폼 */}
        <div className="mb-6">
          {user ? (
              <div className="space-y-2">
        <textarea
            className="w-full p-3 border rounded resize-none"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
        />
                <button
                    onClick={() => handleCreateComment(null, newComment)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  댓글 작성
                </button>
              </div>
          ) : (
              <p className="text-gray-600">
                댓글을 작성하려면{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  로그인
                </Link>{" "}
                하세요.
              </p>
          )}
        </div>

        {/* 댓글 목록 */}
          {commentGroups.map(group => renderCommentGroup(group))}
      </div>


  );
};

export default CommentSection;
