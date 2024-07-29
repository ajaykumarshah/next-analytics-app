"use client";
import React, { useEffect, useRef, useState } from "react";
import { message, Modal } from "antd";
import withReduxProvider from "../ReduxStoreProvider";
import { useDispatch, useSelector } from "react-redux";
import useBeforeUnload from "@/customHooks/useBeforeUnload";
import { deleteExcelFromMongo } from "../api/deleteExcelFromMongo";
import ModalFirstStep from "./components/ModalFirstStep";
import { convertJSONDataIntoDocumnet } from "@/utils/convertJSONDataIntoDocumnet";
import { addManualySelectedExcelIntoMongo } from "@/pages/api/addManualySelectedExcelIntoMongo";
import { addManualySelectedExcelDocumnetId, addSheetsConfig } from "@/redux/reducers/addDataToAnalyse";
import TableSheetConfig from "./components/TableSheetConfig";
import { getTheUploadedFileDetails } from "@/utils/getTheUploadedFileDetails";
import { csvToJSONCoverter } from "@/utils/csvToJSONCoverter";
import { xlsxToJSONConverter } from "@/utils/xlsxToJSONConverter";
import { useRouter } from "next/navigation";

const MODAL_TITLE = "Select excel sheet and columns"

const HomePageModal = () => {
    const dispatch = useDispatch();
    const [uploadedFileObj, setUploadedFile] = useState({ uploaded: false, file: null, jsonData: [], details: {} })
    const [modalStep, setModalStep] = useState("upload")
    const [modalButtonsObj,setModalButtonsObj]=useState({okBTN:{loading:false}})

    const ref=useRef(null)

    const router=useRouter()
    const manualySelectedExcelDocumnetId = useSelector(state => state.excelData.manualySelectedExcelDocumnetId)
    useBeforeUnload(() => { deleteExcelFromMongo(manualySelectedExcelDocumnetId) })


    useEffect(() => {
        if (uploadedFileObj.uploaded == true) {
            getTheUploadedFileDetails.getTheExcelFileDetails({
                file: uploadedFileObj.file,
                callback: (details) => {
                    setUploadedFile({ ...uploadedFileObj, details })
                    setModalStep("tableConfig")
                }
            })
        }
    }, [uploadedFileObj.uploaded])

    const showModalTitle = modalStep == "tableConfig"
    const showModalFooter = modalStep == "tableConfig"
    

    const onFileConvertedIntoJSON=async(json)=>{
        const documentObj = convertJSONDataIntoDocumnet(json)
        const modifiedDoc = { ...documentObj, table: documentObj.table.slice(0, 500) }
        const documentIdObj = await addManualySelectedExcelIntoMongo({ document: modifiedDoc })
        const documentId=JSON.parse(documentIdObj).id
        const tableArr = documentObj.table.slice(500)
        for (let i = 0; i < tableArr.length + 500; i++) {
            await addManualySelectedExcelIntoMongo({ moreTableData: true, documentId, table: documentObj.table.slice(i, i + 500) })
            i += 499;
        }
        dispatch(addManualySelectedExcelDocumnetId(documentId))
        console.log(documentId,"rfbrefrgre");
        message.success("file is ready to run queries.")
        router.push("/querypage")
        setModalButtonsObj({...modalButtonsObj,okBTN:{...modalButtonsObj.okBTN,loading:false}})
        
    }

    const handleProceedClick = async () => {
        let checkedSheet;
        let checkedColumns
        if (ref.current) {
            const childdata=ref.current.getRowColumnSelectionState()
            checkedColumns=[]
            checkedSheet=childdata.checkedHeader
            for(const [key,value] of Object.entries(childdata.rowsChecked[checkedSheet])){
                if(value){
                    checkedColumns.push(key)
                }
            }
            dispatch(addSheetsConfig({activeSheet:checkedSheet,checkedColumns}))
        }
        setModalButtonsObj({...modalButtonsObj,okBTN:{...modalButtonsObj.okBTN,loading:true}})
        const file=uploadedFileObj.file
        const fileName=file.name;
        if (fileName.endsWith('.csv')) {
            csvToJSONCoverter({file,callback:onFileConvertedIntoJSON})       
        } 
        else if (fileName.endsWith('.xlsx')) {
            xlsxToJSONConverter({file,callback:onFileConvertedIntoJSON,checkedSheet,checkedColumns})
        }

    }

    const componentsObj = { upload: { component: ModalFirstStep, props: { setUploadedFile, setModalStep } }, tableConfig: { component: TableSheetConfig, props: { sheetsData: uploadedFileObj.details, handleProceedClick ,ref} } }
    const { component: ComponentToRenderInModal, props: componentToRenderInModalProps } = componentsObj[modalStep]

    return (
        <Modal 
            style={{ top: 70 }} {...(showModalTitle) ? { title: MODAL_TITLE } : {}}
            open={true}  {...(!showModalFooter) ? { footer: null } : {}}
            okText="Proceed" cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ title: "Proceed",loading:modalButtonsObj.okBTN.loading }}
            closable={false}
            width={1000}
            onOk={handleProceedClick}
            
            >
            <div className="modal-div-main-container">
                <ComponentToRenderInModal {...componentToRenderInModalProps} />
            </div>
        </Modal>
    );
};




export default withReduxProvider(HomePageModal);

