import { useState } from "react";
import api from "@/utils/axios";

const ChatRoomCreator = ({ categoryId, onChatRoomCreated }) => {
  const [chatRoomName, setChatRoomName] = useState("");
  const [capacity, setCapacity] = useState(2);

  const handleCreateChatRoom = async () => {
    if (!chatRoomName || capacity < 2) {
      alert("채팅방 이름과 최소 2명 이상의 인원을 입력하세요.");
      return;
    }

    const chatRoomDTO = {
      name: chatRoomName,
      capacity: capacity,
      categoryId: categoryId,
    };

    try {
      await api.post("/api/chat-room", chatRoomDTO);
      alert("채팅방이 생성되었습니다!");
      setChatRoomName("");
      setCapacity(2);
      onChatRoomCreated(); // ✅ 채팅방 생성 후 콜백 호출
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">채팅방 생성</h2>
      <input
        type="text"
        placeholder="채팅방 이름"
        value={chatRoomName}
        onChange={(e) => setChatRoomName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="number"
        placeholder="최대 인원 수"
        value={capacity}
        onChange={(e) => setCapacity(parseInt(e.target.value))}
        className="w-full p-2 border rounded mb-2"
        min={2}
      />
      <button
        onClick={handleCreateChatRoom}
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        채팅방 생성
      </button>
    </div>
  );
};

export default ChatRoomCreator;
