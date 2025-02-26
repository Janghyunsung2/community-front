import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/axios";

export default function Home() {
  const [categoriesWithBoards, setCategoriesWithBoards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 카테고리 상위 6개 불러오기
        const { data: categories } = await api.get("/api/categories/top6");
        // 전체 게시판 불러오기
        const { data: boards } = await api.get("/api/boards/main");

        // categoryId별로 게시판 그룹화
        const groupedBoards = boards.reduce((acc, board) => {
          const { categoryId } = board;
          if (!acc[categoryId]) {
            acc[categoryId] = [];
          }
          acc[categoryId].push(board);
          return acc;
        }, {});

        // 카테고리+게시판 병합
        const mergedData = categories.map((category) => ({
          ...category,
          boards: groupedBoards[category.categoryId] || []
        }));

        setCategoriesWithBoards(mergedData);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 헤더 (간단히 예시) */}


      {/* 메인 영역 (밝은 배경) */}
      <main className="flex-1 p-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          {/* 카테고리 + 게시판 목록 */}
          <div className="grid grid-cols-3 gap-6">
            {categoriesWithBoards.map((category) => (
              <div
                key={category.categoryId}
                className="bg-white border rounded-lg shadow p-4 text-center"
              >
                <h2 className="font-semibold text-lg">{category.name}</h2>
                <div className="mt-2">
                  {category.boards.length > 0 ? (
                    category.boards.map((board) => (
                      <Link
                        key={board.boardId}
                        href={`/boards/${board.boardId}/posts`}
                        className="block text-blue-500 mt-1 hover:underline"
                      >
                        {board.title}
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">게시판 없음</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
