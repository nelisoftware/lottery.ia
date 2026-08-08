import { caixaHeaders } from "@/libraries/db/caixaHeaders";
import axios from "axios";
import https from "https";
import { NextResponse } from "next/server";

export const preferredRegion = "gru1";

export async function GET() {
  console.error('fiz aqui primeiro');
  const url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil";
  axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
  })
  const data = await axios.get(url, { headers: caixaHeaders }).then(response => response.data);
  return NextResponse.json(data);
}
