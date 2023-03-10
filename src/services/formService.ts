import axios, { AxiosRequestConfig } from "axios";

const PORT:string = '4000'
const http:string = `http://localhost:${PORT}`

export async function getTodos<T>(): Promise<T[]> {
  const response = await axios.get<T[]>(`${http}/form`);
  return response.data;
}

export async function getTodosById<T>(idTodo: string): Promise<T> {
  const response = await axios.get<T>(`${http}/form/${idTodo}`);
  return response.data;
}

export async function  createTodo<T>(body: any): Promise<T> {
    const response = await axios.post(`${http}/form`, body , {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer my-token'
      }
    });
    return response.data;
}

export async function  updateTodo<T>(body: any, idTodo: string ): Promise<T> {
    const response = await axios.put(`${http}/form/${idTodo }`, body);
    return response.data;
}

export async function deleteTodo<T>(idTodo: string): Promise<T> {
  const response = await axios.delete<T>(`${http}/form/${idTodo}`);
  return response.data;
}
