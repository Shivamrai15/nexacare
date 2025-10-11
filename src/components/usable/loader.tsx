import { LoaderIcon } from 'lucide-react';

export const Loader = () => {
    return (
        <div className='size-full flex items-center justify-center'>
            <LoaderIcon className='animate-spin size-6 text-zinc-600' />
        </div>
    )
}
