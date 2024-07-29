import { forwardRef } from "react"
import RowColumnsSelection from "./components/RowColumnsSelection"


export default forwardRef((props,ref)=>{


    return <>
    
      <RowColumnsSelection {...props} ref={ref}/>
    </>
})
