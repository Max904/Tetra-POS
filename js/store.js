Bien, ahora una cosita urgente que pille ahora, si hay 2 telefonos con garzones, garzon A esta haciendo la comanda para mesa 1, y garzon B esta tomando la comanda de mesa 2, garzon B se le actualiza su comanda con los datos de garzon A si estan haciendo una comanda al mismo tiempo

No te puedo pasar todos los archivos, aqui va el contenido de los que no puedo:

/vendor/client.mjs
/* esm.sh - react-dom@18.3.1/client */
import*as __0$ from"./react-dom.mjs";var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({__esModule:true},m);switch(n){case"react-dom":return e(__0$);default:console.error('module "'+n+'" not found');return null;}};
var R=Object.create;var c=Object.defineProperty;var l=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var E=Object.getPrototypeOf,_=Object.prototype.hasOwnProperty;var f=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(o,e)=>(typeof require<"u"?require:o)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var d=(t,o)=>()=>(o||t((o={exports:{}}).exports,o),o.exports);var m=(t,o,e,a)=>{if(o&&typeof o=="object"||typeof o=="function")for(let r of y(o))!_.call(t,r)&&r!==e&&c(t,r,{get:()=>o[r],enumerable:!(a=l(o,r))||a.enumerable});return t};var h=(t,o,e)=>(e=t!=null?R(E(t)):{},m(o||!t||!t.__esModule?c(e,"default",{value:t,enumerable:!0}):e,t));var u=d(i=>{"use strict";var s=f("react-dom");i.createRoot=s.createRoot,i.hydrateRoot=s.hydrateRoot;var C});var n=h(u()),{createRoot:O,hydrateRoot:g}=n,x=n.default??n;export{O as createRoot,x as default,g as hydrateRoot};
//# sourceMappingURL=client.mjs.map

