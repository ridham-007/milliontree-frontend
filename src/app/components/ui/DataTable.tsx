"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { MdOutlineEdit, MdOutlineMoreVert } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface DataTableProps {
  tableConfig?: any;
  isLoading?: boolean;
  fixRow?: boolean;
  eventSelection?: any;
}

const DataTable: React.FC<DataTableProps> = ({
  tableConfig,
  isLoading,
  fixRow,
  eventSelection,
}) => {
  const { columns, rows, handlePagination, handleRowLimit } = tableConfig;
  const [page, setPage] = useState(0); // Adjust page start from 0
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [menuKey, setMenuKey] = React.useState<string | null>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuKey(key);
  };

  const handleClose = (type: any, item: any) => {
    tableConfig.onActionClick(type, item);
    setAnchorEl(null);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    if (fixRow) {
      handlePagination(newPage);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (fixRow) {
      handleRowLimit(newRowsPerPage);
    }
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  };

  const updatedColumns = [...tableConfig.columns];
  if (tableConfig.actionPresent) {
    updatedColumns.push({
      field: "action",
      headerName: "Action",
    });
  }

  const displayRows = fixRow
    ? rows
    : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (eventSelection) {
      setPage(0); // Reset to first page when event selection changes
    }
  }, [eventSelection]);

  return (
    <TableContainer
      sx={{ maxHeight: 440 }}
      className="custom-scrollbar"
      component={Paper}
    >
      <Table>
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
                {/* <Loader show={true} sx={{ position: "absolute" }} /> */}
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
            {!fixRow && (
              <TablePaginationActions
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
              />
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
