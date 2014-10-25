/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.map

/*! [[HC]] 
 *
 * A small WebGL utility library.
 *
 * Copyright 2014 mukunda
 */
 
var hc_gl; // WebGL context
var hc_canvas; // Canvas object

var hc_width;  // width of canvas
var hc_height; // height of canvas

/** ---------------------------------------------------------------------------
 * Initialize WebGL.
 *
 * @param string canvas_id ID of canvas to use.
 * @param object options Options to pass to getContext()
 */
function HC_Init( canvas_id, options ) {	
	hc_canvas = document.getElementById( canvas_id );
	hc_gl = null;
	
	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		hc_gl = hc_canvas.getContext("webgl", options) ||
			    hc_canvas.getContext("experimental-webgl", options);
	}
	catch(e) {}
	
	// If we don't have a GL context, give up now
	if( !hc_gl ) {
		alert( "Unable to initialize WebGL. Your browser may not support it." );
		console.log( "Failed to get WebGL context." );
		hc_gl = null;
		return false;
	}
	
	return true;
}

/** ---------------------------------------------------------------------------
 * Resize the canvas.
 *
 * @param int width New width.
 * @param int height New height.
 */
function HC_Resize( width, height ) {
	if( hc_gl == null ) return;
	hc_canvas.width = width;
	hc_canvas.height = height;
	hc_gl.viewport( 0, 0, width, height );
	hc_width = width;
	hc_height = height;
}

/** ---------------------------------------------------------------------------
 * Enable a list of vertex attribute arrays.
 *
 * @param array list List of vertex attribute array indexes to enable.
 */
function HC_EnableVertexAttribArrays( list ) {
	for( var i = 0; i < list.length; i++ ) {
		hc_gl.enableVertexAttribArray( list[i] );
	}
}

/** ---------------------------------------------------------------------------
 * Disable a list of vertex attribute arrays.
 *
 * @param array list List of vertex attribute array indexes to disable.
 */
function HC_DisableVertexAttribArrays( list ) {
	for( var i = 0; i < list.length; i++ ) {
		hc_gl.disableVertexAttribArray( list[i] );
	}
}


/*! [[HC]] 
 * Copyright 2014 mukunda
 */
 
/** ---------------------------------------------------------------------------
 * [class] Vertex Buffer
 *
 * Controls a single GL vertex buffer.
 */
function HC_Buffer() {
	this.buffer = hc_gl.createBuffer();
	this.Bind();
}

/** ---------------------------------------------------------------------------
 * Bind this buffer.
 */
HC_Buffer.prototype.Bind = function() {
	hc_gl.bindBuffer( hc_gl.ARRAY_BUFFER, this.buffer );
};


/** ---------------------------------------------------------------------------
 * Load vertex data.
 *
 * @param ArrayBuffer/x data Data to load.
 * @param GLenum usage Rendering hint.
 */
HC_Buffer.prototype.Load = function( data, usage ) {

	this.Bind();
	
	hc_gl.bufferData( hc_gl.ARRAY_BUFFER, data, usage );
};


/*! [[HC]] 
 * Copyright 2014 mukunda
 */
 
