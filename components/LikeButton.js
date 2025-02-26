import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';

const LikeButton = ({ postId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 좋아요 여부 및 개수 가져오기
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        // 좋아요 여부 확인
        const likeStatusRes = await api.get(`/api/posts/${postId}/likes/check`, {
          withCredentials: true,
        });
        setIsLiked(likeStatusRes.data); // true 또는 false

        // 좋아요 개수 가져오기
        const likeCountRes = await api.get(`/api/posts/${postId}/likes`);
        setLikeCount(likeCountRes.data.likeCount); // LikeCountResponseDto의 likeCount 값
      } catch (error) {
        console.error('좋아요 데이터 불러오기 실패:', error);
      }
    };

    fetchLikeData();
  }, [postId]);

  // 좋아요 토글
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await api.delete(`/api/posts/${postId}/likes`, { withCredentials: true });
        setLikeCount((prevCount) => Math.max(0, prevCount - 1)); // 좋아요 개수 감소
      } else {
        await api.post(`/api/posts/${postId}/likes`, {}, { withCredentials: true });
        setLikeCount((prevCount) => prevCount + 1); // 좋아요 개수 증가
      }
      setIsLiked(!isLiked); // 상태 토글
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={handleLikeToggle}>
        {isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
      </button>
      <span>{likeCount}개</span>
    </div>
  );
};

export default LikeButton;
