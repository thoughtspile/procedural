import{s as v,f as q,w as y,p as c}from"./perlin-84837d9b.js";const h=()=>{for(;;){const e=q(1)[0],{s,l:r}=y(e).toHsl();if(r>20&&r<65)return console.log(s,r),e}};let E=h();const t={time:0,noiseFreq:150,period:1e3,grid:10,radius:1.5,warpQ:3};function F(e){const{radius:s,warpQ:r,noiseFreq:a,time:l,grid:u}=t,m=window.innerWidth,p=window.innerHeight;e.width=m,e.height=p;const d=e.getContext("2d");for(let i=0;i<p;i+=u)for(let o=0;o<m;o+=u){const g=s*.5*u*(.5+.5*c(o/a+r*c(o/a,i/a,l),i/a+r*c(o/a,i/a,l),l));d.beginPath(),d.ellipse(o,i,g,g,0,2*Math.PI,0),d.fillStyle=E,d.fill()}}v(Math.random());const n={radius:document.getElementById("radius-scale"),warp:document.getElementById("warp-amount"),noiseFreq:document.getElementById("noise-freq"),period:document.getElementById("period"),canvas:document.getElementById("app"),regenerate:document.getElementById("regenerate")};n.radius.value=t.radius;n.radius.addEventListener("input",e=>t.radius=Number(e.target.value));n.warp.value=t.warpQ;n.warp.addEventListener("input",e=>t.warpQ=Number(e.target.value));n.noiseFreq.value=t.noiseFreq;n.noiseFreq.addEventListener("input",e=>t.noiseFreq=Number(e.target.value));n.period.value=t.period;n.period.addEventListener("input",e=>t.period=Number(e.target.value));n.regenerate.addEventListener("click",()=>{v(Math.random()),E=h()});let w=Date.now();const f=()=>{t.time+=(Date.now()-w)/t.period,w=Date.now(),F(n.canvas),requestAnimationFrame(f)};f();