(function() {

function CC( str ) {
	return str.charCodeAt(0);
}
 
var	BYTE   = 0; var UBYTE  = 1;
var SHORT  = 2; var USHORT = 3;
var INT    = 4; var UINT   = 5;
var FLOAT  = 6; var DOUBLE = 7;

var TYPEMAP = {
	'b': BYTE,
	'B': UBYTE,
	's': SHORT,
	'S': USHORT,
	'i': INT,
	'I': UINT,
	'f': FLOAT,
	'd': DOUBLE
};

var SIZES = {};

SIZES[BYTE]  = 1; SIZES[UBYTE]  = 1;
SIZES[SHORT] = 2; SIZES[USHORT] = 2;
SIZES[INT]   = 4; SIZES[UINT]   = 4;
SIZES[FLOAT] = 4; SIZES[DOUBLE] = 8;

var ALLOC_SIZE = 64;

/****************************************************
 normal example of usage:
 
   // create buffer, float x2 and unsigned byte x4
   var buffer = HC_Packer( "ff BBBB" );
   
   // insert data
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] );
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] );
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] );
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] ); 
   
   // get resulting buffer with Buffer()
   gl_operation( a, b, buffer.Buffer(), c );
   
*****************************************************/

/** ---------------------------------------------------------------------------
 * [class] Data packer/serializer
 *
 * @param string format Format of data to be packed.
 *        each letter in the format is a data type that is in the packed
 *        format. Spaces can be used for 
 *        For example, "fff ff bbbb" would be a vertex struct like this:
 *                                   float x,y,z
 *                                   float u,v
 *                                   byte r,g,b,a;
 *        Data type list:
 *          b: signed 8-bit integer (byte)
 *          B: unsigned 8-bit integer
 *          s: signed 16-bit integer (short)
 *          S: unsigned 16-bit integer 
 *          i: signed 32-bit integer
 *          I: unsigned 32-bit integer
 *          f: 32-bit floating point (float)
 *          d: 64-bit floating point (double)
 */
HC_Packer = function( format ) {
	if( !format.match( /[bBsSiIfd ]+/ ) ) {
		throw new Error( "Invalid format string." );
	}
	
	var stripped_format = format.replace( / /g, "" );
	
	var p_format = [];
	
	for( var i = 0; i < stripped_format.length; i++ ) {
		p_format.push( TYPEMAP[stripped_format[i]] );
	}
	
	this.format = p_format;
	this.cell_size = ComputeSize( p_format );
	this.buffer = new ArrayBuffer(0);
	this.total = 0;
};

/** ---------------------------------------------------------------------------
 * Push data into the buffer.
 *
 * @param array values Values to push. Length must be divisible by
 *                     the format length.
 * @return int Total number of cells (formatted structs) in the buffer.
 */
HC_Packer.prototype.Push = function( values ) {
	var start = 0;
	
	while( start < values.length ) {
		if( this.write_buffer == null ) {
			this.CreateWriteBuffer();
		}
		
		var pos = this.write_index * this.cell_size;
		
		for( var i = 0; i < this.format.length; i++ ) {
			var value = values[start+i];
			var type = this.format[i];
			
			switch( type ) {
				case BYTE:
					this.buffer_view.setInt8( pos, value );
					break;
				case UBYTE:
					this.buffer_view.setUint8( pos, value );
					break;
				case SHORT:
					this.buffer_view.setInt16( pos, value, true );
					break;
				case USHORT:
					this.buffer_view.setUint16( pos, value, true );
					break;
				case INT:
					this.buffer_view.setInt32( pos, value, true );
					break;
				case UINT:
					this.buffer_view.setUint32( pos, value, true );
					break;
				case FLOAT:
					this.buffer_view.setFloat32( pos, value, true );
					break;
				case DOUBLE:
					this.buffer_view.setFloat64( pos, value, true );
					break;
			}
			pos += SIZES[type];
		}
		this.write_index++;
		if( this.write_index == ALLOC_SIZE ) {
			// our temp buffer has been maxed out, concatenate to the main buffer.
			this.Flush();
		}
		this.total++;
		start += this.format.length;
	}
	return this.total;
};

/** ---------------------------------------------------------------------------
 * Return the data buffer.
 */
HC_Packer.prototype.Buffer = function() {
	this.Flush();
	return this.buffer;
};

/** ---------------------------------------------------------------------------
 * Create a writing buffer.
 *
 * This is not called normally.
 */
HC_Packer.prototype.CreateWriteBuffer = function() {
	this.write_buffer = new ArrayBuffer( this.cell_size * ALLOC_SIZE );
	this.write_index = 0;
	this.buffer_view = new DataView( this.write_buffer );
};

/** ---------------------------------------------------------------------------
 * Push the write buffer into the main buffer, and delete the write buffer.
 *
 * This is called by Buffer, so you don't have to worry about it.
 */
HC_Packer.prototype.Flush = function() {
	if( this.write_buffer == null ) return;
	this.buffer_view = null;
	var bucket = new Uint8Array( this.buffer.byteLength + 
							     this.write_buffer.byteLength );
	bucket.set( new Uint8Array( this.buffer ), 0 );
	bucket.set( new Uint8Array( this.write_buffer ), this.buffer.byteLength );
	this.buffer = null;
	this.buffer = bucket.buffer;
	this.write_buffer = null;
	this.write_index = 0;
};

/** ---------------------------------------------------------------------------
 * Compute the size per format cell.
 *
 * @param string format A format string.
 * @return int Size in bytes.
 */
function ComputeSize( format ) {
	var size = 0;
	
	for( var i = 0; i < format.length; i++ ) {
		size += SIZES[format[i]];
	}
	return size;
}

})();

/*! [[HC]] 
 * Copyright 2014 mukunda
 */

/** ---------------------------------------------------------------------------
 * [class] Shader component.
 *
 * @param string|object source 
 *        Source for shader. Can either be a DOM id, which is loaded with 
 *        HC_GetShaderScript, or an object with these fields:
 *           "type": "fragment" or "vertex"
 *           "code": Shader source code.
 */
function HC_ShaderSource( source ) {
	if( typeof source === "string" ) {
		source = HC_ReadShaderScript( source );
	}
	
	if( source.type == "fragment" ) {
		this.shader = hc_gl.createShader( hc_gl.FRAGMENT_SHADER );
	} else if( source.type == "vertex" ) {
		this.shader = hc_gl.createShader( hc_gl.VERTEX_SHADER );
	} else {
		throw new Error("Invalid shader type.");
	}

	hc_gl.shaderSource( this.shader, source.code );
	hc_gl.compileShader( this.shader );
	
	if( !hc_gl.getShaderParameter( this.shader, hc_gl.COMPILE_STATUS ) ) {  
		
		console.log( "Error compiling shader \"" + source.id + "\":\n" 
						+ hc_gl.getShaderInfoLog( this.shader ));  
		throw new Error("Shader compilation error");
	}
}

/** ---------------------------------------------------------------------------
 * [class] Shader program.
 */
function HC_Shader() {
	this.program = hc_gl.createProgram();
}

/** ---------------------------------------------------------------------------
 * Attach a shader source.
 *
 * @param string|HC_ShaderSource source 
 *        Component to attach. If this is a string, then this will treat it as
 *        a script ID and try to load the shader from there
 */
HC_Shader.prototype.Attach = function( source ) {
	if( typeof source === "string" ) {
		source = new HC_ShaderSource( source );
	}
	hc_gl.attachShader( this.program, source.shader );
};

/** ---------------------------------------------------------------------------
 * Link the program.
 */
HC_Shader.prototype.Link = function() {
	hc_gl.linkProgram( this.program );
	if( !hc_gl.getProgramParameter( this.program, hc_gl.LINK_STATUS ) ) {
		console.log( "Unable to link shader." );  
		throw "Shader link error.";
	}
};

/** ---------------------------------------------------------------------------
 * Use the program.
 */
HC_Shader.prototype.Use = function() {
	hc_gl.useProgram( this.program );
};

/** ---------------------------------------------------------------------------
 * Wrapper for getAttribLocation
 *
 * @param string name Name of attribute
 * @return Attribute location. (see gl docs.)
 */
