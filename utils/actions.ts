'use server';

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
