"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import QRCode from "qrcode";
import Image from "next/image";
import { createClient } from "@/app/_utils/supabase/client";

export default function CardPage() {
 
  const supabase = createClient();

  const [cardData, setCardData] = useState(null);
  



  async function fetchCard() {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("id", card)
      .single();

    if (!error && data) {
      setCardData(data);

      // generate QR
      const qrImage = await QRCode.toDataURL(data.barcode_value);
      setQr(qrImage);
    }
  }

  if (!cardData) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-xl font-bold mb-2">{cardData.name}</h1>

      <p className="text-gray-500 mb-4">
        {cardData.card_number}
      </p>

      {/* QR Code */}
      {qr && (
        <Image
          src={qr}
          alt="QR Code"
          className="mx-auto mb-4"
        />
      )}

      <p className="text-sm text-gray-400">
        Scan at checkout
      </p>
    </div>
  );
}