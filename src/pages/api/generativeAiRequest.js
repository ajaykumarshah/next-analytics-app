
// import Groq from "groq-sdk"


// const { contextForChatBotQuery} = require("@/static/media/images/data/staticData");
const contextForChatBotQuery="edchbrrfr"
const Groq = require("groq-sdk")

// const API_KEY = "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";
const API_KEY="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"


const generativeAiRequest = {
  getSuggestionQueries: async function (keywords = tempKeys) {
    const additionalParameters={
      temperature: 1,
      
    }
    const response = await makeRequestWithPrompt(getPrompt({keywords, calledCase:"SUGGESTIONS_GENERATIONS"}),additionalParameters);
    // console.log("this is suggestion", typeof response, response);
    return response
  },
  getDataFromSuggestionClickedQuery: async function (keywords = tempKeys, query, documentId) {
    const additionalParameters={
      temperature: 0.2,
      stream: false,
      response_format: { "type": "json_object"  },
      max_tokens: 500,
      model:"llama3-70b-8192"
    }
    const response = await makeRequestWithPrompt(getPrompt({keywords, calledCase:"SEARCHED_QUERY_TO_AGGREGATION_QUERY", query, documentId}),additionalParameters, true)
    // console.log(query, "this is query");
    // console.log("this is query response", typeof response);
    return response
  },
  getChatBotQueryResponse: async function(userQuery) {
    const additionalParameters={
      temperature: 0.2,
      stream: false,
      // max_tokens: 1024,
      // top_p: 1,
    }
    // console.log("this is chatbot request",userQuery);
    const response = await makeRequestWithPrompt(getPrompt({calledCase:"CHAT_BOT_USER_QUERY", query:userQuery}),additionalParameters)
    // console.log(response, "this is chatbot response",typeof response);
    return response
  },
  getInsightsOfData: async function (data) {
    const additionalParameters={
      temperature: 0.2,
      model:"llama3-70b-8192"
      // model:"llama-3.1-70b-versatile"
      // model:"llama-3.1-8b-instant"
      // stream: false,
      // response_format: { "type": "json_object"  },
    }
    const response = await makeRequestWithPrompt(getPrompt({calledCase:"GET_INSIGHT_OF_DATA", data}),additionalParameters)
    console.log(response, "this is chatbot response",typeof response);
    return response
  }
  
};


// generativeAiRequest.getDataFromSuggestionClickedQuery(tempKeys, "profit by sales", "669a490523edc0e73f402f85")
// generativeAiRequest.getInsightsOfData([{"mp":30,"up":24,"cg":40}])
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

