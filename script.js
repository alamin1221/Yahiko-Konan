/* ============================================================
   100 Days — YahiKo × KonaN
   Fixed: scroll typewriter + all features
   ============================================================ */
(function(){
'use strict';

const $=(s,d=document)=>d.querySelector(s);
const $$=(s,d=document)=>[...d.querySelectorAll(s)];
const easeOutExpo=t=>t===1?1:1-Math.pow(2,-10*t);
const isMobile=/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.innerWidth<768;

/* ---- vh fix ---- */
function setVh(){document.documentElement.style.setProperty('--vh',window.innerHeight*0.01+'px')}
setVh();window.addEventListener('resize',setVh);

const START_DATE=new Date('2025-12-23T00:00:00');

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load',()=>setTimeout(()=>$('#preloader')?.classList.add('hidden'),2200));
setTimeout(()=>$('#preloader')?.classList.add('hidden'),5000);

/* ============================================================
   SPARKLE TRAIL
   ============================================================ */
const sparkleTrail=$('#sparkleTrail');
const SPARKLE_COLORS=['#ffb7d5','#f2a6cf','#b487e0','#d9c8f5','#ffd6ea'];
let sparkleTh=0;
function mkSparkle(x,y){
  if(!sparkleTrail)return;
  const d=document.createElement('div');
  d.className='sparkle-dot';
  const c=SPARKLE_COLORS[Math.random()*SPARKLE_COLORS.length|0];
  const s=Math.random()*5+2;
  d.style.cssText=`left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${c};box-shadow:0 0 ${s+3}px ${c}`;
  sparkleTrail.appendChild(d);
  setTimeout(()=>d.remove(),700);
}
document.addEventListener('mousemove',e=>{if(Date.now()-sparkleTh<45)return;sparkleTh=Date.now();mkSparkle(e.clientX,e.clientY)});
document.addEventListener('touchmove',e=>{if(Date.now()-sparkleTh<35)return;sparkleTh=Date.now();const t=e.touches[0];if(t)mkSparkle(t.clientX,t.clientY)},{passive:true});

/* ============================================================
   SAKURA BLOSSOMS FROM TREE BRANCHES
   ============================================================ */
function initBlossoms(){
  const leftC=$('#blossomsLeft'),rightC=$('#blossomsRight');
  if(!leftC&&!rightC)return;
  const leftSpawns=[{x:25,y:30},{x:35,y:40},{x:20,y:50},{x:40,y:35},{x:15,y:55},{x:30,y:45}];
  const rightSpawns=[{x:60,y:30},{x:70,y:40},{x:55,y:50},{x:75,y:35},{x:65,y:45},{x:50,y:55}];
  function spawn(container,spawns){
    if(!container)return;
    const sp=spawns[Math.random()*spawns.length|0];
    const p=document.createElement('div');
    p.className='blossom-petal';
    const sz=Math.random()*8+6,dur=Math.random()*6+6;
    const colors=['#ffb7d5','#f2a6cf','#ffd6ea','#fbc8e4'];
    p.style.cssText=`left:${sp.x}%;top:${sp.y}%;width:${sz}px;height:${sz}px;background:radial-gradient(circle at 30% 30%,${colors[Math.random()*colors.length|0]},#f2a6cf);animation-duration:${dur}s;animation-delay:${Math.random()*1.5}s`;
    container.appendChild(p);
    p.addEventListener('animationend',()=>p.remove());
  }
  setInterval(()=>spawn(leftC,leftSpawns),isMobile?1200:600);
  setInterval(()=>spawn(rightC,rightSpawns),isMobile?1400:700);
  for(let i=0;i<8;i++)setTimeout(()=>{spawn(leftC,leftSpawns);spawn(rightC,rightSpawns)},i*200);
}

/* ============================================================
   GLOBAL SAKURA PETALS
   ============================================================ */
function initGlobalSakura(){
  const layer=$('#sakuraFallLayer');if(!layer)return;
  const count=isMobile?18:30;
  const frag=document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const p=document.createElement('div');
    p.className='sakura-fall-petal';
    const sz=Math.random()*10+6;
    const colors=['#ffb7d5','#f2a6cf','#ffd6ea','#fbc8e4','rgba(255,255,255,0.25)'];
    const c=colors[Math.random()*colors.length|0];
    p.style.cssText=`left:${Math.random()*100}%;width:${sz}px;height:${sz}px;border-radius:50% 0 50% 0;background:radial-gradient(circle at 30% 30%,${c},rgba(242,166,207,0.4));filter:drop-shadow(0 0 2px rgba(255,183,213,0.3));animation-duration:${Math.random()*10+12}s;animation-delay:${Math.random()*18}s`;
    frag.appendChild(p);
  }
  layer.appendChild(frag);
}

/* ============================================================
   TYPEWRITER SCROLL SYSTEM — fixed
   ============================================================ */
let panelViewport;
const twPanelsDone=new Set();

function setupTwElements(){
  $$('.tw-scroll').forEach(el=>{
    const text=el.getAttribute('data-tw')||el.textContent.trim();
    if(!text)return;
    el.dataset.twText=text;
    el.textContent='';
    el._twQueued=false;
  });
}

function triggerPanelTypewriters(panelIndex){
  if(twPanelsDone.has(panelIndex))return;
  twPanelsDone.add(panelIndex);
  const panel=$$('.panel')[panelIndex];
  if(!panel)return;
  const els=$$('.tw-scroll',panel).filter(el=>!el._twQueued);
  if(els.length===0)return;
  els.forEach(el=>{el._twQueued=true});
  typeSequence(els,0);
}

function typeSequence(els,idx){
  if(idx>=els.length)return;
  const el=els[idx];
  const text=el.dataset.twText;
  if(!text){typeSequence(els,idx+1);return}

  el.textContent='';
  el.classList.add('typing');

  const cursor=document.createElement('span');
  cursor.className='tw-cursor';
  el.appendChild(cursor);

  const charDelay=text.length>80?22:text.length>40?30:40;
  let i=0;

  function typeChar(){
    if(i<text.length){
      el.insertBefore(document.createTextNode(text[i]),cursor);
      i++;
      const ch=text[i-1];
      const pause=(ch==='.'||ch==='!'||ch===',')?charDelay*3:charDelay;
      setTimeout(typeChar,pause+(Math.random()*10-5));
    }else{
      setTimeout(()=>{
        el.classList.remove('typing');
        el.classList.add('typed');
        cursor.remove();
        typeSequence(els,idx+1);
      },600);
    }
  }
  setTimeout(typeChar,120);
}

/* ============================================================
   FLOATING HEARTS
   ============================================================ */
(function(){
  const layer=$('#floatLayer');if(!layer)return;
  const hearts=['🌸','🤍','🩷','💗','🫶'];
  function spawn(){
    const el=document.createElement('div');
    el.className='floaty';
    el.textContent=hearts[Math.random()*hearts.length|0];
    el.style.cssText=`left:${Math.random()*85+5}%;animation-duration:${Math.random()*10+12}s;--drift:${(Math.random()-0.5)*40}px;font-size:${Math.random()*0.5+0.7}rem`;
    layer.appendChild(el);
    el.addEventListener('animationend',()=>el.remove());
  }
  setInterval(spawn,3500);
  for(let i=0;i<3;i++)setTimeout(spawn,i*800);
})();

/* ============================================================
   BURST ON BUTTONS
   ============================================================ */
const burstLayer=$('#burstLayer');
const BURST_COLORS=['#ffb7d5','#f2a6cf','#b487e0','#ffd6ea','#ffffff'];
function burst(x,y,count=10){
  if(!burstLayer)return;
  for(let i=0;i<count;i++){
    const p=document.createElement('div');
    p.className='burst-particle';
    const a=(Math.PI*2*i)/count+(Math.random()-0.5)*0.5;
    const d=Math.random()*50+25;
    const c=BURST_COLORS[Math.random()*BURST_COLORS.length|0];
    const sz=Math.random()*4+3;
    p.style.cssText=`left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${c};box-shadow:0 0 ${sz+2}px ${c};--bx:${Math.cos(a)*d}px;--by:${Math.sin(a)*d}px`;
    burstLayer.appendChild(p);
    p.addEventListener('animationend',()=>p.remove());
  }
}
document.addEventListener('click',e=>{
  const btn=e.target.closest('button,.gallery-item,.envelope,.final-heart,.surprise-btn,.promise-card,.music-btn');
  if(btn){const r=btn.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2)}
});
document.addEventListener('touchstart',e=>{
  const btn=e.target.closest('button,.gallery-item,.envelope,.final-heart,.surprise-btn,.promise-card,.music-btn');
  if(btn){const t=e.touches[0];if(t)burst(t.clientX,t.clientY)}
},{passive:true});

