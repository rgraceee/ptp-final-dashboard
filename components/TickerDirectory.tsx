"use client";

import { useEffect, useState, useCallback, useRef } from "react";

import { Ticker } from "@/lib/types";




export default function TickerDirectory({

  onSelect

}: {

  onSelect: (symbol: string) => void;

}) {


  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);



  const fetchTickers = useCallback(async () => {

    try {

      setLoading(true);
      setError("");


      const response = await fetch(
        "/api/ticker",
        { credentials: "include" }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to load tickers"
        );

      }


      const data = await response.json();


      setTickers(data);


    }
    catch (err) {

      console.error(
        "Failed loading tickers:",
        err
      );


      setError(
        err instanceof Error ? err.message : "Failed loading tickers"
      );

    }
    finally {

      setLoading(false);

    }
  }, []);




  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchTickers();
  }, [fetchTickers]);







  return (

    <div className="mt-10">


      <button

        onClick={() => setOpen(!open)}

        className="
          w-full
          flex
          justify-between
          items-center
          card
          px-5
          py-4
          text-left
          font-semibold
          text-gray-900
          hover:bg-gray-50
          transition
        "

      >

        <span>
          Browse Tickers
        </span>


        <span className="
          text-gray-500
          text-sm
        ">

          {open ? "▲ Collapse" : "▼ Expand"}

        </span>


      </button>







      {
        open && (

          <div className="
            card
            mt-3
            overflow-hidden
          ">


            {
              loading && (

                <p className="
                  p-4
                  text-gray-500
                ">

                  Loading tickers...

                </p>

              )

            }





            {
              error && (

                <p className="
                  p-4
                  text-red-500
                  text-sm
                ">

                  {error}

                </p>

              )

            }





            {
              !loading && !error && (

                <table className="
                  w-full
                  text-sm
                ">


                  <thead>

                    <tr className="
                      border-b
                      border-gray-100
                      text-left
                      text-gray-500
                    ">


                      <th className="
                        px-4
                        py-3
                        font-medium
                      ">

                        Ticker

                      </th>



                      <th className="
                        px-4
                        py-3
                        font-medium
                      ">

                        Company

                      </th>



                      <th className="
                        px-4
                        py-3
                        font-medium
                      ">

                        Description

                      </th>


                    </tr>

                  </thead>





                  <tbody>


                    {
                      tickers.map((t) => (

                        <tr

                          key={t.id}

                          onClick={() =>
                            onSelect(t.symbol)
                          }

                          className="
                            border-b
                            border-gray-50
                            last:border-0
                            hover:bg-[var(--accent-light)]
                            transition-colors
                            cursor-pointer
                          "

                        >


                          <td

                            className="
                              px-4
                              py-3
                              font-semibold
                            "

                            style={{
                              color:"var(--accent)"
                            }}

                          >

                            {t.symbol}

                          </td>




                          <td className="
                            px-4
                            py-3
                            text-gray-900
                          ">

                            {t.company}

                          </td>




                          <td className="
                            px-4
                            py-3
                            text-gray-500
                          ">

                            {t.description}

                          </td>



                        </tr>

                      ))

                    }


                  </tbody>


                </table>

              )

            }


          </div>

        )

      }



    </div>

  );

}