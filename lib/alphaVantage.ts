const BASE = "https://www.alphavantage.co/query";

const KEY = process.env.ALPHA_VANTAGE_API_KEY;

const USE_MOCK_DATA = false;


// ---------- MOCK DATA ----------


function mockQuote(symbol:string){

const prices:any = {

AAPL:189,
TSLA:248,
NVDA:135,
GOOGL:178,
MSFT:420,
AMZN:225

};


const price = prices[symbol] ?? 150;


return {

symbol,

price:price.toFixed(2),

changePercent:"1.85%",

open:(price-2).toFixed(2),

high:(price+5).toFixed(2),

low:(price-5).toFixed(2),

volume:"50,000,000"

};

}



function mockOverview(symbol:string){

return {

name:`${symbol} Corporation`,

sector:"Technology",

industry:"Software",

marketCap:
(symbol.length * 1000000000000).toString(),

description:
`${symbol} company mock information`

};

}



function mockDailyHistory(){

const points:any[]=[];

let price=180;


for(let i=29;i>=0;i--){

price += (Math.random()-0.5)*4;


const date=new Date();

date.setDate(
date.getDate()-i
);


points.push({

date:
date.toISOString().split("T")[0],

close:
parseFloat(price.toFixed(2))

});

}


return points;

}





// ---------- QUOTE ----------


export async function getQuote(symbol:string){


if(USE_MOCK_DATA)
return mockQuote(symbol);



try {


const res = await fetch(

`${BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${KEY}`,

{
next:{
revalidate:60
}
}

);



const data = await res.json();



console.log(
"QUOTE RESPONSE:",
data
);



const q=data["Global Quote"];



if(!q || !q["05. price"]){

return mockQuote(symbol);

}



return {

symbol:q["01. symbol"],

price:
parseFloat(q["05. price"]).toFixed(2),

changePercent:
q["10. change percent"],

open:
parseFloat(q["02. open"]).toFixed(2),

high:
parseFloat(q["03. high"]).toFixed(2),

low:
parseFloat(q["04. low"]).toFixed(2),

volume:
Number(q["06. volume"]).toLocaleString()

};



}catch(error){

console.error(
"Quote error:",
error
);


return mockQuote(symbol);

}


}





// ---------- COMPANY OVERVIEW ----------



export async function getOverview(symbol:string){


if(USE_MOCK_DATA)
return mockOverview(symbol);



try{


const res = await fetch(

`${BASE}?function=OVERVIEW&symbol=${symbol}&apikey=${KEY}`,

{
next:{
revalidate:21600
}
}

);



const data=await res.json();



console.log(
"OVERVIEW RESPONSE:",
data
);



if(!data.Name){

return mockOverview(symbol);

}



return {

name:data.Name,

sector:data.Sector,

industry:data.Industry,

marketCap:data.MarketCapitalization,

description:data.Description

};



}catch(error){


console.error(
"Overview error:",
error
);


return mockOverview(symbol);


}



}





// ---------- DAILY HISTORY ----------



export async function getDailyHistory(symbol:string){


if(USE_MOCK_DATA)
return mockDailyHistory();



try{


const res = await fetch(

`${BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${KEY}`,

{
next:{
revalidate:21600
}
}

);



const data=await res.json();



console.log(
"HISTORY RESPONSE:",
data
);



const series=data["Time Series (Daily)"];



if(!series){

console.warn(
"No history from Alpha Vantage, using mock"
);


return mockDailyHistory();

}




return Object.entries(series)

.slice(0,30)

.map(

([date,values]:[string,any])=>({

date,

close:
parseFloat(values["4. close"])

})

)

.reverse();



}catch(error){


console.error(
"History error:",
error
);


return mockDailyHistory();


}



}





// ---------- TOP MOVERS ----------



export async function getTopMovers(){


const res=await fetch(

`${BASE}?function=TOP_GAINERS_LOSERS&apikey=${KEY}`,

{
next:{
revalidate:300
}
}

);



const data=await res.json();



return {

gainers:
(data.top_gainers ?? []).slice(0,5),

losers:
(data.top_losers ?? []).slice(0,5)

};


}






// ---------- CRYPTO ----------



export async function getCryptoPrice(symbol:string){


const res=await fetch(

`${BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${KEY}`,

{
next:{
revalidate:60
}
}

);



const data=await res.json();


const rate=
data["Realtime Currency Exchange Rate"];



if(!rate)
throw new Error(
"No crypto data"
);



return {

symbol,

price:
parseFloat(
rate["5. Exchange Rate"]
).toFixed(2)

};


}






// ---------- INTRADAY ----------



export async function getIntraday(symbol:string){


const res=await fetch(

`${BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${KEY}`,

{
next:{
revalidate:60
}
}

);



const data=await res.json();



const series=
data["Time Series (5min)"];



if(!series)
return [];



return Object.entries(series)

.slice(0,20)

.map(

([time,values]:[string,any])=>({

time:
time.split(" ")[1],

price:
parseFloat(values["4. close"])

})

)

.reverse();


}