/* ============================================================
   ENVELOPE → OPEN STORY
   ============================================================ */
const envelope=$('#envelope');
const story=$('#story');
const opening=$('#opening');

if(envelope&&story&&opening){
  envelope.addEventListener('click',()=>{
    envelope.classList.add('opened');
    setTimeout(()=>{
      opening.classList.add('fade-out');
      story.removeAttribute('hidden');
      story.classList.add('is-visible');
      story.style.opacity='0';
      story.style.transition='opacity 0.9s ease';
      requestAnimationFrame(()=>{story.style.opacity='1'});
      setTimeout(()=>{story.style.opacity='';story.style.transition='';},950);
      panelViewport=$('#panelViewport');
      setupTwElements();
      initCountdown();
      initBlossoms();
      // attach scroll listener
      if(panelViewport){
        panelViewport.addEventListener('scroll',onPanelScroll,{passive:true});
      }
      // trigger first panel typewriters immediately
      setTimeout(()=>triggerPanelTypewriters(0),500);
    },900);
  });
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
let cdInterval;
function initCountdown(){
  if(cdInterval)return;
  const el=$('#countdown');if(el)el.classList.add('visible');
  function update(){
    const diff=new Date()-START_DATE;if(diff<0)return;
    const s=Math.floor(diff/1000);
    const d=Math.floor(s/86400);
    const h=Math.floor((s%86400)/3600);
    const m=Math.floor((s%3600)/60);
    const $d=$('#cdDays'),$h=$('#cdHours'),$m=$('#cdMins');
    if($d)$d.textContent=d;
    if($h)$h.textContent=String(h).padStart(2,'0');
    if($m)$m.textContent=String(m).padStart(2,'0');
  }
  update();cdInterval=setInterval(update,1000);
}

/* ============================================================
   PANEL SCROLL OBSERVER
   ============================================================ */
const panels=$$('.panel');
const progressFill=$('#progressFill');
const counterCurrent=$('#counterCurrent');
const scrollHint=$('#scrollHint');
let activePanel=0;

function updatePanel(){
  if(progressFill)progressFill.style.width=((activePanel+1)/panels.length*100)+'%';
  if(counterCurrent)counterCurrent.textContent=String(activePanel+1).padStart(2,'0');
  if(scrollHint)scrollHint.classList.toggle('hide',activePanel>0);
  if(activePanel===0)animateDaysNumber();
}

function onPanelScroll(){
  if(!panelViewport)return;
  const idx=Math.round(panelViewport.scrollTop/panelViewport.clientHeight);
  if(idx!==activePanel){
    activePanel=idx;
    updatePanel();
    triggerPanelTypewriters(idx);
  }
}

/* ============================================================
   DAYS NUMBER ANIMATION
   ============================================================ */
let daysAnimated=false;
function animateDaysNumber(){
  if(daysAnimated)return;daysAnimated=true;
  const el=$('#daysNumber'),rangeEl=$('#daysRange');
  if(!el)return;
  const diffDays=Math.max(1,Math.floor((new Date()-START_DATE)/86400000));
  const target=Math.min(diffDays,100);
  const startTs=performance.now();
  function tick(now){
    const t=Math.min((now-startTs)/2200,1);
    el.textContent=Math.round(easeOutExpo(t)*target);
    if(t<1)requestAnimationFrame(tick);else el.textContent=target;
  }
  requestAnimationFrame(tick);
  if(rangeEl){
    const opts={year:'numeric',month:'short',day:'numeric'};
    rangeEl.textContent=START_DATE.toLocaleDateString('en-US',opts)+' — '+new Date().toLocaleDateString('en-US',opts);
  }
}

/* ============================================================
   3D TILT ON GALLERY
   ============================================================ */
(function(){
  $$('.gallery-item').forEach(item=>{
    const max=12;
    function mv(x,y){
      const r=item.getBoundingClientRect();
      const dx=(x-(r.left+r.width/2))/(r.width/2);
      const dy=(y-(r.top+r.height/2))/(r.height/2);
      item.style.transform=`perspective(600px) rotateX(${-dy*max}deg) rotateY(${dx*max}deg) scale(1.04)`;
    }
    function rst(){item.style.transform=''}
    item.addEventListener('mousemove',e=>mv(e.clientX,e.clientY));
    item.addEventListener('mouseleave',rst);
    item.addEventListener('touchmove',e=>{const t=e.touches[0];if(t)mv(t.clientX,t.clientY)},{passive:true});
    item.addEventListener('touchend',rst);
  });
})();

/* ============================================================
   AUDIO — simple, reliable
   ============================================================ */
const audio=$('#bgMusic');
const musicBtn=$('#musicBtn');
const visualizer=$('#visualizer');
const vizSpans=visualizer?$$('span',visualizer):[];
let audioReady=false;

function showPlaying(){
  musicBtn.classList.add('playing');
  if(visualizer)visualizer.classList.add('active');
  const pi=musicBtn.querySelector('.music-icon--play');
  const pa=musicBtn.querySelector('.music-icon--pause');
  if(pi)pi.style.display='none';
  if(pa)pa.style.display='';
}
function showPaused(){
  musicBtn.classList.remove('playing');
  if(visualizer)visualizer.classList.remove('active');
  const pi=musicBtn.querySelector('.music-icon--play');
  const pa=musicBtn.querySelector('.music-icon--pause');
  if(pi)pi.style.display='';
  if(pa)pa.style.display='none';
}

// Simple play/pause — no AudioContext blocking
musicBtn?.addEventListener('click',()=>{
  if(!audio){return}
  // Unmute on user click (browsers require this)
  audio.muted=false;
  if(audio.paused){
    var playPromise=audio.play();
    if(playPromise!==undefined){
      playPromise.then(()=>{
        audioReady=true;
        showPlaying();
      }).catch(function(e){
        audio.muted=false;
        audio.currentTime=0;
        audio.play().then(function(){
          audioReady=true;
          showPlaying();
        }).catch(function(){});
      });
    }
  }else{
    audio.pause();
    showPaused();
  }
});

// If audio ends or errors, reset button
audio?.addEventListener('ended',()=>showPaused());
audio?.addEventListener('error',()=>showPaused());

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox=$('#lightbox'),lbImg=$('#lightboxImg'),lbCap=$('#lightboxCaption');
if(lightbox){
  $$('.gallery-item').forEach(item=>{item.addEventListener('click',()=>{const img=$('img',item),fig=$('figcaption',item);if(!img?.src)return;lbImg.src=img.src;lbCap.textContent=fig?.textContent||'';lightbox.classList.add('open');document.body.style.overflow='hidden'})});
  function closeLB(){lightbox.classList.remove('open');document.body.style.overflow='';lbImg.src=''}
  $('#lightboxClose')?.addEventListener('click',closeLB);
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLB()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lightbox.classList.contains('open'))closeLB()});
}

