import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './table-detail.styles.scss';

const TableDetail = ({selectedRow, keys}) => {
    const rows = keys.map(key => {
        return {
            key: key.label,
            value: selectedRow[key.value],
        }
    });

    return (
        <div className="table-detail-container">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableBody>
                    {
                        selectedRow.id ?
                            rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">{row.key.toUpperCase()}</TableCell>
                                    <TableCell style={{backgroundColor: 'azure'}} align="right">{row.value}</TableCell>
                                </TableRow>
                            )) :
                            null
                    }
                    </TableBody>
                </Table>
            </TableContainer>  
        </div>
    );
}

export default TableDetail;