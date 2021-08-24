import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './table-detail.styles.scss';

const TableDetail = ({selectedRow}) => {
    const rows = [];
    for( let key in selectedRow) {
        if (key != 'id') {
            rows.push({key, value: selectedRow[key]})
        }
    }

    return (
        <div className="table-detail-container">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableBody>
                    {
                        rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">{row.key.toUpperCase()}</TableCell>
                                <TableCell style={{backgroundColor: 'azure'}} align="right">{row.value}</TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>  
        </div>
    );
}

export default TableDetail;