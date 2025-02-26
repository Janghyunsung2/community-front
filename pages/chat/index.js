import { useState } from "react";
import CategorySelector from "@/components/chat/CategorySelector";
import ChatRoomList from "@/components/chat/ChatRoomList";

const ChatPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">채팅방 관리</h1>

      {/* 카테고리 선택 */}
      {!selectedCategoryId && (
        <CategorySelector onSelectCategory={handleCategorySelect} />
      )}

      {/* 선택한 카테고리의 채팅방 목록 */}
      {selectedCategoryId && (
        <ChatRoomList categoryId={selectedCategoryId} />
      )}
    </div>
  );
};

export default ChatPage;
