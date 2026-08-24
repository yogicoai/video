import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'videogen';

// 개발 중 HMR로 연결이 매번 새로 생기는 걸 막기 위해 전역에 캐시한다.
let cached = global._videogenMongo;
if (!cached) {
  cached = global._videogenMongo = { client: null, promise: null };
}

// MONGODB_URI가 비었거나 견본(<cluster> 등)이면 DNS 오류 대신 바로 안내 메시지로 실패시킨다.
export function mongoConfigured() {
  return (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) && !uri.includes('<');
}

export async function getDb() {
  if (cached.client) return cached.client.db(dbName);
  if (!mongoConfigured()) {
    throw new Error('MONGODB_URI가 설정되지 않았습니다. .env.local에 실제 MongoDB(Atlas) 주소를 넣어주세요.');
  }

  if (!cached.promise) {
    cached.promise = new MongoClient(uri, {
      maxPoolSize: 10,
    }).connect();
  }
  cached.client = await cached.promise;
  return cached.client.db(dbName);
}

// 컬렉션 단축 헬퍼
export async function collection(name) {
  const db = await getDb();
  return db.collection(name);
}
