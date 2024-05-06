import {auth} from '@/auth';
import {NextResponse} from 'next/server';

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// Todo: match /api/auth/signin routes
export const config = {
    matcher: ['/add-job', '/stats', '/jobs/:path*'],
};

export default auth((req) => {
    if (!req.auth) {
        return NextResponse.redirect(new URL('/', req.url));
    }
});

export const runtime = 'experimental-edge';
