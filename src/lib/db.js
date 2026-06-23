import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'videogen';

// 개발 중 HMR로 연결이 매번 새로 생기는 걸 막기 위해 전역에 캐시한다.
let cached = global._videogenMongo;
if (!cached) {
  cached = global._videogenMongo = { client: null, promise: null };
}

export async function getDb() {
  if (cached.client) return cached.client.db(dbName);

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
