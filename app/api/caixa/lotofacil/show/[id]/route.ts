import axios from "axios";
import https from "https";
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export async function GET(req: Request, context: { params: Promise<Params> }) {
  // Garante que context.params seja tratado como um Promise
  const params = await Promise.resolve(context.params);
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/" + id;

  axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const data = await axios.get(url).then(response => response.data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}