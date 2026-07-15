"use client";

import { useEffect, useState } from "react";
import RecordsTable from "@/components/RecordsTable";

type RecordType = {
  id: string;
  ticker: string;
  date: string;
  price: number;
  notes: string;
  category: string;
};


export default function RecordForm() {


const [records,setRecords] = useState<RecordType[]>([]);


const [ticker,setTicker] = useState("");
const [date,setDate] = useState("");
const [price,setPrice] = useState("");
const [notes,setNotes] = useState("");
const [category,setCategory] = useState("Buy");


const [categoryFilter,setCategoryFilter] = useState("All");
const [startDate,setStartDate] = useState("");
const [endDate,setEndDate] = useState("");


const [editingId,setEditingId] = useState<string|null>(null);



async function fetchRecords(){

try{

const res = await fetch("/api/records");

const data = await res.json();

setRecords(data);

}

catch(err){

console.error(
"Failed loading records",
err
);

}

}



useEffect(()=>{

fetchRecords();

},[]);





// FILTERING

const filteredRecords = records.filter((record)=>{


const categoryMatch =
categoryFilter === "All" ||
record.category === categoryFilter;


const startMatch =
!startDate ||
record.date >= startDate;


const endMatch =
!endDate ||
record.date <= endDate;



return (
categoryMatch &&
startMatch &&
endMatch
);


});



// ANALYTICS

const totalValue = filteredRecords.reduce(
(sum,record)=>
sum + Number(record.price),
0
);


const averagePrice =
filteredRecords.length
?
totalValue / filteredRecords.length
:
0;







async function handleSubmit(
e:React.FormEvent
){

e.preventDefault();



const payload = {

ticker:ticker.toUpperCase(),

date,

price:Number(price),

notes,

category

};





try{


if(editingId){


await fetch(
`/api/records/${editingId}`,
{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(payload)

}

);


}
else{


await fetch(
"/api/records",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(payload)

}

);


}



reset();

fetchRecords();


}

catch(err){

console.error(err);

}


}








function reset(){

setTicker("");

setDate("");

setPrice("");

setNotes("");

setCategory("Buy");

setEditingId(null);

}







function handleEdit(record:RecordType){


setEditingId(record.id);

setTicker(record.ticker);

setDate(record.date);

setPrice(
String(record.price)
);

setNotes(record.notes);

setCategory(record.category);


}








async function handleDelete(id:string){


await fetch(
`/api/records/${id}`,
{
method:"DELETE"
}
);


fetchRecords();


}







return (

<div className="mt-10">


<h2 className="text-lg font-semibold mb-3">

{
editingId
?
"Edit Record"
:
"Add Record"
}

</h2>





<form
onSubmit={handleSubmit}
className="card p-5 max-w-md space-y-4"
>



<input

value={ticker}

onChange={(e)=>setTicker(e.target.value)}

placeholder="Ticker e.g. AAPL"

className="input"

/>




<input

type="date"

value={date}

onChange={(e)=>setDate(e.target.value)}

className="input"

/>





<input

value={price}

onChange={(e)=>setPrice(e.target.value)}

placeholder="Price"

className="input"

/>





<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

className="input"

>


<option value="Buy">
Buy
</option>


<option value="Sell">
Sell
</option>


</select>





<textarea

value={notes}

onChange={(e)=>setNotes(e.target.value)}

placeholder="Notes"

className="input"

/>





<button

className="px-4 py-2 rounded-lg text-white"

style={{
background:"var(--accent)"
}}

>

{
editingId
?
"Save Changes"
:
"Add Record"
}


</button>





{
editingId &&

<button

type="button"

onClick={reset}

className="ml-3"

>

Cancel

</button>

}



</form>









<div className="mt-8">



<div className="card p-4 mb-5">


<h3 className="font-semibold mb-3">

Analytics Filters

</h3>




<div className="flex flex-wrap gap-3">



<input

type="date"

value={startDate}

onChange={(e)=>setStartDate(e.target.value)}

className="input"

/>





<input

type="date"

value={endDate}

onChange={(e)=>setEndDate(e.target.value)}

className="input"

/>





<select

value={categoryFilter}

onChange={(e)=>setCategoryFilter(e.target.value)}

className="input"

>


<option value="All">
All Categories
</option>


<option value="Buy">
Buy
</option>


<option value="Sell">
Sell
</option>


</select>



</div>


</div>








<div className="grid grid-cols-3 gap-4 mb-5">


<div className="card p-4">

<p className="text-sm text-gray-500">
Filtered Records
</p>

<p className="text-xl font-bold">
{filteredRecords.length}
</p>

</div>




<div className="card p-4">

<p className="text-sm text-gray-500">
Total Value
</p>

<p className="text-xl font-bold">
${totalValue.toFixed(2)}
</p>

</div>





<div className="card p-4">

<p className="text-sm text-gray-500">
Average Price
</p>

<p className="text-xl font-bold">
${averagePrice.toFixed(2)}
</p>

</div>



</div>







<RecordsTable

records={filteredRecords}

onEdit={handleEdit}

onDelete={handleDelete}

/>



</div>


</div>


);


}