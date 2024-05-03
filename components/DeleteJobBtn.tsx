import {Button} from './ui/button';
import {Badge} from './ui/badge';
import JobInfo from './JobInfo';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteJobAction} from '@/utils/actions';
import {useToast} from '@/components/ui/use-toast';
import {useSession} from 'next-auth/react';

function DeleteJobBtn({id}: {id: string}) {
    const {data} = useSession();
    const userId = data?.user?.id || '';

    const {toast} = useToast();

    const queryClient = useQueryClient();
    const {mutate, isPending} = useMutation({
        mutationFn: (id: string) => deleteJobAction(id, userId),
        onSuccess: (data) => {
            if (!data) {
                toast({
                    description: 'there was an error',
                });
                return;
            }
            queryClient.invalidateQueries({queryKey: ['jobs']});
            queryClient.invalidateQueries({queryKey: ['stats']});
            queryClient.invalidateQueries({queryKey: ['charts']});

            toast({description: 'job removed'});
        },
    });
    return (
        <Button
            size="sm"
            disabled={isPending}
            onClick={() => {
                mutate(id);
            }}>
            {isPending ? 'deleting...' : 'delete'}
        </Button>
    );
}
export default DeleteJobBtn;