/vendor/scheduler.mjs
/* esm.sh - scheduler@0.23.2 */
var __setImmediate$ = (cb, ...args) => ( { $t: setTimeout(cb, 0, ...args), [Symbol.dispose](){ clearTimeout(this.t) } });
var V=Object.create;var B=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var X=Object.getOwnPropertyNames;var Z=Object.getPrototypeOf,$=Object.prototype.hasOwnProperty;var D=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports);var ee=(e,n,t,l)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of X(n))!$.call(e,i)&&i!==t&&B(e,i,{get:()=>n[i],enumerable:!(l=U(n,i))||l.enumerable});return e};var ne=(e,n,t)=>(t=e!=null?V(Z(e)):{},ee(n||!e||!e.__esModule?B(t,"default",{value:e,enumerable:!0}):t,e));var K=D(r=>{"use strict";function L(e,n){var t=e.length;e.push(n);e:for(;0<t;){var l=t-1>>>1,i=e[l];if(0<g(i,n))e[l]=n,e[t]=i,t=l;else break e}}function o(e){return e.length===0?null:e[0]}function k(e){if(e.length===0)return null;var n=e[0],t=e.pop();if(t!==n){e[0]=t;e:for(var l=0,i=e.length,y=i>>>1;l<y;){var f=2*(l+1)-1,I=e[f],b=f+1,m=e[b];if(0>g(I,t))b<i&&0>g(m,I)?(e[l]=m,e[b]=t,l=b):(e[l]=I,e[f]=t,l=f);else if(b<i&&0>g(m,t))e[l]=m,e[b]=t,l=b;else break e}}return n}function g(e,n){var t=e.sortIndex-n.sortIndex;return t!==0?t:e.id-n.id}typeof performance=="object"&&typeof performance.now=="function"?(q=performance,r.unstable_now=function(){return q.now()}):(C=Date,O=C.now(),r.unstable_now=function(){return C.now()-O});var q,C,O,s=[],c=[],te=1,a=null,u=3,P=!1,_=!1,v=!1,z=typeof setTimeout=="function"?setTimeout:null,A=typeof clearTimeout=="function"?clearTimeout:null,W=typeof __setImmediate$<"u"?__setImmediate$:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function N(e){for(var n=o(c);n!==null;){if(n.callback===null)k(c);else if(n.startTime<=e)k(c),n.sortIndex=n.expirationTime,L(s,n);else break;n=o(c)}}function j(e){if(v=!1,N(e),!_)if(o(s)!==null)_=!0,M(F);else{var n=o(c);n!==null&&R(j,n.startTime-e)}}function F(e,n){_=!1,v&&(v=!1,A(d),d=-1),P=!0;var t=u;try{for(N(n),a=o(s);a!==null&&(!(a.expirationTime>n)||e&&!J());){var l=a.callback;if(typeof l=="function"){a.callback=null,u=a.priorityLevel;var i=l(a.expirationTime<=n);n=r.unstable_now(),typeof i=="function"?a.callback=i:a===o(s)&&k(s),N(n)}else k(s);a=o(s)}if(a!==null)var y=!0;else{var f=o(c);f!==null&&R(j,f.startTime-n),y=!1}return y}finally{a=null,u=t,P=!1}}var w=!1,h=null,d=-1,G=5,H=-1;function J(){return!(r.unstable_now()-H<G)}function E(){if(h!==null){var e=r.unstable_now();H=e;var n=!0;try{n=h(!0,e)}finally{n?p():(w=!1,h=null)}}else w=!1}var p;typeof W=="function"?p=function(){W(E)}:typeof MessageChannel<"u"?(T=new MessageChannel,Y=T.port2,T.port1.onmessage=E,p=function(){Y.postMessage(null)}):p=function(){z(E,0)};var T,Y;function M(e){h=e,w||(w=!0,p())}function R(e,n){d=z(function(){e(r.unstable_now())},n)}r.unstable_IdlePriority=5;r.unstable_ImmediatePriority=1;r.unstable_LowPriority=4;r.unstable_NormalPriority=3;r.unstable_Profiling=null;r.unstable_UserBlockingPriority=2;r.unstable_cancelCallback=function(e){e.callback=null};r.unstable_continueExecution=function(){_||P||(_=!0,M(F))};r.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):G=0<e?Math.floor(1e3/e):5};r.unstable_getCurrentPriorityLevel=function(){return u};r.unstable_getFirstCallbackNode=function(){return o(s)};r.unstable_next=function(e){switch(u){case 1:case 2:case 3:var n=3;break;default:n=u}var t=u;u=n;try{return e()}finally{u=t}};r.unstable_pauseExecution=function(){};r.unstable_requestPaint=function(){};r.unstable_runWithPriority=function(e,n){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var t=u;u=e;try{return n()}finally{u=t}};r.unstable_scheduleCallback=function(e,n,t){var l=r.unstable_now();switch(typeof t=="object"&&t!==null?(t=t.delay,t=typeof t=="number"&&0<t?l+t:l):t=l,e){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}return i=t+i,e={id:te++,callback:n,priorityLevel:e,startTime:t,expirationTime:i,sortIndex:-1},t>l?(e.sortIndex=t,L(c,e),o(s)===null&&e===o(c)&&(v?(A(d),d=-1):v=!0,R(j,t-l))):(e.sortIndex=i,L(s,e),_||P||(_=!0,M(F))),e};r.unstable_shouldYield=J;r.unstable_wrapCallback=function(e){var n=u;return function(){var t=u;u=n;try{return e.apply(this,arguments)}finally{u=t}}}});var S=D((ie,Q)=>{"use strict";Q.exports=K()});var x=ne(S()),{unstable_now:ue,unstable_IdlePriority:ae,unstable_ImmediatePriority:oe,unstable_LowPriority:se,unstable_NormalPriority:ce,unstable_Profiling:fe,unstable_UserBlockingPriority:be,unstable_cancelCallback:_e,unstable_continueExecution:pe,unstable_forceFrameRate:ve,unstable_getCurrentPriorityLevel:de,unstable_getFirstCallbackNode:ye,unstable_next:me,unstable_pauseExecution:ge,unstable_requestPaint:he,unstable_runWithPriority:ke,unstable_scheduleCallback:Pe,unstable_shouldYield:we,unstable_wrapCallback:xe}=x,Ie=x.default??x;export{Ie as default,ae as unstable_IdlePriority,oe as unstable_ImmediatePriority,se as unstable_LowPriority,ce as unstable_NormalPriority,fe as unstable_Profiling,be as unstable_UserBlockingPriority,_e as unstable_cancelCallback,pe as unstable_continueExecution,ve as unstable_forceFrameRate,de as unstable_getCurrentPriorityLevel,ye as unstable_getFirstCallbackNode,me as unstable_next,ue as unstable_now,ge as unstable_pauseExecution,he as unstable_requestPaint,ke as unstable_runWithPriority,Pe as unstable_scheduleCallback,we as unstable_shouldYield,xe as unstable_wrapCallback};
/*! Bundled license information:

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=scheduler.mjs.map

/vendor/react.mjs
/* esm.sh - react@18.3.1 */
var U=Object.create;var k=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var A=Object.getOwnPropertyNames;var M=Object.getPrototypeOf,z=Object.prototype.hasOwnProperty;var w=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var B=(e,t,n,u)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of A(t))!z.call(e,o)&&o!==n&&k(e,o,{get:()=>t[o],enumerable:!(u=q(t,o))||u.enumerable});return e};var H=(e,t,n)=>(n=e!=null?U(M(e)):{},B(t||!e||!e.__esModule?k(n,"default",{value:e,enumerable:!0}):n,e));var L=w(r=>{"use strict";var y=Symbol.for("react.element"),W=Symbol.for("react.portal"),Y=Symbol.for("react.fragment"),G=Symbol.for("react.strict_mode"),J=Symbol.for("react.profiler"),K=Symbol.for("react.provider"),Q=Symbol.for("react.context"),X=Symbol.for("react.forward_ref"),Z=Symbol.for("react.suspense"),ee=Symbol.for("react.memo"),te=Symbol.for("react.lazy"),b=Symbol.iterator;function re(e){return e===null||typeof e!="object"?null:(e=b&&e[b]||e["@@iterator"],typeof e=="function"?e:null)}var x={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},O=Object.assign,I={};function p(e,t,n){this.props=e,this.context=t,this.refs=I,this.updater=n||x}p.prototype.isReactComponent={};p.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};p.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function g(){}g.prototype=p.prototype;function S(e,t,n){this.props=e,this.context=t,this.refs=I,this.updater=n||x}var E=S.prototype=new g;E.constructor=S;O(E,p.prototype);E.isPureReactComponent=!0;var $=Array.isArray,P=Object.prototype.hasOwnProperty,R={current:null},T={key:!0,ref:!0,__self:!0,__source:!0};function D(e,t,n){var u,o={},s=null,f=null;if(t!=null)for(u in t.ref!==void 0&&(f=t.ref),t.key!==void 0&&(s=""+t.key),t)P.call(t,u)&&!T.hasOwnProperty(u)&&(o[u]=t[u]);var i=arguments.length-2;if(i===1)o.children=n;else if(1<i){for(var c=Array(i),a=0;a<i;a++)c[a]=arguments[a+2];o.children=c}if(e&&e.defaultProps)for(u in i=e.defaultProps,i)o[u]===void 0&&(o[u]=i[u]);return{$$typeof:y,type:e,key:s,ref:f,props:o,_owner:R.current}}function ne(e,t){return{$$typeof:y,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function C(e){return typeof e=="object"&&e!==null&&e.$$typeof===y}function oe(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var j=/\/+/g;function v(e,t){return typeof e=="object"&&e!==null&&e.key!=null?oe(""+e.key):t.toString(36)}function _(e,t,n,u,o){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var f=!1;if(e===null)f=!0;else switch(s){case"string":case"number":f=!0;break;case"object":switch(e.$$typeof){case y:case W:f=!0}}if(f)return f=e,o=o(f),e=u===""?"."+v(f,0):u,$(o)?(n="",e!=null&&(n=e.replace(j,"$&/")+"/"),_(o,t,n,"",function(a){return a})):o!=null&&(C(o)&&(o=ne(o,n+(!o.key||f&&f.key===o.key?"":(""+o.key).replace(j,"$&/")+"/")+e)),t.push(o)),1;if(f=0,u=u===""?".":u+":",$(e))for(var i=0;i<e.length;i++){s=e[i];var c=u+v(s,i);f+=_(s,t,n,c,o)}else if(c=re(e),typeof c=="function")for(e=c.call(e),i=0;!(s=e.next()).done;)s=s.value,c=u+v(s,i++),f+=_(s,t,n,c,o);else if(s==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return f}function d(e,t,n){if(e==null)return e;var u=[],o=0;return _(e,u,"","",function(s){return t.call(n,s,o++)}),u}function ue(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var l={current:null},m={transition:null},ce={ReactCurrentDispatcher:l,ReactCurrentBatchConfig:m,ReactCurrentOwner:R};function V(){throw Error("act(...) is not supported in production builds of React.")}r.Children={map:d,forEach:function(e,t,n){d(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return d(e,function(){t++}),t},toArray:function(e){return d(e,function(t){return t})||[]},only:function(e){if(!C(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};r.Component=p;r.Fragment=Y;r.Profiler=J;r.PureComponent=S;r.StrictMode=G;r.Suspense=Z;r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ce;r.act=V;r.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var u=O({},e.props),o=e.key,s=e.ref,f=e._owner;if(t!=null){if(t.ref!==void 0&&(s=t.ref,f=R.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(c in t)P.call(t,c)&&!T.hasOwnProperty(c)&&(u[c]=t[c]===void 0&&i!==void 0?i[c]:t[c])}var c=arguments.length-2;if(c===1)u.children=n;else if(1<c){i=Array(c);for(var a=0;a<c;a++)i[a]=arguments[a+2];u.children=i}return{$$typeof:y,type:e.type,key:o,ref:s,props:u,_owner:f}};r.createContext=function(e){return e={$$typeof:Q,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:K,_context:e},e.Consumer=e};r.createElement=D;r.createFactory=function(e){var t=D.bind(null,e);return t.type=e,t};r.createRef=function(){return{current:null}};r.forwardRef=function(e){return{$$typeof:X,render:e}};r.isValidElement=C;r.lazy=function(e){return{$$typeof:te,_payload:{_status:-1,_result:e},_init:ue}};r.memo=function(e,t){return{$$typeof:ee,type:e,compare:t===void 0?null:t}};r.startTransition=function(e){var t=m.transition;m.transition={};try{e()}finally{m.transition=t}};r.unstable_act=V;r.useCallback=function(e,t){return l.current.useCallback(e,t)};r.useContext=function(e){return l.current.useContext(e)};r.useDebugValue=function(){};r.useDeferredValue=function(e){return l.current.useDeferredValue(e)};r.useEffect=function(e,t){return l.current.useEffect(e,t)};r.useId=function(){return l.current.useId()};r.useImperativeHandle=function(e,t,n){return l.current.useImperativeHandle(e,t,n)};r.useInsertionEffect=function(e,t){return l.current.useInsertionEffect(e,t)};r.useLayoutEffect=function(e,t){return l.current.useLayoutEffect(e,t)};r.useMemo=function(e,t){return l.current.useMemo(e,t)};r.useReducer=function(e,t,n){return l.current.useReducer(e,t,n)};r.useRef=function(e){return l.current.useRef(e)};r.useState=function(e){return l.current.useState(e)};r.useSyncExternalStore=function(e,t,n){return l.current.useSyncExternalStore(e,t,n)};r.useTransition=function(){return l.current.useTransition()};r.version="18.3.1"});var F=w((fe,N)=>{"use strict";N.exports=L()});var h=H(F()),{Children:le,Component:ae,Fragment:pe,Profiler:ye,PureComponent:de,StrictMode:_e,Suspense:me,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:he,act:ve,cloneElement:Se,createContext:Ee,createElement:Re,createFactory:Ce,createRef:ke,forwardRef:we,isValidElement:be,lazy:$e,memo:je,startTransition:xe,unstable_act:Oe,useCallback:Ie,useContext:ge,useDebugValue:Pe,useDeferredValue:Te,useEffect:De,useId:Ve,useImperativeHandle:Le,useInsertionEffect:Ne,useLayoutEffect:Fe,useMemo:Ue,useReducer:qe,useRef:Ae,useState:Me,useSyncExternalStore:ze,useTransition:Be,version:He}=h,We=h.default??h;export{le as Children,ae as Component,pe as Fragment,ye as Profiler,de as PureComponent,_e as StrictMode,me as Suspense,he as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ve as act,Se as cloneElement,Ee as createContext,Re as createElement,Ce as createFactory,ke as createRef,We as default,we as forwardRef,be as isValidElement,$e as lazy,je as memo,xe as startTransition,Oe as unstable_act,Ie as useCallback,ge as useContext,Pe as useDebugValue,Te as useDeferredValue,De as useEffect,Ve as useId,Le as useImperativeHandle,Ne as useInsertionEffect,Fe as useLayoutEffect,Ue as useMemo,qe as useReducer,Ae as useRef,Me as useState,ze as useSyncExternalStore,Be as useTransition,He as version};
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=react.mjs.map

/vendor/jsx-runtime.mjs
/* esm.sh - react@18.3.1/jsx-runtime */
import*as __0$ from"./react.mjs";var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({__esModule:true},m);switch(n){case"react":return e(__0$);default:console.error('module "'+n+'" not found');return null;}};
var y=Object.create;var l=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var O=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty;var v=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(e,o)=>(typeof require<"u"?require:e)[o]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var i=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports);var E=(r,e,o,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of x(e))!a.call(r,s)&&s!==o&&l(r,s,{get:()=>e[s],enumerable:!(t=j(e,s))||t.enumerable});return r};var k=(r,e,o)=>(o=r!=null?y(O(r)):{},E(e||!r||!r.__esModule?l(o,"default",{value:r,enumerable:!0}):o,r));var c=i(n=>{"use strict";var N=v("react"),R=Symbol.for("react.element"),S=Symbol.for("react.fragment"),b=Object.prototype.hasOwnProperty,q=N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,w={key:!0,ref:!0,__self:!0,__source:!0};function _(r,e,o){var t,s={},p=null,u=null;o!==void 0&&(p=""+o),e.key!==void 0&&(p=""+e.key),e.ref!==void 0&&(u=e.ref);for(t in e)b.call(e,t)&&!w.hasOwnProperty(t)&&(s[t]=e[t]);if(r&&r.defaultProps)for(t in e=r.defaultProps,e)s[t]===void 0&&(s[t]=e[t]);return{$$typeof:R,type:r,key:p,ref:u,props:s,_owner:q.current}}n.Fragment=S;n.jsx=_;n.jsxs=_});var d=i((D,m)=>{"use strict";m.exports=c()});var f=k(d()),{Fragment:F,jsx:I,jsxs:L}=f,T=f.default??f;export{F as Fragment,T as default,I as jsx,L as jsxs};
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=jsx-runtime.mjs.map

/vendor/jsx-dev-runtime.mjs
/* esm.sh - react@18.3.1//jsx-dev-runtime */
var d=Object.create;var c=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty;var i=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports);var v=(r,e,t,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of x(e))!l.call(r,s)&&s!==t&&c(r,s,{get:()=>e[s],enumerable:!(a=j(e,s))||a.enumerable});return r};var E=(r,e,t)=>(t=r!=null?d(f(r)):{},v(e||!r||!r.__esModule?c(t,"default",{value:r,enumerable:!0}):t,r));var u=i(m=>{"use strict";var g=Symbol.for("react.fragment");m.Fragment=g;m.jsxDEV=void 0});var p=i((q,n)=>{"use strict";n.exports=u()});var o=E(p()),{Fragment:F,jsxDEV:N}=o,b=o.default??o;export{F as Fragment,b as default,N as jsxDEV};
/*! Bundled license information:

react/cjs/react-jsx-dev-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-dev-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=jsx-dev-runtime.mjs.map


/js/useSaleAlerts.js
import { useEffect, useRef, useState } from "react";
import { playReadyBell } from "./notify.js";
// Watches each order's KITCHEN and BAR sub-status independently (instead of
// the combined order.status computed in store.js, which only reads "ready"
// once BOTH stations are done). That way a ticket with only kitchen items
// rings as soon as the kitchen is ready, one with only bar items rings as
// soon as the bar is ready, and a ticket with items on both stations rings
// TWICE — once per station, whenever each one independently flips to
// "ready" — rather than waiting for whichever station is slower.
// A station's status only ever reaches "ready" if that order actually has
// items for that station (Kitchen/Bar Display only show tickets — and only
// expose the "Mark Ready" button — for stations that have items on them),
// so no applicability check is needed here: a non-applicable station's
// status just never moves off its default.
//
// LINE-LEVEL: Kitchen/Bar can also send individual items (or a whole
// category label) to the waiters via `item.ready`. When lines newly flip to
// ready on an order, that rings ONCE per order per update — even if several
// lines were sent together — unless a station-level ring already fired for
// that same order in this update (so "Mark Ready" right after sending
// items doesn't double-ring).
//
// Rings only on devices configured as "waiter" (deviceRole === "waiter").
// Kitchen and Bar Display screens pass their own deviceRole in here too, so
// this hook still tracks the list for them, it just never plays the sound.
const itemKey = (it) => `${it.menuId}|${it.seat ?? ""}`;

function useReadyAlerts(orders, deviceRole) {
  const prevStatusRef = useRef({});
  const [readyOrders, setReadyOrders] = useState([]);
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    const nextStatus = {};
    let ringCount = 0;
    for (const order of orders) {
      const prev = prevStatus[order.id];
      const prevKitchen = prev?.kitchen;
      const prevBar = prev?.bar;
      const readyKeys = order.items.filter((it) => it.ready).map(itemKey);
      nextStatus[order.id] = { kitchen: order.kitchenStatus, bar: order.barStatus, ready: readyKeys };
      let stationRang = false;
      if (order.kitchenStatus === "ready" && prevKitchen && prevKitchen !== "ready") {
        ringCount += 1;
        stationRang = true;
      }
      if (order.barStatus === "ready" && prevBar && prevBar !== "ready") {
        ringCount += 1;
        stationRang = true;
      }
      if (!stationRang && prev && readyKeys.some((k) => !prev.ready.includes(k))) {
        ringCount += 1;
      }
    }
    prevStatusRef.current = nextStatus;
    if (ringCount && deviceRole === "waiter") {
      // Stagger multiple dings (e.g. kitchen + bar on the same ticket, or two
      // separate tickets landing in the same tick) so they're heard as
      // distinct rings instead of overlapping into one muddy tone.
      for (let i = 0; i < ringCount; i++) {
        setTimeout(() => playReadyBell(), i * 650);
      }
    }
    setReadyOrders(
      orders.filter(
        (o) =>
          !o.paid &&
          (o.kitchenStatus === "ready" ||
            o.barStatus === "ready" ||
            (o.status !== "served" && o.items.some((it) => it.ready)))
      )
    );
  }, [orders, deviceRole]);
  return readyOrders;
}
export { useReadyAlerts };

/js/useSaleAlerts.js
import { useEffect, useRef } from "react";
import { playSaleAlert } from "./notify.js";
// Rings on KITCHEN / BAR devices when a waiter presses "Sale" for a
// category (order items newly flagged `sale`). A kitchen device only reacts
// to kitchen-station items and a bar device to bar-station items; waiter
// devices never ring. One ring per order per update, even if several lines
// were flagged together. The first pass after load only records state.
const itemKey = (it) => `${it.menuId}|${it.seat ?? ""}`;

function useSaleAlerts(orders, menu, deviceRole) {
  const prevRef = useRef(null);
  useEffect(() => {
    const prev = prevRef.current;
    const next = {};
    let rings = 0;
    for (const order of orders) {
      const saleKeys = order.items.filter((it) => it.sale).map(itemKey);
      next[order.id] = saleKeys;
      if (!prev || !prev[order.id]) continue;
      const fresh = order.items.filter((it) => it.sale && !prev[order.id].includes(itemKey(it)));
      const mine = fresh.some((it) => {
        const station = menu.find((m) => m.id === it.menuId)?.station || "kitchen";
        return station === deviceRole;
      });
      if (mine) rings += 1;
    }
    prevRef.current = next;
    if (deviceRole === "waiter") return;
    for (let i = 0; i < rings; i++) {
      setTimeout(() => playSaleAlert(), i * 700);
    }
  }, [orders, menu, deviceRole]);
}
export { useSaleAlerts };

