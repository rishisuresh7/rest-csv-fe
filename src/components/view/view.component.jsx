import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Dropdown from '../dropdown/dropdown.component';
import TextField from '@material-ui/core/TextField';
import Table from '../table/table.component';
import TableDetail from '../table/table-detail.component';
import CustomButton from '../button/button.component';
import CustomForm from '../form/form.component';
import AlertDialog from '../alert-dialog/alert-dialog.component';
import { setSnackError, setSnackSuccess } from '../snack-bar/snack-bar.actions';
import { setFormClose, setFormOpen } from '../custom-tabs/custom-tabs.actions';
import './view.styles.scss';

const View = (props) => {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({
        sqn: 'ALL',
        query: '',
    });
    const [open, setOpen] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const handleSelected = (isSelected, data) => {
        const newRows = isSelected ? [...selectedRows, data] : selectedRows.filter(({id}) => id !== data.id);
        setSelectedRows(newRows);
    }
    const handleChange = (prop, value) => {
        setSearch({...search, [prop]: value})
        if (prop === 'query') {
            const data = value ? rows.filter(item => item.ba_no && item.ba_no.includes(value)) : rows;
            setFilteredRows(data);
        }
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
                setLoading(true);
                setRerender(!rerender);
                setSelectedRows([]);
                props.setSnackSuccess('Deleted successfuly');
            } else {
                props.setSnackError('Some unexpected error happened');
            }
        })
        .catch(() => {
            props.setSnackError('Some unexpected error happened');
        })
        setOpen(false);
    }

    useEffect(() => {
        if (props.selectedTab.formOpen) {
            return
        }
        setSelected([]);
        setSelectedRows([]);
        setRows([]);
        setFilteredRows([]);
        setLoading(true);
        const getVehicleName = (vehicleType) => {
            if(vehicleType.includes('A')) {
                return 'A'
            } else if (vehicleType.includes('B')) {
                return 'B'
            } else if (vehicleType.toLowerCase() === "others") {
                return 'OTHERS'
            } else {
                return 'ALL'
            }
        }
        const selectedTab = props.selectedTab.name ? getVehicleName(props.selectedTab.name) : 'A';
        props.token && fetch(`/api/${props.apiType}?vehType=${selectedTab}&squ=${search.sqn}`, {
            headers: {
                'Authorization': props.token,
            }
        })
        .then(response => {
            if(response.status === 200) {
                return response.json()
            } else {
                setLoading(false);
                props.setSnackError('Some unexpected error happened');
            }
        })
        .then(response => {
            if(response && response.success) {
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
                        trg_op: row[13],
                        remarks: row[14]
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
                setFilteredRows(rowData);
                setLoading(false);
            }
        })
    }, [props.token, rerender, props.selectedTab, search.sqn])

    return (
        <div className="view-container">
            <AlertDialog
                open={open}
                title="Delete"
                onClose={() => setOpen(false)}
                confirmationText="Delete"
                onConfirm={handleDelete}
                text={`Are you sure you want to delete ${selected.length} record${ selected.length === 1 ? '' : 's'}?`} 
            />
            {
                props.selectedTab.formOpen ?
                    <CustomForm
                        token={props.token}
                        setRerender={setRerender}
                        isUpdate={selected.length > 0}
                        data={rows.find(({id}) => selected.includes(id))}
                        handleFormOpen={props.setFormClose}
                        formType={props.selectedTab.name === "Demands" ? "demands" : "categories"}
                        setLoading={setLoading}
                    /> :
                    <React.Fragment>
                        <div className="view-actions">
                            <CustomButton
                                className="view-button"
                                onClick={props.setFormOpen}
                                color="primary"
                                text={selected.length ? "Modify" : "Add"}
                                disabled={selected.length > 1}
                            />
                            <CustomButton
                                className="view-button"
                                onClick={() => setOpen(true)}
                                color="secondary"
                                text="Delete"
                                disabled={selected.length === 0}
                            />
                            <Dropdown
                                type="SQN"
                                value={search.sqn}
                                propName="sqn"
                                handleChange={handleChange}
                                name="Squadron"
                                options={['A', 'B', 'C', 'HQ', 'ALL']}
                            />
                            {props.type === "display" ?
                                <TextField
                                    id="outlined-basic"
                                    value={search.query}
                                    onChange={(e) => handleChange('query', e.target.value)}
                                    label="Search"
                                    variant="outlined"
                                /> : null}
                        </div>
                        <div className="view-details">
                            <Table
                                rows={filteredRows}
                                loading={loading}
                                selectionModel={selected}
                                handleSelected={handleSelected}
                                setSelected={setSelected}
                            />
                            <TableDetail
                                selectedRow = {rows.find(item => selected.includes(item.id))}
                            />
                        </div>
                    </React.Fragment>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    selectedTab: state.selectedTab,
})

const mapDispatchToProps = (dispatch) => ({
    setSnackSuccess: (payload) => dispatch(setSnackSuccess(payload)),
    setSnackError: (payload) => dispatch(setSnackError(payload)),
    setFormOpen: () => dispatch(setFormOpen()),
    setFormClose: () => dispatch(setFormClose()),
});

export default connect(mapStateToProps, mapDispatchToProps)(View);