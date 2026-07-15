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
export async function POST(req:Request){

    const body = await req.json();


    const {data,error}=await supabase
        .from("records")
        .insert([
            {
                ticker:body.ticker,
                date:body.date,
                price:body.price,
                notes:body.notes
            }
        ])
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