function M(){}function W(t,e){for(const n in e)t[n]=e[n];return t}function q(t){return t()}function ot(){return Object.create(null)}function G(t){t.forEach(q)}function I(t){return typeof t=="function"}function at(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function ut(t){return Object.keys(t).length===0}function R(t,...e){if(t==null){for(const i of e)i(void 0);return M}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function ft(t,e,n){t.$$.on_destroy.push(R(e,n))}function _t(t,e,n,i){if(t){const s=S(t,e,n,i);return t[0](s)}}function S(t,e,n,i){return t[1]&&i?W(n.ctx.slice(),t[1](i(e))):n.ctx}function dt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const c=[],r=Math.max(e.dirty.length,s.length);for(let o=0;o<r;o+=1)c[o]=e.dirty[o]|s[o];return c}return e.dirty|s}return e.dirty}function ht(t,e,n,i,s,c){if(s){const r=S(e,n,i,c);t.p(r,s)}}function mt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function pt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function yt(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function bt(t){return t??""}function gt(t,e,n){return t.set(n),e}function xt(t){return t&&I(t.destroy)?t.destroy:M}let b=!1;function wt(){b=!0}function vt(){b=!1}function F(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function U(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let a=0;a<e.length;a++){const u=e[a];u.claim_order!==void 0&&l.push(u)}e=l}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let l=0;l<e.length;l++){const a=e[l].claim_order,u=(s>0&&e[n[s]].claim_order<=a?s+1:F(1,s,B=>e[n[B]].claim_order,a))-1;i[l]=n[u]+1;const k=u+1;n[k]=l,s=Math.max(k,s)}const c=[],r=[];let o=e.length-1;for(let l=n[s]+1;l!=0;l=i[l-1]){for(c.push(e[l-1]);o>=l;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);c.reverse(),r.sort((l,a)=>l.claim_order-a.claim_order);for(let l=0,a=0;l<r.length;l++){for(;a<c.length&&r[l].claim_order>=c[a].claim_order;)a++;const u=a<c.length?c[a]:null;t.insertBefore(r[l],u)}}function J(t,e){t.appendChild(e)}function K(t,e){if(b){for(U(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Q(t,e,n){t.insertBefore(e,n||null)}function V(t,e,n){b&&!n?K(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function p(t){t.parentNode&&t.parentNode.removeChild(t)}function Et(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function T(t){return document.createElement(t)}function j(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function A(t){return document.createTextNode(t)}function Tt(){return A(" ")}function At(){return A("")}function C(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Nt(t){return function(e){return e.preventDefault(),t.call(this,e)}}function N(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const X=["width","height"];function Y(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&X.indexOf(i)===-1?t[i]=e[i]:N(t,i,e[i])}function kt(t,e){for(const n in e)N(t,n,e[n])}function Z(t,e){Object.keys(e).forEach(n=>{$(t,n,e[n])})}function $(t,e,n){const i=e.toLowerCase();i in t?t[i]=typeof t[i]=="boolean"&&n===""?!0:n:e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:N(t,e,n)}function Ct(t){return/-/.test(t)?Z:Y}function Ht(t){return t.dataset.svelteH}function Lt(t){return t===""?null:+t}function Mt(t){return Array.from(t.childNodes)}function D(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function P(t,e,n,i,s=!1){D(t);const c=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const l=n(o);return l===void 0?t.splice(r,1):t[r]=l,s||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const l=n(o);return l===void 0?t.splice(r,1):t[r]=l,s?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function O(t,e,n,i){return P(t,s=>s.nodeName===e,s=>{const c=[];for(let r=0;r<s.attributes.length;r++){const o=s.attributes[r];n[o.name]||c.push(o.name)}c.forEach(r=>s.removeAttribute(r))},()=>i(e))}function St(t,e,n){return O(t,e,n,T)}function jt(t,e,n){return O(t,e,n,j)}function tt(t,e){return P(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>A(e),!0)}function Dt(t){return tt(t," ")}function H(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return-1}function Pt(t,e){const n=H(t,"HTML_TAG_START",0),i=H(t,"HTML_TAG_END",n+1);if(n===-1||i===-1)return new g(e);D(t);const s=t.splice(n,i-n+1);p(s[0]),p(s[s.length-1]);const c=s.slice(1,s.length-1);if(c.length===0)return new g(e);for(const r of c)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new g(e,c)}function Ot(t,e){e=""+e,t.data!==e&&(t.data=e)}function zt(t,e){t.value=e??""}function Bt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let m;function et(){if(m===void 0){m=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{m=!0}}return m}function Wt(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=T("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=et();let c;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",c=C(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{c=C(i.contentWindow,"resize",e),e()}),J(t,i),()=>{(s||c&&i.contentWindow)&&c(),p(i)}}function qt(t,e,n){t.classList.toggle(e,!!n)}function nt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Gt(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const c=s.textContent.trim();c===`HEAD_${t}_END`?(i-=1,n.push(s)):c===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class it{is_svg=!1;e=void 0;n=void 0;t=void 0;a=void 0;constructor(e=!1){this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=j(n.nodeName):this.e=T(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)Q(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(p)}}class g extends it{l=void 0;constructor(e=!1,n){super(e),this.e=this.n=null,this.l=n}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)V(this.t,this.n[n],e)}}function It(t,e){return new t(e)}let y;function x(t){y=t}function h(){if(!y)throw new Error("Function called outside component initialization");return y}function Rt(t){h().$$.on_mount.push(t)}function Ft(t){h().$$.after_update.push(t)}function Ut(){const t=h();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const c=nt(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,c)}),!c.defaultPrevented}return!0}}function Jt(t,e){return h().$$.context.set(t,e),e}function Kt(t){return h().$$.context.get(t)}const d=[],L=[];let _=[];const v=[],z=Promise.resolve();let E=!1;function st(){E||(E=!0,z.then(ct))}function Qt(){return st(),z}function rt(t){_.push(t)}function Vt(t){v.push(t)}const w=new Set;let f=0;function ct(){if(f!==0)return;const t=y;do{try{for(;f<d.length;){const e=d[f];f++,x(e),lt(e.$$)}}catch(e){throw d.length=0,f=0,e}for(x(null),d.length=0,f=0;L.length;)L.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];w.has(n)||(w.add(n),n())}_.length=0}while(d.length);for(;v.length;)v.pop()();E=!1,w.clear(),x(t)}function lt(t){if(t.fragment!==null){t.update(),G(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(rt)}}function Xt(t){const e=[],n=[];_.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),_=e}export{jt as $,Qt as A,ot as B,ct as C,ut as D,rt as E,Xt as F,y as G,x as H,q as I,d as J,st as K,wt as L,vt as M,g as N,Pt as O,_t as P,ht as Q,mt as R,dt as S,Gt as T,xt as U,C as V,Et as W,Lt as X,qt as Y,W as Z,j as _,R as a,kt as a0,yt as a1,pt as a2,Ut as a3,Wt as a4,Jt as a5,Kt as a6,Vt as a7,Ct as a8,gt as a9,bt as aa,Nt as ab,Mt as b,St as c,tt as d,T as e,p as f,V as g,K as h,I as i,Ot as j,ft as k,Tt as l,Ht as m,M as n,Dt as o,N as p,zt as q,G as r,at as s,A as t,At as u,Ft as v,Rt as w,Bt as x,L as y,It as z};