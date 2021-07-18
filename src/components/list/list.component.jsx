import React, {useState} from 'react';
import { Accordion } from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AccordionActions from '@material-ui/core/AccordionActions';
import Table from '../table/table.component';

const List = (props) => {
    const [selected, setSelected] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [reRender, setRender] = useState(false);
    const handleAddClick = (category) => {
        fetch(`/api/categories/${category}`, {
            method: 'POST',
            body: JSON.stringify([{id: ''}]),
            headers: {
                'Authorization': props.token,
            }
        })
        .then(response => response.json())
        .then(() => {
            setSelectedRows([]);
            setSelected([]);
            setRender(!reRender);
        })
    }

    const handleSaveClick = (category) => {
        if(selectedRows.length !== 0) {
            const payload = selectedRows.map(item => ({
                baNo: item.ba_no,
                ...item
            }))
            fetch(`/api/categories/${category}`, {
                method: 'PATCH',
                body: JSON.stringify(payload),
                headers: {
                    'Authorization': props.token,
                }
            })
            .then(response => response.json())
            .then(response => {
                setSelectedRows([]);
                setSelected([]);
                setRender(!reRender);
            })
        } else {
            alert("Please select rows to save")
        }
    }

    const handleSelected = (isSelected, data) => {
        const newRows = isSelected ? [...selectedRows, data] : selectedRows.filter(({id}) => id !== data.id);
        setSelectedRows(newRows);
    }

    const handleDeleteClick = (category) => {
        if(selected.length !== 0) {
            fetch(`/api/categories/${category}`, {
                method: 'DELETE',
                body: JSON.stringify({ids: selected}),
                headers: {
                    'Authorization': props.token,
                }
            })
            .then(response => response.json())
            .then(() => {
                setSelected([]);
                setSelectedRows([]);
                setRender(!reRender);
            })
        } else {
            alert("Please select items to delete")
        }
    }

    return (
        <Accordion>
            <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <h3>{props.name.toUpperCase()}</h3>
            </AccordionSummary>
            <Divider />   
            <AccordionActions>
                <Button
                    size="small"
                    color="primary"
                    onClick = {(e) => {
                        e.stopPropagation();
                        handleAddClick(props.name);
                    }}
                >
                    Add Row
                </Button>
                <Button
                    size="small"
                    color="primary"
                    onClick = {(e) => {
                        e.stopPropagation();
                        handleSaveClick(props.name);
                    }}
                >
                    Save
                </Button>
                <Button
                    size="small"
                    color="primary"
                    onClick = {(e) => {
                        e.stopPropagation();
                        handleDeleteClick(props.name);
                    }}
                >
                    Delete
                </Button>
            </AccordionActions>
            <AccordionDetails>
                <Table token={props.token} selected={props.name} reRender={reRender} selectionModel={selected} handleSelected={handleSelected} setSelected={setSelected} />
            </AccordionDetails>
        </Accordion>
    );
}

export default List;