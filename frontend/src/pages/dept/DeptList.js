import React, { useEffect, useState } from 'react';
import Navbar from '../../common/Navbar';
import { Button, Grid, FormControl, Divider, Alert } from '@mui/material';
import Loading from '../../common/Loading';
import {CustomTextField} from '../../common/components/CustomTextField';
import {  Box } from "@mui/system";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DeptListTable from './DeptListTable';
import {LOCATION} from '../../common/Constants';
import { MESSAGE } from "../../common/Constants";
import { get, del } from '../../Http';

function DeptList() {
  const classes = {
    root: {
      flexGrow: 1,
      zIndex: 9999
    },
  }

  const [message, setMessage] = useState();
  const [title, setTitle] = useState();
  const [openComplete, setOpenComplete] = React.useState(false);
  const handleCloseOpenComplete = () => {
    setOpenComplete(false);
  };

  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: null,
    page_num: 0,
    page_size: 20,
    data_count: 0,
  });

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  //検索
  const handleSearch = () => {
    setSelected([])
    setIsLoading(true);
    get('/dept/all', formData)
    .then(response => {
      if(response['status_code'] === 200) {
        setRows(response.data)
        setError('')
        formData.data_count = response.page_info.count
        formData.page = response.page_info.page_num
        setFormData({...formData})
      } else {
        setRows([])
        setError(MESSAGE['E0001'])
      }
      setIsLoading(false);
    })
    .catch(error => {
        setError(MESSAGE['E0001'])
      setIsLoading(false);
    });
  }

  // 初期表示
  useEffect(() => {
    setIsLoading(true);
    handleSearch()
  }, [formData.page_num, formData.page_size]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // クリア
  const handleClear = () => {
    formData.name = ''
    formData.location = null
    setFormData({...formData})
  };

  return (
    <Navbar pageTitle={"部門一覧"} >
    {isLoading && (
      <Loading />
    )}
      <Box sx={classes.root} >
          {error && (
            <Alert severity="error" style={{width: '100%'}}>
              {error}
            </Alert>
          )}
        <Grid container spacing={1} >
          <Grid item xs={2} >
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <CustomTextField label="部門名" name='name' handleChange={handleChange} value={formData.name} />
              </FormControl>
          </Grid>
          
          <Grid item xs={2} >
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <CustomTextField label="場所" name='location' handleChange={handleChange} select={'select'} options={LOCATION} value={formData.location} />
            </FormControl>
          </Grid>
          
          <Grid item xs={8} style={{ display: 'flex', justifyContent: 'flex-end', }}>
            <Button
              variant='contained'
              edge='end'
              endIcon={<ClearIcon />}
              style={{ width: 120, marginRight:3, marginTop: 20, heigth: 40 }}
              onClick={handleClear}
            >
              クリア
            </Button>
            <Button
              variant="contained"
              edge="end" 
              endIcon={<SearchIcon />}
              style={{width: 120, marginTop: 20, heigth: 40 }}
              onClick={handleSearch}
            >
              検索
            </Button>
          </Grid>

        </Grid>
        <Divider style={{marginTop :5, marginBottom:5}}/>
        <DeptListTable rows={rows} selected={selected} setSelected={setSelected} handleSearch={handleSearch} formData={formData} setFormData={setFormData} />
      </Box>
    </Navbar>
  );
}

export default DeptList;
