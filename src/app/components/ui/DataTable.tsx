import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import { MdOutlineEdit, MdOutlineMoreVert } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import { RiDeleteBinLine } from 'react-icons/ri';
import Loader from '../Loader';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function DataTable({ tableConfig, isLoading, paginatedData }: any) {
    const { handlePagination, pagination } = tableConfig;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(paginatedData ? pagination?.rowPerPage : 5);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuKey, setMenuKey] = React.useState<string | null>(null);
  const open = Boolean(anchorEl);
  
  const rows = tableConfig?.rows || [];
  const columns = tableConfig?.columns || [];

  const displayRows = paginatedData
    ? rows
    : rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const updatedColumns = [...tableConfig.columns];
    if (tableConfig.actionPresent) {
      updatedColumns.push({
        field: "action",
        headerName: "Action",
      });
    }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
   if (paginatedData) {
    handlePagination(newPage)
   }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, key: string) => {
    setAnchorEl(event.currentTarget);
    setMenuKey(key);
  };

   const handleClose = (type: any, item: any) => {
    tableConfig.onActionClick(type, item);
    setAnchorEl(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="custom pagination table">
      <TableHead>
          <TableRow sx={{ background: "#FFFFFF" }}>
            {updatedColumns.map((column: any) => (
              <TableCell
                key={column.field}
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#495057",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={tableConfig.columns.length}
                align="center"
                sx={{ height: "200px", position: "relative" }}
              >
                <Loader show={true} sx={{ position: "absolute" }} />
              </TableCell>
            </TableRow>
          ) : tableConfig?.rows?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableConfig.columns.length}
                align="center"
                sx={{
                  fontSize: "20px",
                  fontWeight: 400,
                  height: "200px",
                  color: "darkgray",
                }}
              >
                {tableConfig.notFoundData}
              </TableCell>
            </TableRow>
          ) : (
            displayRows.map((row: any, index: number) => (
              <TableRow key={index}>
                {updatedColumns.map((column: any) => {
                  const cellKey = `Datatable-row-${index}-${column.field}`;

                  if (column.field === "action" && tableConfig.actionPresent) {
                    return (
                      <TableCell
                        key={cellKey}
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        <IconButton
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(event) => {
                            handleClick(event, cellKey);
                          }}
                        >
                          <MdOutlineMoreVert size={18} />
                        </IconButton>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open && menuKey === cellKey}
                          onClose={handleClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {tableConfig?.actionList?.includes("edit") && (
                            <MenuItem
                              onClick={() => {
                                handleClose("edit", row);
                              }}
                            >
                              <ListItemIcon>
                                <MdOutlineEdit size={18} />
                              </ListItemIcon>
                              Edit
                            </MenuItem>
                          )}
                          {tableConfig?.actionList?.includes("view") && (
                            <MenuItem
                              onClick={() => {
                                handleClose("view", row);
                              }}
                            >
                              <ListItemIcon>
                                <GrView size={18} />
                              </ListItemIcon>
                              View
                            </MenuItem>
                          )}
                          {tableConfig?.actionList?.includes("delete") && (
                            <MenuItem
                              onClick={() => {
                                handleClose("delete", row);
                              }}
                            >
                              <ListItemIcon>
                                <RiDeleteBinLine size={18} />
                              </ListItemIcon>
                              Delete
                            </MenuItem>
                          )}
                        </Menu>
                      </TableCell>
                    );
                  } else if (column.customRender) {
                    return (
                      <TableCell
                        key={cellKey}
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        {column.customRender(row)}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell
                        key={cellKey}
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        {row[column.field] ? row[column.field] : "-"}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
          <TablePagination
              rowsPerPageOptions={[]}
              count={paginatedData ? tableConfig?.pagination?.totalResults : rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
