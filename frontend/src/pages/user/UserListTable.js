import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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
import UserFormDialog from "./UserFormDialog";

const generateTestData = (numRows) => {
    const testData = [];
    for (let i = 1; i <= numRows; i++) {
        const paddedNumber = String(i).padStart(4, '0');
        const phoneNumber = `070-1234-${paddedNumber}`;
        testData.push({
            id: i,
            emp_id: `JCL${i}`,
            name: `Name${i}`,
            name_kana: `NameKana${i}`,
            email: `NameKana${i}@jcltk.com`,
            phone: phoneNumber,
            sex: i % 2 === 0 ? 'Male' : 'Female',
            status: i % 2 === 0 ? 'Active' : 'Inactive',
        });
    }
  
    return testData;
  };

const rows = generateTestData(50);

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
        id: 'emp_id',
        label: '社員番号',
    },
    {
        id: 'name',
        label: '社員名',
    },
    {
        id: 'name_kana',
        label: '社員名(かな)',
    },
    {
        id: 'sex',
        label: '性別',
    },
    {
        id: 'email',
        label: 'e-mail',
    },
    {
        id: 'phone',
        label: '電話番号',
    },
    {
        id: 'status',
        label: 'ステータス',
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
  const { numSelected, selected } = props;

  const [kbn, setKbn] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (kbn) => {
    setKbn(kbn)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Toolbar
    style={{minHeight: 50, height: 50}}
      sx={{
        backgroundColor: '#7FFFD4',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
        <Typography
            sx={{ flex: '1 1 100%', }}
            variant="h6"
            id="tableTitle"
            component="div"
        >
            社員一覧
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
      
      <UserFormDialog
        selected={kbn === 0 ? []: selected}
        handleClose={handleClose}
        open={open} />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function UserListTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
        <TableContainer sx={{ maxHeight: 600 }}>
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
              {visibleRows.map((row, index) => {
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
                    <TableCell>{row.emp_id}</TableCell>
                    <TableCell >{row.name}</TableCell>
                    <TableCell >{row.name_kana}</TableCell>
                    <TableCell >{row.sex}</TableCell>
                    <TableCell >{row.email}</TableCell>
                    <TableCell >{row.phone}</TableCell>
                    <TableCell >{row.status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
