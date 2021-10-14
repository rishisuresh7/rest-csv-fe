import React, {useState} from 'react';
import {connect} from 'react-redux';
import Dropdown from '../dropdown/dropdown.component';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import DateFnsUtils from "@date-io/date-fns";
import CustomButton from '../button/button.component';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import { setSnackError, setSnackSuccess, setSnackClose } from '../snack-bar/snack-bar.actions';
import './form.styles.scss';

const CustomForm = (props) => {
    const { id, ba_no, cms_in, cms_out, efc, engine_hours, kilometeres, series_inspection, sqn, tag_op, tm_1, tm_2,
        type, vehicle_type, depot, status, equipment_demanded, control_number, demand_number } = props.data || {};
    const initState = {
        ba_no, sqn, type, depot, status, efc,
        tm_1 : tm_1 ? new Date(tm_1) : new Date(),
        tm_2 : tm_2 ? new Date(tm_2) : new Date(),
        cms_in : cms_in ? new Date(cms_in) : new Date(),
        cms_out : cms_out ? new Date(cms_out) : new Date(),
        id : parseInt(id || 0),
        eh: engine_hours,
        km: kilometeres,
        si: series_inspection,
        tag: tag_op,
        vt: vehicle_type,
        ed: equipment_demanded,
        cn: control_number,
        dn: demand_number
    }
    const [value, setValue] = useState(initState);
    const buttonText = (props.isUpdate ? "Update " : "Insert ") + (props.formType === "categories" ? "Vehicle" : "Demand");
    const isAlphaNumeric = (str) => {
        let code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
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
        setValue({...value, [key]: localValue});
    }
    const parseDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    }
    const handleSubmit = () => {
        const {tm_1, tm_2, cms_in, cms_out} = value;
        if(value !== initState) {
            const postData = {...value,
                tm_1: parseDate(tm_1),
                tm_2: parseDate(tm_2),
                cms_in: parseDate(cms_in),
                cms_out: parseDate(cms_out),
            };
            fetch(`/api/${props.formType}`, {
                method: props.isUpdate ? 'PATCH' : 'POST',
                body: JSON.stringify([postData]),
                headers: {
                    'Authorization': props.token,
                }
            })
            .then(response => response.json())
            .then((response) => {
                if(response.success) {
                    props.setRerender(true);
                    props.handleFormOpen(false);
                    props.setLoading(true);
                    props.setSnackSuccess((props.isUpdate ? 'Updated ' : 'Inserted ') + 'successfuly');
                } else {
                    props.setSnackError('Some unexpected error happened');
                }
            })
            .catch(() => {
                props.setSnackError('Some unexpected error happened');
            })
        } else {
            props.setSnackError(`No change(s) to ${props.isUpdate ? 'update' : 'insert'}.`)
        }
    }

    return (
        <div className="forms-container">
            <Dropdown value={value.sqn} handleChange={handleChange} propName='sqn' setNone type="SQN" name="Squadron" options={['A', 'B', 'C', 'HQ']}/>
            <Dropdown value={value.vt} handleChange={handleChange} propName='vt' setNone type="VEH" name="Vehicle Type" options={['A', 'B', 'OTHERS']}/>
            <FormControl className="forms-text-field" variant="outlined">
                <InputLabel htmlFor="component-outlined">BA Number</InputLabel>
                <OutlinedInput id="component-outlined" value={value.ba_no} onChange={(e) => handleChange('ba_no', e.target.value, true)} label="BA Number" />
            </FormControl>
            <FormControl className="forms-text-field" variant="outlined">
                <InputLabel htmlFor="component-outlined">Type</InputLabel>
                <OutlinedInput id="component-outlined" value={value.type} onChange={(e) => handleChange('type', e.target.value, true)} label="Type" />
            </FormControl>
            {
                props.formType === "categories" ? 
                    <React.Fragment>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">KM</InputLabel>
                            <OutlinedInput type="number" id="component-outlined" value={value.km} onChange={(e) => handleChange('km', e.target.value)} label="KM" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Engine Hours</InputLabel>
                            <OutlinedInput type="number" id="component-outlined" value={value.eh} onChange={(e) => handleChange('eh', e.target.value)} label="Engine Hours" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">EFC</InputLabel>
                            <OutlinedInput type="number" id="component-outlined" value={value.efc} onChange={(e) => handleChange('efc', e.target.value)} label="EFC" />
                        </FormControl>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                className="forms-text-field"
                                label="TM 1 Date"
                                format="dd/MM/yyyy"
                                value={value.tm_1}
                                onChange={(e) => handleChange('tm_1', e)}
                                KeyboardButtonProps={{
                                "aria-label": "change date"
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                className="forms-text-field"
                                label="TM 2 Date"
                                format="dd/MM/yyyy"
                                value={value.tm_2}
                                onChange={(e) => handleChange('tm_2', e)}
                                KeyboardButtonProps={{
                                "aria-label": "change date"
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                className="forms-text-field"
                                label="CMS In Date"
                                format="dd/MM/yyyy"
                                value={value.cms_in}
                                onChange={(e) => handleChange('cms_in', e)}
                                KeyboardButtonProps={{
                                "aria-label": "change date"
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                className="forms-text-field"
                                label="CMS Out Date"
                                format="dd/MM/yyyy"
                                value={value.cms_out}
                                onChange={(e) => handleChange('cms_out', e)}
                                KeyboardButtonProps={{
                                "aria-label": "change date"
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Series Inspection</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.si} onChange={(e) => handleChange('si', e.target.value, true)} label="Series Inspection" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Tag/OP</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.tag} onChange={(e) => handleChange('tag', e.target.value, true)} label="Tag/OP" />
                        </FormControl>
                    </React.Fragment> : 
                    <React.Fragment>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Equipment Demanded</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.ed} onChange={(e) => handleChange('ed', e.target.value, true)} label="Equipment Demanded" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Depot</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.depot} onChange={(e) => handleChange('depot', e.target.value. true)} label="Depot" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Demand Number</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.dn} onChange={(e) => handleChange('dn', e.target.value, true)} label="Demand Number" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Control Number</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.cn} onChange={(e) => handleChange('cn', e.target.value, true)} label="Control Number" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Status</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.status} onChange={(e) => handleChange('status', e.target.value, true)} label="Status" />
                        </FormControl>
                    </React.Fragment>
            }
            <CustomButton className="forms-submit-button" color="primary" size="large" text={buttonText} onClick={handleSubmit}/>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    setSnackError: (payload) => dispatch(setSnackError(payload)),
    setSnackSuccess: (payload) => dispatch(setSnackSuccess(payload)),
    setSnackClose: () => dispatch(setSnackClose())
});

export default connect(null, mapDispatchToProps)(CustomForm);