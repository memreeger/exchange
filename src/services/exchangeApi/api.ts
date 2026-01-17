import axios from "axios";

const API_KEY = "2242d186dbd1e2d2ff0a23ff";

export const exchangeApi = axios.create({
    baseURL: `https://v6.exchangerate-api.com/v6/${API_KEY}`
})