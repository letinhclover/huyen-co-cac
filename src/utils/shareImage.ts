// ============================================================
// shareImage.ts — Ảnh chia sẻ SÁNG - SẠCH - ĐẸP
// Palette sáng: kem trắng + vàng gold + chữ đen
// ============================================================
const APP_URL  = "lich-van-nien.pages.dev";
const APP_FULL = "https://lich-van-nien.pages.dev";
const APP_NAME = "Lịch Vạn Niên AI 2026";
const APP_INVITE = "✨ Dùng miễn phí tại " + APP_URL;
const BG    = "#FEFBF3"; const CARD  = "#FFFFFF";
const GOLD  = "#B8720A"; const GOLD2 = "#D4920D";
const TXT_H = "#1A1208"; const TXT_B = "#3D3020";
const TXT_M = "#7A6545"; const BORDER= "#E8D9BB";
const GREEN = "#16a34a"; const RED   = "#dc2626";
const FONT  = "system-ui, sans-serif";

function rr(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.arcTo(x+w,y,x+w,y+r,r);
  c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);c.lineTo(x+r,y+h);
  c.arcTo(x,y+h,x,y+h-r,r);c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath();
}
function wrap(c:CanvasRenderingContext2D,t:string,maxW:number):string[]{
  const words=t.split(" "),lines:string[]=[];let cur="";
  for(const w of words){const test=cur?`${cur} ${w}`:w;if(c.measureText(test).width>maxW&&cur){lines.push(cur);cur=w;}else cur=test;}
  if(cur)lines.push(cur);return lines;
}
function drawHeader(c:CanvasRenderingContext2D,W:number,icon:string,title:string,sub:string){
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,GOLD);g.addColorStop(1,GOLD2);
  c.fillStyle=g;c.fillRect(0,0,W,4);
  c.fillStyle="#FEF3DC";rr(c,24,18,48,48,12);c.fill();
  c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
  c.font=`26px ${FONT}`;c.textAlign="center";c.textBaseline="middle";c.fillStyle=GOLD;c.fillText(icon,48,42);
  c.textAlign="left";c.textBaseline="top";
  c.font=`700 18px ${FONT}`;c.fillStyle=TXT_H;c.fillText(title,84,18);
  c.font=`400 13px ${FONT}`;c.fillStyle=TXT_M;c.fillText(sub,84,42);
}
function drawInvite(c:CanvasRenderingContext2D,W:number,y:number){
  c.fillStyle="#FEF3DC";rr(c,24,y,W-48,32,8);c.fill();
  c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
  c.font=`600 13px ${FONT}`;c.fillStyle=GOLD;c.textAlign="center";c.textBaseline="middle";
  c.fillText(APP_INVITE,W/2,y+16);
}
function drawFooter(c:CanvasRenderingContext2D,W:number,H:number){
  c.strokeStyle=BORDER;c.lineWidth=1;c.beginPath();c.moveTo(24,H-32);c.lineTo(W-24,H-32);c.stroke();
  c.font=`600 11px ${FONT}`;c.fillStyle=GOLD;c.textAlign="left";c.textBaseline="middle";c.fillText(`📅 ${APP_NAME}`,24,H-16);
  c.fillStyle=TXT_M;c.textAlign="right";c.fillText(APP_URL,W-24,H-16);
}
function makeCanvas(W:number,H:number){
  const cv=document.createElement("canvas");cv.width=W;cv.height=H;return cv;
}

// ─── Fortune (AI Luận Giải) ───────────────────────────────────
export async function shareFortuneImage(opts:{dateLabel:string;canChiDay:string;topic:string;content:string;canChiYear:string}):Promise<boolean>{
  const W=780,P=24,cv=makeCanvas(W,480),c=cv.getContext("2d")!;if(!c)return false;
  c.fillStyle=BG;c.fillRect(0,0,W,480);
  drawHeader(c,W,"✨",opts.topic,`${opts.canChiDay} · Tuổi ${opts.canChiYear} · ${opts.dateLabel}`);
  c.strokeStyle=BORDER;c.lineWidth=1;c.beginPath();c.moveTo(P,78);c.lineTo(W-P,78);c.stroke();
  c.fillStyle=CARD;rr(c,P,88,W-P*2,318,14);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
  c.font=`bold 56px ${FONT}`;c.fillStyle="#F5E6C8";c.textAlign="left";c.textBaseline="top";c.fillText("\u201C",P+14,84);
  c.font=`400 17px ${FONT}`;c.fillStyle=TXT_B;
  let y=114;for(const l of wrap(c,opts.content,W-P*2-48).slice(0,10)){c.fillText(l,P+24,y);y+=29;}
  drawInvite(c,W,420);drawFooter(c,W,480);
  const txt=`${opts.topic} ngày ${opts.dateLabel} — tuổi ${opts.canChiYear}\n\n${opts.content.slice(0,200)}\n\n${APP_INVITE}\n${APP_FULL}`;
  return _share(cv,`Luận giải ${opts.topic}`,txt);
}

