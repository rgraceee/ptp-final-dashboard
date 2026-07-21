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


// UPDATE ticker
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id:string }> }
){
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

  const { id } = await params;

  const body = await req.json();

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tickers")
    .update({
      symbol: body.symbol.toUpperCase(),
      company: body.company,
      description: body.description
    })
    .eq("id", id)
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





// DELETE ticker
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id:string }> }
){
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

  const { id } = await params;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("tickers")
    .delete()
    .eq("id", id);

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

  return NextResponse.json({
    success:true
  });
}