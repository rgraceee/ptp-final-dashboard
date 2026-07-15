"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import SearchBar from "@/components/SearchBar";
import TickerDirectory from "@/components/TickerDirectory";
import PriceChart from "@/components/PriceChart";
import TickerComparison from "@/components/TickerComparison";
import RecordForm from "@/components/RecordForm";

import {
  getQuote,
  getOverview,
  getDailyHistory,
} from "@/lib/alphaVantage";


function formatMarketCap(raw?: string) {
  const num = Number(raw);

  if (!num) return "N/A";

  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;

  return `$${num.toLocaleString()}`;
}



export default function DashboardPage() {

  const [ticker, setTicker] = useState("AAPL");

  const [quote, setQuote] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  async function validateTicker(symbol: string) {

    const response = await fetch(
      `/api/ticker?symbol=${symbol}`
    );


    if (!response.ok) {
      throw new Error("Ticker does not exist");
    }


    return true;

  }





  async function fetchData(selectedTicker = ticker) {

    try {

      setLoading(true);
      setError("");


      await validateTicker(selectedTicker);



      const [
        quoteData,
        overviewData,
        historyData
      ] = await Promise.all([

        getQuote(selectedTicker),
        getOverview(selectedTicker),
        getDailyHistory(selectedTicker)

      ]);



      setQuote(quoteData);
      setOverview(overviewData);
      setHistory(historyData);



    } catch(error:any) {


      console.error(
        "Dashboard error:",
        error
      );


      setError(
        error.message || "Failed to load data"
      );


      setQuote(null);
      setOverview(null);
      setHistory([]);



    } finally {


      setLoading(false);


    }

  }





  useEffect(()=>{

    fetchData();

  },[]);





  function handleSearch(newTicker:string){

    setTicker(newTicker);

    fetchData(newTicker);

  }







return (

<div className="p-6">


{/* HEADER */}

<div className="flex items-center justify-between mb-4">


<h1 className="text-xl font-bold text-gray-900">
Dashboard
</h1>



<button
onClick={()=>fetchData()}
disabled={loading}
className="
px-4 py-2
rounded-lg
text-sm
font-medium
text-white
hover:scale-105
disabled:opacity-50
"
style={{
background:"var(--accent)"
}}
>

{loading ? "Refreshing..." : "Refresh Data"}

</button>


</div>





{/* SEARCH */}

<div className="mb-4">

<SearchBar
onSearch={handleSearch}
/>

</div>





{/* ERROR */}

{
error && (

<p className="
text-red-500
text-sm
mb-4
">

{error}

</p>

)

}





{/* CONTENT */}

{
loading && !quote ? (

<p className="text-gray-500">
Loading dashboard...
</p>


) : (


<>


{/* STAT CARDS */}

<div className="flex flex-wrap gap-4">


<StatCard
label={`${quote?.symbol} Price`}
value={`$${quote?.price}`}
change={quote?.changePercent}
/>



<StatCard
label="Open Price"
value={`$${quote?.open}`}
/>



<StatCard
label="Volume"
value={quote?.volume}
/>



<StatCard
label="Market Cap"
value={formatMarketCap(
overview?.marketCap
)}
/>


</div>






{/* PRICE CHART */}

{
history.length > 0 && (

<PriceChart
data={history}
/>

)

}





{/* TICKER COMPARISON */}

<TickerComparison />





{/* TICKER DIRECTORY */}

<TickerDirectory

onSelect={(symbol)=>{

setTicker(symbol);

fetchData(symbol);

}}

/>






{/* SUPABASE RECORDS */}

<div className="mt-12">


<h2 className="text-xl font-bold text-gray-900 mb-4">
My Records
</h2>



<RecordForm />


</div>





</>


)

}


</div>

);


}