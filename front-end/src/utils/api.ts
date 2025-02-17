import {BlogCreatePayload, BlogApiResponse } from '@/types/blog';
import {CategoriesResponse, Category} from "@/types/category";
import config from "@/config/config";
import {cookies} from "next/headers";


export async function getCategories(page: number = 1): Promise<CategoriesResponse> {
    const url = new URL(`${config.API_URL}/categories`);
    url.searchParams.append('page', page.toString());

    const res = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    return res.json();
}

export async function getAllCategories(): Promise<Category[]> {
    const res = await fetch(`${config.API_URL}/categories`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    const response = await res.json();
    return response.data || [];
}


export async function getBlogs(page: number = 1, categoryId?: string): Promise<{
    data: BlogApiResponse[];
    meta: {
        current_page: number;
        total: number;
        per_page: number;
    };
}> {
    const url = new URL(`${config.API_URL}/blogs`);

    url.searchParams.append('page', page.toString());
    if (categoryId) {
        url.searchParams.append('category_id', categoryId);
    }

    const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const response = await res.json()
    if (!res.ok) {
        throw new Error(response.message || 'Failed to fetch blogs');
    }

    return response;
}


export async function apiCreateBlog(data: BlogCreatePayload) {
    // const cookieStore = cookies();
    // const token = cookieStore.get("token")?.value;

    // if (!token) {
    //     throw new Error('Authentication token is missing');
    // }

    const formData = new FormData();
    try {


        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item.toString());
                    });
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await fetch(`${config.API_URL}/blogs`, {
            method: 'POST',
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Accept': 'application/json',
            // },
            body: formData,
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.message ||
                responseData.error ||
                `Server error: ${response.status}`
            );
        }

        return responseData;
    } catch (error) {

        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
    }
}

export async function apiUpdateBlog(id: string, data: Partial<BlogApiResponse>): Promise<void> {
    // const cookieStore = cookies();
    // const token = cookieStore.get("token")?.value;
    //
    // if (!token) {
    //     throw new Error('Authentication token is missing');
    // }

    const formData = new FormData();
    try {
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item.toString());
                    });
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        formData.append('_method', 'PUT');

        const response = await fetch(`${config.API_URL}/blogs/${id}`, {
            method: 'POST',
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Accept': 'application/json',
            // },
            body: formData,
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.message ||
                responseData.error ||
                `Server error: ${response.status}`
            );
        }

        return responseData;
    } catch (error) {
        throw new Error(String(error));
    }
}


export async function getBlog(id: string) {
    const response = await fetch(`${config.API_URL}/blogs/${id}`, {
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch blog');
    }

    return response.json();
}

export async function getAllTags() {
    const res = await fetch(`${config.API_URL}/tags`, {
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch tags');
    }

    return await res.json();
}



