'use server';

import prisma from './db';
// import {auth} from '@clerk/nextjs';
import {JobType, CreateAndEditJobType, createAndEditJobSchema} from './types';
import {redirect} from 'next/navigation';
import {Prisma} from '@prisma/client';
import dayjs from 'dayjs';
import {auth} from '@/auth';

async function authenticateAndRedirect(): Promise<string> {
    try {
        const session = await auth();
        if (!session || !session?.user?.id) {
            redirect('/');
        }
        const userId = session?.user?.id;
        return userId;
    } catch (error) {
        console.error(error);
        return 'Something went wrong!';
    }
}

export async function createJobAction(
    values: CreateAndEditJobType
): Promise<JobType | null> {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const userId = await authenticateAndRedirect();
    try {
        createAndEditJobSchema.parse(values);
        const job: JobType = await prisma.job.create({
            data: {
                ...values,

                authId: userId,
            },
        });
        return job;
    } catch (error) {
        console.error(error);
        return null;
    }
}
