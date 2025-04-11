import MyPageLayout from "../../components/MyPageLayout";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/router';

export default function MyCommentsList() {
    const [comments, setComments] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0 });
    const router = useRouter();

    const fetchComments = async (page = 0) => {
        try {
            const res = await api.get('/api/comments', {
                params: {
                    me: true,
                    page,
                    size: 10,
                    sort: 'id,desc',
                },
            });
            setComments(res.data.content);
            setPageInfo({ page: res.data.number, totalPages: res.data.totalPages });

            console.log(res.data.content);
        } catch (err) {
            console.error('내 댓글 불러오기 실패:', err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handlePageChange = (newPage) => {
        fetchComments(newPage);
    };

    return (
    <MyPageLayout>
        <div className="max-w-3xl mx-auto mt-5 space-y-4">
            <h2 className="text-xl font-bold mb-4">내가 단 댓글</h2>

            {comments.map((comment) => (
                <div
                    key={comment.commentId}
                    onClick={() => router.push(`/post/${comment.postId}`)}
                    className="p-4 border border-gray-400 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-100 hover:border-blue-500 cursor-pointer transition"
                >
                    <h3 className="text-lg font-semibold">{comment.content}</h3>
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                        <span>[{comment.postTitle}]</span>
                        <span>{new Date(comment.createdAt).toLocaleString('ko-KR')}</span>
                    </div>

                </div>
            ))}

            {/* 페이지네이션 */}
            <div className="flex justify-center space-x-2 mt-6">
                {[...Array(pageInfo.totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 border rounded ${
                            pageInfo.page === i ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    </MyPageLayout>
    );
}