// ─── Tử Vi ───────────────────────────────────────────────────
export async function shareTuviImage(opts:{canChiYear:string;gender:string;sections:{emoji:string;label:string;content:string}[]}):Promise<boolean>{
  const W=780,P=24,cv=makeCanvas(W,580),c=cv.getContext("2d")!;if(!c)return false;
  c.fillStyle=BG;c.fillRect(0,0,W,580);
  drawHeader(c,W,"🔮","Tử Vi Trọn Đời",`${opts.gender==="nam"?"👨":"👩"} Tuổi ${opts.canChiYear}`);
  c.strokeStyle=BORDER;c.lineWidth=1;c.beginPath();c.moveTo(P,78);c.lineTo(W-P,78);c.stroke();
  const cw=(W-P*2-12)/2,ch=190;
  opts.sections.slice(0,4).forEach((s,i)=>{
    const col=i%2,row=Math.floor(i/2),x=P+col*(cw+12),y=90+row*(ch+12);
    c.fillStyle=CARD;rr(c,x,y,cw,ch,12);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
    const g2=c.createLinearGradient(x,y,x+cw,y);g2.addColorStop(0,"#FEF3DC");g2.addColorStop(1,"#FFFBF0");
    c.fillStyle=g2;c.beginPath();c.moveTo(x+12,y);c.lineTo(x+cw-12,y);c.arcTo(x+cw,y,x+cw,y+12,12);
    c.lineTo(x+cw,y+36);c.lineTo(x,y+36);c.lineTo(x,y+12);c.arcTo(x,y,x+12,y,12);c.closePath();c.fill();
    c.font=`700 13px ${FONT}`;c.fillStyle=GOLD;c.textAlign="left";c.textBaseline="middle";c.fillText(`${s.emoji} ${s.label}`,x+12,y+18);
    c.font=`400 13px ${FONT}`;c.fillStyle=TXT_B;c.textBaseline="top";
    wrap(c,s.content,cw-24).slice(0,6).forEach((l,li)=>c.fillText(l,x+12,y+44+li*22));
  });
  drawInvite(c,W,502);drawFooter(c,W,580);
  const txt=opts.sections.map(s=>`${s.emoji} ${s.label}: ${s.content.slice(0,80)}`).join("\n")+`\n\n${APP_INVITE}\n${APP_FULL}`;
  return _share(cv,`Tử vi tuổi ${opts.canChiYear}`,txt);
}

// ─── Xem Tuổi ────────────────────────────────────────────────
export async function shareXemTuoiImage(opts:{mode:"capdoi"|"laman";canChiA:string;canChiB:string;labelA:string;labelB:string;diem:number;danhGia:string;tongQuan:string;ketLuan:string}):Promise<boolean>{
  const W=780,P=24,cv=makeCanvas(W,460),c=cv.getContext("2d")!;if(!c)return false;
  c.fillStyle=BG;c.fillRect(0,0,W,460);
  drawHeader(c,W,opts.mode==="capdoi"?"💑":"🤝",opts.mode==="capdoi"?"Hợp Đôi Tình Duyên":"Xem Tuổi Làm Ăn",`${opts.labelA} ${opts.canChiA}  ⟷  ${opts.labelB} ${opts.canChiB}`);
  c.strokeStyle=BORDER;c.lineWidth=1;c.beginPath();c.moveTo(P,78);c.lineTo(W-P,78);c.stroke();
  const sc=Math.round(opts.diem),sc_col=sc>=80?GREEN:sc>=60?GOLD:sc>=40?"#f97316":RED;
  const cx=P+52,cy=148,R=44;
  c.fillStyle="#FEF9F0";c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.fill();
  c.strokeStyle=sc_col;c.lineWidth=3;c.stroke();
  c.font=`800 26px ${FONT}`;c.fillStyle=sc_col;c.textAlign="center";c.textBaseline="middle";c.fillText(`${sc}`,cx,cy-5);
  c.font=`500 11px ${FONT}`;c.fillStyle=TXT_M;c.fillText("điểm",cx,cy+14);
  c.textAlign="left";c.textBaseline="top";
  c.font=`700 18px ${FONT}`;c.fillStyle=TXT_H;c.fillText(opts.danhGia,P+112,94);
  c.font=`400 14px ${FONT}`;c.fillStyle=TXT_B;
  wrap(c,opts.tongQuan,W-P*2-120).slice(0,3).forEach((l,i)=>c.fillText(l,P+112,118+i*22));
  c.fillStyle="#FFFBEF";rr(c,P,204,W-P*2,156,12);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
  c.font=`600 12px ${FONT}`;c.fillStyle=GOLD;c.textBaseline="top";c.fillText("💡 Kết Luận & Lời Khuyên",P+16,218);
  c.font=`400 14px ${FONT}`;c.fillStyle=TXT_B;
  wrap(c,opts.ketLuan,W-P*2-32).slice(0,5).forEach((l,i)=>c.fillText(l,P+16,240+i*22));
  drawInvite(c,W,372);drawFooter(c,W,460);
  const txt=`${opts.mode==="capdoi"?"💑 Hợp Đôi":"🤝 Làm Ăn"}: ${opts.canChiA} & ${opts.canChiB} — ${sc} điểm\n${opts.danhGia}\n\n${opts.ketLuan}\n\n${APP_INVITE}\n${APP_FULL}`;
  return _share(cv,opts.mode==="capdoi"?"Hợp Đôi Tình Duyên":"Xem Tuổi Làm Ăn",txt);
}