function getPrompt({keywords, calledCase, query, documentId,data=[]}) {
  let prompt
  let arr = [{ role: "system" }, { role: "user" }]
  switch (calledCase) {
    
    case "SUGGESTIONS_GENERATIONS":
      const firstObj={
        Sales:"number",
        State:"string",
        Region:"string"
       }

      prompt = `Here is the below pairs of column name and value data type of ${JSON.stringify(keywords)}
               based on above data.
               Intructions:
                1. Use the following JSON format to return you response:
               {{
                 "generated":<trus/false>,
                 "kpis":<[]>,
                 "error":<true/false>
               }}
                2. Need relevant response, don"t responsd ungrounded data.
                3. Atleast count of 20 kpis should be there.
                4. Don"t use any description on response.
                5. Response should be JSON object.
                6. Generate some complex and Important KPIS based on above provided the below json data.
                7. You can take Idea from below example , what are kpis but don't copy same pattern.
                8. Make sure don't create kpi from using same same type column data.
                9  Atleast 1 number column and 1 string column used on KPI. 
                 
              KPIS Examples :
              
              ["What is Total Sales by State","Top 5 Cities By Sales","Total Sales by Region and State where Total Sales of State is greater than 5000"]
              
              it will be totally based upon proveded json
              
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
                   5. Before adding aggregation pipline check their data type present in columns from above json.
                   6. Cross check generated query so that mongodb not throw error in Aggregation Pipeline.

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
                            }
                            
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
                                "_id": "$table.Ship Date",
                                "val": { "$sum": "$table.Profit" }
                                },
                            }
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
        
      below is the context:
       
       ${contextForChatBotQuery}
      question: ${query}
      `
      arr[0]["content"] = "You are an good Assistance In Reading context and Self generating answers."
      arr[1]["content"] = prompt
      break;
    
    case "GET_SUGGESTION_OF_CHART":
      
       prompt= `
        

       `
        break;
    case "GET_INSIGHT_OF_DATA":
       prompt=`
       
         Instructions:
           1. Understand the given array data.
           2. Create Important insights from array data.
           3. Answer The last Question.
           4. Use only inline css.
           5. Send response in only HTML.
           6. Use the below format only.
           7. Follow the pattern of Previous Questions Answers

           Examples:

           1.Question:  create the insights from below data in only HTML
                   array= [{"_id":"January","val":29},{"_id":"February","val":35},{"_id":"March","val":40},{"_id":"April","val":28},{"_id":"May","val":25},{"_id":"June","val":32}]
            Answer:
                '<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <ol style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <li><strong style="color: darkblue;">Highest Value:</strong> 
                          <ul>
                            <li>The highest value is in <strong style="color: darkgreen;">March</strong> with an amount of <strong style="color: darkred;">40</strong>.</li>
                          </ul>
                        </li>
                        <li><strong style="color: darkblue;">Lowest Value:</strong> 
                          <ul>
                            <li>The lowest value is in <strong style="color: darkgreen;">May</strong> with an amount of <strong style="color: darkred;">25</strong>.</li>
                          </ul>
                        </li>
                        <li><strong style="color: darkblue;">Month-to-Month Analysis:</strong>
                          <ul>
                            <li><strong style="color: darkgreen;">January</strong> to <strong style="color: darkgreen;">February:</strong> There is an increase of <strong style="color: darkred;">6</strong> (from 29 to 35).</li>
                            <li><strong style="color: darkgreen;">February</strong> to <strong style="color: darkgreen;">March:</strong> There is an increase of <strong style="color: darkred;">5</strong> (from 35 to 40).</li>
                            <li><strong style="color: darkgreen;">March</strong> to <strong style="color: darkgreen;">April:</strong> There is a decrease of <strong style="color: darkred;">12</strong> (from 40 to 28).</li>
                            <li><strong style="color: darkgreen;">April</strong> to <strong style="color: darkgreen;">May:</strong> There is a decrease of <strong style="color: darkred;">3</strong> (from 28 to 25).</li>
                            <li><strong style="color: darkgreen;">May</strong> to <strong style="color: darkgreen;">June:</strong> There is an increase of <strong style="color: darkred;">7</strong> (from 25 to 32).</li>
                          </ul>
                        </li>
                        <li><strong style="color: darkblue;">Overall Trend:</strong> 
                          <ul>
                            <li>The values show fluctuations with an overall increase from <strong style="color: darkgreen;">January</strong> (29) to <strong style="color: darkgreen;">June</strong> (32).</li>
                          </ul>
                        </li>
                        <li><strong style="color: darkblue;">Significant Changes:</strong>
                          <ul>
                            <li>The most significant increase is from <strong style="color: darkgreen;">May</strong> to <strong style="color: darkgreen;">June</strong>, with a rise of <strong style="color: darkred;">7</strong>.</li>
                            <li>The most significant decrease is from <strong style="color: darkgreen;">March</strong> to <strong style="color: darkgreen;">April</strong>, with a drop of <strong style="color: darkred;">12</strong>.</li>
                          </ul>
                        </li>
                      </ol>

                    </div>'
            
            1. Question: create the insights from below data in only HTML.
                
                  array=  [{"_id":"Corporate","val":768426.9094254},{"_id":"Home Office","val":477160.34582492},{"_id":"Consumer","val":359919.3346686},{"_id":"Corporate","val":768426.9094254},{"_id":"Home Office","val":477160.34582492},{"_id":"Consumer","val":359919.3346686},{"_id":"Home Office","val":477160.34582492},{"_id":"Consumer","val":359919.3346686},{"_id":"Consumer","val":359919.3346686},{"_id":"Small Business","val":179908.06909575}]
                 
               Answer: '<div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                        <ol style="font-family: Arial, sans-serif; line-height: 1.6;">
                          <li><strong style="color: darkblue;">Highest Value:</strong> 
                            <ul>
                              <li>The highest value is in the <strong style="color: darkgreen;">Corporate</strong> category with an amount of <strong style="color: darkred;">768,426.91</strong>.</li>
                            </ul>
                          </li>
                          <li><strong style="color: darkblue;">Lowest Value:</strong> 
                            <ul>
                              <li>The lowest value is in the <strong style="color: darkgreen;">Small Business</strong> category with an amount of <strong style="color: darkred;">179,908.07</strong>.</li>
                            </ul>
                          </li>
                          <li><strong style="color: darkblue;">Insights:</strong>
                            <ul>
                              <li><strong style="color: darkgreen;">Corporate</strong> category consistently shows the highest values, indicating a strong performance in this sector.</li>
                              <li><strong style="color: darkgreen;">Home Office</strong> and <strong style="color: darkgreen;">Consumer</strong> categories have multiple entries with moderate values, showing significant contributions to the overall total.</li>
                              <li><strong style="color: darkgreen;">Small Business</strong> has the lowest value and the fewest entries, suggesting a smaller impact in comparison to other categories.</li>
                            </ul>
                          </li>
                          <li><strong style="color: darkblue;">Category Breakdown:</strong>
                            <ul>
                              <li><strong style="color: darkgreen;">Corporate:</strong> 
                                <ul>
                                  <li>Appears <strong>2 times</strong> with a total value of <strong style="color: darkred;">1,536,853.82</strong> (768,426.91 * 2).</li>
                                </ul>
                              </li>
                              <li><strong style="color: darkgreen;">Home Office:</strong> 
                                <ul>
                                  <li>Appears <strong>3 times</strong> with a total value of <strong style="color: darkred;">1,431,481.04</strong> (477,160.35 * 3).</li>
                                </ul>
                              </li>
                              <li><strong style="color: darkgreen;">Consumer:</strong> 
                                <ul>
                                  <li>Appears <strong>4 times</strong> with a total value of <strong style="color: darkred;">1,439,677.34</strong> (359,919.33 * 4).</li>
                                </ul>
                              </li>
                              <li><strong style="color: darkgreen;">Small Business:</strong> 
                                <ul>
                                  <li>Appears <strong>1 time</strong> with a total value of <strong style="color: darkred;">179,908.07</strong>.</li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li><strong style="color: darkblue;">Average Value Per Category:</strong>
                            <ul>
                              <li><strong style="color: darkgreen;">Corporate:</strong> 
                                <ul>
                                  <li>The average value per entry is <strong style="color: darkred;">768,426.91</strong>.</li>
                                </ul>
                              </li>
                              <li><strong style="color: darkgreen;">Home Office:</strong> 
                                <ul>
                                  <li>The average value per entry is <strong style="color: darkred;">477,160.35</strong>.</li>
                                </ul>
                              </li>
                              <li><strong style="color: darkgreen;">Consumer:</strong> 
                                <ul>
                                  <li>The average value per entry is <strong style="color: darkred;">359,919.33</strong>.</li>
                                </ul>
                              </li>
                              <li><strong style="color: darkgreen;">Small Business:</strong> 
                                <ul>
                                  <li>The average value per entry is <strong style="color: darkred;">179,908.07</strong>.</li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          
                        </ol>

                      </div> 
                        '              
             3.Question: create the insights from below data in only HTML.
               
              ${JSON.stringify(data)}

              Answer: 

       `    
      arr[0]["content"] = "You are an good HTML(Hyper Text Markup Language) developer"
      arr[1]["content"] = prompt
      
      default:
      break;
  }
  return arr

};






