let o,l,r;let h=0;let t=true;let a=[400,600];let e,i,s,n,c;let f,d;let u=false;function g(){gamefont=loadFont("assets/MotionControl-BoldItalic.otf");i=loadImage("assets/airplane.png");s=loadImage("assets/enemy.png");e=loadImage("assets/explosion.png");n=loadImage("assets/tower.png");c=loadImage("assets/background.png");f=loadSound("assets/background.mp3");d=loadSound("assets/explosion.wav")}function w(){let t=createCanvas(a[0],a[1]);scaleFactor=windowHeight/a[1];let i=a[0]*scaleFactor;let s=a[1]*scaleFactor;let h=(windowWidth-width)/2;let e=0;t.position(h,e);t.style("transform",`scale(${scaleFactor})`);t.style("transform-origin","top center");l=new R(a);o=new y(a);r=new N(a)}function m(){clear();if(keyIsPressed){u=true;h++}r.update();l.update(o);o.update(u);let t=l.t(o);let i=r.t(o);let s=o.y>a[1];r.i();C();if(t||i||s){d.play();image(e,o.h().x,o.h().y-12,64,64);let t=E();if(!t){f.stop();noLoop()}else{w()}}u=false}function p(){if(!f.isPlaying()){f.play();f.loop()}}function x(){u=true;p()}function k(){u=true;p();return false}function C(){textFont(gamefont);textSize(32);stroke(2);fill(250,150,50);textAlign(CENTER,CENTER);text(`Score: ${h}`,width/2,16)}function E(){textFont(gamefont);textSize(32);stroke(2);fill(250,70,50);textAlign(CENTER,CENTER);text("Game Over!",width/2,140);fill(250,150,50);text(str(h),width/2,180);return keyIsPressed&&key===" "}function I(t,i){return t.x<i.x+i.width&&t.x+t.width>i.x&&t.y<i.y+i.height&&t.y+t.height>i.y}class y{constructor(t){this.x=t[0]/3;this.y=t[1]/2;this.dy=0;this.o=.5;this.l=-8;this.u=i;this.u.resize(40,40);this.width=this.u.width;this.height=this.u.height}update(t){this.dy+=this.o;if(t){this.dy=this.l}this.y+=this.dy;if(this.y<32){this.y=32}}i(){image(this.u,this.x-this.width/2,this.y-this.height/2)}h(){return{x:this.x-this.width/2,y:this.y-this.height/2,width:this.width,height:this.height}}}class F{constructor(t,i){this.x=t;this.y=i;this.width=5;this.height=3;this.speed=4;this.color=color(255,0,0)}update(){this.x+=this.speed}i(){fill(this.color);noStroke();rect(this.x,this.y,this.width,this.height)}h(){return{x:this.x-this.width/2,y:this.y-this.height/2,width:this.width,height:this.height}}}class R{constructor(t){this.width=36;this.height=32;this.x=10;this.y=24;this.u=s;this.u.resize(this.width,this.height);this.g=[];this.m=0;this.p=1e3}update(t){let i=millis();if(t.y<40){if(i-this.m>=this.p){this.k(t);this.m=i}}for(let t=this.g.length-1;t>=0;t--){this.g[t].update();if(this.g[t].x>width){this.g.splice(t,this.g.length)}}}k(t){let i=new F(this.x,this.y+this.height/2);this.g.push(i)}i(){image(this.u,this.x,this.y);for(let t of this.g){t.i()}}t(t){let i=t.h();for(let t of this.g){if(I(i,t.h())){return true}}return false}}class S{constructor(t,i,s=64,h=480,e=1.5){this.x=t;this.y=i;this.width=s;this.height=h;this.speed=e;this.u=n;this.u.resize(this.width,this.height)}update(){this.x-=this.speed}i(){image(this.u,this.x,this.y);noStroke()}h(){return{x:this.x,y:this.y,width:this.width,height:this.height}}}class N{constructor(t){this.size=t;this.C=[];this.I=200;this.F=0;this.speed=2;this.R=c;this.S=[0,width];this.R.resize(t[0],t[1])}update(){this.F++;if(this.F>=this.I){this.N();this.F=0}for(let t=this.C.length-1;t>=0;t--){this.C[t].update();if(this.C[t].x<-64){this.C.splice(t,1);h++}}}N(){let t=random(150,300);this.C.push(new S(this.size[0],t));this.I=max(100,this.I-.1)}i(){fill(117,168,250);rect(0,0,width,height);for(let t of this.C){t.i()}l.i();o.i();for(let t=0;t<this.S.length;t++){this.S[t]-=this.speed;if(this.S[t]+width<=0){this.S[t]=width}image(this.R,this.S[t],0)}}t(t){let i=t.h();for(let t of this.C){if(I(i,t.h())){return true}}return false}}
