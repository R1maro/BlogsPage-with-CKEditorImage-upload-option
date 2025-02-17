import React from 'react';
import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    baseUrl: string;
    searchParams?: Record<string, string>;
    showItemCount?: boolean;
    className?: string;
}

const Pagination = ({
                        currentPage,
                        totalItems,
                        itemsPerPage,
                        baseUrl,
                        searchParams = {},
                        showItemCount = true,
                        className = ''
                    }: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const fromItem = (currentPage - 1) * itemsPerPage + 1;
    const toItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageUrl = (pageNum: number): string => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNum.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <div className={`flex items-center justify-between border-t border-gray-200 dark:border-meta-5 bg-white dark:bg-meta-4 px-4 py-3 sm:px-6 mt-4 ${className}`}>
            {/* Mobile pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
                <Link
                    href={getPageUrl(currentPage - 1)}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                        currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }`}
                >
                    Previous
                </Link>
                <Link
                    href={getPageUrl(currentPage + 1)}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                        currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                    }`}
                >
                    Next
                </Link>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                {showItemCount && (
                    <div>
                        <p className="text-sm text-gray-700 dark:text-white">
                            Showing <span className="font-medium">{fromItem}</span> to{' '}
                            <span className="font-medium">{toItem}</span> of{' '}
                            <span className="font-medium">{totalItems}</span> results
                        </p>
                    </div>
                )}

                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Link
                            key={pageNum}
                            href={getPageUrl(pageNum)}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === pageNum
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-meta-3'
                            }`}
                        >
                            {pageNum}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pagination;