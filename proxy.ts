import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes' ];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (!accessToken) {
    if (refreshToken) {
      try {
      const data = await checkSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        const parsedCookies = [];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);
          
          if (parsed.value) {
		        cookieStore.set(parsed.name, parsed.value, parsed);
            parsedCookies.push(parsed);
			    }
        }

        if (isPublicRoute) {
          const response = NextResponse.redirect(new URL('/profile', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
          parsedCookies.forEach((c) => response.cookies.set(c.name, c.value!, c));
          return response;
        }

        if (isPrivateRoute) {
        const response = NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
          parsedCookies.forEach((c) => response.cookies.set(c.name, c.value!, c));
          return response;
        }
      }
    } catch {
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};