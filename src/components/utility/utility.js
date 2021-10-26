export const getFormattedRows = (selectedTab, result) => {
    const rowData = result.map((row, index) => {
        return {...row, sno: index + 1}
    })

    return rowData
}

export const getHeaders = (selectedTab ) => {
    switch (selectedTab.toLowerCase()) {
        case 'a vehicle':
            return {
                headers: [
                    {label: 'S.No.', value: 'sno', width: 60},
                    {label: 'BA No.', value: 'baNumber', width: 130},
                    {label: 'SQN', value: 'squadron', type: 'dropdown', options: ['A', 'B', 'C', 'HQ']},
                    {label: 'Type', value: 'type'},
                    {label: 'Vehicle Type', value: 'vehicleType', width: 140},
                ],
                selectedRowKeys: [
                    {label: 'Kilometers', value: 'kilometers', type: 'integer'},
                    {label: 'EFC', value: 'efc', type: 'integer'},
                    {label: 'Engine Hours', value: 'engineHours', type: 'integer'},
                    {label: 'TM 1', value: 'tm1', type: 'date'},
                    {label: 'TM 2', value: 'tm2', type: 'date'},
                    {label: 'MR 1', value: 'mr1', type: 'date'},
                    {label: 'MR 2', value: 'mr2', type: 'date'},
                    {label: 'CMS In', value: 'cmsIn', type: 'date'},
                    {label: 'CMS Out', value: 'cmsOut', type: 'date'},
                    {label: 'Workshop In', value: 'workshopIn', type: 'date'},
                    {label: 'Workshop Out', value: 'workshopOut', type: 'date'},
                    {label: 'FD Firing', value: 'fdFiring', type: 'date'},
                    {label: 'Series Inspection', value: 'seriesInspection'},
                    {label: 'TRG/OP', value: 'trg'},
                    {label: 'Remarks', value: 'remarks', type: 'text'},
                ],
            }
        case 'b vehicle':
        case 'others':
            return {
                headers: [
                    {label: 'S.No.', value: 'sno', width: 60},
                    {label: 'BA No.', value: 'baNumber', width: 130},
                    {label: 'SQN', value: 'squadron', type: 'dropdown', options: ['A', 'B', 'C', 'HQ']},
                    {label: 'Type', value: 'type'},
                    {label: 'Vehicle Type', value: 'vehicleType', width: 140},
                ],
                selectedRowKeys: [
                    {label: 'Kilometers', value: 'kilometers', type: 'integer'},
                    {label: 'CMS In', value: 'cmsIn', type: 'date'},
                    {label: 'CMS Out', value: 'cmsOut', type: 'date'},
                    {label: 'Workshop In', value: 'workshopIn', type: 'date'},
                    {label: 'Workshop Out', value: 'workshopOut', type: 'date'},
                    {label: 'Remarks', value: 'remarks', type: 'text'},
                ],
            }
        case 'demands':
            return {
                headers: [
                    {label: 'S.No.', value: 'sno', width: 60},
                    {label: 'BA No.', value: 'baNumber', width: 130},
                    {label: 'SQN', value: 'squadron', type: 'dropdown', options: ['A', 'B', 'C', 'HQ']},
                    {label: 'Vehicle Type', value: 'vehicleType', width: 120, type: 'dropdown', options: ['A', 'B']},
                    {label: 'Depot', value: 'depot', width: 100},
                    {label: 'Status', value: 'status', width: 100},
                ],
                selectedRowKeys: [
                    {label: 'Equipment Demanded', value: 'equipmentDemanded'},
                    {label: 'Demand Date', value: 'demandDate', type: 'date'},
                    {label: 'Demand Number', value: 'demandNumber'},
                    {label: 'Control Date', value: 'controlDate', type: 'date'},
                    {label: 'Control Number', value: 'controlNumber'},
                ],
            }
        case 'acsfp':
            return {
                headers: [
                    {label: 'S.No.', value: 'sno', width: 60},
                    {label: 'Name', value: 'name', width: 150},
                    {label: 'Regd. Number', value: 'registeredNumber', width: 150},
                    {label: 'Quantity Held', value: 'quantityHeld', width: 150, type: 'integer'},
                    {label: 'Quantity Auth', value: 'quantityAuth', width: 150, type: 'integer'},
                ],
                selectedRowKeys: [
                    {label: 'Year of proc', value: 'yearOfProc', type: 'integer'},
                    {label: 'Cost', value: 'cost', type: 'integer', step: '0.01'},
                    {label: 'Quantity Ser', value: 'quantityServed', type: 'integer'},
                    {label: 'FWD TO', value: 'forwardTo'},
                    {label: 'Demand Details', value: 'demandDetails'},
                    {label: 'Remarks', value: 'remarks', type: 'text'},
                ],
            }
        default:
            return {
                headers: [],
                selectedRowKeys: []
            }
    }
}

export const getAPIRoute = (selectedTab, params) => {
    let queryString = '', i = 0;
    switch(selectedTab.toLowerCase()) {
        case 'a vehicle':
            for(let key in params) {
                if(i === 0 ) {
                    queryString = '?'
                    i++
                } else {
                    queryString += '&'
                }
                queryString += `${key}=${params[key]}`
            }
            return '/vehicles/avehicle' + queryString;
        case 'b vehicle':
        case 'others':
            for(let key in params) {
                if(i === 0 ) {
                    queryString = '?'
                    i++
                } else {
                    queryString += '&'
                }
                queryString += `${key}=${params[key]}`
            }
            return '/vehicles/bvehicle' + queryString;
        case 'acsfp':
            return '/acsfp';
        case 'demands':
            for(let key in params) {
                if(key === 'search') {
                    continue;
                }
                if(i === 0 ) {
                    queryString = '?'
                    i++
                } else {
                    queryString += '&'
                }
                queryString += `${key}=${params[key]}`
            }
            return '/demands' + queryString;
    }
}