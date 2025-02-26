import AdminLayout from '../../components/AdminLayout';

const AdminHome = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">관리자 페이지에 오신 것을 환영합니다.</h1>
      <p className="mt-4">왼쪽 메뉴를 통해 관리할 항목을 선택하세요.</p>
    </AdminLayout>
  );
};

export default AdminHome;