HC_Shader.prototype.GetAttribute = function( name ) {
	return hc_gl.getAttribLocation( this.program, name );
};

/** ---------------------------------------------------------------------------
 * Wrapper for getUniformLocation
 *
 * @param string name Name of uniform variable.
 * @return Uniform variable location. (see gl docs.)
 */
HC_Shader.prototype.GetUniform = function( name ) {
	return hc_gl.getUniformLocation( this.program, name );
};

/** ---------------------------------------------------------------------------
 * Read a shader script from the DOM.
 *
 * @param string id ID of element to read from.
 * @return object Shader script object for HC_ShaderSource constructor.
 */
function HC_ReadShaderScript( id ) {
	var out = {};
	
	var e = document.getElementById(id);
	if( e === null ) {
		console.log( "Missing script ID." );  
		throw "Shader script error.";
	}
	
	out.id = id;
	if( e.type == "x-shader/x-fragment" ) {
		out.type = "fragment";
	} else if( e.type == "x-shader/x-vertex" ) {
		out.type = "vertex";
	} else {
		console.log( "Unknown script type." );  
		throw "Shader script error.";
	}
	
	out.code = e.text;
	
	return out;
}


/*! [[HC]] 
 * Copyright 2014 mukunda
 */
 
/** ---------------------------------------------------------------------------
 * [class] Create a texture from a file.
 *
 * @param string path Path to texture file.
 * @param GLenum [format] Format of texture. Default = RGBA
 */
function HC_Texture( path, format, onload ) {
	this.format = format || hc_gl.RGBA;
	this.texture = hc_gl.createTexture();
	this.onload = onload;

	var image = new Image();
	var m_this = this;
	image.onload = function() { m_this.OnImageLoaded( image ) }; 
	image.src = path;
}

HC_Texture.prototype.OnImageLoaded = function( image ) {
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, this.texture );
	hc_gl.texImage2D( hc_gl.TEXTURE_2D, 0, this.format, this.format, hc_gl.UNSIGNED_BYTE, image );
//	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MAG_FILTER, hc_gl.LINEAR );
//	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MIN_FILTER, hc_gl.LINEAR_MIPMAP_LINEAR );
	
	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_WRAP_S, hc_gl.CLAMP_TO_EDGE ); 
	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_WRAP_T, hc_gl.CLAMP_TO_EDGE ); 

	hc_gl.generateMipmap( hc_gl.TEXTURE_2D );
	this.onload();
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, null );
};

/** ---------------------------------------------------------------------------
 * Bind this texture to the active texture unit.
 */
HC_Texture.prototype.Bind = function() {
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, this.texture );
};


(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();

(function() {

var my_shader = null; 
var line_shader = null;

var m_source;

var m_zoom = 0.05; // 1.0 = 1 pixel = 1 unit.
var m_translate = { x: 0.0, y: 0.0 };

var m_zooming = 0.0;
var m_flying = {x:0.0, y:0.0};
var m_zoom_accel = 0.0;

var MAXWORDZOOM = 1.0;
var MAXZOOM = 5.0;
var MINZOOM = 0.01;

var fade_in_time;
var m_start_time;
var m_next_tick;
var m_dirty;

var m_texture_font = null;

var m_pinch = {
	active:false,
	last: 0
};

var m_drag = {
	x:0,
	y:0,
	active: false,
	vel: { 
		x: 0.0, 
		y: 0.0 
	}
};

var glyph_width = [
	6,6,5,6, 6,5, 6,6,
	2,5,6,2,10,6, 6,6,
	6,5,5,4, 6,6,10,6,
	6,6
];

var m_cells = {};
var CELL_SIZE = 512;

function GetCell2( cx,cy ) {
	if( m_cells.hasOwnProperty( cx ) && m_cells[cx].hasOwnProperty( cy ) ) {
		return m_cells[cx][cy];
	} 
	return null;
}

function GetCell( point, create ) {
	x = point.x >> 9;
	y = point.y >> 9;
	 
	var cell = GetCell2( x, y );
	if( cell ) return cell;
	if( !create ) return null;
	
	if( !m_cells.hasOwnProperty( x ) ) {
		m_cells[x] = {};
	}
	
	m_cells[x][y] = {  
		buffer_words: new HC_Packer( "ssfffffBBBB" ),
		buffer_boxes: new HC_Packer( "ssfffffBBBB" ),
		buffer_lines: new HC_Packer( "ssffffBBBB" )
		//buffer_lines: new HC_Packer()
	};
	return m_cells[x][y];
}
 
function ResizeScreen() {
	var w = window.innerWidth & ~1;
	var h = window.innerHeight & ~1;
	HC_Resize( w, h );
	m_dirty = true;
}

function Start() {

	var options = {
	//	premultipliedAlpha  : false,
		alpha: false,
		depth: false,
		stencil: false,
		
	}
	
	if( !HC_Init( "glcanvas", options ) ) return;
	
	m_texture_font = new HC_Texture( "texture/chicago.png", undefined, function() {
		
		hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MAG_FILTER, hc_gl.LINEAR );
		hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MIN_FILTER, hc_gl.LINEAR_MIPMAP_LINEAR );
		
	});
	
	hc_gl.clearColor(0.01, 0.01, 0.03, 1.0);                         // Set clear color to black, fully opaque
	hc_gl.disable(hc_gl.DEPTH_TEST);      
	
//	hc_gl.clear(hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT);   // Clear the color as well as the depth buffer.
	hc_gl.enable( hc_gl.BLEND ); 

	hc_gl.blendFunc(hc_gl.SRC_ALPHA, hc_gl.ONE_MINUS_SRC_ALPHA);
	//hc_gl.pixelStorei(hc_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	
	my_shader = new HC_Shader();
	my_shader.Attach( "shader-vs" );
	my_shader.Attach( "shader-fs" );
	my_shader.Link();
	my_shader.Use();
	hc_gl.uniform1i( my_shader.GetUniform( "u_sampler" ), 0 );
  
	line_shader = new HC_Shader();
	line_shader.Attach( "shader-lines-v" );
	line_shader.Attach( "shader-lines-f" );
	line_shader.Link();
	line_shader.Use();
	
	my_shader.Use(); 
	m_dirty = true; 
	ResizeScreen();
} 

function UpdateWordShaderUniforms( time ) {
	hc_gl.uniform1f( my_shader.GetUniform( "u_time" ), time );
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_translate" ), 
		m_translate.x,
		m_translate.y
	);
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_screen_scale" ), 
					 m_zoom / (hc_width/2), m_zoom / (hc_height/2) );
	var word_zoom = Math.min( m_zoom, MAXWORDZOOM );
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_word_scale" ), 
					 word_zoom / (hc_width/2), word_zoom / (hc_height/2) );
	
	hc_gl.uniform1f( my_shader.GetUniform( "u_zoom" ), m_zoom );
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_screen_dimensions" ), 
					 hc_width, hc_height );
}

