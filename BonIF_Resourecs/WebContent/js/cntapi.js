if(navigator.cookieEnabled == false){
	alert("Do not allow cookies in your browser, you can not be utilized properly sites. Please enable cookies");
}
if (document.all && (!document.documentMode || (document.documentMode && document.documentMode < 8))) {
    //alert('IE7 or older or IE8+ in IE7 compatibility mode');
	 alert('Internet Explorer 7 or Internet Explorer less is operating in compatibility mode. The site may not work properly. Turn off compatibility mode, or recommend the latest version of the browser');
}


if(typeof UserInfo === 'undefined'){
	UserInfo = {};
}
UserInfo["user_id"] = null;
UserInfo["user_name"] = null;
UserInfo["user_email"] = null;
UserInfo["user_phone"] = null;
UserInfo["user_no"] = null;
UserInfo["user_store_id"] = null;

window.UserInfo = UserInfo;

if(typeof UserInfo === 'undefined'){
	UserInfo = {};
}

if(typeof StoreInfo === 'undefined'){
	StoreInfo = {};
}
StoreInfo["store_no"] = null;
StoreInfo["store_name"] = null;
StoreInfo["store_brd"] = null;
StoreInfo["store_frc"] = null;
StoreInfo["store_del_mk"] = null;

var checkprocessing = false;

