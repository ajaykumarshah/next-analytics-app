"use client";
import { useEffect } from 'react';

const useBeforeUnload = ( onConfirm) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave/reload ?. Due to this your uploaded data will be deleted from our store";
      if (onConfirm) {
        onConfirm();
      }
      return "Are you sure you want to leave/reload ?. Due to this your uploaded data will be deleted from our store";
    };
     
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export default useBeforeUnload;
