"use client";

import { useEffect,useState } from "react";


type Ticker = {
 id:string;
 symbol:string;
 company:string;
 description:string;
};



export default function ManageTickers(){


const [tickers,setTickers]=useState<Ticker[]>([]);

const [form,setForm]=useState({
 symbol:"",
 company:"",
 description:""
});



async function loadTickers(){

const res=await fetch("/api/ticker");

const data=await res.json();

setTickers(data);

}



useEffect(()=>{

loadTickers();

},[]);





async function addTicker(){


await fetch("/api/ticker",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

});



setForm({
symbol:"",
company:"",
description:""
});


loadTickers();

}





async function deleteTicker(id:string){

await fetch(`/api/ticker/${id}`,{

method:"DELETE"

});


loadTickers();

}





return (

<div className="p-6">


<h1 className="text-xl font-bold mb-5">

Manage Tickers

</h1>



<div className="card p-5 mb-8">


<h2 className="font-semibold mb-3">

Add New Ticker

</h2>


<input
placeholder="Symbol"
className="border p-2 rounded mr-2"
value={form.symbol}
onChange={
e=>setForm({
...form,
symbol:e.target.value
})
}
/>


<input
placeholder="Company"
className="border p-2 rounded mr-2"
value={form.company}
onChange={
e=>setForm({
...form,
company:e.target.value
})
}
/>



<input
placeholder="Description"
className="border p-2 rounded mr-2"
value={form.description}
onChange={
e=>setForm({
...form,
description:e.target.value
})
}
/>



<button
onClick={addTicker}
className="px-4 py-2 rounded text-white"
style={{
background:"var(--accent)"
}}
>

Add

</button>


</div>





<table className="w-full text-sm">


<thead>

<tr className="border-b">

<th className="text-left p-3">
Ticker
</th>

<th className="text-left p-3">
Company
</th>

<th className="text-left p-3">
Action
</th>


</tr>

</thead>



<tbody>


{
tickers.map(t=>(

<tr
key={t.id}
className="border-b"
>


<td className="p-3 font-semibold">
{t.symbol}
</td>


<td className="p-3">
{t.company}
</td>


<td className="p-3">

<button
onClick={()=>deleteTicker(t.id)}
className="text-red-500"
>

Delete

</button>

</td>


</tr>

))

}


</tbody>


</table>


</div>

)

}