import React, { forwardRef, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { Checkbox, Tag } from "antd";
import { useState,useEffect } from "react";


{/* <Tag color="green">green</Tag>
      <Tag color="cyan">cyan</Tag>
      <Tag color="blue">blue</Tag> */}

const tagColoresObj={"string":"green","number":"blue","date":"purple"}   
const dataTypesObj={"string":"text","number":"number","date":"date"}   

const CustomHeader = ({ checkedHeader, props, setCheckedHeader }) => {
    const handleChange = () => {
        setCheckedHeader(props.displayName);
    };
    return (
        <div>
            <Checkbox
                checked={checkedHeader == props.displayName}
                onChange={handleChange}
            >
                {props.displayName}
            </Checkbox>
        </div>
    );
};

const RowCellRendrer = ({
    props,
    columnRowCheckedStatus,
    checkedHeader,
    setRowsChecked,
}) => {
    const {name:content="",type=""} = props.data[props.column.colId] || {};
    const handleChange = (checkStatus) => {
        setRowsChecked((prev) => ({
            ...prev,
            [props.colDef.field]: {
                ...prev[props.colDef.field],
                [content]: checkStatus.target.checked,
            },
        }));
    };
    return (
        <div>
            {content?<Checkbox
                onChange={handleChange}
                checked={
                    columnRowCheckedStatus[content] && props.colDef.field == checkedHeader
                }
            >
                {content}
            </Checkbox>:null}
            <Tag color={tagColoresObj[type]}>{dataTypesObj[type]}</Tag>
        </div>
    );
};

const RowColumnsSelection = forwardRef((props,ref) => {
    const {sheetsData=[]}=props
    const [checkedHeader, setCheckedHeader] = useState(sheetsData[0]?.sheetName || "");
    const [rowsChecked, setRowsChecked] = useState({});

    
    useEffect(() => {
        const tempObj = {};
        for (const obj of sheetsData) {
            const temp = {};
            for (const column of obj.columns) {
                temp[column.name] = true;
            }
            tempObj[obj.sheetName] = temp;
        }
        setRowsChecked(tempObj);
    }, []);

    useImperativeHandle(ref, () => ({
        getRowColumnSelectionState() {
          return {checkedHeader,rowsChecked};
        }
    }));

    const columnDefs = sheetsData.map((obj) => ({
        headerName: obj.sheetName,
        field: obj.sheetName,
        headerComponent: (cellProps) => (
            <CustomHeader
                checkedHeader={checkedHeader}
                props={cellProps}
                setCheckedHeader={setCheckedHeader}
            />
        ),
        cellRenderer: (cellProps) => (
            <RowCellRendrer
                setRowsChecked={setRowsChecked}
                columnRowCheckedStatus={rowsChecked[obj.sheetName]}
                checkedHeader={checkedHeader}
                props={cellProps}
                setCheckedHeader={setCheckedHeader}
            />
        ),
        flex: 1
    }));

    const rowData = [];
    const maxColumns = Math.max(...sheetsData.map((obj) => obj.columns.length));

    for (let i = 0; i < maxColumns; i++) {
        const row = {};
        sheetsData.forEach((sheet) => {
            row[sheet.sheetName] = sheet.columns[i];
        });
        rowData.push(row);
    }

    return (
        <div
            className="ag-theme-quartz"
            style={{
                height: "350px",
                width: "100%",
            }}
        >
            <AgGridReact columnDefs={columnDefs} rowData={rowData}></AgGridReact>
        </div>
    );
});

export default RowColumnsSelection;
