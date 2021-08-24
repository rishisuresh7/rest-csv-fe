import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const Dropdown = (props) => {
    const classes = useStyles();

    return (
    <div>
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
    </div>
    );
}

export default Dropdown;