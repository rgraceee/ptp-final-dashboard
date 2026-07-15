import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET(req: Request) {


const { searchParams } = new URL(req.url);

const symbol = searchParams
.get("symbol")
?.toUpperCase();



//
// If symbol exists -> validate one ticker
//
if(symbol){


const {data,error}=await supabase
.from("tickers")
.select("*")
.eq("symbol",symbol)
.single();



if(error || !data){

console.log("Ticker lookup failed:", {
  symbol,
  data,
  error
});


return NextResponse.json(
{
exists:false,
message:"Ticker not found"
},
{
status:404
}
);

}



return NextResponse.json({

exists:true,
ticker:data

});


}





//
// No symbol -> return all tickers
//

const {data,error}=await supabase
.from("tickers")
.select("*")
.order("symbol");



if(error){

return NextResponse.json(
{
error:error.message
},
{
status:500
}
);

}



return NextResponse.json(data);


}
export async function POST(req:Request){

  const body = await req.json();


  const {data,error}=await supabase
    .from("tickers")
    .insert({
      symbol:body.symbol.toUpperCase(),
      company:body.company,
      description:body.description
    })
    .select()
    .single();



  if(error){

    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );

  }



  return NextResponse.json(data);

}