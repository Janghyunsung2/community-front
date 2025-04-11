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
  const [allPosts, setAllPosts] = useState([]);


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
      try {
        const [group1Res, group2Res] = await Promise.all([
          api.get('/api/boards/4/best'),
          api.get('/api/boards/1/best'),
        ]);

        setBoardGroup1(group1Res.data); // [{ title, posts[] }]
        setBoardGroup2(group2Res.data);
      } catch (err) {
        console.error('🔥 추천 게시판 불러오기 실패:', err);
      }
    }



    fetchPosts();
    fetchBestPostsByBoardIds();
  }, []);


  useEffect(() => {
    async function fetchAllPosts() {
      try {
        const res = await api.get("/api/posts", {
          params: {
            page: 0,
            size: 10,
          },
          withCredentials: true,
        });
        setAllPosts(res.data.content); // Page 객체의 content 배열만 사용
      } catch (err) {
        console.error("🔥 전체 게시글 불러오기 실패:", err);
      }
    }

    fetchAllPosts();
  }, []);

  return (
      <div className="flex flex-col min-h-[200px]">
        <main className="flex-1 p-30 bg-gray-90">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* 1. 조회순 게시글 */}
            <section className="bg-white border rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">조회순 게시글</h2>
              <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
                <PostList title="일간" posts={dailyPosts}/>
                <PostList title="주간" posts={weeklyPosts}/>
                <PostList title="월간" posts={monthlyPosts}/>
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
            <section className="bg-white border rounded-lg shadow p-12">
              <h2 className="text-lg font-semibold mb-4">추천게시판</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {[boardGroup1, boardGroup2].map((board, idx) => (
                    <div key={idx}>
                      <Link
                          href={`/boards/${board.id}/posts`}
                          className="hover:underline hover:text-blue-600 cursor-pointer"
                      >
                        <h3 className="font-semibold mb-2">{board.title}</h3>
                      </Link>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {board.posts?.map((post) => (
                            <div key={post.id} className="flex flex-col items-center space-y-2">
                              <img
                                  src={
                                      post.imageUrl ||
                                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSAySszMhWPAD-i4hov3Km4ss4Pvxjiacx6Q&s'
                                  }
                                  alt={post.title}
                                  className="w-20 h-20 object-cover rounded"
                              />
                              <Link
                                  href={`/post/${post.id}`}
                                  className="font-medium text-blue-600 hover:underline text-sm text-center"
                              >
                                {post.title}
                              </Link>
                            </div>
                        ))}
                      </div>
                    </div>
                ))}
              </div>
            </section>


            {/* 기존 카테고리 + 게시판 목록 */}
            <section>
              <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

            <section className="bg-white border rounded-lg shadow p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">전체 게시글</h2>
                <Link href="/post"
                      className="text-sm text-blue-500 hover:underline">
                  전체 보기
                </Link>
              </div>

              <div className="divide-y">
                {allPosts.map((post) => (
                    <div key={post.postId}
                         className="flex items-center py-3 text-sm text-gray-800">
                      {/* 제목 */}
                      <Link
                          href={`/post/${post.postId}`}
                          className="flex-1 font-medium text-blue-600 hover:underline truncate"
                      >
                        {post.title} {' '}
                        <span
                            className="text-red-500">[{post.commentCount}]
                        </span>

                      </Link>

                      {/* 작성자 */}
                      <div
                          className="w-28 text-center text-gray-600 truncate">{post.nickName}</div>

                      {/* 날짜 */}
                      <div className="w-32 text-center text-gray-500">
                        {new Date(post.createAt).toLocaleDateString()}
                      </div>

                      {/* 조회수 */}
                      <div
                          className="w-24 text-right text-gray-500">{post.views.toLocaleString()}
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
                <Link href={`/post/${post.id}`}>{post.title}</Link>
              </li>
          ))}
        </ul>
      </div>
  );
}
