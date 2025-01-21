import { NextResponse } from "next/server";
import tickets from "@/app/database";

export async function GET() {
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const ticket = await request.json();

  tickets.push({ id: tickets.length + 1, ...ticket });

  return NextResponse.json(tickets);
}

//request for id using Text
// export async function POST(request: Request) {
//   const ticketId = await request.text();

//   const findTicket = tickets.find((ticket) => ticket.id === parseInt(ticketId));

//   return NextResponse.json(findTicket);
// }
