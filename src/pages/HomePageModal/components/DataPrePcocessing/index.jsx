import React from 'react';
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional Theme applied to the Data Grid
import { Checkbox, Skeleton, Tag, Tooltip } from 'antd';
import "./style.scss"


const tagColoresObj={"string":"green","number":"blue","date":"cyan"}   
const dataTypesObj={"string":"text","number":"number","date":"date"}   

const CustomHeader = ({ checkedHeader, props, setCheckedHeader }) => {
    console.log(props);
    const {type,name="Fill with"}=props.column?.colDef?.detailsOfColumn||{}
    return (
        <div className='header-container'>
            <Tooltip title={name}><span>{name.slice(0,12)+(name.length>11?"...":"")}</span></Tooltip>
            
            {type?<Tag color={tagColoresObj[type]}>{dataTypesObj[type]}</Tag>:null}
        </div>
    );
};

const RowCellRendrer = ({
    props,
    columnRowCheckedStatus,
    checkedHeader,
    setRowsChecked,
    columnWithStasticsDetailsInProg,
    columnWithStasticsDetails 
}) => {




    const colId=props.colDef.detailsOfColumn.field ||  props.column.colId
    const {key,content}= props.data.item || {}
    let contentToReturn=""


    const handleCheckBoxchanges=()=>{

    }

    if(colId=="fillWith"){
       contentToReturn=props.data.item.content
    }
    else if(key=="delete"){
        contentToReturn="delete"
    }
    else{
        const val=columnWithStasticsDetails?.[key]?.[colId]
        const contemtToRender=String(val).slice(0,10)+(String(val).length>9?"...":"")
        contentToReturn=val?<Checkbox  checked={false} onChange={handleCheckBoxchanges}><Tooltip title={val} >  <span>{contemtToRender}</span> </Tooltip></Checkbox>:"_______"
    }
    console.log(colId,contentToReturn);
    return <>{columnWithStasticsDetailsInProg && colId!="fillWith"?<Skeleton active paragraph={{rows:1}} />:contentToReturn}</>
};


const DataPrePcocessing = ({  uploadedFileObj,checkedColumns,activeSheet}) => {


    const {details:sheetsData,columnWithStasticsDetails,columnWithStasticsDetailsInProg}=uploadedFileObj
    const cold=sheetsData.filter(obj=>obj.sheetName===activeSheet)[0].columns.filter(obj=>checkedColumns.includes(obj.name))
    const columnDefs = [{sheetName:"Fill with",field:"fillWith"},...cold].map((obj,index) => ({
        headerName: obj.name,
        field: obj.name,
        detailsOfColumn:obj,
        headerComponent: (cellProps) => (
            <CustomHeader
               
                props={cellProps}
                
            />
        ),
        headerHeight:50,
        cellRenderer: (cellProps) => (
            <RowCellRendrer
                props={cellProps}
                columnWithStasticsDetailsInProg={columnWithStasticsDetailsInProg}
                columnWithStasticsDetails={columnWithStasticsDetails}
            />
        ),
        flex: 1,
        ...(index==0)?{minWidth: 255}:{minWidth:120,margin:"4px"},
        ...(index==0)?{pinned: 'left'}:{}

    }));
    const rowData=getRowData(cold)
    
    return <div
        className="ag-theme-balham"
        id='data-processing-container'
        style={{
            height: "420px",
            width: "100%",
        }}
    >
        <AgGridReact  getRowHeight={()=>35} columnDefs={columnDefs} rowData={rowData}></AgGridReact>
    </div>
}


const getRowData=(colArrWithDataTypes=[])=>{

    const fillWithData=[{content:"Delete row",key:"delete"},{content:"Max value of column",key:"max"},{content:"Min value of column",key:"min"},{content:"Avg value of column",key:"avg"},{content:"Med value of column",key:"med"},{content:"Max occurred value",key:"maxOccured"},{content:"Min occurred value",key:"minOccured"}]
    
    let arr=[]
    fillWithData.forEach((item,index)=>{
        arr.push({item,colArrWithDataTypes})
    })
    return arr


}

export default DataPrePcocessing