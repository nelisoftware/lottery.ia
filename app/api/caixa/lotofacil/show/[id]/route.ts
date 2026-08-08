import axios from "axios";
import { NextResponse } from 'next/server';

type Params = {
  id: string;
};

export async function GET(req: Request, context: { params: Promise<Params> }) {
  const params = await context.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  // API alternativa — NÃO envie headers da Caixa aqui!
  const url = `https://loteriascaixa-api.herokuapp.com/api/lotofacil/${id}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Heroku API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch data', 
        details: error.message,
        status: error.response?.status 
      }, 
      { status: 500 }
    );
  }
}

// import { caixaHeaders } from "@/libraries/db/caixaHeaders";
// import axios from "axios";
// import https from "https";
// import { NextResponse } from 'next/server';

// type Params = {
//   id: string;
// };

// export const preferredRegion = "gru1";

// export async function GET(req: Request, context: { params: Promise<Params> }) {
//   // Garante que context.params seja tratado como um Promise
//   const params = await Promise.resolve(context.params);
//   const { id } = params;

//   if (!id) {
//     return NextResponse.json({ error: 'ID is required' }, { status: 400 });
//   }

//   // const url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/" + id;  
//   const url = `https://loteriascaixa-api.herokuapp.com/api/lotofacil/${id}`;

//   axios.defaults.httpsAgent = new https.Agent({
//     rejectUnauthorized: false,
//   });

//   try {
//     const data = await axios.get(url, { headers: caixaHeaders }).then(response => response.data);
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
//   }
// }