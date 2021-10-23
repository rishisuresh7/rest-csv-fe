import React from 'react';
import {connect} from 'react-redux';
import ScrollableTabs from '../components/custom-tabs/custom-tabs.component';
import View from '../components/view/view.component';
import './tabs-page.styles.scss';

const TabsPage = (props) => {
    return (
        <div className="tabs-page-container">
            <ScrollableTabs token={props.token} />
            <View token={props.token} type="display" apiType={ props.selectedTab === "Demands" ? "demands" : "vehicles"} />
        </div>
    )
}

const mapStateToProps = state => ({
    selectedTab: state.selectedTab.name,
})

export default connect(mapStateToProps)(TabsPage);