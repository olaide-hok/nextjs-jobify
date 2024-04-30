import Google from 'next-auth/providers/google';

export const authOptions = {
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
        jwt({token, user}: any) {
            if (user) {
                // User is available during sign-in
                token.id = user.id;
            }
            return token;
        },
        // Modifies the session object
        session({session, token}: any) {
            session.user.id = token.id;
            return session;
        },
    },
};