/* ============================================================
   SURPRISE BUTTON
   ============================================================ */
const surpriseMsg=$('#surpriseMsg');
const msgs=["100 days and counting. This is just the beginning. 🫶","You're the KonaN of my dreams. No cap. 🤍","You make my life 100x more beautiful. 🌸","Never too busy for you. Ever. 🩷","This friendship is my favorite notification. 📲","You're my 3 AM overthinking partner. 😄","Your messages > everything else in my inbox. 💌","I didn't know friendship could feel this warm. 🤍","Plot twist: you're stuck with me forever. 😏","If I had a flower for every time you made me smile, I'd have a garden. 🌷"];
let sIdx=0;
$('#surpriseBtn')?.addEventListener('click',()=>{surpriseMsg.textContent=msgs[sIdx%msgs.length];surpriseMsg.classList.add('show');sIdx++;setTimeout(()=>surpriseMsg.classList.remove('show'),5000)});

/* ============================================================
   HEART BUTTON
   ============================================================ */
const heartBtn=$('#heartBtn'),heartCount=$('#heartCount'),heartProgress=$('#heartProgress'),hiddenMsg=$('#hiddenMsg');
let hTaps=0;const HTOTAL=5;
heartBtn?.addEventListener('click',()=>{
  hTaps++;
  heartBtn.textContent=hTaps>=HTOTAL?'❤️':'🤍';
  if(heartCount)heartCount.textContent='×'+hTaps;
  if(heartProgress)$$('span',heartProgress).forEach((s,i)=>{if(i<Math.min(hTaps,HTOTAL))s.classList.add('filled')});
  if(hTaps>=HTOTAL&&hiddenMsg)hiddenMsg.classList.add('show');
  if(hTaps<HTOTAL)setTimeout(()=>{heartBtn.textContent='🤍'},200);
});

