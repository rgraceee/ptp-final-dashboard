import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


// UPDATE ticker
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id:string }> }
){

  const { id } = await params;

  const body = await req.json();


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

  const { id } = await params;



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