function UpdateLineShaderUniforms( time ) {
	hc_gl.uniform1f( line_shader.GetUniform( "u_time" ), time );
	
	hc_gl.uniform2f( line_shader.GetUniform( "u_translate" ),
		m_translate.x,
		m_translate.y
	);
	
	hc_gl.uniform2f( line_shader.GetUniform( "u_screen_scale" ),
					 m_zoom / (hc_width/2), m_zoom / (hc_height/2) );
	
	var line_zoom = Math.min( m_zoom, MAXWORDZOOM );
	 
	hc_gl.uniform2f( line_shader.GetUniform( "u_line_scale" ), 
					 line_zoom / (hc_width/2), line_zoom / (hc_height/2) );
	
}

/** ---------------------------------------------------------------------------
 * Iterates over a render box and calls func for each active cell found.
 *
 * @param object renderbox {left,top,right,bottom} Cell positions.
 * @param function( cell ) func Callback for rendering.
 */
function ForRenderBox( renderbox, func ) {
	for( var rx = renderbox.left; rx <= renderbox.right; rx++ ) {
		for( var ry = renderbox.top; ry <= renderbox.bottom; ry++ ) {
			var cell = GetCell2( rx, ry );
			if( cell === null ) continue;
			func( cell );
		}
	}
	
}

function DrawScene() {
	hc_gl.clear( hc_gl.COLOR_BUFFER_BIT ); 
	
	var current_time = (new Date().getTime()) - m_start_time;
	
	var padding = 500;
	var scale = 1.0 / m_zoom;
	var renderbox = {
		left: (-m_translate.x - (hc_width/2) * scale -padding)>>9,
		top: (-m_translate.y - (hc_height/2) * scale -padding)>>9,
		right: (-m_translate.x + (hc_width/2) * scale + padding)>>9,
		bottom: (-m_translate.y + (hc_height/2) * scale + padding)>>9
	};
	
	//
	// line phase
	//
	line_shader.Use();
	UpdateLineShaderUniforms( current_time );
	var a_position = line_shader.GetAttribute( "a_position" );
	var a_center   = line_shader.GetAttribute( "a_center" );
	var a_side     = line_shader.GetAttribute( "a_side" );
	var a_time     = line_shader.GetAttribute( "a_time" );
	var a_color    = line_shader.GetAttribute( "a_color" );
	 
	HC_EnableVertexAttribArrays( 
		[a_position, a_center, a_side, a_time, a_color] );
	
	ForRenderBox( renderbox, function( cell ) {
		var buffer = cell.buffer_lines;
		buffer.Bind();
		hc_gl.vertexAttribPointer( a_position, 2, hc_gl.SHORT, false, 24, 0  );
		hc_gl.vertexAttribPointer( a_center,   2, hc_gl.FLOAT, false, 24, 4  );
		hc_gl.vertexAttribPointer( a_side,     1, hc_gl.FLOAT, false, 24, 12 );
		hc_gl.vertexAttribPointer( a_time,     1, hc_gl.FLOAT, false, 24, 16 );
		hc_gl.vertexAttribPointer( a_color,    4, hc_gl.UNSIGNED_BYTE, true, 24, 20 );
		hc_gl.drawArrays( hc_gl.TRIANGLES, 0, buffer.u_size );
	});
		
	HC_DisableVertexAttribArrays( 
		[a_position, a_center, a_side, a_time, a_color] );
	
	m_texture_font.Bind();
	
	//
	// word/box phase
	//
	my_shader.Use();
	UpdateWordShaderUniforms( current_time );
	var a_position = my_shader.GetAttribute( "a_position" );
	var a_texture  = my_shader.GetAttribute( "a_texture" );
	var a_center   = my_shader.GetAttribute( "a_center" );
	var a_time     = my_shader.GetAttribute( "a_time" );
	var a_color    = my_shader.GetAttribute( "a_color" );
	
	HC_EnableVertexAttribArrays( 
		[a_position, a_texture, a_center, a_time, a_color] );
	
	
	function RenderWordBuffer( buffer ) {
		buffer.Bind();
		hc_gl.vertexAttribPointer( a_position, 2, hc_gl.SHORT, false, 28, 0  );
		hc_gl.vertexAttribPointer( a_texture,  2, hc_gl.FLOAT, false, 28, 4  );
		hc_gl.vertexAttribPointer( a_center,   2, hc_gl.FLOAT, false, 28, 12 );
		hc_gl.vertexAttribPointer( a_time,     1, hc_gl.FLOAT, false, 28, 20 );
		hc_gl.vertexAttribPointer( a_color,    4, hc_gl.UNSIGNED_BYTE, true, 28, 24 ); 
		hc_gl.drawArrays( hc_gl.TRIANGLES, 0, buffer.u_size );
	}
	
	if( scale < 6.0 )  {
		ForRenderBox( renderbox, function( cell ) {
			RenderWordBuffer( cell.buffer_words );
		});
	} else {
		ForRenderBox( renderbox, function( cell ) {
			RenderWordBuffer( cell.buffer_boxes );
		});
	}
	 
	HC_DisableVertexAttribArrays(
		[a_position, a_texture, a_center, a_time, a_color] );
	
}

