import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import React from 'react'

export const PaginationBar = ({
    pages,
    currentPage,
    onIncrement,
    onDecrement,
    setPage
}: {
    pages: number;
    currentPage: number;
    onIncrement: () => void;
    onDecrement: () => void;
    setPage: React.Dispatch<React.SetStateAction<number>>
}) => {
    const showPages = () => {
        const items = [];
        const maxVisible = 5;
        const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(pages, start + maxVisible - 1);

        for (let i = start; i <= end; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        className="cursor-pointer"
                        isActive={currentPage === i}
                        onClick={() => {
                            if (i !== currentPage) {
                                setPage(i);
                            }
                        }}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <Pagination className="flex justify-center p-4 mb-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className="cursor-pointer" onClick={onDecrement} />
                </PaginationItem>
                {showPages()}
                <PaginationItem>
                    <PaginationNext className="cursor-pointer" onClick={onIncrement} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
