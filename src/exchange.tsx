import { useEffect, useState } from "react";
import { getRatesFromUSD } from "./services/exchangeApi/exchangeService";

const currencies = ["USD", "EUR", "GBP", "JPY", "AED", "TRY"] as const;
type Currency = typeof currencies[number];

const Exchange: React.FC = () => {
    const [fromCurrency, setFromCurrency] = useState<Currency>("TRY");
    const [toCurrency, setToCurrency] = useState<Currency>("USD");
    const [amount, setAmount] = useState<number>(1);
    const [rates, setRates] = useState<Record<Currency, number>>({} as Record<Currency, number>);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        getRatesFromUSD()
            .then((data) => {
                // USD bazlı veriyi alıyoruz
                // API’den TL yoksa sabit bir oran ekleyebiliriz
                setRates({
                    ...data,
                    USD: 1,
                    TRY: data["TRY"] || 27.5,
                } as Record<Currency, number>);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center mt-4">Loading...</p>;

    // amount in fromCurrency → USD → toCurrency
    const converted =
        amount && rates[fromCurrency] && rates[toCurrency]
            ? (amount / rates[fromCurrency]) * rates[toCurrency]
            : 0;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 space-y-6">
                <h2 className="text-2xl font-bold text-center">💱 Döviz Çevirici</h2>

                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        placeholder="Miktar"
                    />

                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value as Currency)}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        {currencies.map((cur) => (
                            <option key={cur} value={cur}>
                                {cur}
                            </option>
                        ))}
                    </select>

                    <span className="self-center text-lg font-bold text-center">→</span>

                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value as Currency)}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        {currencies.map((cur) => (
                            <option key={cur} value={cur}>
                                {cur}
                            </option>
                        ))}
                    </select>
                </div>

                <p className="text-center text-xl font-semibold mt-4">
                    {amount} {fromCurrency} = {converted.toFixed(2)} {toCurrency}
                </p>
            </div>
        </div>
    );
};

export default Exchange;
