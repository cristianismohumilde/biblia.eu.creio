import { NextResponse } from 'next/server';

export async function GET() {
  const namespace = "biblia-creio-final";
  const key = "hits";
  
  try {
    // Try to increment (up)
    const res = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      // Fallback to just getting the value
      const res2 = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}`, {
        cache: 'no-store'
      });
      if (!res2.ok) throw new Error('API failed');
      const data2 = await res2.json();
      return NextResponse.json({ count: data2.count });
    }
    
    const data = await res.json();
    return NextResponse.json({ count: data.count });
  } catch (error) {
    console.error("Hits API Error:", error);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
