import { NextResponse } from "next/server";
import { getQuote } from "@/lib/alphaVantage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  try {
    const data = await getQuote(ticker.toUpperCase());
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}