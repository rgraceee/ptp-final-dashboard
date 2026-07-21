import { NextResponse } from "next/server";
import { getQuote } from "@/lib/alphaVantage";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {

  const { ticker } = await params;

  const symbol = ticker.toUpperCase();

  const supabase = createServerSupabaseClient();

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


  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      {
        error: message
      },
      {
        status:500
      }
    );
  }

}
