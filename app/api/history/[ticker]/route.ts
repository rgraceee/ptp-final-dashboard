import { NextResponse } from "next/server";
import { getDailyHistory } from "@/lib/alphaVantage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  try {
    const data = await getDailyHistory(ticker.toUpperCase());
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}