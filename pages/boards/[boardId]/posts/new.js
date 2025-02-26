import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";

const API_URL = "/api/boards";

export default function NewPost() {
  const router = useRouter();
  const { boardId } = router.query;
  const [form, setForm] = useState({ title: "", content: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API_URL}/${boardId}/posts`, form, { withCredentials: true });
      router.push(`/boards/${boardId}/posts`);
    } catch (err) {
      console.error("게시글 작성 실패:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white border rounded shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">게시글 작성</h2>

          {/* 제목 입력 */}
          <input
            className="w-full p-2 border rounded"
            type="text"
            name="title"
            placeholder="제목"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* 내용 입력 */}
          <textarea
            className="w-full p-2 border rounded h-40 resize-none"
            name="content"
            placeholder="내용"
            value={form.content}
            onChange={handleChange}
            required
          />

          {/* 버튼 */}
          <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            작성 완료
          </button>
        </form>
      </div>
    </div>
  );
}
