import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";

const REGISTER_API = "/api/members/register"; // 회원가입 API
const SEND_EMAIL_API = "/api/auth/send-email"; // 이메일 인증 요청 API
const VERIFY_EMAIL_API = "/api/auth/verify-email"; // 이메일 코드 검증 API
const CHECK_NICKNAME_API = "/api/members/check-nickname"; // 닉네임 중복 확인 API
const CHECK_USERNAME_API = "/api/members/check-username"; // 사용자명 중복 확인 API

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    nickname: "",
    phone: "",
    gender: "male", // 기본값
    birthday: "",
    verificationCode: "",
  });
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [error, setError] = useState(null);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // 입력값이 변경되면 중복 확인 상태를 초기화
    if (name === "username") setUsernameChecked(false);
    if (name === "nickname") setNicknameChecked(false);
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

  // 사용자명 중복 확인
  const checkUsername = async () => {
    try {
      const response = await api.get(`${CHECK_USERNAME_API}?username=${form.username}`);
      if (response.data) {
        alert("이미 사용 중인 사용자명입니다.");
        setUsernameChecked(false);
      } else {
        alert("사용 가능한 사용자명입니다.");
        setUsernameChecked(true);
      }
    } catch (err) {
      console.error("사용자명 중복 확인 실패:", err);
      setError("사용자명 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 이메일 인증 요청
  const sendEmailVerification = async () => {
    try {
      await api.post(`${SEND_EMAIL_API}?email=${form.email}`, {}, { withCredentials: true });
      setEmailSent(true);
      alert("인증 이메일이 발송되었습니다.");
    } catch (err) {
      console.error("이메일 인증 요청 실패:", err);
      setError("이메일 인증 요청 실패");
    }
  };

  // 이메일 인증 코드 검증
  const verifyEmailCode = async () => {
    try {
      const response = await api.post(VERIFY_EMAIL_API, {
        email: form.email,
        code: form.verificationCode,
      });
      if (response.status === 200) {
        setEmailVerified(true);
        alert("이메일 인증 성공!");
      }
    } catch (err) {
      console.error("이메일 인증 실패:", err);
      setError("인증 코드가 일치하지 않습니다.");
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!emailVerified) {
      setError("이메일 인증을 완료해야 합니다.");
      return;
    }
    if (!usernameChecked) {
      setError("사용자명 중복 확인을 완료해야 합니다.");
      return;
    }
    if (!nicknameChecked) {
      setError("닉네임 중복 확인을 완료해야 합니다.");
      return;
    }

    try {
      const response = await api.post(REGISTER_API, form);
      console.log("회원가입 성공:", response.data);
      router.push("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError(err.response?.data?.message || "회원가입 중 오류 발생");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
        />
        <div className="flex space-x-2">
          <input
            className="flex-1 p-2 border rounded"
            type="text"
            name="username"
            placeholder="사용자명"
            value={form.username}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={checkUsername}
            className="p-2 bg-blue-500 text-white rounded"
            disabled={usernameChecked}
          >
            {usernameChecked ? "사용 가능" : "중복 확인"}
          </button>
        </div>
        <input
          className="w-full p-2 border rounded"
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />
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
            className="p-2 bg-blue-500 text-white rounded"
            disabled={nicknameChecked}
          >
            {nicknameChecked ? "사용 가능" : "중복 확인"}
          </button>
        </div>
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="phone"
          placeholder="전화번호"
          value={form.phone}
          onChange={handleChange}
          required
        />
        {/* 성별 선택 */}
        <select
          className="w-full p-2 border rounded"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        {/* 생년월일 */}
        <input
          className="w-full p-2 border rounded"
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
        />
        {/* 이메일 입력 & 인증 요청 */}
        <div className="flex space-x-2">
          <input
            className="flex-1 p-2 border rounded"
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={sendEmailVerification}
            className="p-2 bg-blue-500 text-white rounded"
            disabled={emailSent}
          >
            {emailSent ? "이메일 발송됨" : "이메일 인증"}
          </button>
        </div>
        {/* 인증 코드 입력 & 검증 */}
        {emailSent && (
          <div className="flex space-x-2">
            <input
              className="flex-1 p-2 border rounded"
              type="text"
              name="verificationCode"
              placeholder="인증 코드 입력"
              value={form.verificationCode}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={verifyEmailCode}
              className="p-2 bg-green-500 text-white rounded"
              disabled={emailVerified}
            >
              {emailVerified ? "인증 완료" : "코드 확인"}
            </button>
          </div>
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={!emailVerified}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
