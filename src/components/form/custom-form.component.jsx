import React, {useState} from 'react';
import {connect} from 'react-redux';
import Dropdown from '../dropdown/dropdown.component';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import DateFnsUtils from "@date-io/date-fns";
import CustomButton from '../button/button.component';
import TextField from '@mui/material/TextField';
import * as utility from '../utility/utility';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import { setSnackError, setSnackSuccess, setSnackClose } from '../snack-bar/snack-bar.actions';
import './form.styles.scss';
import { useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';

const getVehicleName = (vehicleName) => {
    if(vehicleName.includes('A')) {
        return 'A'
    } else if(vehicleName.includes('B')) {
        return 'B'
    } else {
        return 'OTHERS'
    }
}

const DynamicCustomForm = (props) => {
    const [values, setValues] = useState({});
    useEffect(() => {
        let newState = {};
        if(props.data) {
            for(let i in props.keys) {
                const item = props.keys[i];
                let itemValue = '';
                switch(item.type) {
                    case 'date':
                        itemValue = new Date(props.data[item.value]);
                        break;
                    default:
                        itemValue = props.data[item.value];
                }
                newState[item.value] = itemValue;
            }
        } else {
            for(let i in props.keys) {
                const item = props.keys[i];
                let itemValue = '';
                switch(item.type) {
                    case 'date':
                        itemValue = new Date();
                }
                newState[item.value] = itemValue;
            }
        }

        setValues({...newState})
    }, [])

    const buttonText = (props.isUpdate ? "Update " : "Insert ") + (props.selectedTab.includes('Vehicle') ? 'Vehicle': props.selectedTab);

    const isAlphaNumeric = (str) => {
        let code, i, len;
        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (code === 32 ) {
              continue;
          }
          if (!(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123)) {
            return false;
          }
        }

        return true;
    };

    const handleChange = (key, val, validateField) => {
        let localValue = val;
        props.setSnackClose();
        if(validateField) {
            if(!isAlphaNumeric(val)) {
                props.setSnackError('Please Enter Alphanumeric values');
                if(val.length) {
                    localValue = val.substr(0, val.length - 1);
                }
            }
        }
        setValues({...values, [key]: localValue});
    }

    const parseDate = (date) => {
        const month = date.getMonth()+1;
        const formattedMonth = month <= 9 ? `0${month}` : month
        const day = date.getDate();
        const formattedDay = day <= 9 ? `0${day}` : day;

        return `${date.getFullYear()}-${formattedMonth}-${formattedDay}`
    }

    const handleSubmit = () => {
        let postData = {
            id: props.isUpdate? props.data.id : 0,
        };
        for(let i in props.keys) {
            const item = props.keys[i];
            switch(item.type) {
                case 'date':
                    postData[item.value] = parseDate(values[item.value]);
                    break;
                case 'integer':
                    postData[item.value] = item.step ? parseFloat(values[item.value]) : parseInt(values[item.value]);
                    break;
                default:
                    postData[item.value] = values[item.value];
            }
        }
        fetch(`/api/${utility.getAPIRoute(props.selectedTab)}`, {
            method: props.isUpdate ? 'PATCH' : 'POST',
            body: JSON.stringify([{...postData, vehicleType: getVehicleName(props.selectedTab)}]),
            headers: {
                'Authorization': props.token,
            }
        })
        .then(response => response.json())
        .then((response) => {
            if(response.success) {
                props.setRerender(true);
                props.handleFormOpen();
                props.setLoading(true);
                props.setSnackSuccess((props.isUpdate ? 'Updated ' : 'Inserted ') + 'successfuly');
            } else {
                props.setSnackError('Some unexpected error happened');
            }
        })
        .catch(() => {
            props.setSnackError('Some unexpected error happened');
        })
    }

    return (
        <div className="forms-container">
            {
                props.keys.map((item, index) => {
                    if(index === 0 || (item.value === 'vehicleType' && props.selectedTab !== 'Demands')) {
                        return null
                    }
                    switch(item.type) {
                        case 'integer':
                            return <FormControl key={index} className="forms-text-field" variant="outlined">
                                        <InputLabel htmlFor="component-outlined">
                                            {item.label}
                                        </InputLabel>
                                        <OutlinedInput
                                            type="number"
                                            
                                            id="component-outlined"
                                            value={values[item.value]}
                                            onChange={(e) => handleChange(item.value, e.target.value)}
                                            label={item.label}
                                        />
                                    </FormControl>
                        case 'dropdown':
                            return <Dropdown
                                        key={index}
                                        spacing={1}
                                        value={values[item.value]}
                                        handleChange={handleChange}
                                        propName={item.value}
                                        setNone
                                        type={item.value === 'squadron' ? "SQN" : "VEH"}
                                        name={item.label}
                                        options={item.options}
                                    />
                        case 'date':
                            return <MuiPickersUtilsProvider key={index} utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            className="forms-text-field"
                                            label={`${item.label} Date`}
                                            format="dd/MM/yyyy"
                                            value={values[item.value]}
                                            onChange={(e) => handleChange(item.value, e)}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date"
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                        case 'text':
                            return  <TextField
                                        key={index}
                                        id="outlined-multiline-static"
                                        label="Remarks"
                                        multiline
                                        rows={4}
                                        sx={{width: 400}}
                                        value={values[item.value]}
                                        onChange={(e) => handleChange('remarks', e.target.value)}
                                    />
                        default:
                            return  <FormControl key={index} className="forms-text-field" variant="outlined">
                                        <InputLabel htmlFor="component-outlined">
                                            {item.label}
                                        </InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            value={values[item.value]}
                                            onChange={(e) => handleChange(item.value, e.target.value, true)}
                                            label={item.label}
                                        />
                                    </FormControl>
                    }
                })
            }
            <CustomButton className="forms-submit-button" color="primary" size="large" text={buttonText} extraLarge onClick={handleSubmit} />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    setSnackError: (payload) => dispatch(setSnackError(payload)),
    setSnackSuccess: (payload) => dispatch(setSnackSuccess(payload)),
    setSnackClose: () => dispatch(setSnackClose())
});

export default connect(null, mapDispatchToProps)(DynamicCustomForm);