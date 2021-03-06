import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  largeTableCell: {
    height: 40,
    width: 300,
  },
  input: {
    width: 130,
    height: 40
  },
  largeInput: {
    width: 300,
    height: 40
  }
}));

const CustomTableCell = ({ row, name, onChange, largeTableCell }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={largeTableCell ? classes.largeTableCell : classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={largeTableCell ? classes.largeInput : classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

const EditableTable = props => {
    const [rows, setRows] = useState([]);
    const [previous, setPrevious] = useState({});
    const [initRows, setInitRows] = useState([]);
    const [rerender, setRerender] = useState(false);
    const classes = useStyles();
    const columns = [{name: 'Alert Name'}, {name: 'BA Number'}, {name: 'Vehicle Type'}, {name: 'Trigger Type'}, {name: 'Last Value'},
                    {name: 'Next Value'}, {name: 'Vehicle Remarks'}, {name: 'Alert Remarks'}];

    useEffect(() => {
      fetch('/api/notifications', {
        headers: {
          Authorization: props.token,
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          return resp.json()
        } else {
          throw new Error("Some error happened")
        }
      })
      .then(resp => {
        let resultRows = [];
        let activeIds = [];
        for(let i = 0; i < resp.success.length; i++) {
          activeIds.push(resp.success[i].alertId);
          resultRows.push({...resp.success[i], id: resp.success[i].alertId, isEditMode: false});
        }
        if(!resultRows.length) {
          props.setSnackWarning('No notifications to display!');
        }
        setInitRows(resultRows);
        setRows(resultRows);
        props.setActiveAlerts(activeIds);
      })
      .catch((e) => {
        console.log(e)
        props.setSnackError("Unexpected error in fetching notifications. Please try again later.")
      })
    }, [rerender])

    const handleSave = (row, id) => {
      const initialRow = initRows.filter(item => item.id === id)[0];
      if(!(initialRow.lastValue === row.lastValue && initialRow.nextValue === row.nextValue)) {
        fetch('/api/notifications', {
          method: 'PATCH',
          body: JSON.stringify(row),
          headers: {
            Authorization: props.token,
          }
        })
        .then(resp => {
          if (resp.status === 200) {
            return resp.json()
          } else {
            throw new Error("Some error happened")
          }
        })
        .then(() => {
          props.setSnackSuccess('Alert updated successfully');
          setRerender(true);
        })
        .catch(() => {
          setRows(initRows);
          props.setSnackError("Unexpected error in saving alerts. Please try again later.");
        })
      }
    }

    const onToggleEditMode = id => {
      setRows(state => {
          return rows.map(row => {
            if (row.id === id) {
              if(row.isEditMode) {
                handleSave(row, id);
              }
              return { ...row, isEditMode: !row.isEditMode };
            }
            return row;
          });
      });
    };

    const onChange = (e, row) => {
      if(!previous[row.id]) {
        setPrevious(state => ({ ...state, [row.id]: row }));
      }
      const value = e.target.value;
      const name = e.target.name;
      const { id } = row;
      const newRows = rows.map(row => {
          if (row.id === id) {
            return { ...row, [name]: value };
          }
          return row;
      });
      setRows(newRows);
    };

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" />
                        {
                            columns.map(item => <TableCell align="left"><span style={{fontSize: '16px'}}><b>{item.name}</b></span></TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                        <TableCell className={classes.selectTableCell}>
                            {row.isEditMode ? (
                              <IconButton
                                aria-label="done"
                                onClick={() => onToggleEditMode(row.id)}
                              >
                                <DoneAllIcon />
                              </IconButton>
                            ) : (
                            <IconButton
                                aria-label="delete"
                                onClick={() => onToggleEditMode(row.id)}
                            >
                                <ModeEditOutlineIcon />
                            </IconButton>
                            )}
                        </TableCell>
                        <TableCell align="left" className={classes.tableCell}>{row["alertName"]}</TableCell>
                        <TableCell align="left" className={classes.tableCell}>{row["baNumber"]}</TableCell>
                        <TableCell align="left" className={classes.tableCell}>{row["vehicleType"]}</TableCell>
                        <TableCell align="left" className={classes.tableCell}>{row["fieldName"]}</TableCell>
                        <CustomTableCell {...{ row, name: "lastValue", onChange }} />
                        <CustomTableCell {...{ row, name: "nextValue", onChange }} />
                        <TableCell align="left" className={classes.largeTableCell}>{row["vehicleRemarks"]}</TableCell>
                        <CustomTableCell {...{ row, name: "alertRemarks", onChange, largeTableCell: true }} />
                      </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}


export default EditableTable;
