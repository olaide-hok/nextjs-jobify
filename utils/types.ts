import * as z from 'zod';

export type JobType = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authId: string;
    position: string;
    company: string;
    location: string;
    status: string;
    mode: string;
};

export type UserType = {
    id: string;
    name: string;
    email: string;
    emailVerified: Date;
    image: string;
    accounts: Account[];
    sessions: Session[];
    createdAt: Date;
    updatedAt: Date;
};

export type Account = {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string;
    access_token: string;
    expires_at: number;
    token_type: string;
    scope: string;
    id_token: string;
    session_state: string;
    createdAt: Date;
    updatedAt: Date;
    user: UserType;
};

export type Session = {
    sessionToken: string;
    userId: string;
    expires: Date;
    user: UserType;
    createdAt: Date;
    updatedAt: Date;
};

export enum JobStatus {
    Pending = 'pending',
    Interview = 'interview',
    Declined = 'declined',
}

export enum JobMode {
    FullTime = 'full-time',
    PartTime = 'part-time',
    Internship = 'internship',
}

export const createAndEditJobSchema = z.object({
    position: z.string().min(2, {
        message: 'position must be at least 2 characters.',
    }),
    company: z.string().min(2, {
        message: 'company must be at least 2 characters.',
    }),
    location: z.string().min(2, {
        message: 'location must be at least 2 characters.',
    }),
    status: z.nativeEnum(JobStatus),
    mode: z.nativeEnum(JobMode),
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;
