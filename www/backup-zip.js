// Small ZIP/STORE codec: no network dependency, compression bombs or path extraction.
(() => {
 'use strict';
 const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true}),MAX=150*1024*1024;
 const table=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
 function crc(bytes){let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
 const valid=name=>typeof name==='string'&&/^[A-Za-z0-9_./-]{1,180}$/.test(name)&&!name.startsWith('/')&&!name.split('/').some(x=>x==='..'||x==='.'||!x);
 function pack(files){
  if(files.length>10000)throw Error('Too many backup files');let size=22;const seen=new Set();
  const items=files.map(f=>{if(!valid(f.name)||seen.has(f.name)||!(f.bytes instanceof Uint8Array))throw Error('Invalid archive entry');seen.add(f.name);const name=encoder.encode(f.name);size+=76+name.length*2+f.bytes.length;return {...f,nameBytes:name,crc:crc(f.bytes)};});
  if(size>MAX)throw Error('Backup exceeds 150 MB');const bytes=new Uint8Array(size),v=new DataView(bytes.buffer);let p=0;
  for(const f of items){f.offset=p;v.setUint32(p,0x04034b50,true);v.setUint16(p+4,20,true);v.setUint16(p+6,0x800,true);v.setUint32(p+14,f.crc,true);v.setUint32(p+18,f.bytes.length,true);v.setUint32(p+22,f.bytes.length,true);v.setUint16(p+26,f.nameBytes.length,true);bytes.set(f.nameBytes,p+30);bytes.set(f.bytes,p+30+f.nameBytes.length);p+=30+f.nameBytes.length+f.bytes.length;}
  const start=p;for(const f of items){v.setUint32(p,0x02014b50,true);v.setUint16(p+4,20,true);v.setUint16(p+6,20,true);v.setUint16(p+8,0x800,true);v.setUint32(p+16,f.crc,true);v.setUint32(p+20,f.bytes.length,true);v.setUint32(p+24,f.bytes.length,true);v.setUint16(p+28,f.nameBytes.length,true);v.setUint32(p+42,f.offset,true);bytes.set(f.nameBytes,p+46);p+=46+f.nameBytes.length;}
  v.setUint32(p,0x06054b50,true);v.setUint16(p+8,items.length,true);v.setUint16(p+10,items.length,true);v.setUint32(p+12,p-start,true);v.setUint32(p+16,start,true);return bytes;
 }
 function unpack(bytes){
  if(!(bytes instanceof Uint8Array)||bytes.length<22||bytes.length>MAX)throw Error('Invalid backup size');const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),end=bytes.length-22;
  if(v.getUint32(end,true)!==0x06054b50||v.getUint16(end+4,true)||v.getUint16(end+6,true)||v.getUint16(end+20,true))throw Error('Invalid ZIP footer');
  const count=v.getUint16(end+10,true),start=v.getUint32(end+16,true),centralSize=v.getUint32(end+12,true);if(count>10000||count!==v.getUint16(end+8,true)||start+centralSize!==end)throw Error('Invalid ZIP index');
  let p=start,total=0;const files=new Map(),ranges=[];
  for(let i=0;i<count;i++){
   if(p+46>end||v.getUint32(p,true)!==0x02014b50)throw Error('Invalid ZIP entry');const flags=v.getUint16(p+8,true),method=v.getUint16(p+10,true),checksum=v.getUint32(p+16,true),size=v.getUint32(p+20,true),original=v.getUint32(p+24,true),n=v.getUint16(p+28,true),extra=v.getUint16(p+30,true),comment=v.getUint16(p+32,true),off=v.getUint32(p+42,true);
   if(method!==0||(flags&~0x800)||size!==original||p+46+n+extra+comment>end||off+30>start)throw Error('Use the ZIP created by Pet Care');
   const name=decoder.decode(bytes.subarray(p+46,p+46+n));if(!valid(name)||files.has(name))throw Error('Unsafe or duplicate archive name');if(v.getUint32(off,true)!==0x04034b50||v.getUint16(off+6,true)!==flags||v.getUint16(off+8,true)!==method||v.getUint32(off+14,true)!==checksum||v.getUint32(off+18,true)!==size||v.getUint32(off+22,true)!==original)throw Error('Invalid local entry');
   const nn=v.getUint16(off+26,true),xx=v.getUint16(off+28,true),from=off+30+nn+xx,to=from+size;if(to>start||decoder.decode(bytes.subarray(off+30,off+30+nn))!==name)throw Error('Invalid entry bounds');const data=bytes.subarray(from,to);if(crc(data)!==checksum)throw Error('Backup file is damaged');total+=size;if(total>MAX)throw Error('Backup too large');ranges.push([off,to]);files.set(name,data);p+=46+n+extra+comment;
  }
  if(p!==end)throw Error('Invalid index length');ranges.sort((a,b)=>a[0]-b[0]);for(let i=1;i<ranges.length;i++)if(ranges[i][0]<ranges[i-1][1])throw Error('Overlapping entries');return files;
 }
 window.petCareZip={pack,unpack,maxBytes:MAX};
})();
