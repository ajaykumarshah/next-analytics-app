import React from 'react';
import Icon from '@mdi/react';
import { mdiMagnify, mdiClose } from '@mdi/js';
import styles from "./recentsearches.module.css"
import { Tooltip } from 'antd';
const RecentSearches = ({recentQueries,handleClickOnRecentSearches}) => {
    

    return (
        <div style={{ width: "45%" }}>
            
            {recentQueries.map(query => {
                return <div onClick={() => handleClickOnRecentSearches(query)} className={styles.suggestionDiv}>
                    <span className={styles.suggestionIcon}>
                        <Icon path={mdiMagnify} size={0.7} />

                    </span>
                    <span className={styles.suggestionText}>
                        {query}
                    </span>
                    <span className={styles.suggestionDelete} >
                        <Tooltip title="Remove">
                            <Icon path={mdiClose} size={0.7} />
                        </Tooltip>
                    </span>
                </div>

            })}
        </div>
    )
}

export default RecentSearches