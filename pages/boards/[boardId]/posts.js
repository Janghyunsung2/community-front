import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import Link from "next/link";

const API_URL = "/api/boards"; // ✅ 백엔드 API

export default function BoardPosts() {
  const router = useRouter();
  const { boardId } = router.query;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (boardId) {
      api
        .get(`${API_URL}/${boardId}/posts`)
        .then((res) => {
          // 삭제되지 않은 게시글만 필터링
          setPosts(res.data.content.filter((post) => !post.isDelete));
        })
        .catch((err) => console.error("게시글 목록 불러오기 실패:", err));
    }
  }, [boardId]);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-3xl mx-auto bg-white border rounded shadow p-6">
        {/* 상단 헤딩 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">게시판 {boardId} - 게시글 목록</h1>
          <Link
            href={`/boards/${boardId}/posts/new`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ✏️ 새 글 작성
          </Link>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500">게시글이 없습니다.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded p-4 hover:bg-gray-50 transition"
              >
                <Link href={`/boards/${boardId}/posts/${post.postId}`}>
                  <div className="cursor-pointer">
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                    <p className="text-sm text-gray-500">
                      작성자: {post.nickName} | 작성일: {post.createAt}
                    </p>
                    <p className="text-sm text-gray-500">조회수: {post.views}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
