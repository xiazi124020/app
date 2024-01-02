import * as React from 'react';
import { TextField, MenuItem, InputAdornment  } from '@mui/material';

export function CustomTextField(props) {
  const { type='text', maxlength=255, label, name, handleChange, errorMessage,required,select,disabled=false,multiline=true,options=[], value, ...rest } = props;
  return (
    <TextField
      select={select}
      type={type}
      margin="normal"
      required={required}
      fullWidth
      id={name}
      color="success" 
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      InputLabelProps={{ shrink: true }}
      disabled={disabled}
      {...rest}
      multiline={multiline}
      minRows={1}
      inputProps={{ maxLength: maxlength,}}
      size={"small"}
    >
      {options != null && options.length > 0 && options.map((item) => {
        return (
          <MenuItem key={item.id} value={item.id}>
            {item.abbr}{item.name}
          </MenuItem>
        );
      })}
    </TextField>
  );
}