$(window).resize( function() {
	ResizeScreen();
	DrawScene();
});

$( function() {

	Start();
	$.get( "../tree.php", {} )
		.done( function( data ) {
		
			Source.Load( data, OnLoaded );
		})
		.fail( function() {
			$("#loading>div>div").text( "failed to retrieve data from server." );
			
		});
});

/** ---------------------------------------------------------------------------
 * Add a rect to a word vertex buffer
 *
 * @param array out Vertex buffer.
 * @param iny x,y Top left position of rect.
 * @param ubyte w,h Dimensions of rect.
 * @param int u,v Top left texture coordinate, in pixels.
 * @param int tw,th Dimensions of texture.
 * @param float cx,cy Center of element.
 * @param float r,g,b,a Color.
 */
function DrawRect( out, x, y, w, h, u, v, tw, th, cx, cy, r,g,b,a, time ) {
	
	if(!tw) tw = w;
	if(!th) th = h;
	
	x = Math.round( x-cx );
	y = Math.round( y-cy );
	
	u = u / 128.0;    // + 0.5/128.0;
	v = v / 64.0;     // + 0.5/64.0;
	tw = tw / 128.0;  // - 0.5/128.0;
	th = th / 64.0;   // - 0.5/64.0; 
	
	r = Math.round(r * 255.0);
	g = Math.round(g * 255.0);
	b = Math.round(b * 255.0);
	a = Math.round(a * 255.0);
	  
	out.Push( [
		
		x+w, y  , u+tw, v   , cx, cy, time, r,g,b,a,
		x  , y  , u   , v   , cx, cy, time, r,g,b,a,
		x  , y-h, u   , v+th, cx, cy, time, r,g,b,a,
		x  , y-h, u   , v+th, cx, cy, time, r,g,b,a,
		x+w, y-h, u+tw, v+th, cx, cy, time, r,g,b,a,
		x+w, y  , u+tw, v   , cx, cy, time, r,g,b,a
	]);
}

function DrawText( out, x, y, text, cx, cy, r, g, b, a, time ) {
	var a_code = "a".charCodeAt(0);
	//y -= 3;
	y += 1;
	var count = 0;
	for( var i = 0; i < text.length; i++ ) {
		var code = text.charCodeAt(i);
		if( code == 32 ) {
		  x += 3;
		  continue;
		}
		code -= a_code;
		if( code < 0 || code > 25 ) continue;
		DrawRect( out, x, y, glyph_width[ code ], 12, 
				  5 + (code&7)*16, 2 + (code>>3)*16, 0, 0, 
				  cx, cy, r, g, b, a, time );
		x += glyph_width[code] + 1;
		count++;
	}
	return count;
}

function DrawLine( out, x1,y1,x2,y2,thickness,r,g,b,a, time ) {
	var delta = [ x2-x1, y2-y1 ];
	var length = Math.sqrt( delta[0]*delta[0] + delta[1]*delta[1] );
	delta[0] /= length;
	delta[1] /= length;
	
	// rotate 90deg cc
	delta = [ -delta[1], delta[0] ];
	
	thickness = thickness * 256;
	delta[0] *= thickness;
	delta[1] *= thickness;
	
	delta[0] = Math.round( delta[0] );
	delta[1] = Math.round( delta[1] );
	
	r = Math.round(r * 255.0);
	g = Math.round(g * 255.0);
	b = Math.round(b * 255.0);
	a = Math.round(a * 255.0);
	
	out.Push( [
		 delta[0],  delta[1], x1, y1,  1.0, time, r,g,b,a,
		-delta[0], -delta[1], x1, y1, -1.0, time, r,g,b,a,
		-delta[0], -delta[1], x2, y2, -1.0, time, r,g,b,a,
		-delta[0], -delta[1], x2, y2, -1.0, time, r,g,b,a,
		 delta[0],  delta[1], x2, y2,  1.0, time, r,g,b,a,
		 delta[0],  delta[1], x1, y1,  1.0, time, r,g,b,a,
	]);
}

/** ---------------------------------------------------------------------------
 * Measure the pixel width of a text string.
 *
 * @param string text Letters and spaces only.
 * @return int Size.
 */
function MeasureText( text ) {
	
	var size = 0;
	var a_code = "a".charCodeAt(0);

	for( var i = 0; i < text.length; i++ ) {
		if( text[i] == " " ) {
			size += 3;
			continue;	
		}
		size += glyph_width[ text.charCodeAt(i) - a_code ] +1;
	}
	size -= 1;
	return size;
}

