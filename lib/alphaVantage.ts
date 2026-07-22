const BASE = "https://www.alphavantage.co/query";

const KEY = process.env.ALPHA_VANTAGE_API_KEY;

const USE_MOCK_DATA = false;


// ---------- MOCK DATA ----------


function mockQuote(symbol:string){

const stocks: Record<string, { price: number; changePercent: string; volume: string }> = {

AAPL:{
price:189.45,
changePercent:"1.85%",
volume:"50,000,000"
},

MSFT:{
price:420.30,
changePercent:"0.95%",
volume:"35,000,000"
},

NVDA:{
price:135.80,
changePercent:"2.40%",
volume:"45,000,000"
},

GOOGL:{
price:178.25,
changePercent:"1.20%",
volume:"25,000,000"
},

AMZN:{
price:225.10,
changePercent:"0.75%",
volume:"30,000,000"
},

TSLA:{
price:248.50,
changePercent:"-0.60%",
volume:"60,000,000"
}

};


const stock =
stocks[symbol] ?? {
price:150,
changePercent:"1.00%",
volume:"20,000,000"
};



return {

  symbol,

  price: Number(stock.price.toFixed(2)),

  changePercent:
  stock.changePercent,

  open: Number((stock.price - 2).toFixed(2)),

  high: Number((stock.price + 5).toFixed(2)),

  low: Number((stock.price - 5).toFixed(2)),

  volume:
  stock.volume,

  isMock:true

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
`${symbol} company mock information`,

isMock:true

};

}





function mockDailyHistory(){

const points: Array<{ date: string; close: number; isMock: boolean }> = [];

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
parseFloat(
price.toFixed(2)
),


isMock:true

});


}



return points;

}






// ---------- QUOTE ----------


export async function getQuote(symbol:string){


if(USE_MOCK_DATA){

return mockQuote(symbol);

}



try{


const res = await fetch(

`${BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${KEY}`,

{
next:{
revalidate:60
}
}

);



const data =
await res.json();



const q =
data["Global Quote"];






if(
  !q ||
  !q["05. price"]
){

return mockQuote(symbol);

}


return {

  symbol:
  q["01. symbol"],

  price:
  parseFloat(
    q["05. price"]
  ),

  changePercent:
  q["10. change percent"],

  open:
  parseFloat(
    q["02. open"]
  ),

  high:
  parseFloat(
    q["03. high"]
  ),

  low:
  parseFloat(
    q["04. low"]
  ),

  volume:
  Number(
    q["06. volume"]
  ).toLocaleString(),

  isMock:false

};



}
catch(error){



return mockQuote(symbol);


}



}






// ---------- COMPANY OVERVIEW ----------


export async function getOverview(symbol:string){


if(USE_MOCK_DATA){

return mockOverview(symbol);

}



try{


const res = await fetch(

`${BASE}?function=OVERVIEW&symbol=${symbol}&apikey=${KEY}`,

{
next:{
revalidate:21600
}
}

);



const data =
await res.json();




if(
!data.Name
){

return mockOverview(symbol);

}



return {

name:data.Name,

sector:data.Sector,

industry:data.Industry,

marketCap:data.MarketCapitalization,

description:data.Description,

isMock:false

};



}
catch(error){



return mockOverview(symbol);


}



}






// ---------- DAILY HISTORY ----------


export async function getDailyHistory(symbol:string){


if(USE_MOCK_DATA){

return mockDailyHistory();

}



try{


const res = await fetch(

`${BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${KEY}`,

{
next:{
revalidate:21600
}
}

);



const data =
await res.json();



const series =
data["Time Series (Daily)"];






if(!series){


return mockDailyHistory();

}






return Object.entries(series)

.slice(0,30)

.map(

([date,values])=>{

  const record = values as Record<string, unknown>;

  return {

    date,

    close:
    parseFloat(
      record["4. close"] as string
    ),


    isMock:false


  };

}

)

.reverse();



}
catch(error){



return mockDailyHistory();


}



}
