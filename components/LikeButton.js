import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import {useAuth} from "@/contexts/AuthContext";
import {useRouter} from "next/router";

const LikeButton = ({ postId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  // 좋아요 여부 및 개수 가져오기
  useEffect(() => {
    fetchLikeData();
  }, [postId]);

  const fetchLikeData = async () => {
    try {
      // 좋아요 여부 확인
      if(user){
        const likeStatusRes = await api.get(`/api/posts/${postId}/likes/check`, {
          withCredentials: true,
        });
        setIsLiked(likeStatusRes.data); // true 또는 false
      }

      // 좋아요 개수 가져오기
      const likeCountRes = await api.get(`/api/posts/${postId}/likes`);
      setLikeCount(likeCountRes.data.likeCount); // LikeCountResponseDto의 likeCount 값
    } catch (error) {
      console.error('좋아요 데이터 불러오기 실패:', error);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if(user){
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
    } else {
    //   로그인 안 했을 경우 '로그인이 필요한 서비스입니다.' 모달 띄우기
      const goLogin = confirm("로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?");
      if (goLogin) {
        // window.location.href = "/login"; // 로그인 페이지로 이동
        router.push("/login");
      }
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
