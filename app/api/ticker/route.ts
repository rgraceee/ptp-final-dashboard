import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

async function getAuthenticatedClient(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return null;
  }
  const token = auth.replace("Bearer ", "");
  const {
    createClient
  } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function GET(req: Request) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);

  const symbol = searchParams
    .get("symbol")
    ?.toUpperCase();

  if (symbol) {
    const { data, error } = await supabase
      .from("tickers")
      .select("*")
      .eq("symbol", symbol)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { exists: false, message: "Ticker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      exists: true,
      ticker: data
    });
  }

  const { data, error } = await supabase
    .from("tickers")
    .select("*")
    .order("symbol");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const client = await getAuthenticatedClient(req);
  if (!client) {
    return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tickers")
    .insert({
      symbol: body.symbol.toUpperCase(),
      company: body.company,
      description: body.description,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
