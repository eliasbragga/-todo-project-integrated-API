import axios from "axios";

interface Body  {
    phone: string,
    message: string
}

const HTTP = 'https://api.z-api.io/instances/3BA3163F0970C072021C5ECBD9C20C92/token/0FB05B73A8301711BD07C7FD/send-messages'

export async function  sendTimeline<T>(body: Body): Promise<T> {
    const response = await axios.post(`${HTTP}`, body)
    return response.data;
}