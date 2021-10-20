import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { setSelectedTab } from './custom-tabs.actions';

const ScrollableTabs = (props) => {
  const [tabs, setTabs] = useState([]);
  useEffect(() => {
    if(props.token) {
      fetch(`/api/tabs`, {
      headers: {
          'Authorization': props.token,
      }
    })
    .then(response => response.json())
    .then(response => {
        if(response.success) {
            setTabs(response.success);
        }
    })
    }
  }, [props.token])

  const handleChange = (event, newValue) => {
    props.setSelectedTab({value: newValue, name: tabs[newValue], formOpen: false})
  };

  return (
    <Box sx={{ }}>
      <Tabs
        value={props.selectedTab.value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={true}
      >
        {
            tabs.map(tab => (<Tab label={tab} />))
        }
      </Tabs>
    </Box>
  );
}

const mapStateToProps = state => ({
  selectedTab: state.selectedTab,
})

const mapDispatchToProps = dispatch => ({
  setSelectedTab: (payload) => dispatch(setSelectedTab(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ScrollableTabs);