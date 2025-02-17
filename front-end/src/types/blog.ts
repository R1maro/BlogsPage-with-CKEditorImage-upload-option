export interface MediaUrls {
    original: string;
    thumbnail: string;
    responsive: {
        [key: string]: string;
    } | null;
}

export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface MetaData {
    title?: string;
    description?: string;
    keywords?: string[];
}

export interface BlogMeta {
    current_page: number;
    total: number;
    per_page: number;
}

export interface BlogFormData {
    id?: number;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image?: MediaUrls | string;
    status?: 'draft' | 'published' | 'archived';
    published_at?: string;
    meta?: MetaData;
    categories?: Category[];
    tags?: Tag[];
}

export interface BlogFormProps {
    categories: Category[];
    tags: Tag[];
    initialData?: BlogFormData;
}

export interface BlogApiResponse {
    id?: number;
    title: string;
    content: string;
    excerpt?: string;
    featured_image: MediaUrls | File;
    author: {
        id: number;
        name: string;
    };
    status: string;
    published_at?: string;
    meta: MetaData;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    categories?: Category[];
    tags?: Tag[];
}

export interface BlogCreatePayload {
    title: string;
    content: string;
    excerpt: string;
    status: string;
    published_at?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords: string[];
    categories: any[];
    tags: any[];
    featured_image?: File;
}

export interface BlogApiListResponse {
    data: BlogApiResponse[];
    meta: BlogMeta;
}export interface MediaUrls {
    original: string;
    thumbnail: string;
    responsive: {
        [key: string]: string;
    } | null;
}

export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface MetaData {
    title?: string;
    description?: string;
    keywords?: string[];
}

export interface BlogMeta {
    current_page: number;
    total: number;
    per_page: number;
}

export interface BlogFormData {
    id?: number;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image?: MediaUrls | string;
    status?: 'draft' | 'published' | 'archived';
    published_at?: string;
    meta?: MetaData;
    categories?: Category[];
    tags?: Tag[];
}

export interface BlogFormProps {
    categories: Category[];
    tags: Tag[];
    initialData?: BlogFormData;
}

export interface BlogApiResponse {
    id?: number;
    title: string;
    content: string;
    excerpt?: string;
    featured_image: MediaUrls | File;
    author: {
        id: number;
        name: string;
    };
    status: string;
    published_at?: string;
    meta: MetaData;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    categories?: Category[];
    tags?: Tag[];
}

export interface BlogCreatePayload {
    title: string;
    content: string;
    excerpt: string;
    status: string;
    published_at?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords: string[];
    categories: any[];
    tags: any[];
    featured_image?: File;
}

export interface BlogApiListResponse {
    data: BlogApiResponse[];
    meta: BlogMeta;
}