import React from 'react';
import Link from 'next/link';

export default function MyPageLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">마이페이지</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/mypage" className="hover:bg-gray-700 p-2 rounded">
            회원정보
          </Link>
          <Link href="/mypage/member-update" className="hover:bg-gray-700 p-2 rounded">
            회원정보 수정
          </Link>
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
