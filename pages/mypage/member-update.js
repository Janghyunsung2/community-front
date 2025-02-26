import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios"; // 일부 API는 api 인스턴스 사용
import MyPageLayout from "../../components/MyPageLayout";

const REGISTER_API = "/api/members";
const CHECK_NICKNAME_API = "/api/members/check-nickname";
const CHECK_PASSWORD_API = "/api/auth/check-password";

export default function MemberUpdate() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    birthday: "",
    currentPassword: "",
    newPassword: "",
  });
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [error, setError] = useState(null);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // 닉네임 입력 시 중복 체크 상태 해제
    if (name === "nickname") {
      setNicknameChecked(false);
    }
  };

  // 현재 비밀번호 확인
  const handleCheckPassword = async () => {
    try {
      const response = await axios.post(
        CHECK_PASSWORD_API,
        { password: form.currentPassword },
        { withCredentials: true }
      );
      if (response.data === true) {
        setPasswordVerified(true);
        alert("현재 비밀번호가 확인되었습니다.");
      } else {
        setPasswordVerified(false);
        alert("현재 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("비밀번호 확인 실패:", err);
      setError("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  // 닉네임 중복 확인
  const checkNickname = async () => {
    try {
      const response = await api.get(`${CHECK_NICKNAME_API}?nickname=${form.nickname}`);
      if (response.data) {
        alert("이미 사용 중인 닉네임입니다.");
        setNicknameChecked(false);
      } else {
        alert("사용 가능한 닉네임입니다.");
        setNicknameChecked(true);
      }
    } catch (err) {
      console.error("닉네임 중복 확인 실패:", err);
      setError("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 회원정보 변경 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 새 비밀번호가 있다면, 현재 비밀번호 확인 필요
    if (form.newPassword && !passwordVerified) {
      setError("비밀번호 변경을 위해 현재 비밀번호 확인을 완료해야 합니다.");
      return;
    }

    // 닉네임이 변경되었다면 중복확인 필요
    if (!nicknameChecked) {
      setError("닉네임 중복 확인을 완료해야 합니다.");
      return;
    }

    const updateDto = {
      name: form.name,
      nickname: form.nickname,
      birthday: form.birthday,
      password: form.newPassword || null,
    };

    try {
      await api.put(REGISTER_API, updateDto, { withCredentials: true });
      alert("회원정보가 변경되었습니다.");
      router.push("/mypage");
    } catch (err) {
      console.error("회원정보 변경 실패:", err);
      setError(err.response?.data?.message || "회원정보 변경 중 오류 발생");
    }
  };

  return (
    <MyPageLayout>
      {/* 
        AdminLayout 스타일과 유사하게,
        메인 콘텐츠 내부에 "bg-white border rounded p-6 shadow" 컨테이너 사용
      */}
      <div className="bg-white border rounded p-6 shadow w-full">
        <h2 className="text-2xl font-bold mb-4">회원정보 변경</h2>
        
        {error && <p className="text-red-500 mb-2">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 입력 */}
          <input
            className="w-full p-2 border rounded"
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* 닉네임 입력 및 중복 확인 */}
          <div className="flex space-x-2">
            <input
              className="flex-1 p-2 border rounded"
              type="text"
              name="nickname"
              placeholder="닉네임"
              value={form.nickname}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={checkNickname}
              className={`px-4 py-2 rounded text-white ${
                nicknameChecked ? 'bg-gray-500' : 'bg-blue-500'
              }`}
              disabled={nicknameChecked}
            >
              {nicknameChecked ? "사용 가능" : "중복 확인"}
            </button>
          </div>

          {/* 생년월일 */}
          <input
            className="w-full p-2 border rounded"
            type="date"
            name="birthday"
            placeholder="생년월일"
            value={form.birthday}
            onChange={handleChange}
          />

          {/* 비밀번호 변경 섹션 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold mb-2">비밀번호 변경</h3>
            <div className="flex space-x-2 mb-2">
              <input
                className="flex-1 p-2 border rounded"
                type="password"
                name="currentPassword"
                placeholder="현재 비밀번호"
                value={form.currentPassword}
                onChange={handleChange}
                required={!!form.newPassword} // 새 비밀번호가 있을 때만 필수
              />
              <button
                type="button"
                onClick={handleCheckPassword}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                확인
              </button>
            </div>
            {passwordVerified && (
              <input
                className="w-full p-2 border rounded"
                type="password"
                name="newPassword"
                placeholder="새 비밀번호"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            )}
          </div>

          {/* 변경하기 버튼 */}
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            변경하기
          </button>
        </form>
      </div>
    </MyPageLayout>
  );
}
