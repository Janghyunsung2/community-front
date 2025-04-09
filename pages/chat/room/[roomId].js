import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { useRouter } from "next/router";
import { Client } from "@stomp/stompjs";
import api from "@/utils/axios";
import { useAuth } from '@/contexts/AuthContext';

const ChatRoom = () => {
  const router = useRouter();
  const { roomId } = router.query;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/api/chat/history/${roomId}`)
    .then(response => setMessages(response.data))
    .catch(error => console.error("메시지 히스토리 불러오기 실패:", error));

    const socket = new SockJS(`http://localhost:8080/ws-chat?username=${user.nickname}&roomId=${roomId}`);
    // const socket = new SockJS(`https://ontheit.site/ws-chat?username=${user.nickname}&roomId=${roomId}`);

    api.post(`/api/chat-room/${roomId}/join`, {
      userId: user?.id
    }).catch(err => {
      const message = err.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
      alert(message);
      router.push("/chat");
    });

    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        username: user?.username || "",
        roomId: roomId?.toString() || ""
      },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/public/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages(prevMessages => [...prevMessages, newMessage]);
        });

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

  useEffect(() => {
    const handleRouteChange = () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() && stompClientRef.current?.connected) {
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
      <div className="min-h-screen bg-gray-100 px-2 py-4">
        <div className="w-full h-[85vh] bg-white rounded-lg shadow-md flex flex-col mx-auto max-w-md">
          <div className="bg-white px-6 py-4 text-xl font-bold border-b text-center">
            채팅방 #{roomId}
          </div>

          <div ref={messagesEndRef} className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {messages.map((msg, idx) => (
                <div key={idx} className={`my-2 ${msg.type !== "CHAT" ? "text-center" : msg.sender === user.nickname ? "text-right" : "text-left"}`}>
                  {msg.type === "CHAT" ? (
                      <div className={`inline-block px-4 py-2 rounded-2xl shadow max-w-xs ${msg.sender === user.nickname ? "bg-blue-500 text-white" : "bg-white text-black border"}`}>
                        {msg.sender !== user.nickname && (
                            <div className="text-[11px] text-gray-400 mb-1">{msg.sender}</div>
                        )}
                        <div>{msg.content}</div>
                      </div>
                  ) : (
                      <div className="text-sm text-gray-500 italic">{msg.content}</div>
                  )}
                </div>
            ))}
          </div>

          <div className="p-2 bg-white border-t flex gap-2">
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 border rounded-full px-3 py-2 text-sm"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
              전송
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChatRoom;
