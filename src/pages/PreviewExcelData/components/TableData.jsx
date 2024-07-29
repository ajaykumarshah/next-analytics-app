import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
const TableData = ({excelData}) => {
    
    const rowData=excelData.data?.table?.slice(0,51)
    const colDefs=Object.keys(excelData.data?.table?.[0] || {}).map(column=>({field:column}))
    
    return (
        <div className="ag-theme-quartz" style={{ height: 550 }}>
            <span>Preview data limit : {rowData.length}/{excelData.data.table.length}</span>
            <AgGridReact rowData={rowData} columnDefs={colDefs} />
        </div>
    );
};

export default TableData;
