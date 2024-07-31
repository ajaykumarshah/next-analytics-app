
// "use server"

const validator=require("validator")
export  const csvToJSONCoverter=({file,callback})=>{
    const reader = new FileReader();
    reader.onload = e => {
      const lines = e.target.result.split('\n');
      const headers = lines[0].split(',');
      const jsonData = [];
      for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            if (typeof values[j] === 'number' || validator.isNumeric(values[j]?.toString() || "")) {
                obj[headers[j] || ""] = values[j]-0;
            }
            else{
                obj[headers[j] ||""] = values[j] || ""
            }
          }
          jsonData.push(obj);
      }
     callback(jsonData);
  };
  
  reader.readAsText(file);
}










