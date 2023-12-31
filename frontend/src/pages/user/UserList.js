import React, { useEffect, useState } from 'react';
import { get } from '../../Http';
import Navbar from '../../common/Navbar';
import { Button, Grid, FormControl, Divider } from '@mui/material';
import Loading from '../../common/Loading';
import {CustomTextField} from '../../common/components/CustomTextField';
import {  Box } from "@mui/system";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import UserListTable from './UserListTable';
const sex_options =[
    { name: "男性", id: 0 },
    { name: "女性", id: 1 }
]

const dept_options =[
    { name: "部門１", id: 0 },
    { name: "部門２", id: 1 }
]

const status_options =[
    { name: "稼働中", id: 0 },
    { name: "待機中", id: 1 },
    { name: "離任", id: 2 }
]
function UserList() {
  const classes = {
    root: {
      flexGrow: 1,
      zIndex: 9999
    },
  }

  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sex: 0,
    dept_id: -1,
    status: 0,
    page: 0,
    rowsPerPage: 20,
    data_count: 0
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  //検索
  const handleSearch = () => {
    setSelected([])
    setIsLoading(true);
    get('/fpro001', formData)
    .then(response => {
      if(response['status_code'] === 200) {
        setRows(response.data)
        formData.data_count = response.page_info.count
        formData.page = response.page_info.page_num
        setFormData({...formData})
      } else {
        setRows([])
      }
      setIsLoading(false);
    })
    .catch(error => {
      setIsLoading(false);
    });
  }

  // 初期表示
  useEffect(() => {
    setIsLoading(true);
    handleSearch()
  }, [formData.page, formData.rowsPerPage]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // クリア
  const handleClear = () => {
    formData.name = ''
    formData.dept_id = ''
    formData.sex = ''
    formData.status = ''
    setFormData({...formData})
  };

  return (
    <Navbar pageTitle={"社員一覧"} >
    {isLoading && (
      <Loading />
    )}
      <Box sx={classes.root} >
        <Grid container spacing={1} >
          <Grid item xs={2} >
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <CustomTextField label="社員名" name='name' handleChange={handleChange} />
              </FormControl>
          </Grid>
          
          <Grid item xs={2} >
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <CustomTextField label="性別" name='sex' handleChange={handleChange} select={'select'} options={sex_options} />
            </FormControl>
          </Grid>
          
          <Grid item xs={2} >
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <CustomTextField label="部門" name='dept_id' handleChange={handleChange} select={'select'} options={dept_options} />
            </FormControl>
          </Grid>
          
          <Grid item xs={2} >
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <CustomTextField label="ステータス" name='status' handleChange={handleChange} select={'select'} options={status_options} />
            </FormControl>
          </Grid>
          
          <Grid item xs={4} style={{ display: 'flex', justifyContent: 'flex-end', }}>
            <Button
              variant="contained"
              edge="end" 
              endIcon={<SearchIcon />}
              style={{width: 120, marginTop: 25, marginRight:3, heigth: 70 }}
              onClick={handleSearch}
            >
              検索
            </Button>
            <Button
              variant='contained'
              edge='end'
              endIcon={<ClearIcon />}
              style={{ width: 120, marginTop: 25, heigth: 70 }}
              onClick={handleClear}
            >
              クリア
            </Button>
          </Grid>

        </Grid>
        <Divider style={{marginTop :5, marginBottom:5}}/>
        
        <UserListTable />
      </Box>
    </Navbar>
  );
}

export default UserList;
