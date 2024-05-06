import Google from 'next-auth/providers/google';
import {PrismaAdapter} from '@auth/prisma-adapter';
import type {NextAuthConfig} from 'next-auth';
import {PrismaClient} from '@prisma/client/edge';
import {withAccelerate} from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
    ],
    callbacks: {
        async session({session}) {
            // 1. return session
            return session;
        },
    },
} satisfies NextAuthConfig;
