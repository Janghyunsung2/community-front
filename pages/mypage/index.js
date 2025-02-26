import { useState, useEffect } from "react";
import MyPageLayout from "../../components/MyPageLayout";
import api from "@/utils/axios";

export default function MemberInfo() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/members", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error("회원정보 조회 실패:", err);
        setError("회원정보를 불러오는데 실패했습니다.");
      });
  }, []);

  if (error) {
    return (
      <MyPageLayout>
        <div className="bg-white border rounded p-6 shadow w-full">
          <h1 className="text-2xl font-bold mb-4">회원정보</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </MyPageLayout>
    );
  }

  if (!user) {
    return (
      <MyPageLayout>
        <div className="bg-white border rounded p-6 shadow w-full">
          <h1 className="text-2xl font-bold mb-4">회원정보</h1>
          <p>로딩중...</p>
        </div>
      </MyPageLayout>
    );
  }

  return (
    <MyPageLayout>
      {/* 여기서부터 컨테이너 디자인 */}
      <div className="bg-white border rounded p-6 shadow w-full">
        <h1 className="text-2xl font-bold mb-4">회원정보</h1>
        <div className="space-y-2">
          <p>
            <strong>이름:</strong> {user.name}
          </p>
          <p>
            <strong>사용자명:</strong> {user.username}
          </p>
          <p>
            <strong>이메일:</strong> {user.email}
          </p>
          <p>
            <strong>닉네임:</strong> {user.nickname}
          </p>
          <p>
            <strong>전화번호:</strong> {user.phone}
          </p>
        </div>
      </div>
    </MyPageLayout>
  );
}