CNTApi ={
	sIcon : "http://static.naver.com/maps2/icons/pin_spot2.png",
	sLoader : "/img/common/ajax-loader.gif",
	sPath : { path : "/" },
	str_cust_name : "user_cust_name",
	str_cust_tel : "user_cust_tel",
	idCartCount : ".cart_count",
	sCartId : "user_order_cart_id",
	sPart : "user_select_part",
	sOrderId : "user_complete_order_id",
	sStoreId :"user_order_store_id",
	sMyAddrSeq : "user_Addr_seq",
	sCartCount : "user_order_cart_count",
	sGroupCartId : "group_order_cart_id",
	sGiftCartId : "gift_order_cart_id",
	sGiftCartCount : "gift_order_cart_count",
	sCartPath : { path :"/"},
	sGiftCartPath : { path :"/"},
	getLang : function(){
		return $('html').attr('lang');
	},
	sOrderTypePackage : function () {
		var orderType = this.getOrderType()+"C";
		return orderType;
	},
	sOrderTypeDelivery : function (){
		var orderType = this.getOrderType()+"D";
		return orderType;
	},
	sOrderType : "order_type",
	isLogin : function(){
		var str_user_id = $.cookie("mb_id"); 
		if(!this.isEmpty(str_user_id)){
			return true;
		}
		return false;
	},
	
	chkUserInfo : function(ret_url){
		if(this.isLogin()) {
			this.getUserInfo();
		} else {
			location.replace("/login");
		}
		
	},
	getUserInfo : function(){
		//Use the login cookie information to a global variable
		UserInfo.user_id = $.cookie("mb_id");
		UserInfo.user_name = $.cookie("mb_nm");
		UserInfo.user_email = $.cookie("mb_email") == "" ? $.cookie("mb_email") : $.cookie("mb_email");
		UserInfo.user_phone = this.autoHypenPhone($.cookie("mb_tel") == "" ? $.cookie("mb_mobile") : $.cookie("mb_mobile"));
		UserInfo.user_no = $.cookie("mb_no");
	},
	setStoreId :function(str){
		//Use the cart to save in a cookie number,
		try {
			if(str < 0){
				str = 0;
			}
		} catch(e){
			str = 0;
		}
		$.cookie(this.sStoreId ,str, this.sPath); 
	},
	getStoreId: function(){
		var storeId = $.cookie(this.sStoreId);
		if(this.isEmpty(storeId)){
			return 0;
		}
		return parseInt(storeId);
	},
	setMyAddrSeq :function(str){
		//Use the cart to save in a cookie number,
		try {
			if(str < 0){
				str = 0;
			}
		} catch(e){
			str = 0;
		}
		$.cookie(this.sMyAddrSeq ,str, this.sPath); 
	},
	getMyAddrSeq: function(){
		var addrSeq = $.cookie(this.sMyAddrSeq);
		if(this.isEmpty(addrSeq)){
			return 0;
		}
		return parseInt(addrSeq);
	},
	getOrderStatusStr : function(statusstr,typestr) {
		//N : created, T : transmitted, Y : accepted, N : declined, C : canceled, S : completed, E: error
		var retstr = "";
		if(statusstr == "N") {
			retstr = "<span class='check-spen bd_gray'>주문요청</span>";
		}else if(statusstr == "T") {
			retstr = "<span class='check-spen t-green-on'>주문요청</span>";
		}else if(statusstr == "Y") {
			if(typestr == "D"){
				retstr = "<span class='check-spen t-green-on'>조리중</span>";
			}else{
				retstr = "<span class='check-spen t-orange-on'>조리중</span>";
			}
		}else if(statusstr == "D") {
			retstr = "<span class='check-spen t-green'>주문거절</span>";
		}else if(statusstr == "C") {
			retstr = "<span class='check-spen t-green'>취소완료</span>";
		}else if(statusstr == "S") {
			if(typestr == "D"){
				retstr = "<span class='check-spen t-green-on'>배달완료</span>";
			}else{
				retstr = "<span class='check-spen t-orange-on'>픽업완료</span>";
			}
		}else if(statusstr == "P") {
			retstr = "<span class='check-spen t-orange-on'>픽업완료</span>";
		}else if(statusstr == "E") {
			retstr = "<span class='check-spen bd_gray'>주문거절</span>";
		}else {
			retstr = statusstr;
		}
		//od_status bd_gray
		return retstr;
	},
	getOrderStatusStr2 : function(statusstr,typestr) {
		//N : created, T : transmitted, Y : accepted, N : declined, C : canceled, S : completed, E: error
		var retstr = "";
		if(statusstr == "N") {
			retstr = "주문요청";
		}else if(statusstr == "T") {
			retstr = "주문요청";
		}else if(statusstr == "Y") {
			if(typestr == "D"){
				retstr = "조리중";
			}else{
				retstr = "조리중";
			}
		}else if(statusstr == "D") {
			retstr = "주문거절";
		}else if(statusstr == "C") {
			retstr = "취소완료";
		}else if(statusstr == "S") {
			if(typestr == "D"){
				retstr = "배달완료";
			}else{
				retstr = "픽업완료";
			}
		}else if(statusstr == "P") {
			retstr = "픽업완료";
		}else if(statusstr == "E") {
			retstr = "주문취소";
		}else {
			retstr = statusstr;
		}
		//od_status bd_gray
		return retstr;
	},
	getOrderStatusStr3 : function(statusstr,typestr) {
		//N : created, T : transmitted, Y : accepted, N : declined, C : canceled, S : completed, E: error
		var retstr = "";
		
		if(typestr == "P"){
			
			 if(statusstr == "N") {
                retstr = "<span class='check-spen t-orange-on'>주문요청</span>";
            }else if(statusstr == "T") {
                retstr = "<span class='check-spen t-orange-on'>주문접수</span>";
            }else if(statusstr == "Y") {
                retstr = "<span class='check-spen t-orange-on'>조리중</span>";
            }else if(statusstr == "D") {
                retstr = "<span class='check-spen t-orange'>주문거절</span>";
            }else if(statusstr == "C") {
                retstr = "<span class='check-spen t-orange'>주문취소</span>";
            }else if(statusstr == "S") {
                retstr = "<span class='check-spen t-orange-on'>픽업완료</span>";
            }else if(statusstr == "P") {
                retstr = "<span class='check-spen t-orange-on'>픽업완료</span>";
            }else if(statusstr == "E") {
                retstr = "<span class='check-spen t-orange'>주문거절</span>";
            }else {
                retstr = statusstr;
            }
			
		} else {
			
			 if(statusstr == "N") {
                retstr = "<span class='check-spen t-green-on'>주문요청</span>";
            }else if(statusstr == "T") {
                retstr = "<span class='check-spen t-green-on'>주문접수</span>";
            }else if(statusstr == "Y") {
                retstr = "<span class='check-spen t-green-on'>조리중</span>";
            }else if(statusstr == "A") {
                retstr = "<span class='check-spen t-green-on'>조리중</span>";
            }else if(statusstr == "D") {
                retstr = "<span class='check-spen t-green'>주문거절</span>";
            }else if(statusstr == "C") {
                retstr = "<span class='check-spen t-green'>주문취소</span>";
            }else if(statusstr == "S") {
                retstr = "<span class='check-spen t-green-on'>배달중</span>";
            }else if(statusstr == "P") {
            	 if (typestr == 'R') {
            		 retstr = "<span class='check-spen t-green-on'>배송중</span>";
                 } else {
                	 retstr = "<span class='check-spen t-green-on'>배달완료</span>";
                 }
            }else if(statusstr == "V") {
                retstr = "<span class='check-spen t-green'>배달완료</span>";
            }else if(statusstr == "E") {
                retstr = "<span class='check-spen t-green'>주문거절</span>";
            }else {
            	retstr = statusstr;
			}
			
		}
		//od_status bd_gray
		return retstr;
	},
	setCompleteId : function(str){
		//In order to complete cases for stores
		try {
			if(str < 0){
				str = 0;
			}
		} catch(e){
			str = 0;
		}
		$.cookie(this. sOrderId,str, this.sCartPath);
	},
	getCompleteId : function(){
		//In order to complete cases for stores
		var orderID = $.cookie(this.sOrderId);
		if(this.isEmpty(orderID)){
			return 0;
		}
		return parseInt(orderID);
	},
	
	setCartId : function(str){
		//Use the cart to save in a cookie number,
		try {
			if(str < 0){
				str = 0;
			}
		} catch(e){
			str = 0;
		}
		$.cookie(this.sCartId,str, this.sCartPath);
	},
	getCartId : function(){
		//Use the cart to save in a cookie number,
		var cartId = $.cookie(this.sCartId);
		if(this.isEmpty(cartId)){
			return 0;
		}
		return parseInt(cartId);
	},
	setBrandPart : function(str){
		//Use the cart to save in a cookie number,
		try {
			if(str < 0){
				str = 0;
			}
		} catch(e){
			str = 0;
		}
		$.cookie(this.sPart,str, this.sCartPath);
	},
	getBrandPart : function(){
		//Use the cart to save in a cookie number,
		var part = $.cookie(this.sPart);
		if(this.isEmpty(part)){
			return 1;
		}
		return parseInt(part);
	},
	setCartCount : function(num){
		//Haenotgo use cookies to store the number of items do not need to re-write to make a call when calling to Cart
		if(this.getCartId() > 0) {
			$.cookie(this.sCartCount,num,this.sCartPath);
		} else {
			$.cookie(this.sCartCount,0,this.sCartPath);	
		}
	},
	getCartCount : function(){
		if(this.getCartId() > 0) {
			var cnt = $.cookie(this.sCartCount);
			if(this.isEmpty(cnt)){
				cnt = 0;
			}
			return cnt ;
		}
		return 0;
	},
	setMyAddrSeq :function(str){
		//Use the cart to save in a cookie number,
		try {
			if(str < 0){
				str = 0;
			}
		} catch(e){
			str = 0;
		}
		$.cookie(this.sMyAddrSeq ,str, this.sPath); 
	},
	getMyAddrSeq: function(){
		var addrSeq = $.cookie(this.sMyAddrSeq);
		if(this.isEmpty(addrSeq)){
			return 0;
		}
		return parseInt(addrSeq);
	},
	setGiftCartId : function(str){
		//Use the cart to save in a cookie number,
		try {
			if(str < 0){
				str = 0;
			}
		} catch(e){
			str = 0;
		}
		$.cookie(this.sGiftCartId, str, this.sCartPath);
	},
	getGiftCartId : function(){
		//Use the cart to save in a cookie number,
		var cartId = $.cookie(this.sGiftCartId);
		if(this.isEmpty(cartId)){
			return 0;
		}
		return parseInt(cartId);
	},
	setGiftCartCount : function(num){
		//Haenotgo use cookies to store the number of items do not need to re-write to make a call when calling to Cart
		if(this.getGiftCartId() > 0) {
			$.cookie(this.sGiftCartCount,num,this.sGiftCartPath);
		} else {
			$.cookie(this.sGiftCartCount,0,this.sGiftCartPath);	
		}
	},
	getGiftCartCount : function(){
		if(this.getGiftCartId() > 0) {
			var cnt = $.cookie(this.sGiftCartCount);
			if(this.isEmpty(cnt)){
				cnt = 0;
			}
			return cnt ;
		}
		return 0;
	},
	getCustName : function(){
		return $.cookie(CNTApi.str_cust_name);
	},
	getCustTel : function(){
		return $.cookie(CNTApi.str_cust_tel);
	},
	setOrderType : function(orderType){
		$.cookie('order_type',orderType);
	},
	getOrderType : function(){
		var returnVal = $.cookie("order_type");
		if(typeof returnVal ==='undefined'){
			returnVal = 'D';
		}
		return returnVal;
	},
	getOrderClass : function(){
		var hostname = window.location.hostname;
		if(hostname.indexOf("a") == 0){
			return "04";
		} else if(hostname.indexOf("i") == 0){
			return "05";
		}
		return "";
	},
	getDateFormat : function(s){
		var sText =[];
		
		sText.push(s.slice(0,4));
		sText.push(s.slice(4,6));
		sText.push(s.slice(6,8));
		
		
		return sText.join(".");
		
	},
	getTimeFormat : function(s){
		var sText =[];
		if(this.isEmpty(s)){
			return s;
		}
		sText.push(s.slice(0,2));
		sText.push(s.slice(2,4));
		if(s.length>4){
			sText.push(s.slice(4,6));
		}
		return sText.join(":");
		
	},
	getCurrentTime : function(){
		var d = new Date();

		 var s =
			 CNTApi.leadingZeros(d.getHours(), 2) + ':' +
			 CNTApi.leadingZeros(d.getMinutes(), 2) + ':' +
			 CNTApi.leadingZeros(d.getSeconds(), 2);
		 
		 return s;
	},
	getCurrentDttm : function(){
		var d = new Date();

		 var s =
			 d.getFullYear() + '-' +
			 CNTApi.leadingZeros(d.getMonth()+1, 2) + '-' +
			 CNTApi.leadingZeros(d.getDate(), 2)+ ' ' +
			 CNTApi.leadingZeros(d.getHours(), 2) + ':' +
			 CNTApi.leadingZeros(d.getMinutes(), 2) + ':' +
			 CNTApi.leadingZeros(d.getSeconds(), 2);
		 
		 return s;
	},
	leadingZeros : function(n, digits) {
		  var zero = '';
		  n = n.toString();

		  if (n.length < digits) {
		    for (var i = 0; i < digits - n.length; i++)
		      zero += '0';
		  }
		  return zero + n;
	},
	
	intplus : function(str){
		var reint;
		if( str > 999 ){
			reint = str;
		}else{
			reint = "0"+str;
		}
		return reint;
	},
	
	chr : function(ch){ 
		return String.fromCharCode(ch); 
	},
	
	
	
	trim : function(str){
		return str.replace( /(\s*)/g, "" );
	},
	
	getMoneyFormat : function(Param){
		if(parseInt(Param) == 0){
			return "0";
		}
		if(typeof Param !== "string"){
			Param = Param +"";
		}
		
		var minus = "";
		if(Param.substring(0, 1) == "-") {
			minus = "-";
		}
		
		var strMoney = Param.replace(/,/g, "");
		strMoney = strMoney.replace(/-/g, "");
		strMoney = strMoney.replace(/^0*/, "");
		var strMoneyLength = strMoney.length;
		
		if(strMoneyLength > 3) {
			var mod = strMoneyLength % 3;
			var value = (mod > 0 ? (strMoney.substring(0, mod)) : "");

			for(var i = 0; i < Math.floor(strMoneyLength / 3); i++) {
				if((mod == 0) && (i == 0)) {
					value = value + strMoney.substring(mod + 3 * i, mod + 3 * i + 3);
				} else {
					value = value + "," + strMoney.substring(mod + 3 * i, mod + 3 * i + 3);
				}
			}
			
			return minus + value;
		} else {
			return minus + strMoney;
		}
	},
	round : function (num,ja) { 

		ja=Math.pow(10,ja) ;

		return Math.round(num * ja) / ja; 

	} ,
	ceil : function (num,ja) { 

		ja=Math.pow(10,ja) ;

		return Math.ceil(num * ja) / ja; 

	} ,
	floor : function (num,ja) { 

		ja=Math.pow(10,ja) ;

		return Math.floor(num * ja) / ja; 

	} ,
	getStoreTime: function(store_id){
		var param = [];
		param.push("ex=Linked");
		param.push("ac=checksalesstore");
		param.push("branch_id="+store_id);
		var resultStr = '';
		//var self = this;
		$.ajax({ type : 'get',url : '/get.do',data : param.join('&'),async : false,dataType : 'jsonp',
			contentType : 'application/json; charset=utf-8',error : function(e) {CNTApi.log(e);},
			success : function(data) {
				if (data != null) {
					try {
						if(typeof data[0].a_delivery_time !=='undefined'){
							console.log(data);
							if(data[0].a_delivery_time != ''){
								resultStr = data[0].a_delivery_time;
							}else{
								resultStr = '30';
							} 
						}else{
							resultStr = '30';
						}
					} catch (e) {
						alert(e);
						resultStr = '30';
						return resultStr;
					}
				}else{
					resultStr = '30';
					return resultStr;
				}
		}});
		return resultStr;
	},	
	
    autoHypenPhone : function (str){
    	if(this.isEmpty(str)){
    		str = "";
    	}
    	str = str.replace(/[^0-9]/g, '');
    	var tmp = '';
    	if( str.length < 4){
    		return str;
    	}else if(str.length < 7){
    		tmp += str.substr(0, 3);
    		tmp += '-';
    		tmp += str.substr(3);
    		return tmp;
    	}else if(str.length < 11){
    		if(str.substr(0, 2)=="02"){
    			if(str.length < 10){
    				tmp += str.substr(0, 2);
            		tmp += '-';
            		tmp += str.substr(2, 3);
            		tmp += '-';
            		tmp += str.substr(5);
    			} else {
    				tmp += str.substr(0, 2);
            		tmp += '-';
            		tmp += str.substr(2, 4);
            		tmp += '-';
            		tmp += str.substr(6);
    			}
    			
    		} else {
    			tmp += str.substr(0, 3);
        		tmp += '-';
        		tmp += str.substr(3, 3);
        		tmp += '-';
        		tmp += str.substr(6);
    		}
    		
    		return tmp;
    	}else{				
    		tmp += str.substr(0, 3);
    		tmp += '-';
    		tmp += str.substr(3, 4);
    		tmp += '-';
    		tmp += str.substr(7);
    		return tmp;
    	}
    	return str;
    },
    onlyNumber : function(e){
    	CNTApi.log("onlyNumber:"+e.which);
		var el = $(e.target);
		  var key = String.fromCharCode( e.which );
		  CNTApi.log(key);
		  var v = el.val();
		  var regex = /[^0-9]/gi;
		  if( regex.test(v) ) {
			  el.val(v.replace(regex,''));
		  }
	},
	mailFormat : function(el){
		  var v = el.val();
		  var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		  if( regex.test(v) === false) {
			  return false;
		  }
		  return true;
	},
	isEmpty : function(str){
		if(str == null || typeof str === "undefined" || str == ""){
			return true;
		}
		return false;
	},
	log : function(str) {
		if(typeof console === 'undefined'){
		//	document.write(str);
		} else {
				console.log(str);
		}
		
	},
	createPagingHTMLURL : function (intThisPage, intLastPage, strURL , params){
		 
		var thisPage = parseInt(intThisPage);
		 var LastPage = parseInt(intLastPage);
		 var strPaging = '<a class="prev" href="'+ strURL +'?page=1' + params+'">'
		 +'<img src="/resources/img/common/paging_first.gif" alt="Go to First Page"></a>';

		 if (LastPage == 0){
		  strPaging = '<span ><strong class="active">'+ thisPage +'</strong></span>';
		 }else{
		  if(thisPage -1 > 0){
		   strPaging = strPaging + '<a class="prev" href="'+ strURL +'?page='+ (thisPage -1).toString() + params+'">'
		      + '<img src="/resources/img/common/paging_prev.gif" alt="Go to the previous page"></a>';
		  }
		  strPaging = strPaging + '<span>';
		  var intX = parseInt((thisPage - 1) / 10);
		  
		  var intMOD = thisPage;
		  if (intMOD == 0){
		   intX = intX -1;
		  }
		  for (var j = 1+(intX*10) ; j < 10+(10*intX)+1; j++) {
		   if (j <= LastPage){
		    if (j== thisPage){
		     strPaging = strPaging + '<strong class="active">'+ thisPage +'</strong>';
		    }else{
		     strPaging = strPaging
		       + '<a href="'+ strURL +'?page='+j.toString() + params+'">'+ j.toString() +'</a>';
		    }
		   }
		  }
		 strPaging = strPaging + '</span>';
		  if(thisPage + 1 <= LastPage){
		   strPaging = strPaging + '<a class="next" href="'+ strURL +'?page='+ (thisPage +1).toString() + params+'">'
		      + '<img src="/resources/img/common/paging_next.gif" alt="Go to next page"></a>';
		  }
		  strPaging = strPaging + '<a class="next" href="'+ strURL +'?page='+ LastPage.toString() + params+'">'
		   +'<img src="/resources/img/common/paging_end.gif" alt="Go to the last page"></a>';
		 }
		 
		 
		 return strPaging;
		},
	createPagingHTML : function (intThisPage, intLastPage, strFunctionName){
		 var thisPage = parseInt(intThisPage);
		 var LastPage = parseInt(intLastPage);
		 var strPaging = '<a class="prev" href="javascript:'+strFunctionName+'(\'1\');">'
		 +'&lt;&lt;</a>';

		 if (LastPage == 0){
		  strPaging = '<span ><strong class="active">'+ thisPage +'</strong></span>';
		 }else{
		  if(thisPage -1 > 0){
		   strPaging = strPaging + '<a class="prev" href="javascript:'+strFunctionName+'(\''+ (thisPage -1).toString() + '\');">'
		      + '&lt;</a>';
		  }
		  //strPaging = strPaging + '<span>';
		  var intX = parseInt((thisPage - 1) / 10);
		  
		  var intMOD = thisPage;
		  if (intMOD == 0){
		   intX = intX -1;
		  }
		  for (var j = 1+(intX*10) ; j < 10+(10*intX)+1; j++) {
		   if (j <= LastPage){
		    if (j== thisPage){
		     strPaging = strPaging + '<span ><strong class="active">'+ thisPage +'</strong></span>';
		    }else{
		     strPaging = strPaging
		       + '<a href="javascript:'+strFunctionName+'(\''+j.toString() +'\');">'+ j.toString() +'</a>';
		    }
		   }
		  }
		  //strPaging = strPaging + '</span>';
		  if(thisPage + 1 <= LastPage){
		   strPaging = strPaging + '<a class="next" href="javascript:'+strFunctionName+'(\''+ (thisPage +1).toString() + '\');">'
		      + '&gt;</a>';
		  }
		  strPaging = strPaging + '<a class="next" href="javascript:'+strFunctionName+'(\''+ LastPage.toString() +'\');">'
		   +'&gt;&gt;</a>';
		 }
		 
		 
		 return strPaging;
		},
		toHtml:function (str){
			var returnText = str;
			returnText=returnText.replace(/&nbsp;/gi," ");
		    returnText=returnText.replace(/&amp;/gi,"&");
		    returnText=returnText.replace(/&quot;/gi,'"');
		    returnText=returnText.replace(/&lt;/gi,'<');
		    returnText=returnText.replace(/&gt;/gi,'>');
		    returnText=returnText.replace(/\r\n|\n|\r/g, '<br />');
			return returnText;
		},
		calBytes:function(str) {
			var tcount = 0;
			var tmpStr = new String(str);
			var temp = tmpStr.length;
			var onechar;
			for ( var k=0; k<temp; k++ ) {
				onechar = tmpStr.charAt(k);
				if (escape(onechar).length > 4) {
					tcount += 2;
				} else {
					tcount += 1;
				}
			}
			return tcount;
		},
		tmpPassword:function(size) {
			var chars = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9".split(",");
			var rand;
			var str = "";
			
			for (var i=0; i < size; i++) {
			rand = Math.floor(Math.random()*100) % 62;
			str = str + chars[rand];
			}
			return str;
		},
		startLoading : function(){
			console.log('startLoading');
			var l = $('.page_loader');
			if( l.hasClass('hidden') == true ) {
				$('.page_loader').removeClass('hidden');	
			}	
			checkprocessing = true;
			
		},
		endLoading : function(){
			console.log('endLoading');
			var l = $('.page_loader');
			if( l.hasClass('hidden') == false ) {
				$('.page_loader').addClass('hidden');	
			}
			
			checkprocessing = false;
		},
		isLoading : function(){
			console.log('isLoading');
			return checkprocessing;
		},
		menuSelectPage : function(){
			var self = this;
			return self.getBrandPart();
		},
		brandCheckInfo : function(part){
			this.log("brandCheckInfo");
			var param = [];
			param.push("ex=Store");
			param.push("ac=brandCheckInfo");
			param.push("part="+part);
			var resultStr = false;
			var self = this;
			$.ajax({ type : 'get',url : '/api.do',data : param.join('&'),async : false,dataType : 'jsonp',
				contentType : 'application/json; charset=utf-8',error : function(e) {CNTApi.log(e);},
				success : function(data) {
					self.log("brandCheckInfo data:");
					if (data != null) {
						try {
							if(typeof data[0].orderflag !=='undefined'){
								if(data[0].orderflag != ''){
									if(part != "3"){
										if(data[0].orderflag != "y" || data[0].deliveryflag != "n"){
											alert("해당 브렌드 주문불가 상태 입니다. 잠시 후 다시 시도해주세요.");
										} else {
											if(data[0].open_yn != "y" || data[0].close_yn != "y"){
												alert("주문시간이 아닙니다.");
											}else{
												location.href = "/order/orderType?part="+part;
												self.setBrandPart(part);
											}
										}
									}else{
										if(data[0].orderflag != "y" && data[0].deliveryflag != "y"){
											alert("해당 브렌드 주문불가 상태 입니다. 잠시 후 다시 시도해주세요.");
										} else {
											if(data[0].open_yn != "y" || data[0].close_yn != "y"){
												alert("주문시간이 아닙니다.");
											}else{
												location.href = "/order/orderType?part="+part;
												self.setBrandPart(part);
											}
										}
									}
								}else{
									alert("브렌드 오픈상태가 아닙니다.");
								} 
							}else{
								alert("브렌드 상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요");
							}
						} catch (e) {
							alert(e);
							
							alert("브렌드 상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요");
						}
					}else{
						alert("브렌드 상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요");
					}
			}});
			return resultStr;
		},
		getStoreInfo: function(store_id){
			this.log("getStoreInfo:"+store_id);
			var param = [];
			param.push("ex=Store");
			param.push("ac=getStoreInfo");
			param.push("store_id="+store_id);
			var resultStr = false;
			var self = this;
			$.ajax({ type : 'get',url : '/api.do',data : param.join('&'),async : false,dataType : 'jsonp',
				contentType : 'application/json; charset=utf-8',error : function(e) {CNTApi.log(e);},
				success : function(data) {
					self.log("getStoreInfo data:");
					console.dir(data);
					if (data != null) {
						try {
							self.log("data[0].chaincode"+data[0].chaincode);
							if(typeof data[0].chaincode !=='undefined'){
								if(data[0].chaincode != ''){
									$.cookie("store_no",data[0].chaincode, this.sCartPath);
									$.cookie("store_name",data[0].chainname, this.sCartPath);
									$.cookie("store_frc",data[0].type, this.sCartPath);
									$.cookie("store_brd",data[0].mpart, this.sCartPath);
									$.cookie("store_del_mk",data[0].scd_del_mk, this.sCartPath);
									resultStr = true;
								}else{
									$.cookie("store_no","", this.sCartPath);
									$.cookie("store_name","", this.sCartPath);
									$.cookie("store_frc","", this.sCartPath);
									$.cookie("store_brd","", this.sCartPath);
									$.cookie("store_del_mk","", this.sCartPath);
									resultStr = false;
								} 
							}else{
								$.cookie("store_no","", this.sCartPath);
								$.cookie("store_name","", this.sCartPath);
								$.cookie("store_frc","", this.sCartPath);
								$.cookie("store_brd","", this.sCartPath);
								$.cookie("store_del_mk","", this.sCartPath);
								resultStr = false;
							}
						} catch (e) {
							$.cookie("store_no","", this.sCartPath);
							$.cookie("store_name","", this.sCartPath);
							$.cookie("store_frc","", this.sCartPath);
							$.cookie("store_brd","", this.sCartPath);
							$.cookie("store_del_mk","", this.sCartPath);
							alert(e);
							
							resultStr = false;
						}
					}else{
						$.cookie("store_no","", this.sCartPath);
						$.cookie("store_name","", this.sCartPath);
						$.cookie("store_frc","", this.sCartPath);
						$.cookie("store_brd","", this.sCartPath);
						$.cookie("store_del_mk","", this.sCartPath);
						resultStr = false;
					}
			}});
			return resultStr
		},
		setStoreInfo:function(){
			StoreInfo.store_no = $.cookie("store_no");
			StoreInfo.store_name = $.cookie("store_name");
			StoreInfo.store_frc = $.cookie("store_frc");
			StoreInfo.store_brd = $.cookie("store_brd");
			StoreInfo.store_del_mk = $.cookie("store_del_mk");
			return true;
		},
		getvposstorecode:function(){
			this.log("getvposstorecode");
			var param = [];
			param.push("ex=Store");
			param.push("ac=getvposstorecodelocal");
			param.push("FRC_CD="+StoreInfo.store_frc);
			param.push("BRD_CD="+StoreInfo.store_brd);
			param.push("STR_NO="+StoreInfo.store_no);
			var resultStr = false;
			var self = this;
			$.ajax({ type : 'get',url : '/api.do',data : param.join('&'),async : false,dataType : 'jsonp',
				contentType : 'application/json; charset=utf-8',error : function(e) {CNTApi.log(e);},
				success : function(data) {
					self.log("checkPosStore data:");
					console.dir(data);
					if (data != null) {
						try {
							self.log("data[0].scd_del_mk"+data[0].scd_del_mk);
							if(typeof data[0].scd_del_mk !=='undefined'){
								if(data[0].sd_ro_mk != ''){
									if(data[0].scd_del_mk != "L"){
										resultStr = "주문불가 상태 입니다. 잠시 후 다시 시도해주세요.";
									} else {
										resultStr = "1";
									}
								}else{
									resultStr = "매장이 오픈상태가 아닙니다.";
								} 
							}else{
								resultStr = "매장상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요";
							}
						} catch (e) {
							alert(e);
							
							resultStr = "매장상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요";
						}
					}else{
						resultStr = "매장상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요";
					}
			}});
			return resultStr;
			
		},
		checkPosStore:function(){
			this.log("checkPosStore");
			var param = [];
			param.push("ex=Store");
			param.push("ac=getvposstoreopenlocal");
			param.push("FRC_CD="+StoreInfo.store_frc);
			param.push("BRD_CD="+StoreInfo.store_brd);
			param.push("STR_NO="+StoreInfo.store_no);
			var resultStr = false;
			var self = this;
			$.ajax({ type : 'get',url : '/api.do',data : param.join('&'),async : false,dataType : 'jsonp',
				contentType : 'application/json; charset=utf-8',error : function(e) {CNTApi.log(e);},
				success : function(data) {
					self.log("checkPosStore data:");
					console.dir(data);
					if (data != null) {
						try {
							self.log("data[0].sd_ro_mk"+data[0].sd_ro_mk);
							if(typeof data[0].sd_ro_mk !=='undefined'){
								if(data[0].sd_ro_mk != ''){
									if(data[0].sd_ro_mk == "N"){
										resultStr = "매장이 주문불가 상태 입니다. 잠시 후 다시 시도해주세요.";
									} else {
										resultStr = "1";
									}
								}else{
									resultStr = "매장이 오픈상태가 아닙니다.";
								} 
							}else{
								resultStr = "매장상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요";
							}
						} catch (e) {
							alert(e);
							
							resultStr = "매장상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요";
						}
					}else{
						resultStr = "매장상태를 확인하지 못했습니다.잠시 후 다시 시도해주세요";
					}
			}});
			return resultStr;
			
		}
};
String.prototype.substr2 = function( idx, cnt )
{
	var str = this;
	var len = 0;
	
	for( var i=0; i<str.length; i++ )
	{
		len += ( str.charCodeAt( i ) > 128 ) ? 2 : 1;
		
		if( len > idx )
		{
			str = str.substr( i );
			break;
		}
	}
	
	len = 0;
	for( var i=0; i<str.length; i++ )
	{
		len += ( str.charCodeAt( i ) > 128 ) ? 2 : 1;
		
		if( len > cnt )
		{
			str = str.substring( 0, i );
			break;
		}
	}
	
	return str;
};
String.prototype.getValueByKey = function (k) {
    var p = new RegExp('\\b' + k + '\\b', 'gi');
    var ret = this.search(p) != -1 ? decodeURIComponent(this.substr(this.search(p) + k.length + 1).substr(0, this.substr(this.search(p) + k.length + 1).search(/(&|;|$)/))) : "";
    if(ret == null || ret =="null"){
    	ret = "";
    }
    return ret;
};

