import {
    Pagination,
    PaginationContent,
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
    const pageNumbers = [
        currentPage - 1 >= 1 ? currentPage - 1 : null,
        currentPage,
        currentPage + 1 <= pages ? currentPage + 1 : null
    ].filter(Boolean);

    return (
        <Pagination className="flex justify-center p-4 mb-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className="cursor-pointer" onClick={onDecrement} />
                </PaginationItem>
                {pageNumbers.map((num) => (
                    <PaginationItem key={num}>
                        <PaginationLink
                            className="cursor-pointer"
                            isActive={currentPage === num}
                            onClick={() => num !== currentPage && setPage(num as number)}
                        >
                            {num}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext className="cursor-pointer" onClick={onIncrement} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
