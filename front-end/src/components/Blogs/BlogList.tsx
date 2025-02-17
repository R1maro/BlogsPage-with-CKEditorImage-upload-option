import Link from 'next/link';
import Pagination from '@/components/Pagination/Pagination';
import { getBlogs } from '@/utils/api';
import {BlogApiListResponse, BlogApiResponse, MediaUrls} from "@/types/blog";
import config from "@/config/config";

interface BlogListProps {
    page?: number;
    categoryId?: string;
}
async function BlogList({page = 1, categoryId,}: BlogListProps) {
    const blogs:BlogApiListResponse = await getBlogs(page, categoryId);


    const isMediaUrls = (featured_image: any): featured_image is MediaUrls => {
        return featured_image && 'original' in featured_image;
    };
    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className="mb-6 flex flex-col gap-3">
                <Link
                    href="/create"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    Add Blog
                </Link>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">
                                Image
                            </th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Title
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Author
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Status
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {blogs.data.map((blog :  BlogApiResponse) => (
                            <tr key={blog.id}>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    {blog.featured_image && isMediaUrls(blog.featured_image) ? (
                                        <div className="relative h-20 w-20">
                                            <img
                                                src={`${config.PUBLIC_URL}${blog.featured_image.original}`}
                                                alt={blog.title}
                                                className="h-full w-full object-cover rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                                            <svg
                                                className="h-8 w-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                                    {blog.title}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    {blog.author?.name}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            blog.status
                                ? 'bg-success text-success'
                                : 'bg-danger text-danger'
                        }`}
                    >
                      {blog.status || ''}
                    </span>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5">
                                        <Link
                                            href={`/edit/${blog.id}`}
                                            className="hover:text-primary"
                                            title="Edit Blog"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                                />
                                            </svg>
                                        </Link>
                                        <button
                                            className="hover:text-danger"
                                            title="Delete Blog"
                                        >
                                            <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={blogs.meta.current_page}
                    totalItems={blogs.meta.total}
                    itemsPerPage={blogs.meta.per_page}
                    baseUrl="/dashboard/blogs"
                    searchParams={categoryId ? {category_id: categoryId} : {}}
                    showItemCount={true}
                    className="sm:flex sm:flex-1 sm:items-center sm:justify-between"
                />
            </div>
        </div>
    );
}

export default BlogList;
