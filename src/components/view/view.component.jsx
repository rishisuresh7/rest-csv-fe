import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Dropdown from '../dropdown/dropdown.component';
import TextField from '@material-ui/core/TextField';
import Table from '../table/table.component';
import TableDetail from '../table/table-detail.component';
import CustomButton from '../button/button.component';
import CustomForm from '../form/form.component';
import DynamicCustomForm from '../form/custom-form.component'
import AlertDialog from '../alert-dialog/alert-dialog.component';
import { setSnackError, setSnackSuccess } from '../snack-bar/snack-bar.actions';
import { setFormClose, setFormOpen } from '../custom-tabs/custom-tabs.actions';
import * as utility from '../utility/utility';
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
        fetch(`/api${utility.getAPIRoute(props.selectedTab.name)}`, {
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
        if(!props.selectedTab.name) {
            return
        }
        setSelected([]);
        setSelectedRows([]);
        setRows([]);
        setFilteredRows([]);
        setLoading(true);
        props.token && fetch(`/api${utility.getAPIRoute(props.selectedTab.name, {squ: search.sqn, search: search.query})}`, {
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
                const rowData = utility.getFormattedRows(props.selectedTab.name, response.success);
                setRows(rowData);
                setFilteredRows(rowData);
                setLoading(false);
            }
        })
    }, [props.token, rerender, props.selectedTab, search.sqn])

    const selectedDetails = utility.getHeaders(props.selectedTab.name);
    const keys = [...selectedDetails.headers, ...selectedDetails.selectedRowKeys];
    const checkedRow = rows.find(item => selected.includes(item.id)) || {};
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
                    <>
                        {/* <CustomForm
                            keys={keys}
                            selectedTab={props.selectedTab.name}
                            token={props.token}
                            setRerender={setRerender}
                            isUpdate={selected.length > 0}
                            data={rows.find(({id}) => selected.includes(id))}
                            handleFormOpen={props.setFormClose}
                            formType={props.selectedTab.name === "Demands" ? "demands" : "categories"}
                            setLoading={setLoading}
                        /> */}
                        <DynamicCustomForm
                            keys={keys}
                            selectedTab={props.selectedTab.name}
                            token={props.token}
                            setRerender={setRerender}
                            isUpdate={selected.length > 0}
                            data={rows.find(({id}) => selected.includes(id))}
                            handleFormOpen={props.setFormClose}
                            setLoading={setLoading}
                        />
                    </>
                    :
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
                                headers={selectedDetails.headers}
                                rows={filteredRows}
                                loading={loading}
                                selectionModel={selected}
                                handleSelected={handleSelected}
                                setSelected={setSelected}
                            />
                            <TableDetail
                                keys={keys}
                                selectedRow = {checkedRow}
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