import withAdminAuth from '../../components/withAdminAuth';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">관리자 대시보드</h1>
      <p>이 페이지는 관리자만 접근 가능합니다.</p>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
