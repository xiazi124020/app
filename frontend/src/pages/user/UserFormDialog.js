import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid, Checkbox, FormControlLabel, Alert, Portal, Dialog, DialogTitle, DialogContent,DialogActions } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {CustomTextField} from '../../common/components/CustomTextField';
import {SEX, STATUS} from '../../common/Constants';
import { post, get, del, put } from '../../Http';
import Loading from '../../common/Loading';
import { MESSAGE } from "../../common/Constants";
import {isEmpty} from '../../common/CommonUtils';
import CompleteDialog from '../../common/CompleteDialog';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function UserFormDialog({selected, handleClose, open}) {
  const handleCloseUserDialog = () => {
    handleClose();
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    id: selected[0] ? selected[0]: null,
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const [message, setMessage] = useState();
  const [title, setTitle] = useState();
  const [openComplete, setOpenComplete] = React.useState(false);
  const handleCloseOpenComplete = () => {
    setOpenComplete(false);
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
        setError('')
        const updatedFormData = { ...formData, ...response.data };
        setFormData(updatedFormData);
      } else {
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
    if(selected && selected.length > 0) {
      handleSearch()
    }
  }, [selected]);

  //登録
  const handleRetister = () => {
    setIsLoading(true);
    if(isEmpty(formData.id)) {
      post(`/user`, formData)
      .then(response => {
        if(response['status_code'] === 200) {
          formData.id = response.data
          setFormData({...formData});
          setError('')
          setMessage("社員を登録完了しました。")
          setTitle("社員管理")
          setOpenComplete(true)
        } else {
          setError(MESSAGE['E0001'])
        }
        setIsLoading(false);
      })
      .catch(error => {
        setError(MESSAGE['E0001'])
        setIsLoading(false);
      });
    } else {
      put(`/user/${formData.id}`, formData)
      .then(response => {
        if(response['status_code'] === 200) {
          setFormData({...formData});
          setError('')
          setMessage("社員情報を更新完了しました。")
          setTitle("社員管理")
          setOpenComplete(true)
        } else {
          setError(MESSAGE['E0001'])
        }
        setIsLoading(false);
      })
      .catch(error => {
        setError(MESSAGE['E0001'])
        setIsLoading(false);
      });
    }
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
        <DialogContent dividers sx={{ minHeight: 500,backgroundColor:'#F0F8FF', }}>
          {error && (
            <Alert severity="error" style={{width: '100%'}}>
              {error}
            </Alert>
          )}
          <Grid container spacing={1}>
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
              <CustomTextField label="ステータス" name='status' handleChange={handleChange} select={'select'} options={STATUS} />
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
              onClick={handleRetister}
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
      <CompleteDialog open={openComplete} handleCloseOpenComplete={handleCloseOpenComplete} title={title} message={message} />
    </React.Fragment>
  );
}
