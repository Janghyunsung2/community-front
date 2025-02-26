import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";
import ChatRoomCreator from "./ChatRoomCreator";

const ChatRoomList = ({ categoryId }) => {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false); // ✅ 채팅방 생성 폼 표시 여부

  const PAGE_SIZE = 5;

  useEffect(() => {
    if (categoryId) {
      fetchChatRooms(categoryId, currentPage);
    }
  }, [categoryId, currentPage]);

  // ✅ 채팅방 목록 가져오기
  const fetchChatRooms = (categoryId, page) => {
    setLoading(true);
    api
      .get(`/api/category/${categoryId}/chat-room`, {
        params: { page, size: PAGE_SIZE },
      })
      .then((res) => {
        setChatRooms(res.data.content);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("채팅방 목록 로딩 실패:", err);
        setLoading(false);
      });
  };

  // ✅ 채팅방 입장
  const enterChatRoom = (roomId) => {
    router.push(`/chat/room/${roomId}`); // 채팅방 입장 경로로 이동
  };

  // ✅ 채팅방 생성 완료 후 목록 새로고침
  const handleChatRoomCreated = () => {
    setShowCreator(false); // 생성 폼 닫기
    fetchChatRooms(categoryId, currentPage); // 목록 새로고침
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">채팅방 목록</h2>

      {/* ✅ 채팅방 생성 버튼 */}
      <button
        onClick={() => setShowCreator((prev) => !prev)}
        className="mb-4 p-2 bg-green-500 text-white rounded"
      >
        {showCreator ? "생성 취소" : "채팅방 생성"}
      </button>

      {/* ✅ 채팅방 생성 폼 */}
      {showCreator && (
        <ChatRoomCreator
          categoryId={categoryId}
          onChatRoomCreated={handleChatRoomCreated}
        />
      )}

      {/* ✅ 채팅방 목록 */}
      {loading ? (
        <p className="text-gray-500">채팅방을 불러오는 중...</p>
      ) : chatRooms.length === 0 ? (
        <p className="text-gray-500">채팅방이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              className="p-4 border rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100"
            >
              <div>
                <h3 className="font-semibold">{room.title}</h3>
                <p className="text-sm text-gray-600">
                  인원: {room.memberCount}/{room.capacity}
                </p>
              </div>
              <button
                onClick={() => enterChatRoom(room.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                입장
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ 페이징 처리 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`px-3 py-1 rounded ${
              currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            이전
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`px-3 py-1 rounded ${
                currentPage === idx ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage + 1 === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage + 1 === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoomList;