/* ============================================================
   PROMISE CARD FLIP
   ============================================================ */
$('#promiseCard')?.addEventListener('click',function(){this.classList.toggle('flipped')});

/* ============================================================
   TRIPLE-TAP EASTER EGG
   ============================================================ */
const finalHeart=$('#finalHeart');
if(finalHeart){
  let tc=0,tt=null;
  const ep=['💖','💗','🌸','✨','🩷','🤍','💫','🫶','💕','🌟','🦋','🎉'];
  finalHeart.addEventListener('click',()=>{
    tc++;if(tt)clearTimeout(tt);tt=setTimeout(()=>{tc=0},800);
    if(tc>=3){
      tc=0;finalHeart.textContent='❤️‍🔥';setTimeout(()=>{finalHeart.textContent='🤍'},2000);
      const w=document.createElement('div');w.className='easter-egg-burst';finalHeart.parentElement.appendChild(w);
      for(let i=0;i<24;i++){
        const p=document.createElement('div');p.className='easter-particle';
        p.textContent=ep[Math.random()*ep.length|0];p.style.fontSize=Math.random()*12+12+'px';
        const a=Math.PI*2*i/24+(Math.random()-0.5)*0.4;const d=Math.random()*80+40;
        p.style.setProperty('--ex',Math.cos(a)*d+'px');p.style.setProperty('--ey',Math.sin(a)*d+'px');
        p.style.animationDelay=Math.random()*0.1+'s';w.appendChild(p);
      }
      setTimeout(()=>w.remove(),1200);fireConfetti();
    }
  });
}

