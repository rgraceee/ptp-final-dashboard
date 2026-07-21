import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient(token?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
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
  try {
    const auth = req.headers.get("Authorization");
    const token = auth?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseClient(token);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("records")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      throw error;
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("GET ERROR:", error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("Authorization");

    if (!auth) {
      return NextResponse.json(
        { error: "Missing authorization" },
        { status: 401 }
      );
    }

    const token = auth.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { ticker, date, price, notes, category } = body;

    const trimmedTicker = typeof ticker === "string" ? ticker.trim().toUpperCase() : "";
    const trimmedDate = typeof date === "string" ? date.trim() : "";
    const numericPrice = Number(price);

    if (!trimmedTicker || !/^[A-Z]{1,5}$/.test(trimmedTicker)) {
      return NextResponse.json(
        { error: "Ticker must be 1-5 uppercase letters" },
        { status: 400 }
      );
    }

    if (!trimmedDate || isNaN(Date.parse(trimmedDate))) {
      return NextResponse.json(
        { error: "Please provide a valid date" },
        { status: 400 }
      );
    }

    const entryDate = new Date(trimmedDate);
    if (entryDate > new Date()) {
      return NextResponse.json(
        { error: "Date cannot be in the future" },
        { status: 400 }
      );
    }

    if (!numericPrice || numericPrice <= 0 || numericPrice >= 1_000_000) {
      return NextResponse.json(
        { error: "Price must be between 0 and 1,000,000" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("records")
      .insert({
        ticker: trimmedTicker,
        date: trimmedDate,
        price: numericPrice,
        notes: notes ?? "",
        category: category ?? "Buy",
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("INSERT ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
