import{f as y,w as D}from"./index-f1008b54.js";import{s as f,p as L,l as h}from"./perlin-4df1f8a2.js";const b=()=>{const[e,r]=y(2).map(o=>D(o)),i=e.isLight()?r:e,l=e.isLight()?e:r;return[i.darken(.2).toRgb(),l.lighten(.2).toRgb()]};let q=b();const k=e=>Math.max(0,Math.min(1,e)),t={time:0,noiseClamp:2,noiseFreq:150,period:1e3};function x(e){const{noiseClamp:r,noiseFreq:i,time:l}=t,[o,p]=q,s=window.innerWidth,g=window.innerHeight;e.width=s,e.height=g;const v=e.getContext("2d"),a=v.getImageData(0,0,s,g);for(let d=0;d<g;d++)for(let m=0;m<s;m++){const u=k(.5+r*L(m/i,d/i,l)),c=4*(d*s+m),C=h(o.r,p.r,u),F=h(o.g,p.g,u),I=h(o.b,p.b,u);a.data[c]=C,a.data[c+1]=F,a.data[c+2]=I,a.data[c+3]=255}v.putImageData(a,0,0)}f(Math.random());const n={clamp:document.getElementById("noise-clamp"),noiseFreq:document.getElementById("noise-freq"),period:document.getElementById("period"),canvas:document.getElementById("app"),regenerate:document.getElementById("regenerate")};n.clamp.value=t.noiseClamp;n.clamp.addEventListener("input",e=>t.noiseClamp=Number(e.target.value));n.noiseFreq.value=t.noiseFreq;n.noiseFreq.addEventListener("input",e=>t.noiseFreq=Number(e.target.value));n.period.value=t.period;n.period.addEventListener("input",e=>t.period=Number(e.target.value));n.regenerate.addEventListener("click",()=>{f(Math.random()),q=b()});let w=Date.now();const E=()=>{t.time+=(Date.now()-w)/t.period,w=Date.now(),x(n.canvas),requestAnimationFrame(E)};E();