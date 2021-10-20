import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './table.styles.scss';

const Table = (props) => {
    const fields = ["SNO", "ID", "BA NO", "SQN", "TYPE"]
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

    return (
    <div className="table">
        <DataGrid
            autoHeight
            rows={props.rows || []}
            columns={columns}
            loading={props.loading}
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