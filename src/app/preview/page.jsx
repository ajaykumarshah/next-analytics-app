import PreviewExcelData from '@/pages/PreviewExcelData';
import { Loader } from '@/utils/Loader';
import React, { Suspense } from 'react';

export default ()=>{
    return <>
      <Suspense  fallback={<Loader />}>
        <PreviewExcelData />
      </Suspense>
    </>
}