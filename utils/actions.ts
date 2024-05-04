'use server';

import {redirect} from 'next/navigation';
import prisma from './db';
import {JobType, CreateAndEditJobType, createAndEditJobSchema} from './types';
import {Prisma} from '@prisma/client';
import dayjs from 'dayjs';
import {auth} from '@/auth';

export async function createJobAction(
    values: CreateAndEditJobType
): Promise<JobType | null> {
    // await new Promise((resolve) => setTimeout(resolve, 3000)); //To view loading spinner.
    const session = await auth();
    const userId = session?.user?.id || '';

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
};

export async function getAllJobsAction({
    search,
    jobStatus,
    page = 1,
    limit = 10,
}: GetAllJobsActionTypes): Promise<{
    jobs: JobType[];
    count: number;
    page: number;
    totalPages: number;
}> {
    const session = await auth();
    const userId = session?.user?.id || '';
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

export async function deleteJobAction(id: string): Promise<JobType | null> {
    const session = await auth();
    const userId = session?.user?.id || '';
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

export async function getSingleJobAction(id: string): Promise<JobType | null> {
    const session = await auth();
    const userId = session?.user?.id || '';

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
    values: CreateAndEditJobType
): Promise<JobType | null> {
    const session = await auth();
    const userId = session?.user?.id || '';
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

export async function getStatsAction(): Promise<{
    pending: number;
    interview: number;
    declined: number;
}> {
    const session = await auth();
    const userId = session?.user?.id || '';

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

export async function getChartsDataAction(): Promise<
    Array<{date: string; count: number}>
> {
    const session = await auth();
    const userId = session?.user?.id || '';

    const sixMonthsAgo = dayjs().subtract(6, 'month').toDate();
    try {
        const jobs = await prisma.job.findMany({
            where: {
                authId: userId,
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        let applicationsPerMonth = jobs.reduce((acc, job) => {
            const date = dayjs(job.createdAt).format('MMM YY');

            const existingEntry = acc.find((entry) => entry.date === date);

            if (existingEntry) {
                existingEntry.count += 1;
            } else {
                acc.push({date, count: 1});
            }

            return acc;
        }, [] as Array<{date: string; count: number}>);

        return applicationsPerMonth;
    } catch (error) {
        redirect('/jobs');
    }
}
