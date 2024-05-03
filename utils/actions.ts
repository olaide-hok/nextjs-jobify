'use server';

import {redirect} from 'next/navigation';
import prisma from './db';
import {JobType, CreateAndEditJobType, createAndEditJobSchema} from './types';
import {Prisma} from '@prisma/client';
import dayjs from 'dayjs';

export async function createJobAction(
    values: CreateAndEditJobType,
    userId: string
): Promise<JobType | null> {
    await new Promise((resolve) => setTimeout(resolve, 3000));
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

type GetAllJobsActionTypes = {
    search?: string;
    jobStatus?: string;
    page?: number;
    limit?: number;
    userId: string;
};

export async function getAllJobsAction({
    search,
    jobStatus,
    page = 1,
    limit = 10,
    userId,
}: GetAllJobsActionTypes): Promise<{
    jobs: JobType[];
    count: number;
    page: number;
    totalPages: number;
}> {
    try {
        let whereClause: Prisma.JobWhereInput = {
            authId: userId,
        };
        if (search) {
            whereClause = {
                ...whereClause,
                OR: [
                    {
                        position: {
                            contains: search,
                        },
                    },
                    {
                        company: {
                            contains: search,
                        },
                    },
                ],
            };
        }
        if (jobStatus && jobStatus !== 'all') {
            whereClause = {
                ...whereClause,
                status: jobStatus,
            };
        }

        const jobs: JobType[] = await prisma.job.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {jobs, count: 0, page: 1, totalPages: 0};
    } catch (error) {
        console.error(error);
        return {jobs: [], count: 0, page: 1, totalPages: 0};
    }
}

export async function deleteJobAction(
    id: string,
    userId: string
): Promise<JobType | null> {
    try {
        const job: JobType = await prisma.job.delete({
            where: {
                id,
                authId: userId,
            },
        });
        return job;
    } catch (error) {
        return null;
    }
}

export async function getSingleJobAction(
    id: string,
    userId: string
): Promise<JobType | null> {
    let job: JobType | null = null;

    try {
        job = await prisma.job.findUnique({
            where: {
                id,
                authId: userId,
            },
        });
    } catch (error) {
        job = null;
    }
    if (!job) {
        redirect('/jobs');
    }
    return job;
}

export async function updateJobAction(
    id: string,
    values: CreateAndEditJobType,
    userId: string
): Promise<JobType | null> {
    try {
        const job: JobType = await prisma.job.update({
            where: {
                id,
                authId: userId,
            },
            data: {
                ...values,
            },
        });
        return job;
    } catch (error) {
        return null;
    }
}

export async function getStatsAction(userId: string): Promise<{
    pending: number;
    interview: number;
    declined: number;
}> {
    // just to show Skeleton
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
        const stats = await prisma.job.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
            where: {
                authId: userId, // replace userId with the actual authId
            },
        });
        const statsObject = stats.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {} as Record<string, number>);

        const defaultStats = {
            pending: 0,
            declined: 0,
            interview: 0,
            ...statsObject,
        };
        return defaultStats;
    } catch (error) {
        redirect('/jobs');
    }
}
