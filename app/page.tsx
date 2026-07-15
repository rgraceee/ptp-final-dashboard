"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();


  useEffect(() => {

    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);


    return () => clearTimeout(timer);

  }, [router]);



  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
      px-6
    ">


      <div className="
        max-w-xl
        w-full
        text-center
        bg-white
        rounded-3xl
        shadow-lg
        p-10
      ">


        {/* Logo / Icon */}
        <div className="
          mx-auto
          mb-6
          w-20
          h-20
          rounded-2xl
          flex
          items-center
          justify-center
          text-white
          text-3xl
          font-bold
        "
        style={{
          background:"var(--accent)"
        }}
        >
          📈
        </div>



        <h1 className="
          text-4xl
          font-bold
          text-gray-900
          mb-4
        ">
          Stock Analytics Dashboard
        </h1>



        <p className="
          text-gray-500
          text-base
          leading-relaxed
          mb-8
        ">
          Track market prices, analyze stock movements,
          and manage your personal investment records
          in one place.
        </p>



        <div className="
          flex
          justify-center
          items-center
          gap-2
          text-sm
          text-gray-400
        ">

          <div className="
            w-2
            h-2
            rounded-full
            animate-pulse
          "
          style={{
            background:"var(--accent)"
          }}
          />

          Loading your dashboard...

        </div>


      </div>


    </main>

  );
}