String.prototype.isMobile = function () {
    var arg = arguments[0] ? arguments[0] : "";
    return eval("(/01[016789]" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(this)");
};
String.prototype.isPhone = function () {
    var arg = arguments[0] ? arguments[0] : "";
    return eval("(/(02|0[3-9]{1}[0-9]{1})" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(this)");
};
String.prototype.isEmail = function () {
  //  var arg = arguments[0] ? arguments[0]:"";
    return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/).test(this.trim());
};
String.prototype.isPwdNew = function () {
	console.log("isPwdNew:"+this);
    var chk1 = /^[a-zA-Z0-9]{8,16}$/;
    var chk2 = /[a-z]/;
    var chk3 = /[A-Z]/;
    var chk4 = /\d/;
    console.log("arguments[0]:"+arguments[0]);
    console.log("chk1:"+chk1.test(this.replace(arguments[0],"")));
    console.log("chk2:"+chk2.test(this.replace(arguments[0],"")));
    console.log("chk3:"+chk3.test(this.replace(arguments[0],"")));
    console.log("chk4"+chk4.test(this.replace(arguments[0],"")));
    
    return chk1.test(this.replace(arguments[0],""))
    		&& (chk2.test(this.replace(arguments[0],""))
    		|| chk3.test(this.replace(arguments[0],"")))
    		&& chk4.test(this.replace(arguments[0],""))
    		? true : false;
    		
};
String.prototype.isID = function () {
	console.log("isID");
	console.log(arguments);
    var chk1 = /^[a-z0-9]{6,12}$/;
    //var chk2 = /[a-z]/;
    //var chk3 = /\d/;
    return chk1.test(this.replace(arguments[0],""))
    		//&& chk2.test(this.replace(arguments[0],""))
    		//&& chk3.test(this.replace(arguments[0],""))
    		? true : false;
    		
};


paramString = function (notinkey){
		var returnPARMS = "";
	 	var query = location.search;  
	    query = query.slice(1);      
	    query = query.split('&');   
	    $.each(query, function(i,value){    
	        var token = value.split('=');   
	        var key = token[0];     
	        var data = token[1];
	        var isInsertKey = true;
	        for (var i = 0; i < notinkey.length; i++) {
				if (notinkey[i] == key){
					isInsertKey = false;
				}
			}	
	        if(isInsertKey){
	        	if(data != null){
	        		returnPARMS = returnPARMS + '&' +value;
	        	}
	        }
	    });
	    return returnPARMS;  
};

getParamMap = function (notinkey){
	var returnMap = new hashMap();
 	var query = location.search;  
    query = query.slice(1);      
    query = query.split('&');   
    $.each(query, function(i,value){    
        var token = value.split('=');   
        var key = token[0];     
        var data = token[1];
        var isInsertKey = true;
        for (var i = 0; i < notinkey.length; i++) {
			if (notinkey[i] == key){
				isInsertKey = false;
			}
		}	
        if(isInsertKey){
        	if(data!= null){
        		if(data!= ""){
        			returnMap.put(key, decodeURIComponent(data));
        		}
        	}
        }
    });
    return returnMap; 
};

if(CNTApi.isLogin()){
	CNTApi.getUserInfo();
}
if(typeof $(CNTApi.idCartCount) !=='undefined'){
	CNTApi.log("cart_count1 :"+CNTApi.getCartCount());
	$(CNTApi.idCartCount).html(CNTApi.getCartCount());
} else {
	CNTApi.log("cart_count2");
}

hashMap = function() {
	this.map = new Object();
};
hashMap.prototype = {
	put : function(key, value) {
		this.map[key] = value;
	},
	get : function(key) {
		return this.map[key];
	},
	containsKey : function(key) {
		return key in this.map;
	},
	containsValue : function(value) {
		for ( var prop in this.map) {
			if (this.map[prop] == value)
				return true;
		}
		return false;
	},
	isEmpty : function(key) {
		return (this.size() == 0);
	},
	clear : function() {
		for ( var prop in this.map) {
			delete this.map[prop];
		}
	},
	remove : function(key) {
		delete this.map[key];
	},
	keys : function() {
		var keys = new Array();
		for ( var prop in this.map) {
			keys.push(prop);
		}
		return keys;
	},
	values : function() {
		var values = new Array();
		for ( var prop in this.map) {
			values.push(this.map[prop]);
		}
		return values;
	},
	size : function() {
		var count = 0;
		for ( var prop in this.map) {
			 if (this.map.hasOwnProperty(prop))
				 	count++;
		}		
		return count;
	}
};
var setCutStrDot = function(str,limit_len){
	var bytes = 0;
	var max = str.length;
	if (max > limit_len)
	{
		return str.substring(0,limit_len)+"...";
	}
	else
	{
		return str;		
	}
};
function userlogout() {
	var x = confirm( i18nProp("confirm.doyouwantlogout") );
	if(x){
		var count = 0;
		if (document.cookie != "") {
			var cookies = document.cookie.split("; ");
			console.log(cookies);
			count = cookies.length;

			var expireDate = new Date();
			expireDate.setDate(expireDate.getDate() - 1);

			for (var i = 0; i < count; i++) {
				var cookieName = cookies[i].split("=")[0];
				console.log(cookieName);
				document.cookie = cookieName + "= " + "; expires="
						+ expireDate.toGMTString() + "; path=/";
			}
		}
		location.replace("/customer/lang.jsp");	
	}
	
}