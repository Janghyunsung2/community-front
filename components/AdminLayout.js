import Link from 'next/link';
import withAdminAuth from './withAdminAuth';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">관리자 페이지</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/admin/category" className="hover:bg-gray-700 p-2 rounded">카테고리 관리</Link>
          <Link href="/admin/board" className="hover:bg-gray-700 p-2 rounded">게시판 관리</Link>
          <Link href="/admin/post" className="hover:bg-gray-700 p-2 rounded">게시글 관리</Link>
          <Link href="/admin/comment" className="hover:bg-gray-700 p-2 rounded">댓글 관리</Link>
          <Link href="/admin/member" className="hover:bg-gray-700 p-2 rounded">회원 관리</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default withAdminAuth(AdminLayout);
