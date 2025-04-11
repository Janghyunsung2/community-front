'use client';

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utils/axios";
import { AuthContext } from "../contexts/AuthContext";
import CategorySideBar from "components/category/CategorySideBar";
import { FiBell } from "react-icons/fi";

export default function Layout({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [unReadCount, setUnReadCount] = useState(0);

  const fetchAlarms = async () => {
    try {
      const res = await api.get("/api/alarm", {
        withCredentials: true,
        params: {
          page: 0,
          size: 50,
          sort: ["isRead,asc", "createdAt,desc"],
        },
        paramsSerializer: {
          indexes: null,
        },
      });
      setAlarms(res.data.alarms.content || []);
      setUnReadCount(res.data.unReadCount || 0);
    } catch (err) {
      console.error("알림 불러오기 실패:", err);
    }
  };

  const toggleAlarm = () => {
    setShowAlarm(!showAlarm);
    if (!showAlarm) fetchAlarms();
  };

  useEffect(() => {
    fetchAlarms();
  }, []);


  return (
      <div className="w-full flex flex-col min-h-screen bg-gray-100 text-gray-900 overflow-x-hidden">        {/* 상단 네비게이션 */}
        <header className="relative bg-gray-800 text-white">
        <div className="w-full sm:max-w-7xl sm:mx-auto px-4 sm:px-4 py-4 space-y-2 sm:space-y-4">
            <div className="flex justify-between items-center">
              {/* 왼쪽: 로고 */}
              <div className="flex items-center space-x-2">
                <Link href="/">
                  <Image src="/온더잇.png" alt="Logo" width={100} height={40}/>
                </Link>
              </div>

              {/* 오른쪽: 카테고리 보기 + 알림 + 유저 */}
              <div className="flex items-center space-x-3 sm:space-x-6">
                {/* ✅ 모바일 전용 카테고리 버튼 */}
                <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="sm:hidden bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  카테고리
                </button>

                {/* 알람 아이콘 */}
                {user && (
                    <button onClick={toggleAlarm} className="relative hover:opacity-80">
                      <FiBell className="text-white text-xl" />
                      {unReadCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {unReadCount}
                    </span>
                      )}
                    </button>
                )}

                {/* 로그인 / 유저 정보 */}
                {user == null ? (
                    <>
                      <Link href="/login"
                            className="text-blue-200 text-sm">로그인</Link>
                      <Link href="/register"
                            className="text-green-300 text-sm">회원가입</Link>
                    </>
                ) : (
                    <div className="relative inline-block text-left">
                      <button
                          onClick={() => setIsOpen(!isOpen)}
                          className="font-medium text-white hover:text-gray-300 text-sm"
                      >
                        {user.nickname}
                      </button>
                      {isOpen && (
                          <div
                              className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                            <ul className="py-2 px-2 text-sm text-gray-700">
                              <li>
                                <Link href="/mypage"
                                      className="block py-1 hover:underline">마이페이지</Link>
                              </li>
                              <li>
                                <button
                                    onClick={() => setUser(null)}
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
          </div>
        </header>

        {showAlarm && (
            <div className="fixed top-16 right-4 z-50 w-80 bg-white border rounded shadow-lg">
              <div className="p-4 border-b font-semibold">알림</div>
              <ul className="max-h-80 overflow-y-auto divide-y text-sm">
                {alarms.length === 0 ? (
                    <li className="p-4 text-gray-400">알림이 없습니다.</li>
                ) : (
                    alarms.map((alarm) => (
                        <li
                            key={alarm.id}
                            className={`p-4 cursor-pointer hover:bg-gray-100 ${alarm.read ? "text-gray-400" : "text-black"}`}
                            onClick={async () => {
                              try {
                                await api.patch(`/api/alarm/${alarm.id}/read`, {}, { withCredentials: true });
                                setAlarms((prev) =>
                                    prev.map((a) => (a.id === alarm.id ? { ...a, read: true } : a))
                                );
                                setUnReadCount((prev) => Math.max(0, prev - 1));
                              } catch (err) {
                                console.error("알림 읽음 처리 실패:", err);
                              }
                            }}
                        >
                          <p className="font-semibold">{alarm.title}</p>
                          <p className="text-xs">{alarm.content}</p>
                          <p className="text-[10px]">{new Date(alarm.createdAt).toLocaleString()}</p>
                        </li>
                    ))
                )}
              </ul>
            </div>
        )}

        {/* ✅ 모바일용 카테고리 모달 */}
        {isCategoryModalOpen && (
            <div
                className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-start justify-center sm:hidden">
              <div
                  className="bg-white w-full max-w-sm p-4 mt-20 rounded shadow-lg">
                <button
                    className="text-right text-gray-500 mb-2 text-sm"
                    onClick={() => setIsCategoryModalOpen(false)}
                >
                  ✕ 닫기
                </button>
                <CategorySideBar isMobile={true}/>
              </div>
            </div>
        )}

        {/* 본문 */}
        <div className="flex w-full sm:max-w-7xl sm:mx-auto">
          <div className="hidden sm:block">
          <CategorySideBar/>
          </div>
          <main className="flex-1 p-4 sm:p-4 bg-gray-100 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
  );
}