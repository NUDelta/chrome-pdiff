//tealium universal tag - utag.683 ut4.0.201612082118, Copyright 2016 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u={"id":id};utag.o[loader].sender[id]=u;if(utag.ut===undefined){utag.ut={};}
var match=/ut\d\.(\d*)\..*/.exec(utag.cfg.v);if(utag.ut.loader===undefined||!match||parseInt(match[1])<41){u.loader=function(o,a,b,c,l,m){utag.DB(o);a=document;if(o.type=="iframe"){m=a.getElementById(o.id);if(m&&m.tagName=="IFRAME"){b=m;}else{b=a.createElement("iframe");}o.attrs=o.attrs||{};utag.ut.merge(o.attrs,{"height":"1","width":"1","style":"display:none"},0);}else if(o.type=="img"){utag.DB("Attach img: "+o.src);b=new Image();}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";}if(o.id){b.id=o.id;}for(l in utag.loader.GV(o.attrs)){b.setAttribute(l,o.attrs[l]);}b.setAttribute("src",o.src);if(typeof o.cb=="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb();},false);}else{b.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded"){this.onreadystatechange=null;o.cb();}};}}if(o.type!="img"&&!m){l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l=="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b);}}}};}
if(utag.ut.typeOf===undefined){u.typeOf=function(e){return({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();};}else{u.typeOf=utag.ut.typeOf;}
u.ev={"view":1};u.initialized=false;u.scriptrequested=false;u.queue=[];u.event_lookup={"PageView":"PageView","ViewContent":"ViewContent","Search":"Search","AddToCart":"AddToCart","AddToWishlist":"AddToWishlist","InitiateCheckout":"InitiateCheckout","AddPaymentInfo":"AddPaymentInfo","Purchase":"Purchase","Signup":"Signup","CompleteRegistration":"CompleteRegistration","Download":"Download"};u.map_func=function(arr,obj,item){var i=arr.shift();obj[i]=obj[i]||{};if(arr.length>0){u.map_func(arr,obj[i],item);}else{obj[i]=item;}};u.clearEmptyKeys=function(object){for(var key in object){if(object[key]===""||object[key]===undefined){delete object[key];}}
return object;};u.map={"Twitter_Universal_Event_Name":"event_value","Twitter_Universal_Event_Name:Signup":"Signup","Twitter_Universal_Event_Name:Search":"Search"};u.extend=[function(a,b){try{if((b['js_page.utag_data.eventName'].toString().toLowerCase().indexOf('web.drivers.signup'.toLowerCase())>-1&&b['js_page.utag_data.eventType'].toString().toLowerCase().indexOf('landing'.toLowerCase())>-1)){b['Twitter_Universal_Event_Name']='Search'}}catch(e){utag.DB(e)}},function(a,b){try{if((b['js_page.utag_data.eventName'].toString().toLowerCase().indexOf('web.drivers.signup'.toLowerCase())>-1&&b['js_page.utag_data.eventType'].toString().toLowerCase().indexOf('success'.toLowerCase())>-1)){b['Twitter_Universal_Event_Name']='Signup'}}catch(e){utag.DB(e)}}];u.loader_cb=function(a,b,c){utag.DB("send:683:CALLBACK");var event_params,i,q;event_params={};if(!u.initialized){u.initialized=true;twq("init",u.data.twitter_pixel_id);}
if(u.data.event_name==="PageView"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.num_items){event_params.num_items=u.data.num_items;}}
if(u.data.event_name==="ViewContent"){if(u.data.content_type===""||u.data.product_id.length===0){utag.DB(u.id+": ViewContent event not fired: Required attribute not populated");return;}
if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
if(u.data.product_category.length>0){event_params.content_category=u.data.product_category.join(",");}
event_params.content_type=u.data.content_type;event_params.content_ids=u.data.product_id;}
if(u.data.event_name==="Search"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}}
if(u.data.event_name==="AddToCart"){if(u.data.content_type===""||u.data.product_id.length===0){utag.DB(u.id+": AddToCart event not fired: Required attribute not populated");return;}
if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
event_params.content_type=u.data.content_type;event_params.content_ids=u.data.product_id;}
if(u.data.event_name==="AddToWishlist"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
if(u.data.product_category.length>0){event_params.content_category=u.data.product_category.join(",");}
if(u.data.product_id.length>0){event_params.content_ids=u.data.product_id;}}
if(u.data.event_name==="InitiateCheckout"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
if(u.data.product_category.length>0){event_params.content_category=u.data.product_category.join(",");}
if(u.data.product_id.length>0){event_params.content_ids=u.data.product_id;}
if(u.data.num_items){event_params.num_items=u.data.num_items;}else if(u.data.product_quantity.length>0){q=0;for(i=0;i<u.data.product_quantity.length;i++){q+=parseInt(u.data.product_quantity[i]);}
event_params.num_items=q+"";}}
if(u.data.event_name==="AddPaymentInfo"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_category.length>0){event_params.content_category=u.data.product_category.join(",");}
if(u.data.product_id.length>0){event_params.content_ids=u.data.product_id;}}
if(u.data.event_name==="Purchase"){if((u.data.event_value===""&&u.data.order_total==="")||u.data.order_currency===""||u.data.content_type===""||u.data.product_id.length===0){utag.DB(u.id+": Purchase event not fired: Required attribute not populated");return;}
event_params.value=u.data.event_value||u.data.order_total;event_params.currency=u.data.order_currency;if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
event_params.content_type=u.data.content_type;event_params.content_ids=u.data.product_id;if(u.data.num_items){event_params.num_items=u.data.num_items;}else if(u.data.product_quantity.length>0){q=0;for(i=0;i<u.data.product_quantity.length;i++){q+=parseInt(u.data.product_quantity[i]);}
event_params.num_items=q+"";}
if(u.data.order_id){event_params.order_id=u.data.order_id;}}
if(u.data.event_name==="Signup"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
if(u.data.product_category.length>0){event_params.content_category=u.data.product_category.join(",");}
if(u.data.order_id){event_params.order_id=u.data.order_id;}}
if(u.data.event_name==="CompleteRegistration"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
if(u.data.event_status){event_params.status=u.data.event_status;}
if(u.data.order_id){event_params.order_id=u.data.order_id;}}
if(u.data.event_name==="Download"){if(u.data.event_value){event_params.value=u.data.event_value;}
if(u.data.order_currency){event_params.currency=u.data.order_currency;}
if(u.data.product_name.length>0){event_params.content_name=u.data.product_name.join(",");}
if(u.data.product_category.length>0){event_params.content_category=u.data.product_category.join(",");}
if(u.data.product_id.length>0){event_params.content_ids=u.data.product_id;}
if(u.data.num_items){event_params.num_items=u.data.num_items;}else if(u.data.product_quantity.length>0){var q=0;for(i=0;i<u.data.product_quantity.length;i++){q+=parseInt(u.data.product_quantity[i]);}
event_params.num_items=q+"";}
if(u.data.order_id){event_params.order_id=u.data.order_id;}}
if(u.data.event_name){twq("track",u.data.event_name,event_params);}
utag.DB("send:683:CALLBACK:COMPLETE");};u.callBack=function(){var data={};while(data=u.queue.shift()){u.data=data.data;u.loader_cb(data.a,data.b,data.c);}};u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){utag.DB("send:683");utag.DB(b);var c,d,e,f,g,h,i;u.data={"twitter_pixel_id":"nvrsp","event_name":"","event_value":"","content_type":"","num_items":"","event_status":"","product_id":[],"product_name":[],"product_category":[],"product_quantity":[]};for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){}};utag.DB("send:683:EXTENSIONS");utag.DB(b);for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){u.map_func(e[f].split("."),u.data,b[d]);}}else{h=d.split(":");if(h.length===2&&b[h[0]]===h[1]){i=""+u.event_lookup[u.map[d]];if(i!==""){u.data.event_name=i;}}}}
utag.DB("send:683:MAPPINGS");utag.DB(u.data);u.data.order_id=u.data.order_id||b._corder||"";u.data.order_total=u.data.order_total||b._ctotal||"";u.data.order_currency=u.data.order_currency||b._ccurrency||"";if(u.data.product_id.length===0&&b._cprod!==undefined){u.data.product_id=b._cprod.slice(0);}
if(u.data.product_name.length===0&&b._cprodname!==undefined){u.data.product_name=b._cprodname.slice(0);}
if(u.data.product_category.length===0&&b._ccat!==undefined){u.data.product_category=b._ccat.slice(0);}
if(u.data.product_quantity.length===0&&b._cquan!==undefined){u.data.product_quantity=b._cquan.slice(0);}
if(!u.data.twitter_pixel_id){utag.DB(u.id+": Tag not fired: Required attribute not populated");return;}
if(u.initialized){u.loader_cb(a,b,c);}else{u.queue.push({"data":u.data,"a":a,"b":b,"c":c});if(!u.scriptrequested){u.scriptrequested=true;!function(e,n,u,a){e.twq||(a=e.twq=function(){a.exe?a.exe.apply(a,arguments):a.queue.push(arguments);},a.version="1",a.queue=[],t=n.createElement(u),t.async=!0,t.src="//static.ads-twitter.com/uwt.js",s=n.getElementsByTagName(u)[0],s.parentNode.insertBefore(t,s))}(window,document,"script");u.callBack();}}
utag.DB("send:683:COMPLETE");}};utag.o[loader].loader.LOAD(id);}("683","uber.main"));}catch(error){utag.DB(error);}