// ─── Hỏi Thầy ────────────────────────────────────────────────
export async function shareThayImage(opts:{tenQue:string;trieuTuong:string;cauHoi:string;luanGiai:string}):Promise<boolean>{
  const W=780,P=24,cv=makeCanvas(W,480),c=cv.getContext("2d")!;if(!c)return false;
  c.fillStyle=BG;c.fillRect(0,0,W,480);
  drawHeader(c,W,"🧓","Hỏi Thầy Lão Đại",`${opts.tenQue} — ${opts.trieuTuong}`);
  c.strokeStyle=BORDER;c.lineWidth=1;c.beginPath();c.moveTo(P,78);c.lineTo(W-P,78);c.stroke();
  c.fillStyle="#EFF6FF";rr(c,P,88,W-P*2,42,10);c.fill();c.strokeStyle="#BAE6FD";c.lineWidth=1;c.stroke();
  c.font=`500 13px ${FONT}`;c.fillStyle="#0369a1";c.textAlign="left";c.textBaseline="middle";
  c.fillText(`❓ "${opts.cauHoi.slice(0,80)}${opts.cauHoi.length>80?"...":""}"`,P+14,109);
  c.fillStyle=CARD;rr(c,P,140,W-P*2,276,14);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
  c.font=`bold 56px ${FONT}`;c.fillStyle="#F5E6C8";c.textBaseline="top";c.textAlign="left";c.fillText("\u201C",P+14,136);
  c.font=`400 16px ${FONT}`;c.fillStyle=TXT_B;c.textBaseline="top";
  let y=162;for(const l of wrap(c,opts.luanGiai,W-P*2-48).slice(0,9)){c.fillText(l,P+24,y);y+=28;}
  drawInvite(c,W,430);drawFooter(c,W,480);
  const txt=`🧓 Thầy Lão Đại giải quẻ ${opts.tenQue}\n❓ "${opts.cauHoi}"\n\n${opts.luanGiai}\n\n${APP_INVITE}\n${APP_FULL}`;
  return _share(cv,`Hỏi Thầy — ${opts.tenQue}`,txt);
}

