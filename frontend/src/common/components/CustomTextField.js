import * as React from 'react';
import { TextField, MenuItem } from '@mui/material';

export function CustomTextField(props) {
  const { maxlength=255, label, name, handleChange, errorMessage,required,select,disabled=false,options=[], value, ...rest } = props;
  return (
    <TextField
      select={select}
      margin="normal"
      required={required}
      fullWidth
      id={name}
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      InputLabelProps={{ shrink: true }}
      disabled={disabled}
      {...rest}
      multiline={true}
      minRows={1}
      inputProps={{ maxLength: maxlength }}
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