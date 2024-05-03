'use server';

import prisma from './db';
import {auth} from '@/auth';
import {JobType, CreateAndEditJobType, createAndEditJobSchema} from './types';
import {redirect} from 'next/navigation';
import {Prisma} from '@prisma/client';
import dayjs from 'dayjs';

async function authenticateAndRedirect(): Promise<string> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        redirect('/');
    }
    return userId;
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
