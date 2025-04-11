import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axios";

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("createdAt,DESC");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api
    .get(`/api/posts`, {
      params: {
        page,
        size: 10,
        sort: sortOption,
      },
    })
    .then((res) => {
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
    })
    .catch((err) => {
      console.error("전체 게시글 불러오기 실패:", err);
    });
  }, [sortOption, page]);

  const handleFirstPage = () => setPage(0);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-3xl mx-auto bg-white border rounded shadow p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">전체 게시글</h1>
          </div>

          {/* 정렬 */}
          <div className="mb-4">
            <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(0);
                }}
                className="border px-2 py-1 rounded"
            >
              <option value="createdAt,DESC">최신순</option>
              <option value="createdAt,ASC">오래된순</option>
              <option value="viewCount,DESC">조회순</option>
            </select>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-4">
            {posts.length === 0 ? (
                <p className="text-gray-500">게시글이 없습니다.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.postId}
                        className="border border-gray-200 rounded p-4 hover:bg-gray-50 transition"
                    >
                      <Link href={`/post/${post.postId}`}>
                        <div className="cursor-pointer">
                          <h2 className="text-lg font-semibold">
                            {post.title}{" "}
                            <span className="text-red-500">[{post.commentCount}]</span>
                          </h2>
                          <p className="text-sm text-gray-500">
                            작성자: {post.nickName} | 작성일:{" "}
                            {new Date(post.createAt).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            조회수: {post.views.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    </div>
                ))
            )}
          </div>

          {/* 페이징 */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
                onClick={handleFirstPage}
                disabled={page === 0}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              처음으로
            </button>
            <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              이전
            </button>
            <span className="px-3 py-1">
            {page + 1} / {totalPages}
          </span>
            <button
                onClick={handleNextPage}
                disabled={page + 1 >= totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>
  );
}