import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const chipsPath = path.join(process.cwd(), 'data', 'colorchips.json');
    
    let products = [];
    let chips = [];
    
    if (fs.existsSync(productsPath)) {
      products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    } else {
      return NextResponse.json({ error: 'data/products.json 파일을 찾을 수 없습니다. (Vercel 번들에 포함되지 않았을 수 있습니다)' }, { status: 404 });
    }
    
    if (fs.existsSync(chipsPath)) {
      chips = JSON.parse(fs.readFileSync(chipsPath, 'utf8'));
    }
    
    const uri = process.env.MONGODB_URI || '';
    if (!/^mongodb(\+srv)?:\/\//.test(uri) || uri.includes('<')) {
       return NextResponse.json({ error: 'Vercel에 MONGODB_URI 환경변수가 정상적으로 설정되지 않았습니다.' }, { status: 400 });
    }
    
    const { collection } = await import('@/lib/db');
    
    const pCol = await collection('products');
    const cCol = await collection('colorchips');
    
    // 로컬 데이터로 DB를 덮어쓰기 위해 기존 데이터 초기화
    await pCol.deleteMany({});
    if (products.length > 0) {
      await pCol.insertMany(products);
    }
    
    await cCol.deleteMany({});
    if (chips.length > 0) {
      await cCol.insertMany(chips);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '로컬 JSON 데이터가 MongoDB로 성공적으로 복사되었습니다!',
      migratedProductsCount: products.length,
      migratedColorChipsCount: chips.length 
    });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
