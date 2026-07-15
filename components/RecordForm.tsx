"use client";

import { useEffect, useState } from "react";
import RecordsTable from "@/components/RecordsTable";


type RecordType = {
  id:string;
  ticker:string;
  date:string;
  price:string;
  notes:string;
};



export default function RecordForm(){


const [records,setRecords] = useState<RecordType[]>([]);


const [ticker,setTicker]=useState("");
const [date,setDate]=useState("");
const [price,setPrice]=useState("");
const [notes,setNotes]=useState("");

const [editingId,setEditingId]=useState<string|null>(null);

const [loading,setLoading]=useState(false);



async function fetchRecords(){

try{

const res = await fetch("/api/records");

const data = await res.json();

setRecords(data);

}catch(err){

console.error("Failed loading records",err);

}

}



useEffect(()=>{

fetchRecords();

},[]);





async function handleSubmit(e:React.FormEvent){

e.preventDefault();


const payload={

ticker:ticker.toUpperCase(),
date,
price:Number(price),
notes

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



}catch(err){

console.error(err);

}



}





function reset(){

setTicker("");
setDate("");
setPrice("");
setNotes("");
setEditingId(null);

}





function handleEdit(record:RecordType){

setEditingId(record.id);

setTicker(record.ticker);

setDate(record.date);

setPrice(record.price);

setNotes(record.notes);

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
className="
card
p-5
max-w-md
space-y-4
"
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




<textarea

value={notes}

onChange={(e)=>setNotes(e.target.value)}

placeholder="Notes"

className="input"

/>





<button

className="
px-4
py-2
rounded-lg
text-white
"

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

className="ml-2"

>

Cancel

</button>

}



</form>





<div className="mt-8">


<RecordsTable

records={records}

onEdit={handleEdit}

onDelete={handleDelete}

/>



</div>




</div>

);


}