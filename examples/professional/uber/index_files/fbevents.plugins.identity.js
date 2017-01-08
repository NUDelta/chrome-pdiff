/*1483801172,,JIT Construction: v2767640,en_US*/

/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
try {/**
 * @provides fb.fbevents.plugins.identity
 * @noframework
 * @preserve-header
 *
 * Copyright (c) 2003, Christoph Bichlmeier
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHORS ''AS IS'' AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * str2rstr_utf8 is taken from:
 * "A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321."
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 *
 */(function(a){var b=function ka(la){var ma='',na,oa;for(var pa=0;pa<la.length;pa++){na=la.charCodeAt(pa);oa=pa+1<la.length?la.charCodeAt(pa+1):0;if(55296<=na&&na<=56319&&56320<=oa&&oa<=57343){na=65536+((na&1023)<<10)+(oa&1023);pa++;}if(na<=127){ma+=String.fromCharCode(na);}else if(na<=2047){ma+=String.fromCharCode(192|na>>>6&31,128|na&63);}else if(na<=65535){ma+=String.fromCharCode(224|na>>>12&15,128|na>>>6&63,128|na&63);}else if(na<=2097151)ma+=String.fromCharCode(240|na>>>18&7,128|na>>>12&63,128|na>>>6&63,128|na&63);}return ma;};function c(ka,la){return la>>>ka|la<<32-ka;}function d(ka,la,ma){return ka&la^~ka&ma;}function e(ka,la,ma){return ka&la^ka&ma^la&ma;}function f(ka){return c(2,ka)^c(13,ka)^c(22,ka);}function g(ka){return c(6,ka)^c(11,ka)^c(25,ka);}function h(ka){return c(7,ka)^c(18,ka)^ka>>>3;}function i(ka){return c(17,ka)^c(19,ka)^ka>>>10;}function j(ka,la){return ka[la&15]+=i(ka[la+14&15])+ka[la+9&15]+h(ka[la+1&15]);}var k=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),l=new Array(8),m=new Array(2),n=new Array(64),o=new Array(16),p="0123456789abcdef";function q(ka,la){var ma=(ka&65535)+(la&65535),na=(ka>>16)+(la>>16)+(ma>>16);return na<<16|ma&65535;}function r(){m[0]=m[1]=0;l[0]=1779033703;l[1]=3144134277;l[2]=1013904242;l[3]=2773480762;l[4]=1359893119;l[5]=2600822924;l[6]=528734635;l[7]=1541459225;}function s(){var ka,la,ma,na,oa,pa,qa,ra,sa,ta;ka=l[0];la=l[1];ma=l[2];na=l[3];oa=l[4];pa=l[5];qa=l[6];ra=l[7];for(var ua=0;ua<16;ua++)o[ua]=n[(ua<<2)+3]|n[(ua<<2)+2]<<8|n[(ua<<2)+1]<<16|n[ua<<2]<<24;for(var va=0;va<64;va++){sa=ra+g(oa)+d(oa,pa,qa)+k[va];if(va<16){sa+=o[va];}else sa+=j(o,va);ta=f(ka)+e(ka,la,ma);ra=qa;qa=pa;pa=oa;oa=q(na,sa);na=ma;ma=la;la=ka;ka=q(sa,ta);}l[0]+=ka;l[1]+=la;l[2]+=ma;l[3]+=na;l[4]+=oa;l[5]+=pa;l[6]+=qa;l[7]+=ra;}function t(ka,la){var ma,na,oa=0;na=m[0]>>3&63;var pa=la&63;if((m[0]+=la<<3)<la<<3)m[1]++;m[1]+=la>>29;for(ma=0;ma+63<la;ma+=64){for(var qa=na;qa<64;qa++)n[qa]=ka.charCodeAt(oa++);s();na=0;}for(var qa=0;qa<pa;qa++)n[qa]=ka.charCodeAt(oa++);}function u(){var ka=m[0]>>3&63;n[ka++]=128;if(ka<=56){for(var la=ka;la<56;la++)n[la]=0;}else{for(var la=ka;la<64;la++)n[la]=0;s();for(var la=0;la<56;la++)n[la]=0;}n[56]=m[1]>>>24&255;n[57]=m[1]>>>16&255;n[58]=m[1]>>>8&255;n[59]=m[1]&255;n[60]=m[0]>>>24&255;n[61]=m[0]>>>16&255;n[62]=m[0]>>>8&255;n[63]=m[0]&255;s();}function v(){var ka=0,la=new Array(32);for(var ma=0;ma<8;ma++){la[ka++]=l[ma]>>>24&255;la[ka++]=l[ma]>>>16&255;la[ka++]=l[ma]>>>8&255;la[ka++]=l[ma]&255;}return la;}function w(){var ka=new String();for(var la=0;la<8;la++)for(var ma=28;ma>=0;ma-=4)ka+=p.charAt(l[la]>>>ma&15);return ka;}function x(ka){var la=0;for(var ma=0;ma<8;ma++)for(var na=28;na>=0;na-=4)ka[la++]=p.charCodeAt(l[ma]>>>na&15);}function y(ka,la){r();t(ka,ka.length);u();if(la){x(la);}else return w();}function z(ka,la,ma){if(ka===null||ka===undefined)return null;la=typeof la=='undefined'?true:la;if(la)ka=b(ka);return y(ka,ma);}var aa=/^[a-f0-9]{64}$/i,ba=/^[\w!#\$%&'\*\+\/\=\?\^`\{\|\}~\-]+(:?\.[\w!#\$%&'\*\+\/\=\?\^`\{\|\}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i,ca=/^\s+|\s+$/g,da=Object.prototype.hasOwnProperty;function ea(ka){return ba.test(ka);}function fa(ka){if(typeof ka==='string')return ka.replace(ca,'');}function ga(ka){if(typeof ka==='string')return ka.toLowerCase();}function ha(ka,la){var ma=null;switch(ka){case 'em':case 'email':var na=fa(ga(la));ma=ea(na)?na:null;break;default:ma=la;}return ma;}function ia(ka){var la=ka.pixels||[];for(var ma=0;ma<la.length;ma++){var na=la[ma].userData;if(na){var oa={};for(var pa in na)if(da.call(na,pa)){var qa=na[pa];if(qa!=null&&!aa.test(qa)){qa=ha(pa,qa);if(qa!==null)qa=z(qa);}oa[pa]=qa;}la[ma].userData=oa;}}}var ja=a.fbq;if(!(!ja))ja.registerPlugin('IDENTITY',ia);})(window);} catch (e) {new Image().src="https:\/\/www.facebook.com\/" + 'common/scribe_endpoint.php?c=jssdk_error&m='+encodeURIComponent('{"error":"LOAD", "extra": {"name":"'+e.name+'","line":"'+(e.lineNumber||e.line)+'","script":"'+(e.fileName||e.sourceURL||e.script)+'","stack":"'+(e.stackTrace||e.stack)+'","revision":"2767640","namespace":"FB","message":"'+e.message+'"}}');}