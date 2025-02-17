export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: number;
    parent_id?: number;
    parent?: {
        id: number;
        name: string;
    } | null;
    children: Category[];
    created_at: string;
    updated_at: string;
}

export interface SingleCategoryResponse {
    data: Category;
}

export interface CategoryFormData {
    id: number;
    name: string;
    description: string;
    status: number;
    parent_id?: number | null;
}
export interface CategoriesResponse {
    data: Category[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}