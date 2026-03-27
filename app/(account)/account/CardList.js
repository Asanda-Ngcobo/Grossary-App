'use client'
import Image from "next/image";
import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export default function CardList({ cards }) {
  const [qrMap, setQrMap] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const barcodeRefs = useRef({});

 useEffect(() => {
  if (!cards || cards.length === 0) return;

  async function generateAllQRs() {
    const entries = await Promise.all(
      cards
        .filter(card => !card.name?.toLowerCase().includes('checkers')) // skip checkers
        .map(async (card) => {
          const qrImage = await QRCode.toDataURL(card.card_number);
          return [card.id, qrImage];
        })
    );

    setQrMap(Object.fromEntries(entries));
  }

  generateAllQRs();
}, [cards]);

  useEffect(() => {
    if (!expandedId) return;
    const svgEl = barcodeRefs.current[expandedId];
    if (!svgEl) return;

    const card = cards.find((c) => c.id === expandedId);
    if (!card) return;

    JsBarcode(svgEl, card.card_number, {
      format: "CODE128",
      lineColor: "#000",
      width: 2.5,
      height: 100,
      displayValue: false,
      margin: 0,
    });
  }, [expandedId, cards]);

  function toggleCard(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

function getCardStyle(name) {
  const n = name?.toLowerCase() ?? "";

  const stores = {
    shoprite: ["shoprite"],
    checkers: ["checkers"],
    pnp: ["pick n pay", "pnp"],
    woolworths: ["woolworths", "woolies"],
    spar: ["spar"],
  };

  if (stores.shoprite.some(s => n.includes(s)))
    return { tw: "from-purple-700 to-purple-500", style: {} };

  if (stores.checkers.some(s => n.includes(s)))
    return {
      tw: "",
      style: { background: "linear-gradient(135deg, #38A8AE, #2d8f94)" },
    };

  if (stores.pnp.some(s => n.includes(s)))
    return { tw: "from-blue-700 to-blue-500", style: {} };

  if (stores.woolworths.some(s => n.includes(s)))
    return { tw: "from-zinc-900 to-zinc-700", style: {} };

  if (stores.spar.some(s => n.includes(s)))
    return {
      tw: "",
      style: { background: "linear-gradient(135deg, #157946, #0f5c36)" },
    };





  return { tw: "from-zinc-800 to-zinc-600", style: {} };
}

  const gradients = [
    "from-zinc-900 to-zinc-700",
    "from-cyan-600 to-cyan-400",
    "from-purple-950 to-purple-600",
    "from-green-700 to-green-500",
    "from-red-950 to-red-600",
  ];


  return (
    <div className="space-y-4 px-4">
      {cards.map((card, index) => {
        const isExpanded = expandedId === card.id;
        const gradient = gradients[index % gradients.length];
        const { tw, style } = getCardStyle(card.name);
    function formatCardNumber(number) {
  return number.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}
// const isCheckers = card.name?.toLowerCase().includes('checkers');
// const qrUrl = `https://www.checkers.co.za/qr/?cardno=${card.card_number}`;

        return (
          <div
            key={card.id}
            onClick={() => toggleCard(card.id)}
            className={`
              ${tw ? `bg-gradient-to-br ${tw}` : `bg-gradient-to-br ${gradient}`}
              text-white cursor-pointer overflow-hidden
              transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${isExpanded
                ? "fixed inset-0 z-50 rounded-none"
                : "relative w-full rounded-2xl shadow-md hover:shadow-xl"
              }
            `}
            style={style}
          >
            {/* Gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {isExpanded ? (
              <div className="flex flex-col w-full h-full px-6 py-10 justify-between">


                {/* Top: store name + close */}
                <div className="flex flex-col items-start justify-between h-3/4 rotate-90">
                 
                    
                    <p className="text-xs opacity-40 tracking-widest uppercase mt-2">
                      Tap to close
                    </p>
                  
                      {/* Middle: barcode */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-4xl
                  capitalize font-extrabold tracking-tight drop-shadow ">
                   {card.name}
                  </p>
                  <div className="bg-white rounded-md px-5 py-4 shadow-2xl">
                    <svg
                      ref={(el) => (barcodeRefs.current[card.id] = el)}
                      className="w-full"
                    />
                  </div>
                  <p className="text-lg font-mono tracking-widest opacity-60">
                     {formatCardNumber(card.card_number)}
                  </p>
                </div>
                  <p className="text-xs opacity-40 tracking-widest uppercase mt-2">
                    Tap to close
                  </p>
                </div>

            

  
              </div>
            ) : (
              <div className="p-5 flex items-center justify-between">
                <p className="text-lg font-bold tracking-wide drop-shadow">
                  {card.name}
                </p>
                <p className="text-xs opacity-40 tracking-widest uppercase">
                  Tap to scan
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}