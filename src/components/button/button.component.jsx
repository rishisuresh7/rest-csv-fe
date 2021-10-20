import React from 'react';
import Button from '@material-ui/core/Button';

const CustomButton = (props) => {
  const {color, text, onClick, extraLarge, variant, size, className} = props;

  return (
    <div className={className}>
      <Button
        disabled={props.disabled}
        variant={ variant || "contained"}
        color={color} size={size || "medium"}
        onClick = {onClick}
        style={extraLarge ? {height: '60px', width: '150px'}: {width: '100px'}}
      >
        {text}
      </Button>
    </div>
  );
}

export default CustomButton;