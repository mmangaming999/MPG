"use strict";
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const stamps = new Map(); let nextId=1, cursor={x:0,y:0}, bg='black', window=null, open=false;
let target=60, last=0, start=Date.now(), keys=new Set(), newly=new Set(), mouse={x:0,y:0,buttons:new Set()}, textQueue=[];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const valid=id=>{if(!stamps.has(id))throw Error('MPG: Invalid stamp ID '+id);return stamps.get(id)};
const numeric=x=>{if(!Number.isFinite(Number(x)))throw Error('MPG: Expected finite number');return Number(x)};
const safeColor=c=>String(c);
ipcMain.on('mpg:event',(_,ev)=>{if(ev.type==='keydown'){if(!keys.has(ev.key))newly.add(ev.key);keys.add(ev.key);} else if(ev.type==='keyup'){keys.delete(ev.key);}else if(ev.type==='blur'){keys.clear();newly.clear();mouse.buttons.clear();}else if(ev.type==='mouse'){mouse.x=ev.x;mouse.y=ev.y;}else if(ev.type==='mousedown')mouse.buttons.add(ev.button);else if(ev.type==='mouseup')mouse.buttons.delete(ev.button);});
function win(title,w,h){if(open)throw Error('MPG: Window already open');if(!app.isReady())throw Error('MPG: Electron not ready');w=Math.max(1,Math.round(numeric(w)));h=Math.max(1,Math.round(numeric(h)));window=new BrowserWindow({title:String(title),width:w,height:h,useContentSize:true,webPreferences:{nodeIntegration:false,contextIsolation:true,preload:path.join(__dirname,'preload.js')}});window.setMenuBarVisibility(false);window.loadFile(path.join(__dirname,'renderer.html'));open=true;window.on('closed',()=>{open=false;window=null;keys.clear();});last=0;start=Date.now();return true;}
function quit(){if(window&&!window.isDestroyed())window.close();open=false;}
function isopen(){return open;}
function fps(v){target=numeric(v);if(target<=0||target>1000)throw Error('MPG: FPS must be between 0 and 1000');}
function background(c){bg=safeColor(c);}
function clear(c){if(c!==undefined)bg=safeColor(c);textQueue=[];}
function stamp(shape,dim,col){let id=nextId++;stamps.set(id,{id,shape:String(shape).toLowerCase(),dim:Array.isArray(dim)?dim.map(numeric):numeric(dim),color:safeColor(col),x:cursor.x,y:cursor.y,rotation:0,visible:true});return id;}
function clone(id){let o=valid(id),id2=nextId++;stamps.set(id2,{...o,id:id2,dim:Array.isArray(o.dim)?[...o.dim]:o.dim});return id2;}
function del(id){valid(id);stamps.delete(id);}
function goto(...a){if(a.length===2){cursor={x:numeric(a[0]),y:numeric(a[1])};return;}if(a.length===3){let o=valid(a[0]);o.x=numeric(a[1]);o.y=numeric(a[2]);return;}throw Error('MPG: goto(x,y) or goto(id,x,y)');}
function move(...a){if(a.length===2){cursor.x+=numeric(a[0]);cursor.y+=numeric(a[1]);return;}if(a.length===3){let o=valid(a[0]);o.x+=numeric(a[1]);o.y+=numeric(a[2]);return;}throw Error('MPG: move(dx,dy) or move(id,dx,dy)');}
function posx(id){return id===undefined?cursor.x:valid(id).x;}
function posy(id){return id===undefined?cursor.y:valid(id).y;}
function size(id,s){valid(id).dim=Array.isArray(s)?s.map(numeric):numeric(s);}
function color(id,c){valid(id).color=safeColor(c);}
function rotate(id,deg){valid(id).rotation=numeric(deg);}
function show(id,v=true){valid(id).visible=Boolean(v);}
function bounds(s){const d=Array.isArray(s.dim)?s.dim:[s.dim,s.dim];let w=Math.abs(d[0]),h=Math.abs(d[1]);if(s.shape==='circle'){w=h=2*Math.abs(s.dim);}let r=numeric(s.rotation)*Math.PI/180, cw=Math.abs(Math.cos(r))*w+Math.abs(Math.sin(r))*h,ch=Math.abs(Math.sin(r))*w+Math.abs(Math.cos(r))*h;return {left:s.x-cw/2,right:s.x+cw/2,top:s.y-ch/2,bottom:s.y+ch/2};}
function touching(a,b){let s=valid(a),t=valid(b);let x=bounds(s),y=bounds(t);return x.left<=y.right&&x.right>=y.left&&x.top<=y.bottom&&x.bottom>=y.top;}
function key(k){return keys.has(String(k).toLowerCase());}
function keypressed(k){k=String(k).toLowerCase();const was=newly.has(k);newly.delete(k);return was;}
function mox(){return mouse.x;}
function moy(){return mouse.y;}
function moc(btn=1){return mouse.buttons.has(Number(btn));}
function drawtext(text,x,y,sz=20,col='white'){textQueue.push({text:String(text),x:numeric(x),y:numeric(y),size:numeric(sz),color:safeColor(col)});}
function ticks(){return Date.now()-start;}
async function waitframe(){let delay=Math.max(0,1000/target-(Date.now()-last));if(delay>0)await sleep(delay);}
async function update(){if(!open)return;await waitframe();if(!open)return;last=Date.now();if(window&&!window.isDestroyed())window.webContents.send('mpg:frame',{background:bg,stamps:[...stamps.values()],text:textQueue});textQueue=[];}
module.exports={win,quit,isopen,fps,clear,update,background,stamp,clone,delete:del,goto,move,posx,posy,size,color,rotate,touching,key,keypressed,mox,moy,moc,drawtext,waitframe,ticks,show,ready:()=>app.whenReady()};