function Distance( x1, y1, x2, y2 ) {
	return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

/** ---------------------------------------------------------------------------
 * Callback for when the database set has been loaded.
 */
function OnLoaded() {
	
	var elements = Source.GetElements();
	var fade_time = 1.0;
	//var vertices = new HC_Packer( "ssffffBBBB" );
	//var lines = new HC_Packer( "ssffBBBB" );
	fade_in_time = elements.length * fade_time + 1000;
	
	for( var i = 0; i < elements.length; i++ ) {
		if( elements[i].type == Source.E_WORD ) {
			
			var x = Math.round( elements[i].location.x );
			var y = Math.round( elements[i].location.y );
			var cell = GetCell( {x:x, y:y}, true );
			
			var phrase = Source.GetPhrase( elements[i].phrase );
			var text_width = MeasureText( phrase );
			  
			var box_width = text_width;
			var box_height = 12;
			var box_x = Math.floor( x - box_width /2 );
			var box_y = Math.floor( y + box_height/2 );
			
			DrawRect( 
				cell.buffer_words,
				box_x-2,
				box_y-2,
				box_width+4,box_height+4,40,56,1,1,
				x,y,
				1.0,1.0,1.0,elements[i].opacity, i*fade_time
			);
			
			DrawRect( 
				cell.buffer_boxes,
				box_x-2,
				box_y-2,
				box_width+4,box_height+4,40,56,1,1,
				x,y,
				1.0,1.0,1.0,elements[i].opacity, i*fade_time
			);
			
			DrawText(
				cell.buffer_words,
				box_x,
				y,
				phrase,
				x, y,
				0.0,0.0,0.0,elements[i].opacity, i*fade_time
			);
			// lol
		} else if( elements[i].type == Source.E_LINE ) {
		
			var x1 = Math.round( elements[i].from.x );
			var y1 = Math.round( elements[i].from.y );
			var x2 = Math.round( elements[i].to.x );
			var y2 = Math.round( elements[i].to.y );
			var cell = GetCell( {x:x2, y:y2}, true );
			
			DrawLine( cell.buffer_lines, x1, y1, x2, y2, 1.5, 
				elements[i].color.r, 
				elements[i].color.g, 
				elements[i].color.b, 
				elements[i].opacity, i*fade_time   );
			
		}
	}
	  
	// load vertex buffers.
	for( var cx in m_cells ) { 
		if( !m_cells.hasOwnProperty( cx ) ) continue;
		for( var cy in m_cells[cx] ) {
			if( !m_cells[cx].hasOwnProperty( cy ) ) continue;
			var cell = m_cells[cx][cy];
			
			var buffer = new HC_Buffer();
			buffer.Load( cell.buffer_words.Buffer(), hc_gl.STATIC_DRAW ); 
			buffer.u_size = cell.buffer_words.total; 
			cell.buffer_words = buffer;
			
			buffer = new HC_Buffer();
			buffer.Load( cell.buffer_boxes.Buffer(), hc_gl.STATIC_DRAW );
			buffer.u_size = cell.buffer_boxes.total; 
			cell.buffer_boxes = buffer;
			
			buffer = new HC_Buffer();
			buffer.Load( cell.buffer_lines.Buffer(), hc_gl.STATIC_DRAW );
			buffer.u_size = cell.buffer_lines.total;
			cell.buffer_lines = buffer;
			
		}
	}
	 
	m_start_time = (new Date().getTime());
	// start frame loop
	m_next_tick = m_start_time;//
	OnFrame();
	
	$("#statusbar").text(
		is_touch_device() ? "Touch to navigate." :
		"Use your mouse to navigate. Scroll to zoom." );
	
	$("#glcanvas").bind( "mousewheel", function( ev, delta ) {
		DoZoom( delta * 0.05, true );
	}); 

	$("#glcanvas").mousedown( function( ev ) {
		 
		if( ev.which == 1 ) {
			DragStart( ev.screenX, ev.screenY );
		}
	}); 
	 
	$("#glcanvas").bind( "touchstart", function( ev ) {
		 
		if( ev.originalEvent.touches.length == 1 ) {
			DragStart( ev.originalEvent.touches[0].screenX, ev.originalEvent.touches[0].screenY );
		}
		/* else if( e.originalEvent.touches.length == 2 ) {
			DragStop();
			PinchStart( 
				Distance( 
					ev.originalEvent.touches[0].screenX, 
					ev.originalEvent.touches[0].screenY,
					ev.originalEvent.touches[1].screenX, 
					ev.originalEvent.touches[1].screenY ) );
			
		}*/
		ev.preventDefault();
	});
	
	$("#glcanvas").bind( "touchmove", function( ev ) {
		
		//console.log( ev.originalEvent.touches.length );
		if( ev.originalEvent.touches.length == 1 ) {
			m_pinch.active = false;
			DragMove( ev.originalEvent.touches[0].screenX, ev.originalEvent.touches[0].screenY );
		} else if( ev.originalEvent.touches.length == 2 ) {
			DragStop();
			PinchDrag( 
				Distance( 
					ev.originalEvent.touches[0].screenX, 
					ev.originalEvent.touches[0].screenY,
					ev.originalEvent.touches[1].screenX, 
					ev.originalEvent.touches[1].screenY ) );
		}
		//DragStart( .touches[0].pageX, ev.originalEvent.touches[0].pageY );
		ev.stopPropagation();
		ev.preventDefault();
	});
	
	$("#glcanvas").bind( "touchend", function( ev ) {
		DragStop();
		ev.preventDefault();
	});
	
	$("#glcanvas").mousemove( function( ev ) {
		if( m_drag.active ) { 
			DragMove( ev.screenX, ev.screenY );
			//m_drag.vel.power = 1.0;
		}
	});

	$("#glcanvas").mouseup( function(ev ) { 
		if( ev.which == 1 ) {
			DragStop();
		}
	}); 
	
	$("#loading").remove();
	/*
	$("#control_search").keypress( function(e) {
		if( e.which == 13 ) {
			
		}
	});*/
}

function DoZoom( delta, accel ) {
	if( accel ) {
		m_zooming -= delta  * (2.0 + m_zoom_accel);
		m_zoom_accel += 0.1; 
	} else {
		m_zooming -= delta ;// * (2.0 + m_zoom_accel);
	}
}
/*
function PinchStart( d ) {

	m_pinch.last = d;
}
*/
function PinchDrag( d ) {	
	
	if( !m_pinch.active ) {
		m_pinch.last = d;
		m_pinch.active = true;
	}
	var delta = d - m_pinch.last;
	m_pinch.last = d;
	DoZoom( delta * 0.005 );
}

function DragStart( x, y ) {
	if( m_drag.active ) return;
	m_drag.active = true;
	m_drag.start = { x: m_translate.x, y: m_translate.y }; 
	m_drag.sx = x;
	m_drag.sy = y;
	m_drag.lx = x;
	m_drag.ly = y;
	m_drag.x = 0;
	m_drag.y = 0;
	m_drag.velocity = 0.0;
	m_drag.vel.x = 0.0;
	m_drag.vel.y = 0.0;
}

function DragMove( x, y ) {
	if( !m_drag.active ) return;
	m_drag.x = x - m_drag.sx;
	m_drag.y = y - m_drag.sy;
	var rx = x - m_drag.lx;
	var ry = y - m_drag.ly;
	m_drag.lx = x;
	m_drag.ly = y;
	
	m_drag.vel.x += rx * 0.3;
	m_drag.vel.y += ry * 0.3;
	m_drag.vel.x = Math.clamp( m_drag.vel.x, -60, 60 );
	m_drag.vel.y = Math.clamp( m_drag.vel.y, -60, 60 );
}

function DragStop() {
	if( !m_drag.active ) return;
	m_drag.active = false;
	
	m_flying.x = m_drag.vel.x / m_zoom;
	m_flying.y = -m_drag.vel.y / m_zoom;
}

function DoFrameUpdate() {
	if( m_drag.active ) {
		m_zooming = 0.0;
		
		m_translate.x = m_drag.start.x + m_drag.x / m_zoom;
		m_translate.y = m_drag.start.y - m_drag.y / m_zoom; 
		
		m_drag.vel.x = m_drag.vel.x * 0.5;
		m_drag.vel.y = m_drag.vel.y * 0.5;
	} else {
		if( Math.abs(m_zooming) < 0.0001 
			&& Math.abs(m_flying.x) < 0.0001 
			&& Math.abs(m_flying.y) < 0.0001
			&& m_next_tick > m_start_time + fade_in_time
			&& !m_dirty ) {
			return;
		}
		if( m_zooming > 0.0001 ) {
			
			m_zoom /= Math.pow(1.1,m_zooming);
		} else if( m_zooming < 0.0001 ) {
			m_zoom *= Math.pow(1.1,-m_zooming);
		} 
		if( m_zoom < MINZOOM ) {
			m_zoom = MINZOOM;
			m_zooming = Math.min( m_zooming, 0.0 );
		} else if( m_zoom > MAXZOOM ) {
			m_zoom = MAXZOOM;
			m_zooming = Math.max( m_zooming, 0.0 );
		}
		
		m_zooming *= 0.95;
		
		m_translate.x += m_flying.x;
		m_translate.y += m_flying.y;
		m_flying.x *= 0.994;
		m_flying.y *= 0.994; 
	}
	m_zoom_accel *= 0.8;
	DrawScene();
	m_dirty = false;
}

function OnFrame() {
	
	DoFrameUpdate();
	
	var time = (new Date().getTime());
	m_next_tick += 1000.0/60.0;
	
	if( time > m_next_tick ) {
		m_next_tick = time;
		setTimeout( OnFrame, 0 );
	} else {
		setTimeout( OnFrame, m_next_tick - time );
	}
	
}

function is_touch_device() {
  return !!('ontouchstart' in window);
}

})();

