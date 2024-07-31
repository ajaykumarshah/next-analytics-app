"use client";
import React, { useMemo, useState } from "react";
import QueryTextArea from "./QueryTextArea";
import RecentSearches from "./RecentSearches";
import SampleSearches from "./SampleSearches";
import styles from "./querypage.module.css";
import { useSelector } from "react-redux";
import withReduxProvider from "../ReduxStoreProvider";
import LineChart from "../Charts/LineCharts/page";
import getDataFromSampleSuggestion from "../api/getDataFromSampleSuggestion";
import getDataFromTypedQuery from "../api/getDataFromTypedQuery";
import useBeforeUnload from "@/customHooks/useBeforeUnload";
import { deleteExcelFromMongo } from "../api/deleteExcelFromMongo";
import { Divider } from "antd";
import calculateSuggestionQueries from "@/utils/calculateSuggestionQueries";
import ChatComponent from "../ChatComponent";
import { generativeAiRequest } from "../api/generativeAiRequest";
const QueryPage = () => {

    const [searchBoxOnFocus, setSearchBoxOnFocus] = useState(false);
    const [typedQuery, setTypedQuery] = useState("");
    const [dd, setDd] = useState([]);
    const [recentQueries,setRecentQueries]=useState([])
    const [dataAnalysing,setDataAnalysing]=useState(false)
    const [insightsDataObj,setInsightsData]=useState("")

    const {sampleQueries = [],keywordsOfExcel,manualySelectedExcelDocumnetId} = useSelector((state) => {
        return {
            ...state.defaultQueries,
            keywordsOfExcel: state.excelKeywords?.keywords || {},
            manualySelectedExcelDocumnetId:state.excelData.manualySelectedExcelDocumnetId
        };
    });
    useBeforeUnload(()=>{deleteExcelFromMongo(manualySelectedExcelDocumnetId)})

    const suggestionClick = async (suggestion) => {
        setDataAnalysing(true)
        setTypedQuery(suggestion);
        setSearchBoxOnFocus(false);
        const data = await getDataFromSampleSuggestion(suggestion,manualySelectedExcelDocumnetId,keywordsOfExcel);
        setDd(data);
        const insightsOfData=await generativeAiRequest.getInsightsOfData(data)
        setInsightsData(insightsOfData);
        console.log("00000000000000000",insightsOfData);
        setRecentQueries([...new Set([suggestion,...recentQueries])].slice(0,11))
        setDataAnalysing(false)
    };
    const searchQueryClicked = async (query) => {
        setDataAnalysing(true)
        setSearchBoxOnFocus(false);
        const data = await getDataFromSampleSuggestion(query,manualySelectedExcelDocumnetId,keywordsOfExcel);
        setDd(data);
        const insightsOfData=await generativeAiRequest.getInsightsOfData(data)
        console.log("222222222222222222",insightsOfData);

        setInsightsData(insightsOfData);
        setRecentQueries([...new Set([query,...recentQueries])].slice(0,11))
        setDataAnalysing(false)
        setTypedQuery(query);
    };
    const handleClickOnRecentSearches=(query)=>{
       if(sampleQueries.includes(query)){
        suggestionClick(query);
        return ;
       }
       searchQueryClicked(query)
    }

    const insights=useMemo(()=>{
        const isHTMLContains=insightsDataObj.includes("div") || insightsDataObj.includes("p")
        if(isHTMLContains && dd.length){
            return insightsDataObj.slice(insightsDataObj.indexOf("<div"),insightsDataObj.lastIndexOf("</div")+6).replaceAll("\n","")
        }
        if(!dd.length){
            return "<span>No Insights Available</span>"
        }
        return "<span>Some technical issues.</span>"
    },[insightsDataObj])
    


   
    return (
        <>
            <div
                className={
                    searchBoxOnFocus
                        ? styles.query_page_main_active
                        : styles.query_page_main
                }
            >
                <div>
                    <QueryTextArea
                        setSearchBoxOnFocus={setSearchBoxOnFocus}
                        typedQuery={typedQuery}
                        searchQueryClicked={searchQueryClicked}
                        searchBoxOnFocus={searchBoxOnFocus}
                        setTypedQuery={setTypedQuery}
                    />
                </div>
                {searchBoxOnFocus ? (
                    <div >
                        <div className={styles.recent_sample_suggestion_container}>
                             <span>Recents</span>
                             <span>Suggestions</span>
                        </div>
                        <div className={styles.suggestionContainer}>
                        <RecentSearches recentQueries={recentQueries} handleClickOnRecentSearches={handleClickOnRecentSearches} />
                        <Divider  type="vertical"  style={{top:"-2.06em",height:"23.9em"}}/>
                        <SampleSearches
                            sampleQueries={calculateSuggestionQueries({suggestions:sampleQueries,typedQuery,excelKeywords:keywordsOfExcel})}
                            suggestionClick={suggestionClick}
                        />
                        </div>
                    </div>
                ) : null}
            </div>
            <div><ChatComponent /></div>
            <div className={styles.all_charts_conatiners}>
                <div style={{width:"70%"}}>
                  <LineChart typedQuery={typedQuery} dataAnalysing={dataAnalysing} dd={dd} type={"column"} />
                </div>
                <div className={styles.insights_container}  style={{width:"30%"}} dangerouslySetInnerHTML={{__html: insights}}>
                     
                </div>
                <div>
                  {/* {getIn()} */}
                </div>
            </div>
        </>
    );
};

export default withReduxProvider(QueryPage);