/* ============================================================
   SHAKE DETECTION
   ============================================================ */
(function(){
  if(!window.DeviceMotionEvent)return;
  let lastShake=0,lx=0,ly=0,lz=0;
  function hm(e){
    const a=e.accelerationIncludingGravity;if(!a)return;
    const t=Math.abs((a.x||0)-lx)+Math.abs((a.y||0)-ly)+Math.abs((a.z||0)-lz);
    lx=a.x||0;ly=a.y||0;lz=a.z||0;
    if(t>25&&Date.now()-lastShake>3000){lastShake=Date.now();fireConfetti();burst(window.innerWidth/2,window.innerHeight/2,15)}
  }
  if(typeof DeviceMotionEvent.requestPermission==='function'){
    let pr=false;document.addEventListener('click',()=>{if(pr)return;pr=true;DeviceMotionEvent.requestPermission().then(s=>{if(s==='granted')window.addEventListener('devicemotion',hm)}).catch(()=>{})});
  }else{window.addEventListener('devicemotion',hm)}
})();

/* ============================================================
   CONFETTI
   ============================================================ */
const cc=$('#confettiCanvas');
let ccCtx,ccW,ccH,ccParts=[],ccRun=false;
const CC_COLORS=['#ffb7d5','#f2a6cf','#b487e0','#d9c8f5','#ffd6ea','#fff'];

function initCC(){if(!cc)return;ccW=window.innerWidth;ccH=window.innerHeight;cc.width=ccW;cc.height=ccH;ccCtx=cc.getContext('2d')}
function fireConfetti(){
  initCC();cc.style.display='block';ccParts=[];
  for(let i=0;i<70;i++)ccParts.push({x:Math.random()*ccW,y:-Math.random()*ccH*0.5,w:Math.random()*8+4,h:Math.random()*6+3,color:CC_COLORS[Math.random()*CC_COLORS.length|0],vx:(Math.random()-0.5)*4,vy:Math.random()*3+2,rot:Math.random()*360,rs:(Math.random()-0.5)*12,grav:0.06+Math.random()*0.04,wb:Math.random()*10,ws:Math.random()*0.1+0.03,op:1,isH:Math.random()<0.15,isS:Math.random()<0.08});
  if(!ccRun){ccRun=true;animCC()}
}
function animCC(){
  if(!ccCtx)return;ccCtx.clearRect(0,0,ccW,ccH);
  ccParts.forEach(p=>{p.vy+=p.grav;p.x+=p.vx+Math.sin(p.wb)*0.5;p.y+=p.vy;p.rot+=p.rs;p.wb+=p.ws;if(p.y>ccH+20)p.op-=0.05;if(p.op<=0)return;
    ccCtx.save();ccCtx.translate(p.x,p.y);ccCtx.rotate(p.rot*Math.PI/180);ccCtx.globalAlpha=Math.max(0,p.op);
    if(p.isH){ccCtx.font=p.w+4+'px serif';ccCtx.fillText('❤️',0,0)}
    else if(p.isS){ccCtx.font=p.w+2+'px serif';ccCtx.fillText('⭐',0,0)}
    else{ccCtx.fillStyle=p.color;ccCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h)}
    ccCtx.restore()});
  ccParts=ccParts.filter(p=>p.op>0);
  if(ccParts.length>0)requestAnimationFrame(animCC);else{ccRun=false;cc.style.display='none'}
}
document.addEventListener('keydown',e=>{if(e.key==='c'||e.key==='C')fireConfetti()});

/* ============================================================
   INIT
   ============================================================ */
initGlobalSakura();

})();