/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

// process the data set

window.Source = new function() {
	
var m_source;

var m_stack = [];
var m_found = {};

//var m_cells = {};
var m_phrases = {};

var m_elements = [];

var MAX_SHADE_DIST = 500;

var E_WORD = 1;
this.E_WORD = 1;
var E_LINE = 2;
this.E_LINE = 2;

var m_postload;

function Load( source, onload ) {
	// todo: double up links, remove that from tree.php
	m_source = source;
	
	// add reversed links
	var backlinks = {};

	for( var from in m_source.links ) {
		if( !m_source.links.hasOwnProperty( from ) ) continue;
		
		for( var i = 0; i < m_source.links[from].length; i++ ) {
			var to = m_source.links[from][i].to;
			
			if( !backlinks.hasOwnProperty( to ) ) {
				backlinks[to] = [];
			}
			backlinks[to].push({
				"to": from,
				"score": m_source.links[from][i].score
			});
		}
		
	}
	
	for( var i in backlinks ) {
		if( !backlinks.hasOwnProperty( i ) ) continue;
		
		if( !m_source.links.hasOwnProperty( i ) ) {
			m_source.links[i] = [];
		}
		
		m_source.links[i] = m_source.links[i].concat( backlinks[i] );
	}
	// i hope that worked
	
	backlinks = null;
	
	m_stack.push( {
		from: 0,
		id: m_source.start, 
		progress: 0, 
		x:0, y:0, 
		level:0, 
		power: 100, 
		angle: 0.0,
		color: {
			r: 1.0,
			g: 1.0,
			b: 1.0
		}
	});
	setTimeout( DoProcess, 5 );
	
	m_postload = onload;
}

function GetElements() {
	return m_elements;
}

function GetPhrase( id ) {
	return m_source.phrases[id];
}

function GetCell( point, create ) {
	x = point.x >> 8;
	y = point.y >> 8;
	x = x < 0 ? -x*2+1 : x*2;
	y = y < 0 ? -y*2+1 : y*2;
	
	if( m_cells.hasOwnProperty( x ) && m_cells[x].hasOwnProperty(y) ) {
		return m_cells[x][y];
	} 
	if( !create ) return null;
	
	if( !m_cells.hasOwnProperty( x ) ) {
		m_cells[x] = {};
	}
	
	m_cells[x][y] = { lines: [], words: [] };
	return m_cells[x][y];
}
	
/** ---------------------------------------------------------------------------
 * Add an word to the element list.
 *
 * @param int phrase ID of phrase to use. 0 for a line-only element.
 * @param point point Destination point.
 * @param float opacity Opacity to render the element.
 */
function AddWord( phrase, point, opacity, level ) {
	var index = m_elements.push( {
		type: E_WORD,
		phrase: phrase,
		location: {
			x: point.x,
			y: point.y,
		},
		opacity: opacity,
		level: level
	}) - 1;
	
	//var cell = GetCell( point );
	//cell.push( index );
}

/** ---------------------------------------------------------------------------
 * Add a connection/line.
 *
 * @param point from,to Line coordinates.
 * @param float opacity Opacity to render the element.
 */
function AddLine( from, to, color, opacity, level ) {
	var index = m_elements.push( {
		type: E_LINE,
		from: {
			x: from.x,
			y: from.y
		}, 
		to: {
			x: to.x,
			y: to.y
		},
		color: color,
		opacity: opacity,
		level: level
	}) - 1;
	
	//var cell = GetCell( to );
	//cell.push( index );
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function Shuffle( o ) { //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function RndRange( min, max ) {
	return Math.random() * (max-min) + min;
}

function Distance2( a, b ) {
	return (b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y);
}

function ProcessItem() { 
	if( Math.random() < 0.1 ) {
		var item = m_stack.shift();
	} else {
		var item = m_stack.pop();
	}
		
	var found = m_found.hasOwnProperty(item.id);
	
	if( found ) {
		if( Distance2( 
				m_found[item.from], m_found[item.id].x ) 
				    < MAX_SHADE_DIST * MAX_SHADE_DIST ) {
					  
			AddLine( m_found[item.from], m_found[item.id], item.color, 0.5, item.level );
			 
			return 1;
		}
	}
	
	if( item.from != 0 ) {
		// draw line
		AddLine( m_found[item.from], item, m_found[item.from].color, found ? 0.5 : 1.0, item.level );
	}
	
	if( item.progress == 0 ) {
		AddWord( item.id, item, found ? 0.5 : 1.0, item.level  );
		item.progress = 1;
	}
	
	if( m_found.hasOwnProperty(item.id)  ) return 0;
	m_found[item.id] = { x: item.x, y: item.y,
		color: {
			r: item.color.r,
			g: item.color.g,
			b: item.color.b
		}
	};
	
	//item.color.r = ;
	//item.color.g = Math.clamp( item.color.g+RndRange( -0.2, 0.2 ), 0.5, 1.0 );
	//item.color.b = Math.clamp( item.color.b+RndRange( -0.2, 0.2 ), 0.5, 1.0 );
	
	
	Shuffle( m_source.links[item.id] );
	
	var length = m_source.links[item.id].length;
	//var dbase = -140.0;
	
	for( var i = 0; i < length; i++ ) {
		if( m_source.links[item.id][i].to == item.from ) continue;
		var distance_range = 1.0 + Math.max(1.0-(item.level / 10.0),0.0) * 2.0  + 1.0;// Math.max( Math.min( 1.0, length / 5.0 * 1.0 ), 0.2 ) * 3.0;+
		
		var angle_range = 0.1+Math.min( 1.0, length / 10.0 ) * 2.0 +  Math.max(1.0-(item.level / 3.0),0.0) * 6.0; 
		var angle = item.angle + RndRange(-angle_range,angle_range) - 0.02;
		  
		var distance = RndRange( 70.0 , 100.0 )* distance_range;// + dbase;
	 
		var x2 = Math.round(item.x + Math.cos( angle ) * distance);
		var y2 = Math.round(item.y + Math.sin( angle ) * distance);
	
		m_stack.push( {
			from: item.id,
			id: m_source.links[item.id][i].to,
			power: m_source.links[item.id][i].score,
			progress: 0,
			level: item.level+1,
			x: x2,
			y: y2,
			angle: angle,
			color: {
				r: Math.clamp( item.color.r + RndRange( -0.1, 0.1 ), 0.4, 1.0 ),
				g: Math.clamp( item.color.g + RndRange( -0.1, 0.1 ), 0.4, 1.0 ),
				b: Math.clamp( item.color.b + RndRange( -0.1, 0.1 ), 0.4, 1.0 )
			}} ); 
	}
	return 1;
}


function DoProcess() {
	
	var time = 0;
	while( time < 50 ) {// 4000 ) {
		if( m_stack.length == 0 ) {
			m_postload();
			return; // finished!
		}
		time += ProcessItem();
	}
	
	setTimeout( DoProcess, 5 );
}

this.GetCell = GetCell;
this.Load = Load;

this.GetElements = GetElements;
this.GetPhrase = GetPhrase;
	
};

