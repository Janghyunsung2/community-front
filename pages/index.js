'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from "@/utils/axios";

export default function Home() {
  const [dailyPosts, setDailyPosts] = useState([]);
  const [weeklyPosts, setWeeklyPosts] = useState([]);
  const [monthlyPosts, setMonthlyPosts] = useState([]);
  const [popularBoards, setPopularBoards] = useState([]);
  const [boardGroup1, setBoardGroup1] = useState([]);
  const [boardGroup2, setBoardGroup2] = useState([]);
  const [categoriesWithBoards, setCategoriesWithBoards] = useState([]);


  useEffect(() => {
    async function fetchPosts() {
      try {
        const [daily, weekly, monthly] = await Promise.all([
          api.get('/api/posts/views', { params: { period: 'DAILY' } }),
          api.get('/api/posts/views', { params: { period: 'WEEKLY' } }),
          api.get('/api/posts/views', { params: { period: 'MONTHLY' } }),
        ]);

        setDailyPosts(daily.data);
        setWeeklyPosts(weekly.data);
        setMonthlyPosts(monthly.data);
      } catch (err) {
        console.error('🔥 게시글 불러오기 실패:', err);
      }
    }

    async function fetchPopularBoards() {
      try{
        const boards = await api.get('/api/boards/best')
        setPopularBoards(boards.data);
      }catch (err){
        console.error(' 인기순 불러오기 실패:', err);
      }
    }
    fetchPopularBoards()

    async function fetchBestPostsByBoardIds() {
      const boardsGroup1 = [
        { boardId: 1, title: '자유 게시판' },
      ];
      const boardsGroup2 = [
        { boardId: 2, title: '정보 게시판' },
      ];

      try {
        const group1 = await Promise.all(
            boardsGroup1.map(board =>
                api.get(`/api/boards/${board.boardId}/best`).then(res => ({
                  boardId: board.boardId,
                  posts: res.data,
                }))
            )
        );

        const group2 = await Promise.all(
            boardsGroup2.map(board =>
                api.get(`/api/boards/${board.boardId}/best`).then(res => ({
                  boardId: board.boardId,
                  posts: res.data,
                }))
            )
        );

        setBoardGroup1(group1);
        setBoardGroup2(group2);
      } catch (err) {
        console.error('🔥 추천 게시판 불러오기 실패:', err);
      }
    }


    fetchPosts();
    fetchBestPostsByBoardIds();
  }, []);



  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-6 bg-gray-100">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* 1. 조회순 게시글 */}
            <section className="bg-white border rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">조회순 게시글</h2>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                <PostList title="일간" posts={dailyPosts} />
                <PostList title="주간" posts={weeklyPosts} />
                <PostList title="월간" posts={monthlyPosts} />
              </div>
            </section>



            {/* 2. 인기 게시판 */}
            <section className="bg-white border rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">인기 게시판 순위</h2>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
                {popularBoards.map(board => (
                    <li key={board.id}>
                      <Link href={`/boards/${board.id}/posts`}
                            className="hover:underline text-blue-600">
                        {board.title}
                      </Link>
                    </li>
                ))}
              </ol>
            </section>

            {/* 3. 게시판 이미지 + 제목 */}
            <section className="bg-white border rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">추천 게시판</h2>
              <div className="grid grid-cols-2 gap-6">
                {[boardGroup1, boardGroup2].map((group, idx) => (
                    <div key={idx} className="space-y-4">
                      {group.map(board => (
                          <div key={board.boardId}>
                            <h3 className="font-semibold mb-2">{board.title}</h3>
                            <div className="space-y-2">
                              {board.posts.map(post => (
                                  <div key={post.id}
                                       className="flex items-center space-x-4">
                                    <img src={post.imageUrl} alt={post.title}
                                         className="w-16 h-16 object-cover rounded"
                                         onError={(e) => {
                                           e.currentTarget.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSAySszMhWPAD-i4hov3Km4ss4Pvxjiacx6Q&s'; // public 폴더에 있는 기본 이미지
                                         }}
                                    />
                                    <Link
                                        href={`/posts/${post.id}`}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                      {post.title}
                                    </Link>
                                  </div>
                              ))}
                            </div>
                          </div>
                      ))}
                    </div>
                ))}
              </div>
            </section>


            {/* 기존 카테고리 + 게시판 목록 */}
            <section>
              <div className="grid grid-cols-3 gap-6">
                {categoriesWithBoards.map((category) => (
                    <div key={category.categoryId}
                         className="bg-white border rounded-lg shadow p-4 text-center">
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
            </section>

          </div>
        </main>
      </div>
  );
}

function PostList({title, posts}) {
  return (
      <div>
        <h3 className="font-medium mb-2">{title}</h3>
        <ul>
          {posts.map(post => (
              <li key={post.id} className="hover:underline">
                <Link href={`boards/${post.boardId}/posts/${post.id}`}>{post.title}</Link>
              </li>
          ))}
        </ul>
      </div>
  );
}

