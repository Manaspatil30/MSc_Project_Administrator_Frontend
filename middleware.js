import Cookies from "js-cookie";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request){
    return NextResponse.redirect(new URL("/login", request.url))
}

export const config = {
    matcher: "/"
  };