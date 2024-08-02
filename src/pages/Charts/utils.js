const calculate_Y_Axis = ({ type, data }) => {

    switch (type) {
        case "cylinder":
            return {
                title: {
                    margin: 20,
                    text: 'Reported cases'
                },
                labels: {
                    skew3d: true
                }
            }
            break;
        case "line":
        case "column":
            return {
                title: {
                    text: 'Value'
                }
            }

        default:
            break;
    }
}

const calculate_X_Axis=({type,data=[]})=>{
    switch (type) {
        case "column":
        case "line":
            return {
                categories: data?.map(obj=>typeof obj._id=="object"?Object.values(obj._id || {})[0]:obj._id),
                // labels:{
                //     overflow:"justify",
                // },
                // margin:20,
                // max:6,
                scrollbar: {
                         enabled: true,
                }
                
              }
        case "cylinder":
            return {
                categories: data?.map(obj=>typeof obj._id=="object"?Object.values(obj._id || {})[0]:obj._id),
                title: {
                    text: 'Age groups'
                },
                labels: {
                    skew3d: true,
                    overflow: 'justify'
                      
                }
            }
        default:
           return {
            labels: {
                // skew3d: true,
                overflow: 'justify'
                  

            }
           }
    }
}


const calculate_Plot_Options = ({ type, data }) => {

    switch (type) {
        case "cylinder":
            return {
                series: {
                    depth: 25,
                    colorByPoint: true,
                    color: '#2563EB'
                }
            }

        default:
            return {
                series: {
                    depth: 25,
                    // colorByPoint: true,
                    color: '#2563EB'
                }
            }
    }
}

const calculate_Chart_Fields=({type,data})=>{
    switch (type) {
        case "column":
            return {
                type,
            //     scrollablePlotArea: {
            //         maxWidth: 700,
            //         scrollPositionX: 1,
            //         marginRight: 100
            //   }
            }; 
        case "line":
            return {
                type,
                scrollablePlotArea: {
                    minWidth: 700,
                    scrollPositionX: 1,
                    marginRight: 100
              }};    
            
        case "cylinder":
            return {
                type,
                options3d: {
                  enabled: true,
                  alpha: 15,
                  beta: 15,
                  depth: 50,
                  viewDistance: 25
              }
              }
    
        default:
            return {type}
    }
}

export { calculate_Chart_Fields,calculate_X_Axis,calculate_Y_Axis ,calculate_Plot_Options}