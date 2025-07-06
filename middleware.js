import { NextResponse } from "next/server";

export function middleware(req) {
  const trafficGreenPercent = parseInt(process.env.TRAFFIC_GREEN_PERCENT || "0");
  const blueUrl = process.env.BLUE_URL || "";
  const greenUrl = process.env.GREEN_URL || "";

  if (!blueUrl || !greenUrl) {
    return NextResponse.next(); // Kama URL hazipo, endelea na default
  }

  const randomPercent = Math.floor(Math.random() * 100);
  const useGreen = randomPercent < trafficGreenPercent;
  const redirectUrl = useGreen ? greenUrl : blueUrl;

  // Usirudishe tena kama tayari yuko kwenye deployment sahihi
  if (req.nextUrl.href.startsWith(redirectUrl)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(redirectUrl);
}
