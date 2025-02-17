import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import BlogForm from '@/components/Blogs/BlogForm';
import {apiCreateBlog, getAllCategories, getAllTags} from "@/utils/api";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create Blog | Admin Dashboard',
    description: 'Create new blog post',
};

async function createBlogAction(formData: FormData) {
    'use server'

    try {
        const metaKeywords = JSON.parse(formData.get('meta_keywords')?.toString() || '[]');
        const categories = JSON.parse(formData.get('categories')?.toString() || '[]');
        const tags = JSON.parse(formData.get('tags')?.toString() || '[]');
        const featuredImage = formData.get('featured_image');


        const data = {
            title: formData.get('title')?.toString() || '',
            content: formData.get('content')?.toString() || '',
            excerpt: formData.get('excerpt')?.toString() || '',
            status: formData.get('status')?.toString() || 'draft',
            published_at: formData.get('published_at')?.toString(),
            meta_title: formData.get('meta_title')?.toString(),
            meta_description: formData.get('meta_description')?.toString(),
            meta_keywords: metaKeywords,
            categories: categories,
            tags: tags,
            featured_image: featuredImage instanceof File ? featuredImage : undefined,
        };


        await apiCreateBlog(data);

        revalidatePath('/');
        redirect('/');
    } catch (error) {
        if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
            throw new Error(`Blog creation failed: ${error.message}`);
        }
        throw error;
    }
}

export default async function CreateBlogPage() {
    const [categories, tagsResponse] = await Promise.all([
        getAllCategories(),
        getAllTags()
    ]);
    const tags = tagsResponse.data;

    return (

        <div
            className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
            <BlogForm
                categories={categories}
                tags={tags}
                action={async (formData: FormData) => {
                    'use server';
                    await createBlogAction(formData);
                }}
            />
        </div>
    );
}