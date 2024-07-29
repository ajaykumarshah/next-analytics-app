import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiGoogleAnalytics, mdiClose } from "@mdi/js";
import styles from "./samplesearches.module.css";
import { Skeleton, Tooltip } from "antd";
const SampleSearches = ({ sampleQueries, suggestionClick }) => {
    const [showSkeletonForSuggestions, setShowSkeletonForSuggestions] =useState(false);
    useEffect(() => {
        setShowSkeletonForSuggestions(true);
        setTimeout(() => {
            setShowSkeletonForSuggestions(false);
        }, 200);
    }, [sampleQueries.length]);
    return (
        <div className={styles.sampleMaincontainer} style={{ width: "45%" }}>
            {showSkeletonForSuggestions ? (
                <Skeleton active paragraph={{ rows: 7 }} />
            ) : (
                sampleQueries.map((query) => {
                    return (
                        <div
                            className={styles.suggestionDiv}
                            onClick={() => suggestionClick(query)}
                        >
                            <span className={styles.suggestionIcon}>
                                <Icon path={mdiGoogleAnalytics} size={0.7} color="blue" />
                            </span>
                            <span
                                onClick={() => suggestionClick(query)}
                                className={styles.suggestionText}
                            >
                                {query}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default SampleSearches;
