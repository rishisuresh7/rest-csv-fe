import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const Dropdown = (props) => {
    const useStyles = makeStyles((theme) => ({
        formControl: {
            minWidth: 120,
            width: props.fullWidth ? '100%' : 300,
            margin: theme.spacing(props.spacing),
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));
    const classes = useStyles();

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">{props.name}</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={props.value}
                onChange={(e) => props.handleChange(props.propName, e.target.value)}
                label={props.name}
            >
            {
                props.setNone ? <MenuItem value="">None</MenuItem> : null
            }
            {
                props.options.map(option => (<MenuItem value={option}>{option + (props.type ? " " + props.type : "")}</MenuItem>))
            }
            </Select>
        </FormControl>
    );
}

export default Dropdown;