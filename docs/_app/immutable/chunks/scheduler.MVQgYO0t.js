function M(){}const at=t=>t;function W(t,e){for(const n in e)t[n]=e[n];return t}function I(t){return t()}function ut(){return Object.create(null)}function G(t){t.forEach(I)}function R(t){return typeof t=="function"}function ft(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let m;function _t(t,e){return t===e?!0:(m||(m=document.createElement("a")),m.href=e,t===m.href)}function dt(t){return Object.keys(t).length===0}function F(t,...e){if(t==null){for(const i of e)i(void 0);return M}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function ht(t,e,n){t.$$.on_destroy.push(F(e,n))}function mt(t,e,n,i){if(t){const s=j(t,e,n,i);return t[0](s)}}function j(t,e,n,i){return t[1]&&i?W(n.ctx.slice(),t[1](i(e))):n.ctx}function pt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const c=[],r=Math.max(e.dirty.length,s.length);for(let l=0;l<r;l+=1)c[l]=e.dirty[l]|s[l];return c}return e.dirty|s}return e.dirty}function yt(t,e,n,i,s,c){if(s){const r=j(e,n,i,c);t.p(r,s)}}function gt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function bt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function xt(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function wt(t){return t??""}function vt(t,e,n){return t.set(n),e}function Et(t){return t&&R(t.destroy)?t.destroy:M}let b=!1;function Tt(){b=!0}function At(){b=!1}function U(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function J(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let a=0;a<e.length;a++){const u=e[a];u.claim_order!==void 0&&o.push(u)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let o=0;o<e.length;o++){const a=e[o].claim_order,u=(s>0&&e[n[s]].claim_order<=a?s+1:U(1,s,B=>e[n[B]].claim_order,a))-1;i[o]=n[u]+1;const C=u+1;n[C]=o,s=Math.max(C,s)}const c=[],r=[];let l=e.length-1;for(let o=n[s]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);l>=o;l--)r.push(e[l]);l--}for(;l>=0;l--)r.push(e[l]);c.reverse(),r.sort((o,a)=>o.claim_order-a.claim_order);for(let o=0,a=0;o<r.length;o++){for(;a<c.length&&r[o].claim_order>=c[a].claim_order;)a++;const u=a<c.length?c[a]:null;t.insertBefore(r[o],u)}}function K(t,e){t.appendChild(e)}function Q(t,e){if(b){for(J(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function V(t,e,n){t.insertBefore(e,n||null)}function X(t,e,n){b&&!n?Q(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function y(t){t.parentNode&&t.parentNode.removeChild(t)}function Nt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function A(t){return document.createElement(t)}function D(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function N(t){return document.createTextNode(t)}function kt(){return N(" ")}function Ct(){return N("")}function S(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function St(t){return function(e){return e.preventDefault(),t.call(this,e)}}function k(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const Y=["width","height"];function Z(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&Y.indexOf(i)===-1?t[i]=e[i]:k(t,i,e[i])}function Ht(t,e){for(const n in e)k(t,n,e[n])}function $(t,e){Object.keys(e).forEach(n=>{tt(t,n,e[n])})}function tt(t,e,n){const i=e.toLowerCase();i in t?t[i]=typeof t[i]=="boolean"&&n===""?!0:n:e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:k(t,e,n)}function Lt(t){return/-/.test(t)?$:Z}function Mt(t){return t.dataset.svelteH}function jt(t){return t===""?null:+t}function Dt(t){return Array.from(t.childNodes)}function P(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function O(t,e,n,i,s=!1){P(t);const c=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(e(l)){const o=n(l);return o===void 0?t.splice(r,1):t[r]=o,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(e(l)){const o=n(l);return o===void 0?t.splice(r,1):t[r]=o,s?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function q(t,e,n,i){return O(t,s=>s.nodeName===e,s=>{const c=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];n[l.name]||c.push(l.name)}c.forEach(r=>s.removeAttribute(r))},()=>i(e))}function Pt(t,e,n){return q(t,e,n,A)}function Ot(t,e,n){return q(t,e,n,D)}function et(t,e){return O(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>N(e),!0)}function qt(t){return et(t," ")}function H(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return-1}function zt(t,e){const n=H(t,"HTML_TAG_START",0),i=H(t,"HTML_TAG_END",n+1);if(n===-1||i===-1)return new x(e);P(t);const s=t.splice(n,i-n+1);y(s[0]),y(s[s.length-1]);const c=s.slice(1,s.length-1);if(c.length===0)return new x(e);for(const r of c)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new x(e,c)}function Bt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Wt(t,e){t.value=e??""}function It(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Gt(t,e,n){for(let i=0;i<t.options.length;i+=1){const s=t.options[i];if(s.__value===e){s.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function Rt(t){const e=t.querySelector(":checked");return e&&e.__value}let p;function nt(){if(p===void 0){p=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{p=!0}}return p}function Ft(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=A("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=nt();let c;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",c=S(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{c=S(i.contentWindow,"resize",e),e()}),K(t,i),()=>{(s||c&&i.contentWindow)&&c(),y(i)}}function Ut(t,e,n){t.classList.toggle(e,!!n)}function it(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Jt(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const c=s.textContent.trim();c===`HEAD_${t}_END`?(i-=1,n.push(s)):c===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class st{is_svg=!1;e=void 0;n=void 0;t=void 0;a=void 0;constructor(e=!1){this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=D(n.nodeName):this.e=A(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)V(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(y)}}class x extends st{l=void 0;constructor(e=!1,n){super(e),this.e=this.n=null,this.l=n}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)X(this.t,this.n[n],e)}}function Kt(t,e){return new t(e)}let g;function w(t){g=t}function h(){if(!g)throw new Error("Function called outside component initialization");return g}function Qt(t){h().$$.on_mount.push(t)}function Vt(t){h().$$.after_update.push(t)}function Xt(){const t=h();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const c=it(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,c)}),!c.defaultPrevented}return!0}}function Yt(t,e){return h().$$.context.set(t,e),e}function Zt(t){return h().$$.context.get(t)}const d=[],L=[];let _=[];const E=[],z=Promise.resolve();let T=!1;function rt(){T||(T=!0,z.then(ot))}function $t(){return rt(),z}function ct(t){_.push(t)}function te(t){E.push(t)}const v=new Set;let f=0;function ot(){if(f!==0)return;const t=g;do{try{for(;f<d.length;){const e=d[f];f++,w(e),lt(e.$$)}}catch(e){throw d.length=0,f=0,e}for(w(null),d.length=0,f=0;L.length;)L.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];v.has(n)||(v.add(n),n())}_.length=0}while(d.length);for(;E.length;)E.pop()();T=!1,v.clear(),w(t)}function lt(t){if(t.fragment!==null){t.update(),G(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(ct)}}function ee(t){const e=[],n=[];_.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),_=e}export{Ot as $,$t as A,ut as B,ot as C,dt as D,ct as E,ee as F,g as G,w as H,I,d as J,rt as K,Tt as L,At as M,x as N,zt as O,mt as P,yt as Q,gt as R,pt as S,Jt as T,Et as U,S as V,Nt as W,jt as X,Ut as Y,W as Z,D as _,F as a,Ht as a0,xt as a1,bt as a2,Xt as a3,Ft as a4,Yt as a5,Zt as a6,te as a7,Lt as a8,Gt as a9,Rt as aa,_t as ab,vt as ac,wt as ad,St as ae,at as af,Dt as b,Pt as c,et as d,A as e,y as f,X as g,Q as h,R as i,Bt as j,ht as k,kt as l,Mt as m,M as n,qt as o,k as p,Wt as q,G as r,ft as s,N as t,Ct as u,Vt as v,Qt as w,It as x,L as y,Kt as z};