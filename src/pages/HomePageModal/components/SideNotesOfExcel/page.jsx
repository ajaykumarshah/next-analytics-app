// components/ExcelDataTypes.js
import React from 'react';
import styles from './SideNotesOfExcel.module.css'; // Import the CSS module
import { notesWhileUploadingExcelData } from '@/static/media/images/data/staticData';
const SideNotesOfExcel = () => {


    return (
        <div className={styles.container}>
            <h4 className={styles.heading}>Data Types for Excel Charts</h4>
            <ul className={styles.list}>
                {notesWhileUploadingExcelData.map((item, index) => (
                    <li key={index} className={styles.item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default SideNotesOfExcel;
