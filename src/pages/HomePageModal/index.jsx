"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { message, Modal, Steps } from "antd";
import withReduxProvider from "../ReduxStoreProvider";
import { useDispatch, useSelector } from "react-redux";
import useBeforeUnload from "@/customHooks/useBeforeUnload";
import { deleteExcelFromMongo } from "../api/deleteExcelFromMongo";
import ModalFirstStep from "./components/ModalFirstStep";
import DataPrePcocessing from "./components/DataPrePcocessing";
import { convertJSONDataIntoDocumnet } from "@/utils/convertJSONDataIntoDocumnet";
import { addManualySelectedExcelIntoMongo } from "@/pages/api/addManualySelectedExcelIntoMongo";
import { addManualySelectedExcelDocumnetId, addSheetsConfig } from "@/redux/reducers/addDataToAnalyse";
import TableSheetConfig from "./components/TableSheetConfig";
import { getTheUploadedFileDetails } from "@/utils/getTheUploadedFileDetails";
import { csvToJSONCoverter } from "@/utils/csvToJSONCoverter";
import { useRouter } from "next/navigation";
import useSocket from "@/customHooks/useSocket";



const MODAL_TITLE = "Select excel sheet and columns"
const modalSteps = ["upload", "tableConfig", "dataPreprocessing"]

const HomePageModal = () => {
    const dispatch = useDispatch();
    const [uploadedFileObj, setUploadedFile] = useState({ uploaded: false, file: null, jsonData: [], details: {}, columnWithStasticsDetails: {}, columnWithStasticsDetailsInProg: true })
    const [modalStep, setModalStep] = useState("upload")
    const [modalButtonsObj, setModalButtonsObj] = useState({ okBTN: { loading: false } })
    const [clientSideRendering,setClientSideRendering]=useState(false)
    const ref = useRef(null)
    const dataPreProcessingComRef=useRef(null)
    const router = useRouter()

    const { manualySelectedExcelDocumnetId, uploadedDataDetails: { checkedColumns = [], activeSheet } } = useSelector(state => (
        {
            manualySelectedExcelDocumnetId: state.excelData.manualySelectedExcelDocumnetId,
            uploadedDataDetails: state.excelData.uploadedDataDetails

        }))
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
        setClientSideRendering(true)
       
    }, [uploadedFileObj.uploaded])


    const showModalTitle = modalStep == "tableConfig"
    const showModalFooter = modalStep == "tableConfig"


    const onFileConvertedIntoJSON = async (json) => {
        const documentObj = convertJSONDataIntoDocumnet(json)
        const modifiedDoc = { ...documentObj, table: documentObj.table.slice(0, 500) }
        const documentIdObj = await addManualySelectedExcelIntoMongo({ document: modifiedDoc })
        const documentId = JSON.parse(documentIdObj).id
        const tableArr = documentObj.table.slice(500)
        for (let i = 0; i < tableArr.length + 500; i++) {
            await addManualySelectedExcelIntoMongo({ moreTableData: true, documentId, table: documentObj.table.slice(i, i + 500) })
            i += 499;
        }
        dispatch(addManualySelectedExcelDocumnetId(documentId))
        console.log(documentId, "rfbrefrgre");
        message.success("file is ready to run queries.")
        router.push("/querypage")
        setModalButtonsObj({ ...modalButtonsObj, okBTN: { ...modalButtonsObj.okBTN, loading: false } })

    }

    const handleProceedClick = async () => {
        let checkedSheet;
        let checkedColumns


    }

    const handleModalStep = useCallback(async () => {
        setModalStep(modalSteps[modalSteps.indexOf(modalStep) + 1])
        if (modalStep == "dataPreprocessing") {
            handleProceedClick()
            return
        }
        else if (modalStep == "tableConfig") {
            if (ref.current) {
                let checkedSheet;
                let checkedColumns
                const childdata = ref.current.getRowColumnSelectionState()
                checkedColumns = []
                checkedSheet = childdata.checkedHeader
                for (const [key, value] of Object.entries(childdata.rowsChecked[checkedSheet])) {
                    if (value) {
                        checkedColumns.push(key)
                    }
                }
                dispatch(addSheetsConfig({ activeSheet: checkedSheet, checkedColumns }))
                setModalButtonsObj({ ...modalButtonsObj, okBTN: { ...modalButtonsObj.okBTN, loading: false } })
                const file = uploadedFileObj.file
                const fileName = file.name;
                if (fileName.endsWith('.csv')) {
                    const data = await csvToJSONCoverter({ file, callback: (json) => setUploadedFile({ ...uploadedFileObj, jsonData: json }) })
                    console.log(data);

                }
                else if (fileName.endsWith('.xlsx')) {
                    // xlsxToJSONConverter({ file, callback: ({ jsonData, columnWithStasticsDetails }) => setUploadedFile({ ...uploadedFileObj, jsonData, columnWithStasticsDetails, columnWithStasticsDetailsInProg: false }), checkedSheet, checkedColumns })

                    const formData = new FormData();
                    formData.append('file', file);   
                    formData.append("checkedSheet",checkedSheet)
                    formData.append("checkedColumns",JSON.stringify(checkedColumns))
                    const response = await fetch('/api/xlsxToJsonConverter', {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json(); 
                    setUploadedFile({ ...uploadedFileObj, ...data.data, columnWithStasticsDetailsInProg: false })

                }

            }
        }
        

    }, [modalStep])

    const componentsObj = {
        upload: { component: ModalFirstStep, props: { setUploadedFile, setModalStep } },
        tableConfig: { component: TableSheetConfig, props: { sheetsData: uploadedFileObj.details, handleProceedClick, ref } },
        dataPreprocessing: { component: DataPrePcocessing, props: { uploadedFileObj, checkedColumns, activeSheet,dataPreProcessingComRef } }
    }
    const { component: ComponentToRenderInModal, props: componentToRenderInModalProps } = componentsObj[modalStep]
     
    return (
        <>
        {clientSideRendering?<Modal
            title={getModalTitle(modalStep)}
            style={{ top: 70 }} 
            // {...(showModalTitle) ? { title: MODAL_TITLE } : {}}
            open={true}  {...(!showModalFooter) ? { footer: null } : {}}
            okText="Proceed" cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ title: "Proceed", loading: modalButtonsObj.okBTN.loading }}
            closable={false}
            width={1100}
            onOk={handleModalStep}
            className="home-page-modal"

        >
            <div className="modal-div-main-container">
                <ComponentToRenderInModal {...componentToRenderInModalProps} />
            </div>
        </Modal>:null}
        </>
    );
};



const getModalTitle = activeModalStep => {
    const stepsObj = { upload: 0, tableConfig: 1, dataPreprocessing: 2 }
    const index=stepsObj[activeModalStep]
    
    return <Steps
        size="small"
        current={index}
        items={[
            {
                title: "Data Upload",
            },
            {
                title: "Data Selection",
            },
            {
                title: "Data Preprocessing",
            },
        ]}
    />
}




export default withReduxProvider(HomePageModal);

