import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utils/axios";
import { AuthContext } from "../contexts/AuthContext";
import CategorySideBar from "components/category/CategorySideBar";

export default function Layout({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post(`/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return (
      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        {/* 상단 네비게이션 */}
        <header className="inline-block bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image src="/온더잇.png" alt="Logo" width={100} height={40} />
              </Link>
            </div>

            <div className="flex space-x-4 sm:space-x-10">
              <Link href="/chat">채팅방</Link>
            </div>

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
                  <div className="relative inline-block text-left">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-sm font-medium text-white hover:text-gray-300"
                    >
                      계정
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                          <ul className="py-2 px-2 text-sm text-gray-700">
                            <li>
                              <Link href="/mypage" className="block py-1 hover:underline">
                                마이페이지
                              </Link>
                            </li>
                            {user.nickname === "관리자" && (
                                <li>
                                  <Link href="/admin" className="block py-1 hover:underline">
                                    관리자 페이지
                                  </Link>
                                </li>
                            )}
                            <li>
                              <button
                                  onClick={handleLogout}
                                  className="block w-full text-left text-red-400 hover:text-red-300 py-1"
                              >
                                로그아웃
                              </button>
                            </li>
                          </ul>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </header>

        {/* 본문 레이아웃 */}
        <div className="flex max-w-7xl mx-auto w-full">
            <CategorySideBar />
          <main className="flex-1 p-4 sm:p-6 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
  );
}