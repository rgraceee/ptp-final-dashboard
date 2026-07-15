import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


// GET ALL RECORDS
export async function GET(){

  const { data, error } = await supabase
    .from("records")
    .select("*")
    .order("created_at", {
      ascending:false
    });


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





// CREATE RECORD
export async function POST(
req:Request
){

  const body = await req.json();


  const {
    ticker,
    date,
    price,
    notes,
    category
  } = body;



  const { data, error } = await supabase
    .from("records")
    .insert([
      {
        ticker,
        date,
        price,
        notes,
        category
      }
    ])
    .select();



  if(error){

    console.log(error);


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );

  }



  return NextResponse.json(
    data[0],
    {
      status:201
    }
  );

}