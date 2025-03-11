import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";

const API_URL = "/api/boards";

export default function NewPost() {
  const router = useRouter();
  const { boardId } = router.query;
  const [form, setForm] = useState({ title: "", content: "" });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages((prevImages) => [...prevImages, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // DTO 데이터를 JSON → Blob 변환 후 FormData에 추가
    const postData = JSON.stringify({ title: form.title, content: form.content });
    formData.append("postWithBoardDto", new Blob([postData], { type: "application/json" }));
  
    // 이미지 파일 추가
    images.forEach((image) => {
      formData.append("images", image);
    });
  
    try {
      await api.post(`${API_URL}/${boardId}/posts`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }, // 자동 설정됨 (생략 가능)
      });
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

          <input
            className="w-full p-2 border rounded"
            type="text"
            name="title"
            placeholder="제목"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full p-2 border rounded h-40 resize-none"
            name="content"
            placeholder="내용"
            value={form.content}
            onChange={handleChange}
            required
          />

          <input
            className="w-full p-2 border rounded"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            작성 완료
          </button>
        </form>
      </div>
    </div>
  );
}
