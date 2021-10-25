import React, {useState} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './table.styles.scss';

const Table = (props) => {
    const [pageSize, setPageSize] = useState(10);
    const columns = props.headers.map(({label, value, width}) => {
        return {
            field: value,
            headerName: label.toUpperCase(),
            editable: false,
            sortable: false,
            width: width || 80,
        }
    })

    return (
    <div className="table">
        <DataGrid
            rows={props.rows || []}
            columns={columns}
            loading={props.loading}
            checkboxSelection
            disableColumnMenu
            disableSelectionOnClick
            pagination
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 15]}
            onPageSizeChange={({pageSize}) => setPageSize(pageSize)}
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