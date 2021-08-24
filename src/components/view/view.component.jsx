import React, {useState, useEffect} from 'react';
import Dropdown from '../dropdown/dropdown.component';
import TextField from '@material-ui/core/TextField';
import Table from '../table/table.component';
import TableDetail from '../table/table-detail.component';
import CustomButton from '../button/button.component';
import CustomForm from '../form/form.component';
import CustomSnackbar from '../snack-bar/snack-bar.component';
import './view.styles.scss';

const View = (props) => {
    const [selected, setSelected] = useState([]);
    const [snackState, setSnackState] = useState({
        open: false,
        message: '',
        severity: '',
        onClose: () => {
            setSnackState({...snackState, open: false})
        }
    });
    const [rerender, setRerender] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rows, setRows] = useState([]);
    const handleSelected = (isSelected, data) => {
        const newRows = isSelected ? [...selectedRows, data] : selectedRows.filter(({id}) => id !== data.id);
        setSelectedRows(newRows);
    }
    const handleDelete = () => {
        const deleteRows = selected.map(id => parseInt(id));
        fetch(`/api/${props.apiType}`, {
            method: 'DELETE',
            body: JSON.stringify({ids: deleteRows}),
            headers: {
                'Authorization': props.token,
            }
        })
        .then(response => response.json())
        .then((response) => {
            if (response.success) {
                setSelected([]);
                setRerender(!rerender);
                setSelectedRows([]);
            }
            setSnackState({
                ...snackState,
                open: true,
                message: response.success ? 'Deleted successfuly' : 'Some unexpected error happened',
                severity: response.success ? 'success' : 'error',
            })
        })
        .catch(() => {
            setSnackState({
                ...snackState,
                open: true,
                message: 'Some unexpected error happened',
                severity: 'error',
            })
        })
    }

    useEffect(() => {
        if (props.formOpen) {
            return
        }
        fetch(`/api/${props.apiType}`, {
            headers: {
                'Authorization': props.token,
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.success) {
                const rowData = response.success.map((row, index) => {
                    return (props.apiType !== "demands" ? {
                        sno: index+1,
                        id: row[0],
                        sqn: row[1],
                        vehicle_type: row[2],
                        ba_no: row[3],   
                        type: row[4],
                        kilometeres: row[5],
                        engine_hours: row[6],
                        efc: row[7],
                        tm_1: row[8],
                        tm_2: row[9],
                        cms_in: row[10],
                        cms_out: row[11],
                        series_inspection: row[12],
                        tag_op: row[13]
                    } : {
                        sno: index + 1,
                        id : row[0],
                        sqn: row[1],
                        vehicle_type: row[2],
                        ba_no: row[3],
                        type: row[4],
                        equipment_demanded: row[5],
                        depot: row[6],
                        demand_number: row[7],
                        control_number: row[8],
                        status: row[9]
                    })
                })
                setRows(rowData);
            }
        })
    }, [props.formOpen, rerender])

    return (
        <div className="view-container">
            <CustomSnackbar {...snackState} />
            {
                props.formOpen ? <CustomForm token={props.token} setRerender={setRerender} isUpdate={selected.length > 0} data={rows.find(({id}) => selected.includes(id))} handleFormOpen={props.setFormOpen} formType={props.apiType} snackState={snackState} setSnackState={setSnackState} /> :
                    <React.Fragment>
                        <div className="view-filters">
                            <Dropdown type="VEH" name="Vehicle Type" options={['A', 'B', 'OTHERS', 'ALL']}/>
                            <Dropdown type="SQN" name="Squadron" options={['A', 'B', 'C', 'HQ', 'ALL']}/>
                            {props.type === "display" ? <TextField id="outlined-basic" label="Search" variant="outlined" /> : null}
                        </div>
                        <div className="view-buttons">
                            {
                                selected.length <= 1 ? <CustomButton className="view-button" onClick={props.setFormOpen} color="primary" text={selected.length ? "Modify" : "Add"} /> : null
                            }
                            {
                                selected.length ? <CustomButton className="view-button" onClick={handleDelete} color="secondary" text="Delete" /> : null
                            }
                        </div>
                        <div className="view-details">
                            <Table rows={rows} selectionModel={selected} handleSelected={handleSelected} setSelected={setSelected} />
                            <TableDetail selectedRow = {rows.find(item => selected.includes(item.id))} />
                        </div>
                    </React.Fragment>
            }
        </div>
    )
}

export default View;