import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";
const API_URL = "/api/posts"; // ✅ 백엔드 API

export default function EditPost() {
  const router = useRouter();
  const { postId, boardId } = router.query;
  const [post, setPost] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (postId) {
      api.get(`${API_URL}/${postId}`)
        .then((res) => setPost(res.data))
        .catch((err) => console.error("게시글 불러오기 실패:", err));
    }
  }, [postId]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // 게시글 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.put(`${API_URL}/${postId}`, post, { withCredentials: true });
      router.push(`/boards/${boardId}/posts/${postId}`); // ✅ 수정 후 상세 페이지로 이동
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      setError("게시글 수정 중 오류 발생");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">게시글 수정</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" type="text" name="title" placeholder="제목" value={post.title} onChange={handleChange} required />
        <textarea className="w-full p-2 border rounded" name="content" placeholder="내용" value={post.content} onChange={handleChange} required />
        <button className="w-full p-2 bg-blue-500 text-white rounded">수정 완료</button>
      </form>
    </div>
  );
}
