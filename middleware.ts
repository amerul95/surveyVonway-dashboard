import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    
    const { pathname } = request.nextUrl;

    if (pathname === '/login' || pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    const session = request.cookies.get('client-session');

    if(!session){
        return NextResponse.redirect(new URL("/login",  request.url));
    }

    return NextResponse.next();
}