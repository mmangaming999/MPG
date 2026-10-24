"use strict";
const canvas=document.getElementById('screen'),ctx=canvas.getContext('2d');
function resize(){const d=window.devicePixelRatio||1;canvas.width=Math.round(innerWidth*d);canvas.height=Math.round(innerHeight*d);ctx.setTransform(d,0,0,d,0,0);}
addEventListener('resize',resize);resize();
function name(k){k=k.toLowerCase();return k===' '?'space':k.startsWith('arrow')?k.slice(5):k;}
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();window.mpg.event({type:'keydown',key:name(e.key)});});
addEventListener('keyup',e=>window.mpg.event({type:'keyup',key:name(e.key)}));
addEventListener('blur',()=>window.mpg.event({type:'blur'}));
canvas.addEventListener('mousemove',e=>{let r=canvas.getBoundingClientRect();window.mpg.event({type:'mouse',x:e.clientX-r.left,y:e.clientY-r.top});});
canvas.addEventListener('mousedown',e=>window.mpg.event({type:'mousedown',button:e.button+1}));
addEventListener('mouseup',e=>window.mpg.event({type:'mouseup',button:e.button+1}));
canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.mpg.onFrame(data=>{ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.restore();ctx.fillStyle=data.background;ctx.fillRect(0,0,innerWidth,innerHeight);for(const o of data.stamps){if(!o.visible)continue;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.rotation*Math.PI/180);ctx.fillStyle=o.color;const d=Array.isArray(o.dim)?o.dim:[o.dim,o.dim];switch(o.shape){case 'circle':ctx.beginPath();ctx.arc(0,0,Math.abs(o.dim),0,Math.PI*2);ctx.fill();break;case 'square':case 'rectangle':ctx.fillRect(-d[0]/2,-d[1]/2,d[0],d[1]);break;case 'triangle':ctx.beginPath();ctx.moveTo(0,-d[1]/2);ctx.lineTo(d[0]/2,d[1]/2);ctx.lineTo(-d[0]/2,d[1]/2);ctx.closePath();ctx.fill();break;case 'line':ctx.fillRect(-d[0]/2,-d[1]/2,d[0],d[1]);break;default:break;}ctx.restore();}for(const t of data.text){ctx.fillStyle=t.color;ctx.font=`${t.size}px sans-serif`;ctx.fillText(t.text,t.x,t.y);}});
