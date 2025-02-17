import { Suspense } from 'react';
import BlogList from '@/components/Blogs/BlogList';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blogs | Dashboard',
    description: 'Blog management page',
};

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

export default async function BlogsPage({
                                            searchParams,
                                        }: {
    searchParams: { page?: string; category_id?: string };
}) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const categoryId = searchParams.category_id;

    return (
        <div className="min-h-screen mx-auto px-4 py-8">
            <Suspense fallback={<Loader />}>
                <BlogList page={page} categoryId={categoryId} />
            </Suspense>
        </div>
    );
}
