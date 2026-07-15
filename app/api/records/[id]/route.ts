import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


// UPDATE RECORD
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const body = await req.json();


    const {
      ticker,
      date,
      price,
      notes
    } = body;



    const { data, error } = await supabase
      .from("records")
      .update({
        ticker,
        date,
        price,
        notes
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



  } catch(error:any){

    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );

  }

}





// DELETE RECORD
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {


  try {


    const { id } = await params;



    const { error } = await supabase
      .from("records")
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



    return NextResponse.json(
      {
        message:"Record deleted successfully"
      }
    );



  } catch(error:any){


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );


  }


}