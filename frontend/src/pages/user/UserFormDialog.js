import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button, Grid, Checkbox, FormControlLabel} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {CustomTextField} from '../../common/components/CustomTextField';
import {SEX} from '../../common/Constants';
import { post, get, del } from '../../Http';
import Loading from '../../common/Loading';
import { MESSAGE } from "../../common/Constants";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function UserFormDialog({id, selected, handleClose, open}) {
  const handleCloseUserDialog = () => {
    handleClose();
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    id: id,
    name: '',
    name_kana: '',
    emp_id: -1,
    sex: 0,
    dept_id: -1,
    status: 0,
    phone: '',
    email:'',
    zip_code:'',
    address:'',
    password:'',
    is_admin:false,
    status:'',
    page: 0,
    rowsPerPage: 20,
    data_count: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleChangeCheck = (event) => {
    if (event.target.checked) {
      setFormData({ ...formData, ['is_admin']: true });
    } else {
      setFormData({ ...formData, ['is_admin']: false });
    }
  };

  //検索
  const handleSearch = () => {
    setIsLoading(true);
    get(`/user/${selected[0]}`)
    .then(response => {
      if(response['status_code'] === 200) {
        const updatedFormData = { ...formData, ...response.data };
        setFormData(updatedFormData);
        setFormData(updatedFormData)
      } else {
        setError(MESSAGE['E0001'])
      }
      setIsLoading(false);
    })
    .catch(error => {
      setIsLoading(false);
    });
  }

  // 初期表示
  useEffect(() => {
    handleSearch()
  }, [selected]);

  //検索
  const handleRetister = () => {
    setIsLoading(true);
    post(`/fpro001/${formData.id}`, formData)
    .then(response => {
      if(response['status_code'] === 200) {
        const updatedFormData = { ...formData, ...response.data };
        setFormData(updatedFormData);
        setFormData(updatedFormData)
      } else {
        setError(MESSAGE['E0001'])
      }
      setIsLoading(false);
    })
    .catch(error => {
      setIsLoading(false);
    });
  }


  return (
    <React.Fragment>
      {isLoading && <Loading />}
      <BootstrapDialog 
        onClose={handleCloseUserDialog}
        maxWidth={'lg'}
        fullWidth={true}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 1, backgroundColor:'#F0FFFF',minHeight: 50, height: 50, }} id="customized-dialog-title">
          {selected && selected.length > 0 ? '社員編集': '社員追加'}
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 500,backgroundColor:'#E0FFFF', }}>
      
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <CustomTextField label="社員番号" name='emp_id' handleChange={handleChange} disabled={true} sx={{ backgroundColor:'#F5F5F5' }} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField label="姓名" name='name' handleChange={handleChange} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField label="姓名(かな)" name='name_kana' handleChange={handleChange} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField label="性別" name='sex' handleChange={handleChange} select={'select'} options={SEX} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField label="部門" name='dept_id' handleChange={handleChange} select={'select'} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField label="E-mail" name='email' handleChange={handleChange}  />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField label="電話番号" name='phone' handleChange={handleChange} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField label="パスワード" name='password' handleChange={handleChange} />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel control={<Checkbox checked={formData.is_admin} onChange={handleChangeCheck} />} label="管理者" />
            </Grid>
            <Grid item xs={2}>
              <CustomTextField label="郵便番号" name='zip_code' handleChange={handleChange} />
            </Grid>
            <Grid item xs={10}>
              <CustomTextField label="住所" name='address' handleChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
              variant='contained'
              edge='end'
              endIcon={<SaveIcon />}
              color="success"
              sx={{ width: 140, heigth: 30 }}
              onClick={handleCloseUserDialog}
              >
              保存
          </Button>
          <Button
              variant='contained'
              edge='end'
              endIcon={<CancelIcon />}
              color="error"
              sx={{ width: 140, heigth: 30 }}
              onClick={handleCloseUserDialog}
              >
              キャンセル
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
