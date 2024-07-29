
import { Button, Divider } from 'antd';
import Link from 'next/link';
import React, { useCallback } from 'react';
import SideNotesOfExcel from '../SideNotesOfExcel/page';
import ExcelUpload from "../ExcelUpload/page"
import  "../../HomePageModal.scss"
import { redirect } from 'next/navigation';

export default (props)=>{

    const continueWithSampleDataClick = useCallback(() => {
        redirect("/querypage")
    }, []);

    return (<div className="upload-and-notes-container">
        <div className="upload-container">
            <ExcelUpload {...props} />
            <Divider>Or</Divider>
            <div className="sample-container">
                <Link onClick={continueWithSampleDataClick} href={"/querypage"} >
                    <Button onClick={continueWithSampleDataClick}>
                        Continue with sample data
                    </Button>
                </Link>
                <p>
                    <Link onClick={continueWithSampleDataClick} href={"/preview"} >
                        preview sample data
                    </Link>
                </p>
            </div>
        </div>
        <div className="notes-container">
            <SideNotesOfExcel />
        </div>
    </div>
)
}





