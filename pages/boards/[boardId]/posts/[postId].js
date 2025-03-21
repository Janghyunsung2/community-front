import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import CommentSection from "components/CommentSection";
import LikeButton from "components/LikeButton"; // ✅ DC의 "추천" 역할
import api from "@/utils/axios";
import Link from "next/link";

const PostDetail = () => {
  const router = useRouter();
  const { boardId, postId } = router.query;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uniqueUrls = [...new Set(post?.url || [])];

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || !postId || fetchedRef.current) return;
    fetchedRef.current = true;

    api
      .get(`/api/posts/${postId}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("게시글 불러오기 실패:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [router.isReady, postId]);

  if (!router.isReady || loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/posts/${postId}`, {
          withCredentials: true,
        });
        router.push(`/boards/${boardId}`);
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
      }
    }
  };

  // 만약 post.views, post.createdAt 등이 있다면 아래처럼 추가 가능
  // const views = post.views || 0;
  // const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleString() : '';

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-3xl mx-auto bg-white border rounded shadow p-6">
        {/* 제목 */}
        <div className="border-b pb-2 mb-4">
          <h1 className="text-xl font-bold">{post.title}</h1>
        </div>

        {/* 작성자 / 날짜 / 조회수 (필요 시 추가) */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>글쓴이: {post.nickname}</span>
          {/* <span>조회수: {views}</span> */}
          {/* <span>작성일: {createdAt}</span> */}
        </div>
        <div>
          {uniqueUrls.map((image, index) => (
            <img key={index} src={image} alt={`image-${index}`} className="w-full h-auto rounded-lg shadow" />
          ))}
        </div>


        {/* 내용 */}
        <div className="min-h-[200px] mb-4 whitespace-pre-wrap leading-relaxed">
          
          {post.content}
        </div>

        {/* 추천(좋아요) 버튼 */}
        <div className="mb-4">
          <LikeButton postId={postId} />
        </div>

        {/* 수정 / 삭제 / 목록 */}
        <div className="flex space-x-2">
          <Link href={`/boards/${boardId}/posts/${postId}/edit`}>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded">
              수정
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            삭제
          </button>
          <Link href={`/boards/${boardId}`}>
            <button className="bg-gray-500 text-white px-3 py-1 rounded">
              목록
            </button>
          </Link>
        </div>

        {/* 댓글 섹션 */}
        <div className="mt-6">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
