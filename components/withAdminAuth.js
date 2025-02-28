import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axios';

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      let isMounted = true;

      (async () => {
        try {
          // 1) /api/auth/me 호출
          const response = await api.get('/api/auth/me');
          // ※ 실제 응답 구조를 반드시 확인: console.log(response.data)
          const userRole = response.data; // 예: { role: 'ROLE_ADMIN' }

          console.log('사용자 역할:', userRole);

          // 2) 권한 체크
          if (userRole.nickname === '관리자') {
            if (isMounted) setIsAuthorized(true);
          } else {
            console.warn('관리자 권한 없음, /unauthorized로 이동');
            await router.replace('/unauthorized');
            return; // 리다이렉트 후 더 이상 진행 안 함
          }
        } catch (error) {
          console.error('인증 실패:', error);
          if (error.response) {
            if (error.response.status === 401) {
              console.warn('401 Unauthorized - /login으로 이동');
              await router.replace('/login');
            } else if (error.response.status === 403) {
              console.warn('403 Forbidden - /unauthorized로 이동');
              await router.replace('/unauthorized');
            } else {
              console.error('기타 에러:', error.response.data);
            }
          } else if (error.request) {
            console.error('서버 응답 없음:', error.request);
          } else {
            console.error('요청 자체가 실패:', error.message);
          }
          return; // 에러 시도 리다이렉트 후 종료
        } finally {
          if (isMounted) setIsLoading(false);
        }
      })();

      return () => {
        isMounted = false;
      };
    // 의존성 배열은 비워서 한 번만 실행
    }, []);

    if (isLoading) {
      return <div>로딩 중...</div>;
    }

    // isAuthorized가 true인 경우만 렌더링
    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };
};

export default withAdminAuth;
