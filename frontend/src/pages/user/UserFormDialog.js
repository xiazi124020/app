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

const formErrorsMessage = {
  name: '姓名が未入力です',
  name_kana: '姓名(かな)が未入力です',
  sex: '性別が未入力です',
  status: 'ステータスが未入力です',
  email: 'E-mailが未入力です',
  phone: '電話番号が未入力です',
  password: 'パスワードが未入力です'
}

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
  const [errors, setErrors] = useState();
  const [formData, setFormData] = useState({
    id: selected[0] ? selected[0]: null,
    name: '',
    name_kana: '',
    emp_id: null,
    sex: 0,
    dept_id: null,
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
        console.log(updatedFormData)
        console.log(response.data)
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
    
    const errors = {}
    Object.keys(formErrorsMessage).forEach((key) => {
      if (isEmpty(formData[key])) {
        errors[key] = formErrorsMessage[key]
      }
    })
    
    setErrors(errors)
    if (Object.values(errors).length) {
      return
    }

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
              <CustomTextField value={formData.name} label="姓名" name='name' handleChange={handleChange} required={true} errorMessage={errors?.name} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.name_kana} label="姓名(かな)" name='name_kana' handleChange={handleChange} required={true} errorMessage={errors?.name_kana} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.sex} label="性別" name='sex' handleChange={handleChange} select={'select'} options={SEX} required={true} errorMessage={errors?.sex} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.dept_id} label="部門" name='dept_id' handleChange={handleChange} select={'select'} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.email} label="E-mail" name='email' handleChange={handleChange} required={true} errorMessage={errors?.email} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.phone} label="電話番号" name='phone' handleChange={handleChange} errorMessage={errors?.phone} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.password} label="パスワード" name='password' handleChange={handleChange} required={true} errorMessage={errors?.password} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.status} label="ステータス" name='status' handleChange={handleChange} select={'select'} options={STATUS} required={true} errorMessage={errors?.status} />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel control={<Checkbox checked={formData.is_admin} onChange={handleChangeCheck} />} label="管理者" />
            </Grid>
            <Grid item xs={2}>
              <CustomTextField value={formData.zip_code} label="郵便番号" name='zip_code' handleChange={handleChange} />
            </Grid>
            <Grid item xs={10}>
              <CustomTextField value={formData.address} label="住所" name='address' handleChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
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
          <Button
              variant='contained'
              edge='end'
              endIcon={<SaveIcon />}
              color="success"
              sx={{ width: 140, heigth: 30 }}
              onClick={handleRetister}
              >
              {isEmpty(formData.id) ? '登録': '更新'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <CompleteDialog open={openComplete} handleCloseOpenComplete={handleCloseOpenComplete} title={title} message={message} />
    </React.Fragment>
  );
}
