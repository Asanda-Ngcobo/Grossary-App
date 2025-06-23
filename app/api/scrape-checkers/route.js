import { scrapeCheckers } from "@/app/_lib/scrapeCheckers";
import { NextResponse } from "next/server";
import Papa from 'papaparse';



export async function GET() {
  try {
    const products = await scrapeCheckers();
    const csv = Papa.unparse(products);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="checkers-products.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
