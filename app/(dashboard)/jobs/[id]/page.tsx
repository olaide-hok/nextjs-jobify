import {auth} from '@/auth';
import EditJobForm from '@/components/EditJobForm';
import {getSingleJobAction} from '@/utils/actions';
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';

async function JobDetailPage({params}: {params: {id: string}}) {
    const session = await auth();
    const userId = session?.user?.id || '';
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['job', params.id],
        queryFn: () => getSingleJobAction(params.id, userId),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EditJobForm jobId={params.id} />
        </HydrationBoundary>
    );
}

export default JobDetailPage;
