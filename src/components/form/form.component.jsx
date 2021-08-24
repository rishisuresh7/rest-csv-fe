import React, {useState} from 'react';
import Dropdown from '../dropdown/dropdown.component';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import './form.styles.scss';
import CustomButton from '../button/button.component';

const CustomForm = (props) => {
    const { id, ba_no, cms_in, cms_out, efc, engine_hours, kilometeres, series_inspection, sqn, tag_op, tm_1, tm_2, type, vehicle_type }
        = props.data || {};
    const [value, setValue] = useState({
        ba_no,
        sqn,
        type,
        tm_1 : tm_1 ? new Date(tm_1) : new Date(),
        tm_2 : tm_2 ? new Date(tm_2) : new Date(),
        cms_in : cms_in ? new Date(cms_in) : new Date(),
        cms_out : cms_out ? new Date(cms_out) : new Date(),
        id : parseInt(id || 0),
        efc: parseInt(efc || 0),
        eh: parseInt(engine_hours || 0),
        km: parseInt(kilometeres || 0),
        si: series_inspection,
        tag: tag_op,
        vt: vehicle_type
    });
    const buttonText = "Insert " + (props.formType === "categories" ? "Vehicle" : "Demand")
    const handleChange = (key, val) => {
        setValue({...value, [key]: val});
    }
    const parseDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }
    
    const handleSubmit = () => {
        const {tm_1, tm_2, cms_in, cms_out} = value;
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
                'Authorization': 'foobarbaz',
            }
        })
        .then(response => response.json())
        .then((response) => {
            console.log(response);
        })
    }

    return (
        <div className="forms-container">
            <Dropdown value={value.sqn} handleChange={handleChange} propName='sqn' setNone type="SQN" name="Squadron" options={['A', 'B', 'C', 'HQ']}/>
            <Dropdown value={value.vt} handleChange={handleChange} propName='vt' setNone type="VEH" name="Vehicle Type" options={['A', 'B', 'OTHERS']}/>
            <FormControl className="forms-text-field" variant="outlined">
                <InputLabel htmlFor="component-outlined">BA Number</InputLabel>
                <OutlinedInput id="component-outlined" value={value.ba_no} onChange={(e) => handleChange('ba_no', e.target.value)} label="BA Number" />
            </FormControl>
            <FormControl className="forms-text-field" variant="outlined">
                <InputLabel htmlFor="component-outlined">Type</InputLabel>
                <OutlinedInput id="component-outlined" value={value.type} onChange={(e) => handleChange('type', e.target.value)} label="Type" />
            </FormControl>
            {
                props.formType === "categories" ? 
                    <React.Fragment>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">KM</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.km} onChange={(e) => handleChange('km', parseInt(e.target.value))} label="KM" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Engine Hours</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.eh} onChange={(e) => handleChange('eh', parseInt(e.target.value))} label="Engine Hours" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">EFC</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.efc} onChange={(e) => handleChange('efc', parseInt(e.target.value))} label="EFC" />
                        </FormControl>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                className="forms-text-field"
                                label="TM 1 Date"
                                format="yyyy/MM/dd"
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
                                format="yyyy/MM/dd"
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
                                format="yyyy/MM/dd"
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
                                format="yyyy/MM/dd"
                                value={value.cms_out}
                                onChange={(e) => handleChange('cms_out', e)}
                                KeyboardButtonProps={{
                                "aria-label": "change date"
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Series Inspection</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.si} onChange={(e) => handleChange('si', e.target.value)} label="Series Inspection" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Tag/OP</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.tag} onChange={(e) => handleChange('tag', e.target.value)} label="Tag/OP" />
                        </FormControl>
                    </React.Fragment> : 
                    <React.Fragment>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Equipment Demanded</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.ed} onChange={(e) => handleChange('ed', e.target.value)} label="Equipment Demanded" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Depot</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.depot} onChange={(e) => handleChange('depot', e.target.value)} label="Depot" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Demand Number</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.dn} onChange={(e) => handleChange('dn', e.target.value)} label="Demand Number" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Control Number</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.cn} onChange={(e) => handleChange('cn', e.target.value)} label="Control Number" />
                        </FormControl>
                        <FormControl className="forms-text-field" variant="outlined">
                            <InputLabel htmlFor="component-outlined">Status</InputLabel>
                            <OutlinedInput id="component-outlined" value={value.status} onChange={(e) => handleChange('status', e.target.value)} label="Status" />
                        </FormControl>
                    </React.Fragment>
            }
            <CustomButton className="forms-submit-button" color="primary" size="large" text={buttonText} onClick={handleSubmit}/>
        </div>
    )
}

export default CustomForm;