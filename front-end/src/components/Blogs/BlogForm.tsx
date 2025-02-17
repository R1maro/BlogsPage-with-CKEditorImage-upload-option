'use client';
import {useState, useEffect} from 'react';
import {BlogFormProps} from "@/types/blog";
import ImageUploadAdapter from '@/utils/ImageUploadAdapter';
import config from "@/config/config";

import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    ParagraphButtonUI,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Code,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
    List,
    AutoLink,
    Link,
    Table,
    TableToolbar,
    RemoveFormat,
    Alignment,
    Font,
    Indent,
    IndentBlock,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    ImageUpload,
} from 'ckeditor5';

function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new ImageUploadAdapter(loader);
    };
}

import 'ckeditor5/ckeditor5.css';

export default function BlogForm({
                                     categories,
                                     tags,
                                     action,
                                     initialData
                                 }: BlogFormProps & {
    action: (formData: FormData) => Promise<void>
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>(
        initialData?.categories?.map(cat => cat.id) || []
    );
    const [selectedTags, setSelectedTags] = useState<number[]>(
        initialData?.tags?.map(tag => tag.id) || []
    );
    const [content, setContent] = useState(initialData?.content || '');
    const [featuredImage, setFeaturedImage] = useState<string>(() => {
        if (initialData?.featured_image) {
            if (typeof initialData.featured_image === 'string') {
                return initialData.featured_image;
            } else {
                return initialData.featured_image.original;
            }
        }
        return '';
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metaKeywords, setMetaKeywords] = useState<string[]>(
        Array.isArray(initialData?.meta?.keywords) ? initialData.meta.keywords : []
    );
    const [metaKeywordsInput, setMetaKeywordsInput] = useState(
        Array.isArray(initialData?.meta?.keywords)
            ? initialData.meta.keywords.join(', ')
            : ''
    );


    useEffect(() => {
        if (initialData?.featured_image) {
            if (typeof initialData.featured_image === 'string') {
                setFeaturedImage(`${config.PUBLIC_URL}${initialData.featured_image}`);
            } else if ('original' in initialData.featured_image) {
                setFeaturedImage(`${config.PUBLIC_URL}${initialData.featured_image.original}`);
            }
        }
    }, [initialData]);

    const handleMetaKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setMetaKeywordsInput(input);
        const keywords = e.target.value.split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword.length > 0 && keyword.length <= 50);
        setMetaKeywords(keywords);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {

            e.preventDefault();
            setError(null);
            setIsSubmitting(true);
            const formData = new FormData(e.currentTarget);


            formData.append('meta_keywords', JSON.stringify(metaKeywords));
            formData.append('categories', JSON.stringify(selectedCategories));
            formData.append('tags', JSON.stringify(selectedTags));
            if (selectedFile) {
                formData.append('featured_image', selectedFile);
            }

            formData.append('content', content);


            await action(formData);
        } catch (error) {
            if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
                return;
            }

            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            setIsSubmitting(false);
        }

    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFeaturedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <div className="space-y-6">

                {error && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}
                {/* Title */}

                <div>
                    <label htmlFor="title" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={initialData?.title}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                {/* Content */}
                <div className="custom-editor">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Content
                    </label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onChange={(event: any, editor: any) => setContent(editor.getData())}
                        config={{
                            extraPlugins: [uploadPlugin],
                            licenseKey: 'GPL',
                            plugins: [
                                Font,
                                ParagraphButtonUI,
                                Indent,
                                IndentBlock,
                                Essentials,
                                Paragraph,
                                Bold,
                                Italic,
                                List,
                                Link,
                                AutoLink,
                                Table,
                                TableToolbar,
                                RemoveFormat,
                                Alignment,
                                Code,
                                Strikethrough,
                                Subscript,
                                Superscript,
                                Underline,
                                Image,
                                ImageToolbar,
                                ImageCaption,
                                ImageStyle,
                                ImageResize,
                                ImageUpload,
                            ],
                            toolbar: {
                                items: [
                                    'undo', 'redo',
                                    '|',
                                    'fontSize',
                                    'fontFamily',
                                    'fontColor',
                                    'fontBackgroundColor',
                                    '|',
                                    'bold',
                                    'italic',
                                    'underline',
                                    'strikethrough',
                                    'code',
                                    'subscript',
                                    'superscript',
                                    '|',
                                    'alignment',
                                    'outdent',
                                    'indent',
                                    '|',
                                    'bulletedList',
                                    'numberedList',
                                    '|',
                                    'link',
                                    'insertImage',
                                    'insertTable',
                                    '|',
                                    'removeFormat'
                                ],
                                shouldNotGroupWhenFull: true
                            },
                            image: {
                                toolbar: [
                                    'imageStyle:inline',
                                    'imageStyle:block',
                                    'imageStyle:side',
                                    '|',
                                    'toggleImageCaption',
                                    'imageTextAlternative',
                                    '|',
                                    'resizeImage'
                                ],
                                upload: {
                                    types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
                                },
                                resizeOptions: [
                                    {
                                        name: 'resizeImage:original',
                                        value: null,
                                        label: 'Original'
                                    },
                                    {
                                        name: 'resizeImage:50',
                                        value: '50',
                                        label: '50%'
                                    },
                                    {
                                        name: 'resizeImage:75',
                                        value: '75',
                                        label: '75%'
                                    }
                                ],
                            },
                            table: {
                                contentToolbar: [
                                    'tableColumn',
                                    'tableRow',
                                    'mergeTableCells'
                                ]
                            },
                        }}
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label htmlFor="excerpt" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        defaultValue={initialData?.excerpt}
                        rows={3}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                {/* Featured Image */}
                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Featured Image
                    </label>
                    <div className="mt-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="featured_image"
                        />
                        <label
                            htmlFor="featured_image"
                            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center"
                        >
                            {featuredImage ? (
                                <img
                                    src={featuredImage}
                                    alt="Preview"
                                    className="w-50 h-50 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="text-center">
                                    <span className="text-gray-500">Click to upload image</span>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Categories and Tags */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Categories
                        </label>
                        <select
                            multiple
                            value={selectedCategories.map(String)}
                            onChange={(e) => setSelectedCategories(
                                Array.from(e.target.selectedOptions, option => Number(option.value))
                            )}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Tags
                        </label>
                        <select
                            multiple
                            value={selectedTags.map(String)}
                            onChange={(e) => setSelectedTags(
                                Array.from(e.target.selectedOptions, option => Number(option.value))
                            )}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            {tags?.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


                {/* Status and Publish Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="status" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={initialData?.status || 'draft'}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="published_at"
                               className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Publish Date
                        </label>
                        <input
                            type="datetime-local"
                            id="published_at"
                            name="published_at"
                            defaultValue={initialData?.published_at}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>

                {/* Meta Information */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="meta_title"
                               className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            id="meta_title"
                            name="meta_title"
                            defaultValue={initialData?.meta?.title}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="meta_description"
                               className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Meta Description
                        </label>
                        <textarea
                            id="meta_description"
                            name="meta_description"
                            defaultValue={initialData?.meta?.description}
                            rows={2}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="meta_keywords"
                               className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Meta Keywords (comma-separated)
                        </label>
                        <input
                            type="text"
                            id="meta_keywords"
                            value={metaKeywordsInput}
                            onChange={handleMetaKeywordsChange}
                            placeholder="Enter keywords separated by commas (max 50 characters each)"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {metaKeywords.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {metaKeywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-sm"
                                    >
                                {keyword}
                            </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => history.back()}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Saving...' : (initialData ? 'Update Blog' : 'Create Blog')}
                    </button>
                </div>
            </div>
        </form>
    );
}