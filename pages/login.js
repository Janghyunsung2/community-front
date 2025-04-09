import { useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";
import { AuthContext } from "../contexts/AuthContext";

const LOGIN_API = "/api/auth/login"; // ✅ 로그인 API

export default function Login() {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const [ error, setError ] = useState(null);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  // 로그인 요청 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        api.post(LOGIN_API, form, { withCredentials: true })
            .then(() => {
                console.log("로그인 성공");
                setUser(true);
                router.push("/");
            })
            .catch((err) => {
                console.error("로그인 실패:", err);
                setError('로그인에 실패했습니다. 사용자명과 비밀번호를 확인하세요.');
            });
    };


    return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">로그인</h2>

      {/* 에러 메시지 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}


      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" type="text" name="username" placeholder="사용자명" value={form.username} onChange={handleChange} required />
        <input className="w-full p-2 border rounded" type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
        <button className="w-full p-2 bg-blue-500 text-white rounded">로그인</button>
      </form>
    </div>
  );
}
