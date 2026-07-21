import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient(token: string) {
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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Invalid record id" },
        { status: 400 }
      );
    }

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

    if (!ticker || !date || Number(price) <= 0) {
      return NextResponse.json(
        { error: "Invalid record data" },
        { status: 400 }
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from("records")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this record. It may belong to a different account." },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("records")
      .update({
        ticker: ticker.toUpperCase(),
        date,
        price: Number(price),
        notes: notes ?? "",
        category: category ?? "Buy",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("UPDATE ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("PUT ERROR:", error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Invalid record id" },
        { status: 400 }
      );
    }

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

    const { data: existing, error: fetchError } = await supabase
      .from("records")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this record. It may belong to a different account." },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("records")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("DELETE ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No record deleted. Check permissions or record id." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: data[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
