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

    const supabase = getSupabaseClient(token);

    let userId: string | null = null;

    if (token) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }

    if (!userId) {
      return NextResponse.json(
        {
          totalRecords: 0,
          totalValue: 0,
          averagePrice: 0,
          latestEntry: null,
          tickerBreakdown: [],
          categoryBreakdown: [],
        },
        { status: 200 }
      );
    }

    const { data: records, error } = await supabase
      .from("records")
      .select("ticker, price, date, category, created_at")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    const totalRecords = records?.length ?? 0;
    const totalValue = records?.reduce((sum, r) => sum + Number(r.price), 0) ?? 0;
    const averagePrice = totalRecords > 0 ? totalValue / totalRecords : 0;

    const latestEntry = records?.[0] ?? null;

    const tickerMap = new Map<string, { count: number; total: number }>();
    const categoryMap = new Map<string, { count: number; total: number }>();
    records?.forEach((r) => {
      const tExisting = tickerMap.get(r.ticker) || { count: 0, total: 0 };
      tickerMap.set(r.ticker, {
        count: tExisting.count + 1,
        total: tExisting.total + Number(r.price),
      });

      const cExisting = categoryMap.get(r.category) || { count: 0, total: 0 };
      categoryMap.set(r.category, {
        count: cExisting.count + 1,
        total: cExisting.total + Number(r.price),
      });
    });

    const tickerBreakdown = Array.from(tickerMap.entries()).map(
      ([ticker, { count, total }]) => ({
        ticker,
        count,
        total,
        average: count > 0 ? total / count : 0,
      })
    );

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, { count, total }]) => ({
        category,
        count,
        total,
        average: count > 0 ? total / count : 0,
      })
    );

    return NextResponse.json({
      totalRecords,
      totalValue,
      averagePrice,
      latestEntry,
      tickerBreakdown,
      categoryBreakdown,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("STATS ERROR:", error);

    return NextResponse.json(
      {
        error: errorMessage,
        totalRecords: 0,
        totalValue: 0,
        averagePrice: 0,
        latestEntry: null,
        tickerBreakdown: [],
        categoryBreakdown: [],
      },
      { status: 500 }
    );
  }
}
