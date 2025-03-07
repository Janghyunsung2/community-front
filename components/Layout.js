import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utils/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await api.post(`/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 네비게이션 (어두운 배경) */}
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-2">
          {/* 홈 버튼 (로고) */}
          <Link href="/">
            <Image src="/온더잇.png" alt="Logo" width={100} height={40} />
          </Link>
        </div>

        {/* 로그인/로그아웃 버튼 */}
        <div className="flex space-x-4">
          {user == null ? (
            <>
              <Link href="/login" className="text-blue-200">
                로그인
              </Link>
              <Link href="/register" className="text-green-300">
                회원가입
              </Link>
            </>
          ) : (
            <>
              <Link href="/mypage" className="hover:underline">
                마이페이지
              </Link>

              {user.nickname === "관리자" && (
                <Link href="/admin" className="hover:underline">
                  관리자 페이지
                </Link>
              )}
              <button
                className="text-red-400 hover:text-red-300"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 영역 (밝은 배경) */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
}
