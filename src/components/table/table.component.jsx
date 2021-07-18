import React, {useState, useEffect} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './table.styles.scss';

const Table = (props) => {
    const [rows, setRows] = useState([]);
    const fields = ["SNO", "ID", "BA NO", "CDR", "DRIVER", "OPER", "TM 1", "TM 2", "DEMAND", "FAULT", "REMARKS"]
    const columns = fields.map((item, index) => {
        return {
            field: item.toLowerCase().replaceAll(' ', '_'),
            headerName: item.toUpperCase(),
            editable: index === 0 ? false : true,
            sortable: false,
            width: index === 0 ? 70: 150,
            hide: index === 1 ? true : false,
        }
    })

    useEffect(() => {
        fetch(`/api/categories/${props.selected}`, {
            headers: {
                'Authorization': props.token,
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.success) {
                const rowData = response.success.map((row, index) => {
                    return {
                        sno: index+1,
                        id: row[0],
                        ba_no: row[1],
                        cdr: row[2],
                        driver: row[3],
                        oper: row[4],
                        tm_1: row[5],
                        tm_2: row[6],
                        demand: row[7],
                        fault: row[8],
                        remarks: row[9]
                    }
                })
                setRows(rowData);
            }
        })
    }, [props.reRender, props.selected])

    return (
    <div className="table">
        <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            loading={false}
            checkboxSelection
            disableColumnMenu
            disableSelectionOnClick
            hideFooterPagination
            onRowSelected={({isSelected, data}) => {
                props.handleSelected(isSelected, data);
            }}
            onSelectionModelChange={({selectionModel}) => {
                props.setSelected(selectionModel);
            }}
            selectionModel={props.selectionModel}
        />
    </div>
  );
}

export default Table;