"use client";

import { useEffect, useState } from "react";


type Ticker = {

  id:string;
  symbol:string;
  company:string;
  description:string;

};



export default function TickerDirectory({

onSelect

}:{

onSelect:(symbol:string)=>void;

}) {


const [tickers,setTickers] = useState<Ticker[]>([]);
const [loading,setLoading] = useState(true);
const [error,setError] = useState("");



async function fetchTickers(){

try{


setLoading(true);
setError("");



const response = await fetch(
"/api/ticker"
);



if(!response.ok){

throw new Error(
"Failed to load tickers"
);

}



const data = await response.json();



setTickers(data);



}

catch(err:any){

console.error(
"Failed loading tickers:",
err
);


setError(
err.message
);


}


finally{

setLoading(false);

}

}





useEffect(()=>{

fetchTickers();

},[]);





return (

<div className="mt-10">


<h2 className="text-lg font-semibold mb-3 text-gray-900">

Browse tickers

</h2>




<div className="card overflow-hidden">



{
loading && (

<p className="p-4 text-gray-500">

Loading tickers...

</p>

)

}





{
error && (

<p className="p-4 text-red-500 text-sm">

{error}

</p>

)

}





{
!loading && !error && (

<table className="w-full text-sm">


<thead>

<tr className="border-b border-gray-100 text-left text-gray-500">


<th className="px-4 py-3 font-medium">

Ticker

</th>



<th className="px-4 py-3 font-medium">

Company

</th>



<th className="px-4 py-3 font-medium">

Description

</th>


</tr>

</thead>





<tbody>


{
tickers.map((t)=>(


<tr

key={t.id}

onClick={()=>onSelect(t.symbol)}

className="
border-b
border-gray-50
last:border-0
hover:bg-[var(--accent-light)]
transition-colors
cursor-pointer
"

>


<td

className="
px-4
py-3
font-semibold
"

style={{
color:"var(--accent)"
}}

>

{t.symbol}

</td>




<td className="px-4 py-3 text-gray-900">

{t.company}

</td>




<td className="px-4 py-3 text-gray-500">

{t.description}

</td>



</tr>


))

}



</tbody>


</table>

)

}



</div>


</div>

);

}