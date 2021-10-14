import React, { useState, useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';

const Notifications = (props) => {
  const [dispayItems, setDisplayItems] = useState([]);
  useEffect(() => {
    setDisplayItems(props.items)
  }, [props.items])

  return (
    <Dialog onClose={props.onClose} open={props.open}>
        <List 
            sx={{ width: 600, overflowX: 'hidden', maxWidth: 600, maxHeight: 600, bgcolor: 'background.paper' }}
            subheader={<ListSubheader><span style={{fontSize: 24, fontWeight: 'bolder'}}>Notifications</span></ListSubheader>}
            >
            {
                dispayItems.length > 0 ? dispayItems.map((value, index) => (
                    <ListItem
                        sx={{maxWidth: '100%', paddingRight: 0}}
                        key={value}
                        secondaryAction={ props.disableSecondaryAction ? null: <IconButton> <DeleteIcon /> </IconButton>}
                        >
                        <ListItemText primary={`${index+1}. ${value}`} />
                    </ListItem>)):
                    [
                        <ListItem
                            sx={{maxWidth: '100%', paddingRight: 0}}
                            key={0}
                            >
                            <ListItemText primary="All clear here." />
                        </ListItem>
                    ]
            }
        </List>
    </Dialog>
  );
}

export default Notifications;