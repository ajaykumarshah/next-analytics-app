
// import Groq from "groq-sdk"


const { contextForChatBotQuery} = require("@/static/media/images/data/staticData");
const Groq = require("groq-sdk")

// const API_KEY = "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";
const API_KEY="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"

const tempKeys = {
  "Row ID": "number",
  "Discount": "number",
  "Unit Price": "number",
  "Shipping Cost": "number",
  "Customer ID": "number",
  "Customer Name": "string",
  "Ship Mode": "string",
  "Customer Segment": "string",
  "Product Category": "string",
  "Product Sub-Category": "string",
  "Product Container": "string",
  "Product Name": "string",
  "Product Base Margin": "number",
  "Country": "string",
  "State or Province": "string",
  "City": "string",
  "Postal Code": "number",
  "Order Date": "number",
  "Ship Date": "number",
  "Profit": "number",
  "Quantity ordered new": "number",
  "Sales": "number",
  "Order ID": "number"
}
const generativeAiRequest = {
  getSuggestionQueries: async function (keywords = tempKeys) {
    const response = await makeRequestWithPrompt(getPrompt(keywords, "SUGGESTIONS_GENERATIONS"));
    // console.log("this is suggestion", typeof response, response);
    return response
  },
  getDataFromSuggestionClickedQuery: async function (keywords = tempKeys, query, documentId) {
    const additionalParameters={
      temperature: 0.2,
      stream: false,
      response_format: { "type": "json_object"  },
      max_tokens: 250,
    }
    const response = await makeRequestWithPrompt(getPrompt(keywords, "SEARCHED_QUERY_TO_AGGREGATION_QUERY", query, documentId),additionalParameters, true)
    // console.log(query, "this is query");
    // console.log("this is query response", typeof response);
    return response
  },
  getChatBotQueryResponse: async function(userQuery) {
    const additionalParameters={
      temperature: 1,
      stream: false,
      // max_tokens: 1024,
      // top_p: 1,
    }
    // console.log("this is chatbot request",userQuery);
    const response = await makeRequestWithPrompt(getPrompt({}, "CHAT_BOT_USER_QUERY", userQuery),additionalParameters)
    // console.log(response, "this is chatbot response",typeof response);
    return response
  }
  
};

// generativeAiRequest.getDataFromSuggestionClickedQuery(tempKeys, "profit by sales", "669a490523edc0e73f402f85")
generativeAiRequest.getChatBotQueryResponse({},"what is kpis")
export { generativeAiRequest }

async function makeRequestWithPrompt(prompt, additional = {}, parse = false) {
  const groq = new Groq({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
    
  });
  
  const chatCompletion = await groq.chat.completions.create({
    messages: prompt,
    model: "llama3-groq-70b-8192-tool-use-preview",
    ...additional
  });

  if (parse) {
    return JSON.parse(chatCompletion.choices[0].message.content)
  }
  return chatCompletion.choices[0].message.content
};

function getPrompt(keywords, calledCase, query, documentId) {
  let prompt
  let arr = [{ role: "system" }, { role: "user" }]
  switch (calledCase) {
    
    case "SUGGESTIONS_GENERATIONS":

      prompt = `Here is the below pairs of column name and value data type of ${JSON.stringify(keywords)}
               based on above data.
               Intructions:
                1. Use the following JSON format to return you response:
               {{
                 "generated":<trus/false>,
                 "kpis":<["Profit by Sales","Sales by Region"]>,
                 "error":<true/false>
               }}
                2. Need relevant response, don"t responsd ungrounded data.
                3. Atleast count of 20 kpis should be there.
                4. Don"t use any description on response.
                5. Response should be JSON object.
            `
      arr[0]["content"] = "You are an expert Bussiness Analyst of Bussiness Intelligence tool"
      arr[1]["content"] = prompt
      break;


    case "SEARCHED_QUERY_TO_AGGREGATION_QUERY":

      prompt = `
                
                Retrun the query to answer user"s question in 'json' .
                Here is the below pairs of column name and value data type of 
                ${JSON.stringify(keywords)}

                Instructions:
                   1. use this as documentId :${documentId} to crete query.
                   2. You can get the column name and data type from above mentioned JSON.
                   3. follow the below pattern of response.
                   4. Generate the aggregation where the group value should be always val.
                   5. Cross check generated query so that mongodb not throw error in Aggregation Pipeline.

                Note: Cross check generated query so that mongodb not throw error in Aggregation Pipeline.
                  
                You may refrence below given examples.
                1. Que.: What is Sales by Profit?
                Ans.:
                    {
                        "queryType":"aggregate",
                            "query":[
                            {"$match":{"_id":"documentId"}},
                            { "$unwind": "$table" },
                            {"$group": {
                                "_id": "$table.Profit",
                                "val": { "$sum": "$table.Sales" }
                                },
                            },
                            { "$sort" : { "val" : -1 } },
                        ],
                        "queryGenerated": true
                    }
                
                2. Que.:  What is average Profit  by Category?
                Ans.: 
                   {
                        "queryType":"aggregate",
                            "query":[
                            {"$match":{"_id":"documentId"}},
                            { "$unwind": "$table" },
                            {"$group": {
                                "_id": "$table.Category",
                                "val": { "$sum": "$table.Profit" }
                                },
                            },
                            { "$sort" : { "val" : -1 } },
                        ],
                        "queryGenerated": true
                    }
                
                3.Que.: What is sum of Profit by Ship Mode?
                Ans.:
                    {
                        "queryType":"aggregate",
                            "query":[
                            {"$match":{"_id":"documentId"}},
                            { "$unwind": "$table" },
                            {"$group": {
                                "_id": "$table.Ship Mode",
                                "val": { "$sum": "$table.Profit" }
                                },
                            },
                            { "$sort" : { "val" : -1 } },
                        ],
                        "queryGenerated": true
                    }
            
                4.Que.: ${query}
                
                

            `

      arr[0]["content"] = "You are an expert in MongoDB aggregation."
      arr[1]["content"] = prompt
      break;

    case "CHAT_BOT_USER_QUERY":
      prompt=`  
      instructions:
        1. Read the context. 
        2. Answer the question with no description.
        3.  
      below is the context:
       
       ${contextForChatBotQuery}
      question: ${query}
      `
      arr[0]["content"] = "You are an good Assistance In Reading context and Self generating answers."
      arr[1]["content"] = prompt
    
    case "GET_SUGGESTION_OF_CHART_WITH_CHART_CONFIG":
      
       prompt= `
        
       

       
       
       `
        break;
      default:
      break;
  }
  return arr

};






