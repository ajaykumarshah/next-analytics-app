"use client"
import React, { createRef, useEffect, useState } from 'react';
import { Input } from 'antd';
import styles from "./querytextarea.module.css"
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import getSampleQueriesFromDB from '@/pages/api/getSampleQueriesFromDB';
import { useDispatch, useSelector } from 'react-redux';
import { addSampleQueries } from '@/redux/reducers/addDefaultQueries';
import withReduxProvider from '@/pages/ReduxStoreProvider';
import { addKeywords } from '@/redux/reducers/addKeywordsOfExcel';
import { debounce } from '@/utils/debounce';
const { TextArea } = Input

const QueryTextArea = ({ setTypedQuery, typedQuery, setSearchBoxOnFocus, searchQueryClicked ,searchBoxOnFocus}) => {
    const [inputVal,setInputVal]=useState("")
    const maincontainerRef = createRef(null)
    const dispatch=useDispatch()
    const manualySelectedExcelDocumnetId=useSelector(state=>state.excelData.manualySelectedExcelDocumnetId)
   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (maincontainerRef.current && !maincontainerRef.current.contains(event.target)) {
                    setSearchBoxOnFocus(false)
            }
            else {
                setSearchBoxOnFocus(true)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    })
   
    useEffect(()=>{
     
          getSampleQueriesFromDB({tableId:0,documentId:manualySelectedExcelDocumnetId})
          .then(({tempQueries,keywords,_id})=>{
            dispatch(addSampleQueries({tempQueries,_id}))
            dispatch(addKeywords(keywords))
        })
           .catch(err=>{})
            
    },[])



    useEffect(()=>{
        setInputVal(typedQuery)
    },[typedQuery])
   
    return (
        <div className={styles.maincontainer} id="search-maincontainer" ref={maincontainerRef}>
            <TextArea
                rows={1}
                placeholder="Enter your query, e.g: Profit by Sales"
                className={searchBoxOnFocus?styles.textAreaFocused:styles.textArea}
                onPressEnter={(e) => {
                    e.preventDefault();
                    searchQueryClicked(inputVal) }}
                value={inputVal}
                onChange={(e) => {
                    setInputVal(e.target.value)
                    // debounce(()=>{setTypedQuery(e.target.value)},200)()
                    setTypedQuery(e.target.value)
                    
                }}
                suffix={<Icon path={mdiMagnify} size={1} />}
            />
        </div>
    )
}

export default withReduxProvider(QueryTextArea)