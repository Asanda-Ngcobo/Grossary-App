import { NextResponse } from "next/server";


export async function POST(req) {
  const { token } = await req.json();
  const secret = process.env.TURNSTILE_SECRET_KEY;
try{
    const verifyResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    }
  );
  const data = await verifyResponse.json();
   if (!data.success) {
    return NextResponse.json({ success: false, data }, { status: 400 });
  }
}catch(error){
  console.log(error.message)
}




 

  return NextResponse.json({ success: true });
}
