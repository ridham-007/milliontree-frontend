import React from 'react';
import usePagination from '@mui/material/usePagination';
import { Stack, Button, useMediaQuery } from '@mui/material';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface PaginationProps {
    totalPages: number;
    onPageChange: (page: number) => void;
    currentPage: number;
}

const Pagination = ({ totalPages, onPageChange, currentPage }: PaginationProps) => {

    const boundaryCount = useMediaQuery('(min-width: 640px)') ? 2 : 0;

    const { items } = usePagination({
        count: totalPages,
        onChange: (event: any, page: number | null) => {
            if (page !== null) {
                onPageChange(page);
            }
        },
        page: currentPage,
        defaultPage: 1,
        boundaryCount: boundaryCount,
        siblingCount: 0
    });

    return (
        <Stack direction="row" spacing='10px' className='pagination-wrapper'>
            {items.map(({ page, type, selected, ...item }, index) => {
                let children = null;

                if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                    children = '…';
                } else if (type === 'page') {
                    children = (
                        <Button
                            {...item}
                            onClick={() => onPageChange(page!)}
                            variant={currentPage ? 'contained' : 'outlined'}
                            sx={{
                                minWidth: '41px',
                                height: '38px',
                                padding: 0,
                                fontSize:currentPage ? '22px' : '20px',
                                fontFamily: "'Montserrat', sans-serif",
                                backgroundColor: 'white',
                                color: currentPage === page ? '#3BAD49' : 'black',
                                boxShadow: 'none',
                                borderRadius:'100%',
                                '&:hover': {
                                    backgroundColor: '#3BAD49',
                                    color: 'white',
                                },
                                '&:focus': {
                                    outline: 'none',
                                },
                            }}
                        >
                            {page}
                        </Button>
                    );
                } else {
                    children = (
                        <Button
                            {...item}
                            onClick={() => onPageChange(page!)}
                            disabled={type === 'previous' ? currentPage === 1 : currentPage === totalPages}
                            className='pagination-button'
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                textTransform: 'capitalize',
                                fontSize:'16px',
                                fontFamily: "'Montserrat', sans-serif",
                                '&:hover': {
                                    color: '#3BAD49',
                                },
                                '&:disabled': {
                                    opacity: 0.7,
                                },
                            }}
                        >
                            {type === 'previous' && <MdKeyboardArrowLeft  size={24} className='mr-[2px]' />}
                            {type === 'previous' && 'Previous'}
                            {type === 'next' && 'Next'}
                            {type === 'next' && <MdKeyboardArrowRight  size={24} className='mr-[2px]' />}
                        </Button>
                    );
                }

                return <div key={index} >{children}</div>;
            })}
        </Stack>
    );
};

export default Pagination;