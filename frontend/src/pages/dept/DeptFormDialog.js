import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid, Checkbox, FormControlLabel, Alert, Portal, Dialog, DialogTitle, DialogContent,DialogActions } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {CustomTextField} from '../../common/components/CustomTextField';
import {LOCATION} from '../../common/Constants';
import { post, get, del, put } from '../../Http';
import Loading from '../../common/Loading';
import { MESSAGE } from "../../common/Constants";
import {isEmpty} from '../../common/CommonUtils';
import CompleteDialog from '../../common/CompleteDialog';

const formErrorsMessage = {
  name: '部門名が未入力です',
  location: '場所が未入力です',
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DeptFormDialog({selected, handleClose, open}) {
  const handleCloseDeptDialog = () => {
    handleClose();
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = useState();
  const [errors, setErrors] = useState();
  const [formData, setFormData] = useState({
    id: selected[0] ? selected[0]: null,
    name: '',
    location: '',
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

  //検索
  const handleSearch = () => {
    setIsLoading(true);
    get(`/dept/${selected[0]}`)
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

  // クリア
  const handleClear = () => {
    formData.id = ''
    formData.name = ''
    formData.location = ''
    setFormData({...formData})
    setError('')
    setErrors('')
  };

  // 初期表示
  useEffect(() => {
    handleClear()
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
      post(`/dept`, formData)
      .then(response => {
        if(response['status_code'] === 200) {
          formData.id = response.data
          setFormData({...formData});
          setError('')
          setMessage("部門を登録完了しました。")
          setTitle("部門管理")
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
      put(`/dept/${formData.id}`, formData)
      .then(response => {
        if(response['status_code'] === 200) {
          setFormData({...formData});
          setError('')
          setMessage("部門情報を更新完了しました。")
          setTitle("部門管理")
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
        onClose={handleCloseDeptDialog}
        maxWidth={'lg'}
        fullWidth={true}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 1, backgroundColor:'#7FFFD4',minHeight: 50, height: 50, }} id="customized-dialog-title">
          {selected && selected.length > 0 ? '部門編集': '部門追加'}
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 500,backgroundColor:'#FFFFF0', }}>
          {error && (
            <Alert severity="error" style={{width: '100%'}}>
              {error}
            </Alert>
          )}
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <CustomTextField value={formData.name} label="部門名" name='name' handleChange={handleChange} required={true} errorMessage={errors?.name} />
            </Grid>
            <Grid item xs={4}>
              <CustomTextField value={formData.location} label="場所" name='location' handleChange={handleChange} select={'select'} options={LOCATION} required={true} errorMessage={errors?.location} />
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
              onClick={handleCloseDeptDialog}
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
