// CommentSection.js
import React, { useState, useEffect } from 'react';
import api from '@/utils/axios';
const CommentSection = ({ postId }) => {
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
      <div key={rootDto.contentId} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
        {/* 루트 댓글 */}
        <div>
          <p>
            <strong>{rootDto.nickName}</strong> ({new Date(rootDto.createdAt).toLocaleString()})
          </p>
          <p>
            {rootDto.status === 'ACTIVE' ? rootDto.content
                : rootDto.status === 'ADMIN_DELETE' ? '관리자에 의해 삭제된 댓글입니다.'
                    : '삭제된 댓글입니다.'}
          </p>
          {rootDto.status === 'ACTIVE' && (
              <>
                <button onClick={() => {
                  const updated = prompt('수정할 내용을 입력하세요:', rootDto.content);
                  if (updated !== null) handleUpdateComment(rootDto.contentId, updated);
                }}>수정</button>
                <button onClick={() => handleDeleteComment(rootDto.contentId)}>삭제</button>
              </>
          )}

        </div>
        {/* 대댓글 작성 폼 (루트 댓글 하위) */}
        <div style={{ marginTop: '10px' }}>
          <textarea placeholder="대댓글을 입력하세요" id={`reply-${rootDto.contentId}`} />
          <button onClick={() => {
            const textarea = document.getElementById(`reply-${rootDto.contentId}`);
            if (textarea) {
              const content = textarea.value;
              handleCreateComment(rootDto.contentId, content);
              textarea.value = '';
            }
          }}>대댓글 작성</button>
        </div>
        {/* 대댓글 리스트 렌더링 */}
        {childrenDtos && childrenDtos.length > 0 && (
          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            {childrenDtos.map(child => (
              <div key={child.contentId} style={{ marginBottom: '10px', border: '1px solid #eee', padding: '5px' }}>
                <p>
                  <strong>{child.nickName}</strong> ({new Date(child.createdAt).toLocaleString()})
                </p>
                <p>
                  {child.status === 'ACTIVE' ? child.content
                      : child.status === 'ADMIN_DELETE' ? '관리자에 의해 삭제된 댓글입니다.'
                          : '삭제된 댓글입니다.'}
                </p>
                {child.status === 'ACTIVE' && (
                    <>
                      <button onClick={() => {
                        const updated = prompt('수정할 내용을 입력하세요:', child.content);
                        if (updated !== null) handleUpdateComment(child.contentId, updated);
                      }}>수정</button>
                      <button onClick={() => handleDeleteComment(child.contentId)}>삭제</button>
                    </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (

    <div>
      <h3>댓글</h3>
      {/* 최상위 댓글 작성 폼 */}
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={() => handleCreateComment(null, newComment)}>댓글 작성</button>
      </div>
      {/* 모든 댓글 그룹 렌더링 */}
      {commentGroups.map(group => renderCommentGroup(group))}
    </div>
  );
};

export default CommentSection;
