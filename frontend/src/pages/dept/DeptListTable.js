import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeptFormDialog from "./DeptFormDialog";
import {findNameById} from '../../common/CommonUtils';
import {LOCATION} from '../../common/Constants';
import DeleteConfirmDialog from '../../common/DeleteConfirmDialog';
import { MESSAGE } from "../../common/Constants";
import { del } from '../../Http';
import Loading from '../../common/Loading';
import CompleteDialog from '../../common/CompleteDialog';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        label: '部門名',
    },
    {
        id: 'location',
        label: '場所',
    },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, selected, handleSearch } = props;

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [kbn, setKbn] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (kbn) => {
    setKbn(kbn)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleSearch()
  };

  const [openDelete, setOpenDelete] = React.useState(false);
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [message, setMessage] = useState();
  const [title, setTitle] = useState();
  const [openComplete, setOpenComplete] = React.useState(false);
  const handleCloseOpenComplete = () => {
    setOpenComplete(false);
    handleSearch()
  };

  // 削除
  const handleDelete = () => {
    const postdata ={
        ids: selected
    }
    setIsLoading(true);
    if(selected && selected.length > 0) {
      del(`/dept`, postdata)
      .then(response => {
        if(response['status_code'] === 200) {
          setError('')
          setMessage("部門を削除しました。")
          setTitle("部門削除")
          setOpenComplete(true)
        } else {
          setError(MESSAGE['E0001'])
        }
        setOpenDelete(false);
        setIsLoading(false);
      })
      .catch(error => {
        setOpenDelete(false);
        setError(MESSAGE['E0001'])
        setIsLoading(false);
      });
    }
  }


  return (
    <Toolbar
    style={{minHeight: 50, height: 50}}
      sx={{
        backgroundColor: '#7FFFD4',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
        {isLoading && (
            <Loading />
        )}
        <Typography
            sx={{ flex: '1 1 100%', }}
            variant="h6"
            id="tableTitle"
            component="div"
        >
            部門一覧
        </Typography>

      {numSelected === 1 ? (
        <>
            <Button
                variant='contained'
                edge='end'
                endIcon={<PersonAddIcon />}
                color="success"
                sx={{ width: 140, heigth: 30, marginRight: 1 }}
                onClick={handleClickOpen}
                onClick={() => {handleClickOpen(0); }}
                >
                追加
            </Button>
            <Button
                variant='contained'
                edge='end'
                endIcon={<EditIcon />}
                sx={{ width: 140, heigth: 30, marginRight: 1, backgroundColor: '#8A2BE2', }}
                onClick={() => {handleClickOpen(1); }}
                >
                編集
            </Button>
            <Button
                variant='contained'
                edge='end'
                endIcon={<DeleteForeverIcon />}
                color="error"
                sx={{ width: 140, heigth: 30 }}
                onClick={() => {handleClickOpenDelete(); }}
                >
                削除
            </Button>
        </>
      ) : numSelected > 1 ?
        (
            <>
                <Button
                    variant='contained'
                    edge='end'
                    endIcon={<PersonAddIcon />}
                    color="success"
                    sx={{ width: 140, heigth: 30, marginRight: 1 }}
                    onClick={() => {handleClickOpen(0); }}
                    >
                    追加
                </Button>
                <Button
                    variant='contained'
                    edge='end'
                    endIcon={<DeleteForeverIcon />}
                    color="error"
                    sx={{ width: 140, heigth: 30 }}
                    onClick={() => {handleClickOpenDelete(); }}
                    >
                    削除
                </Button>
            </>
          ): (
          <Button
              variant='contained'
              edge='end'
              endIcon={<PersonAddIcon />}
              color="success"
              onClick={() => {handleClickOpen(0); }}
              sx={{ width: 120, heigth: 30 }}
            >
              追加
            </Button>
      )}
      
        <DeptFormDialog
            selected={kbn === 0 ? []: selected}
            handleClose={handleClose}
            open={open} />
        <DeleteConfirmDialog title={'部門削除'} message={'本当に削除しますか。'} handleClose={handleCloseDelete} open={openDelete} handleDelete={handleDelete} />
        <CompleteDialog open={openComplete} handleCloseOpenComplete={handleCloseOpenComplete} title={title} message={message} />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function DeptListTable({rows, selected, setSelected, handleSearch, formData, setFormData}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    formData.page = newPage
    setFormData({...formData})
  };

  const handleChangeRowsPerPage = (event) => {
    formData.page = 0
    formData.rowsPerPage = parseInt(event.target.value, 10)
    setFormData({...formData})
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} handleSearch={handleSearch} />
        <TableContainer sx={{ maxHeight: 600 }}>
        {rows && rows.length > 0 ? 
          <Table
            stickyHeader
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell >{row.name}</TableCell>
                    <TableCell >{findNameById(row.location,LOCATION)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
            : 
          <div align="left" style={{ whiteSpace: 'nowrap', marginLeft: 10}}><h3>検索結果なし</h3></div>}
        </TableContainer>
        {rows && rows.length > 0 ? 
            <TablePagination
                rowsPerPageOptions={[20, 50, 100]}
                component="div"
                count={formData.data_count}
                rowsPerPage={formData.page_size}
                page={formData.page_num}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
        />:""}
      </Paper>
    </Box>
  );
}
