import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
const API_URL = "/api/posts"; // ✅ 백엔드 API

export default function PostDetail() {
  const router = useRouter();
  const { id, boardId } = router.query;
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  // 게시글 불러오기
  useEffect(() => {
    if (id) {
      api.get(`${API_URL}/${id}`)
        .then((res) => setPost(res.data))
        .catch((err) => console.error("게시글 불러오기 실패:", err));
    }
  }, [id]);

  // 게시글 삭제
  const handleDelete = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await api.delete(`${API_URL}/${id}`, { withCredentials: true }); // ✅ JWT 쿠키 인증 추가
        await router.push(`/boards/${boardId}/posts`); // ✅ 삭제 후 메인 페이지 이동
        console.log(boardId);
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
        setError("게시글 삭제 중 오류 발생");
      }
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="mt-2">{post.content}</p>
      <div className="mt-4 flex space-x-2">
        <button onClick={() => router.push(`/post/edit/${id}`)} className="p-2 bg-yellow-500 text-white rounded">수정</button>
        <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">삭제</button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
