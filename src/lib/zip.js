// 의존성 없는 ZIP(store 방식) 빌더.
// 이미지(PNG/JPG)는 이미 압축돼 있어 deflate 이득이 없으므로 store로 담는다.
// 파일명은 UTF-8 플래그(bit 11)를 세워 한글 폴더/파일명이 윈도우 탐색기에서도 깨지지 않게 한다.

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

export function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

// DOS 시각 포맷 (초는 2초 단위)
function dosTime(d) {
  return ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff;
}
function dosDate(d) {
  return (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;
}

const FLAG_UTF8 = 0x0800;

function localHeader({ nameBytes, crc, size, time, date }) {
  const h = Buffer.alloc(30);
  h.writeUInt32LE(0x04034b50, 0); // signature
  h.writeUInt16LE(20, 4);         // version needed
  h.writeUInt16LE(FLAG_UTF8, 6);
  h.writeUInt16LE(0, 8);          // store
  h.writeUInt16LE(time, 10);
  h.writeUInt16LE(date, 12);
  h.writeUInt32LE(crc, 14);
  h.writeUInt32LE(size, 18);      // compressed
  h.writeUInt32LE(size, 22);      // uncompressed
  h.writeUInt16LE(nameBytes.length, 26);
  h.writeUInt16LE(0, 28);         // extra len
  return Buffer.concat([h, nameBytes]);
}

function centralHeader({ nameBytes, crc, size, time, date, offset }) {
  const h = Buffer.alloc(46);
  h.writeUInt32LE(0x02014b50, 0);
  h.writeUInt16LE(20, 4);   // version made by
  h.writeUInt16LE(20, 6);   // version needed
  h.writeUInt16LE(FLAG_UTF8, 8);
  h.writeUInt16LE(0, 10);   // store
  h.writeUInt16LE(time, 12);
  h.writeUInt16LE(date, 14);
  h.writeUInt32LE(crc, 16);
  h.writeUInt32LE(size, 20);
  h.writeUInt32LE(size, 24);
  h.writeUInt16LE(nameBytes.length, 28);
  h.writeUInt16LE(0, 30);   // extra
  h.writeUInt16LE(0, 32);   // comment
  h.writeUInt16LE(0, 34);   // disk start
  h.writeUInt16LE(0, 36);   // internal attrs
  h.writeUInt32LE(0, 38);   // external attrs
  h.writeUInt32LE(offset, 42);
  return Buffer.concat([h, nameBytes]);
}

function endOfCentralDir({ count, size, offset }) {
  const h = Buffer.alloc(22);
  h.writeUInt32LE(0x06054b50, 0);
  h.writeUInt16LE(0, 4);      // disk
  h.writeUInt16LE(0, 6);      // disk w/ central dir
  h.writeUInt16LE(count, 8);
  h.writeUInt16LE(count, 10);
  h.writeUInt32LE(size, 12);
  h.writeUInt32LE(offset, 16);
  h.writeUInt16LE(0, 20);     // comment len
  return h;
}

/**
 * 엔트리를 하나씩 받아 스트리밍으로 ZIP을 만든다(파일 1개 분량만 메모리에 유지).
 * @param {AsyncIterable<{path: string, data: Buffer}>} entries
 * @returns {ReadableStream<Uint8Array>}
 */
export function createZipStream(entries) {
  return new ReadableStream({
    async start(controller) {
      const central = [];
      let offset = 0;
      const now = new Date();
      const time = dosTime(now);
      const date = dosDate(now);

      try {
        for await (const { path, data } of entries) {
          const nameBytes = Buffer.from(path, 'utf8');
          const crc = crc32(data);
          const meta = { nameBytes, crc, size: data.length, time, date };
          const lh = localHeader(meta);
          controller.enqueue(lh);
          controller.enqueue(data);
          central.push({ ...meta, offset });
          offset += lh.length + data.length;
        }

        const cd = Buffer.concat(central.map(centralHeader));
        controller.enqueue(cd);
        controller.enqueue(endOfCentralDir({ count: central.length, size: cd.length, offset }));
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}
