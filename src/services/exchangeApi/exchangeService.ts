import { exchangeApi } from "./api";

export const getRatesFromUSD = async () => {
    const res = await exchangeApi.get("latest/USD");
    return res.data.conversion_rates;
}