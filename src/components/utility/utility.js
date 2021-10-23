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
                    {label: 'Sl No.', value: 'sno'},
                    {label: 'BA No.', value: 'baNumber', width: 100},
                    {label: 'Squadron', value: 'squadron', width: 130},
                    {label: 'Type', value: 'type'},
                    {label: 'Vehicle Type', value: 'vehicleType', width: 140},
                ],
                selectedRowKeys: [
                    {label: 'Kilometers', value: 'kilometers'},
                    {label: 'EFC', value: 'efc'},
                    {label: 'Engine Hours', value: 'engineHours'},
                    {label: 'TM 1', value: 'tm1'},
                    {label: 'TM 2', value: 'tm1'},
                    {label: 'MR1 1', value: 'mr1'},
                    {label: 'MR2 2', value: 'mr2'},
                    {label: 'CMS In', value: 'cmsIn'},
                    {label: 'CMS Out', value: 'cmsOut'},
                    {label: 'Workshop In', value: 'WorkshopIn'},
                    {label: 'Workshop Out', value: 'WorkshopOut'},
                    {label: 'Series Inspection', value: 'seriesInspection'},
                    {label: 'TRG/OP', value: 'trg'},
                    {label: 'Remarks', value: 'remarks'},
                ],
            }
        case 'b vehicle':
        case 'others':
            return {
                headers: [
                    {label: 'Sl No.', value: 'sno'},
                    {label: 'BA No.', value: 'baNumber', width: 100},
                    {label: 'Squadron', value: 'squadron', width: 130},
                    {label: 'Type', value: 'type'},
                    {label: 'Vehicle Type', value: 'vehicleType', width: 140},
                ],
                selectedRowKeys: [
                    {label: 'Kilometers', value: 'kilometers'},
                    {label: 'Engine Hours', value: 'engineHours'},
                    {label: 'CMS In', value: 'cmsIn'},
                    {label: 'CMS Out', value: 'cmsOut'},
                    {label: 'Workshop In', value: 'WorkshopIn'},
                    {label: 'Workshop Out', value: 'WorkshopOut'},
                    {label: 'Remarks', value: 'remarks'},
                ],
            }
        case 'demands':
            return {
                headers: [
                    {label: 'Sl No.', value: 'sno'},
                    {label: 'BA No.', value: 'baNumber', width: 100},
                    {label: 'Squadron', value: 'squadron', width: 130},
                    {label: 'Vehicle Type', value: 'vehicleType', width: 140},
                ],
                selectedRowKeys: [
                    {label: 'Equipment Demanded', value: 'equipmentDemanded'},
                    {label: 'Depot', value: 'depot'},
                    {label: 'Demand Number', value: 'demandNumber'},
                    {label: 'Demand Date', value: 'demandDate'},
                    {label: 'Control Number', value: 'controlNumber'},
                    {label: 'Control Date', value: 'controlDate'},
                    {label: 'Status', value: 'status'},
                ],
            }
        case 'acsfp':
            return {
                headers: [
                    {label: 'Sl No.', value: 'sno'},
                    {label: 'Name', value: 'name', width: 150},
                    {label: 'Regd. Number', value: 'registeredNumber', width: 150},
                    {label: 'Quantity Held', value: 'quantityHeld', width: 150},
                    {label: 'Quantity Auth', value: 'quantityAuth', width: 150},
                ],
                selectedRowKeys: [
                    {label: 'Year of proc', value: 'yearOfProc'},
                    {label: 'Cost', value: 'cost'},
                    {label: 'Quantity Ser', value: 'quantityServed'},
                    {label: 'FWD TO', value: 'forwardTo'},
                    {label: 'Demand Details', value: 'demandDetails'},
                    {label: 'Remarks', value: 'remarks'},
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