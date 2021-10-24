import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Dropdown from "../dropdown/dropdown.component";
import IconButton from "@material-ui/core/IconButton";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AlertDialog from "../alert-dialog/alert-dialog.component";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650
  },
  tableRow: {
    backgroundColor: '#ff9d9d',
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

const NonEditableTable = props => {
    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [previous, setPrevious] = useState({});
    //const [initRows, setInitRows] = useState([]);
    const classes = useStyles();
    const columns = [{name: 'Alert Name'}, {name: 'BA Number'}, {name: 'Trigger Type'}, {name: 'Last Value'},
                    {name: 'Next Value'}, {name: 'Remarks'}];

    const handleDropdownChange = (key, value, row) => {
      setPrevious(state => ({ ...state, [row.id]: row }));
      setRows(rows.map(item => item.id === row.id ? ({...item, [key]: value}) : item))
    }

    const CustomTableCell = ({ row, name, onChange, largeTableCell }) => {
      const classes = useStyles();
      const { isEditMode } = row;
      return (
        <TableCell align="left" className={largeTableCell ? classes.largeTableCell : classes.tableCell}>
          {isEditMode ? ( name === 'fieldName' ? 
            <Dropdown fullWidth value={row[name]} handleChange={(key, value) => handleDropdownChange(key, value, row)} propName={name} options={['Kilometers', 'EFC', 'TM 1', 'TM 2']}/> :
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

    useEffect(() => {
      fetch('/api/alerts', {
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
        for(let i = 0; i < resp.success.length; i++) {
          resultRows.push({...resp.success[i], isEditMode: false});
        }
        //setInitRows(resultRows);
        if (!resultRows.length) {
            props.setSnackWarning('No alerts to display!')
        }
        setRows(resultRows);
      })
      .catch((e) => {
        props.setSnackError("Unexpected error in fetching notifications. Please try again later.")
      })
    }, [rerender])

    const handleSave = (row, id) => {
      fetch('/api/alerts', {
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
      })
      .catch(() => {
        props.setSnackError("Unexpected error in updating alerts. Please try again later.");
      })
    }

    const handleDelete = () => {
      const deleteId = rows.find(row => row.isEditMode === true);
      fetch('/api/alerts', {
        method: 'DELETE',
        headers: {
          Authorization: props.token,
        },
        body: JSON.stringify({ids: [deleteId.id]}),
      })
      .then(response => response.json())
      .then(() => {
        setRows(rows.filter(row => row.id !== deleteId.id));
        props.setSnackSuccess('Alert deleted successfully');
      })
      .catch(() => {
        props.setSnackError('Some unexpected error happened');
      })
      setAlertOpen(false);
    }

    const onToggleEditMode = (id, saveType) => {
      setRows(state => {
          return rows.map(row => {
            if (row.id === id) {
              if(row.isEditMode) {
                if(saveType === 'delete') {
                  setAlertOpen(true);
                  return row;
                } else if(saveType === 'update') {
                  handleSave(row, id);
                }
              }
              return { ...row, isEditMode: !row.isEditMode };
            }
            return row;
          });
      });
    };

    const onChange = (e, row) => {
      setPrevious(state => ({ ...state, [row.id]: row }));
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
            <AlertDialog
                open={alertOpen}
                title="Delete"
                onClose={() => setAlertOpen(false)}
                confirmationText="Delete"
                onConfirm={handleDelete}
                text={`Are you sure you want to delete 1 alert?`} 
            />
            <Table className={classes.table} aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" />
                        {
                            columns.map(item => <TableCell align="left"><span style={{fontSize: '16px'}}><b>{item.name}</b></span></TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={row.id} className={props.activeAlerts.includes(row.id) ? classes.tableRow : ''}>
                            <TableCell align="center" className={classes.selectTableCell}>
                                {row.isEditMode ? (
                                  <>
                                    <IconButton
                                      aria-label="done"
                                      onClick={() => onToggleEditMode(row.id, 'update')}
                                    >
                                      <DoneAllIcon />
                                    </IconButton>
                                    <IconButton
                                      aria-label="done"
                                      onClick={() => onToggleEditMode(row.id, 'delete')}
                                    >
                                      <DeleteForeverIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => onToggleEditMode(row.id)}
                                >
                                    <ModeEditOutlineIcon />
                                </IconButton>
                                )}
                            </TableCell>
                            <CustomTableCell {...{ row, name: "alertName", onChange }} />
                            <CustomTableCell {...{ row, name: "ba_number", onChange }} />
                            <CustomTableCell {...{ row, name: "fieldName", onChange }} />
                            <CustomTableCell {...{ row, name: "lastValue", onChange }} />
                            <CustomTableCell {...{ row, name: "nextValue", onChange }} />
                            <CustomTableCell {...{ row, name: "remarks", onChange, largeTableCell: true }} />
                      </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default NonEditableTable;