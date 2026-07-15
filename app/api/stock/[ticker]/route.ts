import { NextResponse } from "next/server";
import { getQuote } from "@/lib/alphaVantage";
import { supabase } from "@/lib/supabase";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {

  const { ticker } = await params;

  const symbol = ticker.toUpperCase();


  // Check if ticker exists in Supabase
  const { data, error } = await supabase
    .from("tickers")
    .select("symbol")
    .eq("symbol", symbol)
    .maybeSingle();



  if (error) {

    console.error(
      "Ticker validation error:",
      error
    );


    return NextResponse.json(
      {
        error: "Database error"
      },
      {
        status: 500
      }
    );

  }



  if (!data) {

    return NextResponse.json(
      {
        error: "Ticker not found"
      },
      {
        status: 404
      }
    );

  }



  try {

    const result = await getQuote(symbol);


    return NextResponse.json(result);


  } catch (err:any) {


    return NextResponse.json(
      {
        error: err.message
      },
      {
        status:500
      }
    );

  }

}