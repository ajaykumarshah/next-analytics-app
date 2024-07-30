"use client"
import { addSampleDataToAnalyse } from '@/redux/reducers/addDataToAnalyse';
import React, { useEffect } from 'react';
import getDefaultSampleExcelFromDB from '../api/getDefaultSampleExcelFromDB';
import withReduxProvider from '../ReduxStoreProvider';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@/utils/Loader';
import TableData from './components/TableData';
import TableDataWrapper from './components/TableDataWrapper';

const PreviewExcelData = () => {
    const excelData = useSelector(state => state.excelData)
    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            const excel = await getDefaultSampleExcelFromDB();
            dispatch(addSampleDataToAnalyse(JSON.parse(excel)));
        })()
    }, [])
    let contentToReturn;
    switch (excelData.status) {
        case "fetching":
            contentToReturn = <Loader />
            break;
        case "fetched":
            contentToReturn = (<TableDataWrapper >
                <TableData excelData={excelData} />
            </TableDataWrapper>)
        default:
            break;
    }
    return <div style={{ margin: "10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {contentToReturn}
    </div>
}
export default withReduxProvider(PreviewExcelData)