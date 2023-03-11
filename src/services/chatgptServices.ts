import axios from "axios";
const endpoint: string = 'https://api.openai.com/v1/completions' 

export function integrationChatgpt(body:{}) {
    const client = 
     axios.create({headers: {Authorization: `Bearer ${process.env.VUE_APP_CHATGPT_KEY}`}})
    return client.post(endpoint, body)
}

