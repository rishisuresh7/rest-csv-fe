import React from 'react';
import Button from '@material-ui/core/Button';

const CustomButton = (props) => {
  const {color, text, onClick, extraLarge, variant, size, className} = props;

  return (
    <div className={className}>
      <Button variant={ variant || "contained"} color={color} size={size || "medium"} onClick = {onClick} style={extraLarge ? {height: '60px', width: '150px'}: {}}>
        {text}
      </Button>
    </div>
  );
}

export default CustomButton;