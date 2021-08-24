import React, { useState } from 'react';
import CustomButton from '../button/button.component';
import View from '../view/view.component';
import './select.styles.scss'; 

const SelectComponent = (props) => {
    const [selectedView, setSelectedView] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const handleClick = (val, props) => {
        val === "1" ? setSelectedView('display') : setSelectedView('demand');
    }
    const handleBackCloseButton = () => {
        formOpen ?  setFormOpen(!formOpen) : setSelectedView('');
    }
    return (
        <div className="select-container">
            <div className="select-header">
                {
                    selectedView === '' ? null :
                        <span className="select-header-button">
                            <CustomButton variant="outlined"  text="Back" onClick={handleBackCloseButton} />
                        </span>
                }
                <h1>Invincible Management System</h1>
            </div>
            {
                selectedView === '' ?
                    <div className="select-buttons">
                        <CustomButton color="primary" text="Vehicles" onClick={() => handleClick("1", props)} extraLarge />
                        <CustomButton color="secondary" text="Demands" onClick={() => handleClick("2", props)} extraLarge/>
                    </div> :
                null
            }
            {selectedView === "display" ? <View formOpen={formOpen} setFormOpen={setFormOpen} type="display" apiType="categories" /> : null}
            {selectedView === "demand" ? <View formOpen={formOpen} setFormOpen={setFormOpen} type="demand" apiType="demands" /> : null}
        </div>
    )
}

export default SelectComponent;