// ─── La Bàn Phong Thủy ───────────────────────────────────────
export async function shareFengShuiImage(opts:{kua:number;cung:string;tractName:string;catDirs:{label:string;dir:string;badge:string}[];hungDirs:{label:string;dir:string;badge:string}[]}):Promise<boolean>{
  const W=780,P=24,cv=makeCanvas(W,500),c=cv.getContext("2d")!;if(!c)return false;
  c.fillStyle=BG;c.fillRect(0,0,W,500);
  drawHeader(c,W,"🧭","Cung Mệnh Phong Thủy",`Cung ${opts.kua} — ${opts.cung} · ${opts.tractName}`);
  c.strokeStyle=BORDER;c.lineWidth=1;c.beginPath();c.moveTo(P,78);c.lineTo(W-P,78);c.stroke();
  const cw=(W-P*2-12)/2;
  // Cat header
  c.fillStyle="#F0FDF4";rr(c,P,88,cw,30,8);c.fill();c.strokeStyle="#BBF7D0";c.lineWidth=1;c.stroke();
  c.font=`700 13px ${FONT}`;c.fillStyle=GREEN;c.textAlign="center";c.textBaseline="middle";c.fillText("✅ 4 Hướng Tốt",P+cw/2,103);
  // Hung header
  const hx=P+cw+12;
  c.fillStyle="#FFF5F5";rr(c,hx,88,cw,30,8);c.fill();c.strokeStyle="#FECACA";c.lineWidth=1;c.stroke();
  c.fillStyle=RED;c.fillText("⚠️ 4 Hướng Tránh",hx+cw/2,103);
  opts.catDirs.forEach((d,i)=>{
    const y=126+i*50;c.fillStyle=i%2===0?CARD:"#FAFAF8";rr(c,P,y,cw,46,8);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
    c.font=`600 13px ${FONT}`;c.fillStyle=TXT_H;c.textAlign="left";c.textBaseline="top";c.fillText(d.label,P+12,y+6);
    c.font=`400 11px ${FONT}`;c.fillStyle=TXT_M;c.fillText(d.badge,P+12,y+24);
    c.font=`700 16px ${FONT}`;c.fillStyle=GREEN;c.textAlign="right";c.textBaseline="middle";c.fillText(d.dir,P+cw-12,y+23);
  });
  opts.hungDirs.forEach((d,i)=>{
    const y=126+i*50;c.fillStyle=i%2===0?CARD:"#FAFAF8";rr(c,hx,y,cw,46,8);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
    c.font=`600 13px ${FONT}`;c.fillStyle=TXT_H;c.textAlign="left";c.textBaseline="top";c.fillText(d.label,hx+12,y+6);
    c.font=`400 11px ${FONT}`;c.fillStyle=TXT_M;c.fillText(d.badge,hx+12,y+24);
    c.font=`700 16px ${FONT}`;c.fillStyle=RED;c.textAlign="right";c.textBaseline="middle";c.fillText(d.dir,hx+cw-12,y+23);
  });
  drawInvite(c,W,442);drawFooter(c,W,500);
  const catTxt=opts.catDirs.map(d=>`${d.label}: ${d.dir}`).join(", ");
  const hTxt=opts.hungDirs.map(d=>`${d.label}: ${d.dir}`).join(", ");
  const txt=`🧭 Cung ${opts.kua} — ${opts.cung} · ${opts.tractName}\n✅ Tốt: ${catTxt}\n⚠️ Tránh: ${hTxt}\n\n${APP_INVITE}\n${APP_FULL}`;
  return _share(cv,`Cung Mệnh ${opts.cung}`,txt);
}

// ─── Thẻ Năng Lượng ──────────────────────────────────────────
export async function shareEnergyImage(opts:{canChiYear:string;elementName:string;todayCanChi:string;category:string;content:string}):Promise<boolean>{
  const W=780,P=24,cv=makeCanvas(W,400),c=cv.getContext("2d")!;if(!c)return false;
  c.fillStyle=BG;c.fillRect(0,0,W,400);
  drawHeader(c,W,"⚡","Thẻ Năng Lượng Hôm Nay",`Tuổi ${opts.canChiYear} · Mệnh ${opts.elementName} · ${opts.todayCanChi}`);
  c.strokeStyle=BORDER;c.lineWidth=1;c.beginPath();c.moveTo(P,78);c.lineTo(W-P,78);c.stroke();
  c.fillStyle="#FEF3DC";rr(c,P,88,140,28,8);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
  c.font=`600 12px ${FONT}`;c.fillStyle=GOLD;c.textAlign="center";c.textBaseline="middle";c.fillText(opts.category,P+70,102);
  c.fillStyle=CARD;rr(c,P,126,W-P*2,210,14);c.fill();c.strokeStyle=BORDER;c.lineWidth=1;c.stroke();
  c.font=`bold 56px ${FONT}`;c.fillStyle="#F5E6C8";c.textAlign="left";c.textBaseline="top";c.fillText("\u201C",P+14,122);
  c.font=`400 17px ${FONT}`;c.fillStyle=TXT_B;c.textBaseline="top";
  let y=148;for(const l of wrap(c,opts.content,W-P*2-48).slice(0,7)){c.fillText(l,P+24,y);y+=28;}
  drawInvite(c,W,348);drawFooter(c,W,400);
  const txt=`⚡ Năng Lượng Hôm Nay — ${opts.category}\nTuổi ${opts.canChiYear} · ${opts.todayCanChi}\n\n${opts.content}\n\n${APP_INVITE}\n${APP_FULL}`;
  return _share(cv,"Thẻ Năng Lượng",txt);
}

// ─── Internal ─────────────────────────────────────────────────
async function _share(cv:HTMLCanvasElement,title:string,text:string):Promise<boolean>{
  try{
    const blob=await new Promise<Blob|null>(r=>cv.toBlob(r,"image/png",0.95));
    if(!blob)return _dl(cv,title);
    const file=new File([blob],"lichvannien.png",{type:"image/png"});
    if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title,text,files:[file]});return true;}
    if(navigator.share){await navigator.share({title,text});return true;}
    return _dl(cv,title);
  }catch{return false;}
}
function _dl(cv:HTMLCanvasElement,title:string):boolean{
  try{const a=document.createElement("a");a.href=cv.toDataURL("image/png",0.95);a.download=`lichvannien-${title.replace(/\s+/g,"-").slice(0,30)}.png`;a.click();return true;}catch{return false;}
}
