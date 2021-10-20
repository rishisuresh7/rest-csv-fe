import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Dropdown from '../dropdown/dropdown.component';
import PopOver from '../pop-over/pop-over.component';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import './create-alert.styles.scss';
import CustomButton from '../button/button.component';
import { setSnackClose, setSnackError, setSnackSuccess, setSnackWarning } from '../snack-bar/snack-bar.actions';

const CreateAlert = props => {
    const [values, setValues] = useState({
        alertName: '',
        fieldName: '',
        ba_number: '',
        lastValue: '',
        nextValue: '',
    });
    useEffect(() => {
        setValues({
            alertName: '',
            fieldName: '',
            ba_number: '',
            lastValue: '',
            nextValue: '',
        });
    }, [props.open]);

    const handleChange = (key, value) => {
        props.setSnackClose();
        setValues({...values, [key]: value});
    }
    const handleClick = () => {
        props.setSnackClose();
        if(!(values.ba_number && values.alertName && values.fieldName && values.lastValue && values.nextValue)) {
            props.setSnackWarning('Please input all fields')
            return
        }
        fetch('/api/alerts', {
            method: 'POST',
            headers: {
                Authorization: props.token,
            },
            body: JSON.stringify(values),
        })
        .then(response => {
            if(response.status === 200) {
                props.setSnackSuccess('Created Alert successfully.');
                setValues({
                    alertName: '',
                    fieldName: '',
                    ba_number: '',
                    lastValue: '',
                    nextValue: '',
                })
            } else {
                props.setSnackError('Unexpected error happened!');
            }
        })
        .catch(() => {
            props.setSnackError('Some unexpected error happened');
        })
    }

    return (
        <PopOver fullWidth maxWidth="sm" onClose={props.onClose} open={props.open} >
            <div className="create-alert-container">
                <div className="create-alert-container-header">
                    <span>Create Alerts</span>
                </div>
                <div className="create-alert-container-form">
                    <FormControl required fullWidth className="forms-text-field" variant="outlined">
                        <InputLabel htmlFor="component-outlined">Alert Name</InputLabel>
                        <OutlinedInput id="component-outlined" value={values.alertName} onChange={(e) => handleChange('alertName', e.target.value)} label="Alert Name" />
                    </FormControl>
                    <FormControl required fullWidth className="forms-text-field" variant="outlined">
                        <InputLabel htmlFor="component-outlined">BA Number</InputLabel>
                        <OutlinedInput id="component-outlined" value={values.ba_number} onChange={(e) => handleChange('ba_number', e.target.value)} label="BA Number" />
                    </FormControl>
                    <Dropdown fullWidth value={values.fieldName} handleChange={handleChange} propName='fieldName' setNone name="TriggerField" options={['Kilometers', 'EFC', 'TM_1', 'TM_2']}/>
                    <FormControl required fullWidth className="forms-text-field" variant="outlined">
                        <InputLabel htmlFor="component-outlined">Last Value</InputLabel>
                        <OutlinedInput id="component-outlined" value={values.lastValue} onChange={(e) => handleChange('lastValue', e.target.value)} label="Last Value" />
                    </FormControl>
                    <FormControl required fullWidth className="forms-text-field" variant="outlined">
                        <InputLabel htmlFor="component-outlined">Next Value</InputLabel>
                        <OutlinedInput id="component-outlined" value={values.nextValue} onChange={(e) => handleChange('nextValue', e.target.value)} label="Next Value" />
                    </FormControl>
                </div>
                <div className="create-alert-container-button">
                    <CustomButton className="forms-submit-button" color="primary" size="large" text="Create" onClick={handleClick}/>
                </div>
            </div>
        </PopOver>
    )
}

const mapDispatchToProps = (dispatch) => ({
    setSnackError: (payload) => dispatch(setSnackError(payload)),
    setSnackSuccess: (payload) => dispatch(setSnackSuccess(payload)),
    setSnackWarning: (payload) => dispatch(setSnackWarning(payload)),
    setSnackClose: () => dispatch(setSnackClose()),
});

export default connect(null, mapDispatchToProps)(CreateAlert);