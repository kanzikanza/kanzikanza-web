import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // 예시: JWT 토큰을 쿠키에서 가져옴

  // 메인 페이지(/)는 누구나 접근 가능
  if (req.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/exam/:path*', '/profile/:path*', '/settings/:path*'], // 보호하고 싶은 경로를 지정
};
