import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { useRouter } from "next/router";
import { Client } from "@stomp/stompjs";
import api from "@/utils/axios";
import { useAuth } from '@/contexts/AuthContext';

const ChatRoom = () => {
  const router = useRouter();
  const { roomId } = router.query; 
  const [messages, setMessages] = useState([]); // 모든 메시지 저장
  const [inputMessage, setInputMessage] = useState("");
  const stompClientRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log("user 정보:", user);
    console.log("roomId:", roomId);
  }, [user, roomId]);
  

  // ✅ 채팅방 입장 시 과거 메시지 로드 + WebSocket 연결
  useEffect(() => {
    // 1️⃣ 과거 메시지 로드 (REST API)
    api.get(`/api/chat/history/${roomId}`)
      .then(response => {
        setMessages(response.data); // 과거 메시지 저장
      })
      .catch(error => console.error("메시지 히스토리 불러오기 실패:", error));

    // 2️⃣ WebSocket 연결
    const socket = new SockJS("https://www.ontheit.site/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket 연결됨");

        // ✅ 채팅방 구독
        stompClient.subscribe(`/topic/public/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages(prevMessages => [...prevMessages, newMessage]); // 새 메시지 추가
        });

        // ✅ 입장 메시지 전송
        stompClient.publish({
          destination: `/app/chat.addUser/${roomId}`,
          body: JSON.stringify({
            sender: user.nickname,
            type: "JOIN"
          })
        });
      },
      onStompError: (error) => {
        console.error("WebSocket 에러:", error);
      }
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("WebSocket 연결 종료");
      }
    };
  }, [roomId]);

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (inputMessage.trim() !== "" && stompClientRef.current && stompClientRef.current.connected) {
      const chatMessage = {
        sender: user.nickname,
        content: inputMessage,
        type: "CHAT"
      };

      stompClientRef.current.publish({
        destination: `/app/chat.sendMessage/${roomId}`,
        body: JSON.stringify(chatMessage)
      });

      setInputMessage("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">채팅방 - {roomId}</h2>

    {/* ✅ 채팅 메시지 목록 */}
    <div className="border p-4 h-64 overflow-y-scroll mb-4">
      {messages.length === 0 ? (
        <p className="text-gray-500">대화 내역이 없습니다.</p>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))
      )}
    </div>


      {/* ✅ 메시지 입력창 */}
      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지 입력"
          className="flex-1 border p-2 mr-2"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
