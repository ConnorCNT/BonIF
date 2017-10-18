if(typeof CNTLib === 'undefined'){
	CNTLib = {};
}

CNTLib.GiftOrder = function(el,pt,nm){
	CNTApi.log("create");
	this.$el = $(el);
	this.pagetype = pt; //pt list = "List" : page type param
	this.nextpage = nm;
	this.init();
	
};
CNTLib.GiftOrder.prototype ={
		init : function(){
			CNTApi.log("init");
			this.initVar();
			this.bindEvent();
		},
		initVar : function(){
			CNTApi.log("initVar:"+this.pagetype);
			
			if(this.pagetype == "menu"){
				this.htLayer = {
						list : this.$el.find(".data_list:first"),
						info : this.$el.find(".order_info:first"),
						addcart : this.$el.find(".btn_add"),
						btn_empty : this.$el.find(".btn_empty"),
						btn_change : this.$el.find(".btn_change"),
						save : this.$el.find(".btn_order:first")
				};	
				
			} else if( this.pagetype == "register" ){
				this.htLayer = {
						list : this.$el.find(".data_list:first"),
						table : this.$el.find("table[id^='giftTable']"),
						form : this.$el.find("form[name=orderForm]"),
						btn_orderend : this.$el.find(".btn_orderend:first")
				};
				
				if(typeof cart_Id !== 'undefined' && cart_Id == "0"){
					alert("카트 정보가 없습니다.");
					location.replace("/order/main");
				}

			} else if(this.pagetype == "payment") {
				this.htLayer = {
						list : this.$el.find(".data_list:first"),
						form : this.$el.find("form[name=orderForm]"),
						btn_payment : this.$el.find(".btn_payment:first")
				};
				
				if(typeof cart_Id !== 'undefined' && cart_Id == "0"){
					alert("카트 정보가 없습니다.");
					location.replace("/order/main");
				}
			}
			
			if(typeof cart_Id !== 'undefined'){
				CNTApi.setGiftCartId(cart_Id);
			}
			
			if(typeof CNTApi.getGiftCartCount() === 'undefined'){
				this.cart = [];
			} else {
				this.cart = eval(CNTApi.getGiftCartCount());
			}
			
			this.tpl = {
					option :"<option value='{=VALUE}'>{=TEXT}</option>",
					optioned :"<option value='{=VALUE}' selected=selected>{=TEXT}</option>",
					loading : "<p align='center'><img src='/resources/images/common/ajax-loader.gif'/></p>"
			};
			
			this.api = '/get.do';
			this.params = document.location.search;
			this.mode = this.params.getValueByKey("mode");
			this.menuUrl = "menu_list.jsp";
			this.totalorderamount = 0;
		},
		bindEvent : function(){
			CNTApi.log("bindEvent:"+this.pagetype);	
			CNTApi.log("mode:"+this.mode);
			if(this.pagetype == "menu"){
				this.htLayer.addcart.bind('click',$.proxy(this.onAddCart,this));
				this.htLayer.save.bind('click',$.proxy(this.onSubmit,this));
				this.htLayer.btn_empty.bind('click',$.proxy(this.onEmptyCart,this));
				this.htLayer.btn_change.bind('click',$.proxy(this.onChangeBrand,this));
				this.htLayer.list.bind('click',$.proxy(this.onClick,this));
				
				var $local = this;
				this.callLoadCart(function(pdlist){
					var verification = true;
		    		var pdlists = pdlist.split(",");
		    		
		    		if(pdlists.length == $local.cart.length){
		    			for(var i = 0 ; i < $local.cart.length ; i++){
		    				var tempbool = false;
		    				for(var j = 0 ; j < pdlists.length ; j++){
		    					var pdinfo = pdlists[j].split("/");
		    					if($local.cart[i].code == pdinfo[0] && $local.cart[i].qty == pdinfo[1])
		    						tempbool = true;
		    				}
		    				
		    				if(!tempbool){
		    					verification = false;
		    					break;
		    				}
			    		}
		    		}else{
		    			verification = false;
		    		}
		    		
		    		if(!verification){
		    			$local.onEmptyCart();
		    		}else{
						$local.getCart();
		    		}
				});
			} else if(this.pagetype == "register"){
				this.htLayer.list.bind('click',$.proxy(this.onClick,this));
//				this.htLayer.table.bind('click',$.proxy(this.onClick,this));
				this.htLayer.btn_orderend.bind('click',$.proxy(this.onSubmit,this));
				this.getCart();
			}else if(this.pagetype == "payment"){
				this.htLayer.btn_payment.bind('click',$.proxy(this.onSubmit,this));
				this.getCart();
			}
		},
		onKeyEnter : function(e){
			CNTApi.log("onKeyEnter:"+e.which);
			var el = $(e.target);
			if(e.which == 13){
				//CNTApi.log("Enter");
				if(el.is(this.htSearchLayer.text)){
					this.getList(1);
				}
			}
		},
		makeItem : function (idx, code, name, qty, price, brand){
			var	CartItem = {};
			CartItem["idx"] = idx;
			CartItem["code"] = code;
			CartItem["name"] = name;
			CartItem["qty"] = qty;
			CartItem["price"] = price;
			CartItem["brand"] = brand;
			return CartItem;
		},
		removeCookie : function(){
			var count = 0;
			if (document.cookie != "") {
				var cookies = document.cookie.split("; ");
				count = cookies.length;

				var expireDate = new Date();
				expireDate.setDate(expireDate.getDate() - 1);

				for (var i = 0; i < count; i++) {
					var cookieName = cookies[i].split("=")[0];
					if(cookieName.indexOf("gift_order") != -1){
						document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
					}
				}
			}
		},
		callLoadCart : function(callback){
			var $local = this;
			$.ajax({
			    url: "/order/gift/loadCart",
			    data: {
			    	cartId : cart_Id
			    },
			    success: function(result) {
			    	if (result["status"] == "success") {
			    		cart_Id = result["cartId"];
			    		CNTApi.setGiftCartId(cart_Id);
			    		
			    		if(typeof CNTApi.getGiftCartCount() === 'undefined'){
							this.cart = [];
						} else {
							this.cart = eval(CNTApi.getGiftCartCount());
						}
			    		
			    		callback("");
			    	} else if(result["status"] == "fail") {
			    		alert(result["message"]);
			    	} else {
			    		if(result["ordertype"] == "payment"){
			    			$local.removeCookie();
			    			alert("카트 정보가 없습니다.");
			    			location.replace("/order/main");
			    		}else{
			    			callback(result["pdlist"]);
			    		}
			    	}
			    }
			});
		},
		callAddCart : function(pdspart, pdId, pdAmount, numtp, pagetype, index, callback){
			var this1 = this;
			$.ajax({
			    url: "/order/gift/addCart",
			    data: {
			    	cartId		: cart_Id,
			    	pdId		: pdId,
			    	pdAmount	: pdAmount,
			    	numtp		: numtp,
			    	brandcd 	: pdspart
			    },
			    success: function(result) {
			    	if(result.status == "fail") {
			    		alert(result["message"]);
			    		return false;
			    	} else {
			    		if(pagetype == "register") {
			    			var prevcnt = $("#pdcnt_"+index).val();
			    			var prevamount = parseInt(pdAmount);
			    			var qty = numtp == "P" ? parseInt(prevcnt) + 1 : prevcnt - 1;
			    			
			    			$("#pdcnt_"+index).val(qty);
			    			$("#orderamount_"+index).val(prevamount*qty);
			    			$("table#giftTable_"+index).find("tr[data-value='"+index+"'] td:eq(1) p").text(qty+"개");
			    			
			    			$("#giftTable_"+index).find("p#gift_price").text(CNTApi.getMoneyFormat(parseInt(prevamount*qty)) + "원");
			    			$("table#orderSummary").find("tr[data-value='"+index+"'] td:eq(1) p").text(qty+"개");
			    		}
			    		
			    		callback();
			    		
			    		//에이스카운터 2017-07-18
				    	this1.AceCounter_product(pdId, '1');
			    	}
			    }
			});
		},
		callDelCart : function(pdId, pagetype, index, lastYN){
			$.ajax({
			    url: "/order/gift/deleteCart",
			    data: {
			    	cartId	: cart_Id,
			    	pdId	: pdId
			    },
			    success: function(result) {
			    	if(pagetype == "register") {
			    		if(lastYN){
			    			location.href = "/order/gift/menu";
			    		}else{
			    			$("div.header-line").eq(index).remove();
			    			$("h2.subheader").eq(index).remove();
				    		$("div#orderinfo_"+index).remove();
				    		$("table#orderSummary").find("tr[data-value='"+index+"']").remove();
			    		}
					}
			    }
			});
		},
		onAddCart : function(e){
			CNTApi.log("onAddCart");
			
			var el = $(e.target);
			var nowtag =  e.target.tagName;
			CNTApi.log(" event name : "+ nowtag);
			
			var tr = $(".menu_list > li.on");
			
			var $local = this;
			this.callAddCart(tr.attr('data-spart'), tr.attr('data-value'), tr.attr('data-price'), "P", "", "", function(){
				var brand_nm = "";
				if(tr.attr('data-spart') == '1'){
					var brand_nm = "본죽";
				} else if(tr.attr('data-spart') == '3'){
					var brand_nm = "본도시락";
				}
				
				if($local.updateCart($local.makeItem(tr.attr('data-value'),tr.attr('data-value'),tr.attr('data-title'),1,tr.attr('data-price'), brand_nm))
				){
					// updateCart in Process
					$local.reloadCount();
				}
			});
		},
		onChangeBrand : function (e){
			location.href = "/order/gift/menu?brand=" + $(e.target).attr("code");
		},
		onEmptyCart : function (){
			this.cart = [];
			this.callDelCart();
			this.reloadCount();
			
			//에이스카운터 2017-07-18
			this.AceCounter_delete_cart();
		},
		updateCart : function (item){	
			var retvalue = false;
			var newitem = true;
				
			for(var i = 0; i < this.cart.length; i++){				
				CNTApi.log(this.cart[i].code+"="+item.code);
				if(this.cart[i].code == item.code){
					newitem = false;
					
					var qty1 = parseInt(item.qty);
					var qty2 = parseInt(this.cart[i].qty);
					
					item.qty = (qty1 + qty2);					
					this.cart[i] = item;
				} 
			}
			
			if(newitem == true){			
				if(this.cart == null){
					this.cart = [];
				}
				this.cart.push(item);
			}
			return true;
			
		},
		reloadCount : function(){
			console.log('reloadCount');
			var newcart = [];
			var _index = 0;
			
			for(var tt = 0 ; tt < this.cart.length ; tt++){
				var _idx = this.cart[tt].idx;
				var _qty = this.cart[tt].qty;
				
				if( parseInt(_qty) < 1 ){
					console.log('delete');
				} else {
					if(this.pagetype == "payment"){
						$("input[id^='pdid_']").each(function(){
							if(this.value == _idx){
								_index = $(this).attr("id").replace("pdid_", "");
								return false;
							}
						});
						
						if($("input#pdcnt_"+_index).val() != undefined && _qty != $("input#pdcnt_"+_index).val()){
							_qty = $("input#pdcnt_"+_index).val()
						}
					}
					
					newcart.push(this.makeItem(this.cart[tt].idx, this.cart[tt].code, this.cart[tt].name, _qty, this.cart[tt].price, this.cart[tt].brand));
				}
			}
			
			CNTApi.setGiftCartCount(JSON.stringify(newcart));
			this.cart = eval(CNTApi.getGiftCartCount());
			
			$("#cart_count").html(this.getCartCount());
			try{
				var getVersion;
				getVersion = BonMembershipApp.getVersion();
				BonMembershipApp.getCartCount(this.getCartCount());
			}catch(exx){
				
			}
			this.paintItemList();
		},
		getCartCount : function(pdid){
			CNTApi.log("getCartCount="+pdid);
			if(this.cart == null){
				this.cart = [];
			}
			var qty = 0;
			var pdqty = 0;
			for(var i = 0; i < this.cart.length; i++){
				if(pdid == this.cart[i].code){
					pdqty += parseInt(this.cart[i].qty);
				}
				qty += parseInt(this.cart[i].qty);
			}
			CNTApi.log(pdqty+"/"+qty);
			if( !CNTApi.isEmpty(pdid)){
				return pdqty;
			} 
			return qty;
		},
		onClick : function(e){
			CNTApi.log("onClick");
			var e_target = e.target == "" ? e : e.target;
			var el = $(e_target);
			var nowtag =  e_target.tagName; ;
			CNTApi.log(" event name : "+ nowtag);
			
			if(nowtag == "A") {
				CNTApi.log(" el : "+ el.attr('class'));
				var li = $(e_target);
				var cntArea = li.parent().find('input');
				var cnt = Number(cntArea.val());
				
				if(li.attr('class').indexOf("x_btn") > -1 ){
					var newcart = [];
					var lastYN = $("table[id^='giftTable']").length == 1 ? true : false;
					var _tmpConts = lastYN ? "입력하신 내용이 삭제된 후 본주문 페이지로 이동합니다." : "선택하신 메뉴를 삭제하시겠습니까?";
					
					if(confirm(_tmpConts)){
						for(var tt = 0 ; tt < this.cart.length ; tt++){
							CNTApi.log(this.cart[tt].code);
							var tr = li.parents('div:first');
							
							if(this.pagetype=="register" ) {
								tr = li.parents('tr:first');
							}
							
							CNTApi.log(tt+"/"+tr.attr("item-value"));
//						if(tt == parseInt(tr.attr("data-value")) && CNTApi.trim(this.cart[tt].code) == CNTApi.trim(tr.attr("item-value"))){
							if(CNTApi.trim(this.cart[tt].code) == CNTApi.trim(tr.attr("item-value"))){
								this.callDelCart(tr.attr("item-value"), this.pagetype, tr.attr("data-value"), lastYN);
								
								//에이스카운터 2017-07-19
							    if(this.cart[tt].code != 'undefined')
							    	this.AceCounter_product(this.cart[tt].code, this.cart[tt].qty, 'Y');
							    
							} else {
								newcart.push(this.makeItem(this.cart[tt].idx, this.cart[tt].code, this.cart[tt].name, this.cart[tt].qty, this.cart[tt].price, this.cart[tt].brand));
							} 
						}
						
						CNTApi.setGiftCartCount(JSON.stringify(newcart));
						this.cart = eval(CNTApi.getGiftCartCount());
						
						this.getCart();
					}else{
						return false;
					}
				} else if(li.attr('class').indexOf("btn_plus") > -1 && this.pagetype=="register"){
					var $local = this;
					var tr = li.parents("div[id^='orderinfo_']").find("table[id^='giftTable_']").find("tr:first");
					
					var _index 		= tr.attr('data-value');
					var _pdspart	= $("#pdspart_"+_index).val();
				 	var _pdid		= $("#pdid_"+_index).val();
				 	var _pdamount	= $("#pdamount_"+_index).val();
				 	var tt			= null;
				 	
				 	this.callAddCart(_pdspart, _pdid, _pdamount, "P", this.pagetype, _index, function(){
				 		for (var int = 0; int < $local.cart.length; int++) {
					 		if($local.cart[int].code == _pdid){
					 			tt = int;
					 			break;
					 		}
						}
					 	
					 	if(tt != null){
					 		if($local.updateCart($local.makeItem($local.cart[tt].idx, $local.cart[tt].code, $local.cart[tt].name, 1, $local.cart[tt].price, $local.cart[tt].brand))){
					 			$local.reloadCount();
					 		}
					 	}
				 	});
				} else if(li.attr('class').indexOf("btn_minus") > -1 && this.pagetype=="register"){
					var $local = this;
					var tr = li.parents("div[id^='orderinfo_']").find("table[id^='giftTable_']").find("tr:first");
					var _index = tr.attr('data-value');

					if($("#pdcnt_"+_index).val() > 1){
						var _pdspart	= $("#pdspart_"+_index).val();
					 	var _pdid		= $("#pdid_"+_index).val();
					 	var _pdamount	= $("#pdamount_"+_index).val();
					 	var tt			= null;
					 	
					 	this.callAddCart(_pdspart, _pdid, _pdamount, "N", this.pagetype, _index, function(){
					 		for (var int = 0; int < $local.cart.length; int++) {
						 		if($local.cart[int].code == _pdid){
						 			tt = int;
						 			break;
						 		}
							}
						 	
						 	if(tt != null){
						 		if($local.updateCart($local.makeItem($local.cart[tt].idx, $local.cart[tt].code, $local.cart[tt].name, -1, $local.cart[tt].price, $local.cart[tt].brand))){
						 			$local.reloadCount();
						 		}
						 	}
					 	});
					}
				}
			
			} 
			return false;
		},
		addCartMulti : function(idx, cnt, gubun){
			var _pdspart	= $("#pdspart_"+idx).val();
		 	var _pdid		= $("#pdid_"+idx).val();
		 	var _pdamount	= $("#pdamount_"+idx).val();
		 	var _pdcnt		= cnt;
		 	var tt			= null;
		 	var _qty 		= gubun == "P" ? _pdcnt : 0 - _pdcnt;
		 	
		 	$.ajax({
			    url: "/order/gift/addCartMulti",
			    data: {
			    	cartId		: cart_Id,
			    	pdId		: _pdid,
			    	pdAmount	: _pdamount,
			    	numtp		: gubun,
			    	brandcd 	: _pdspart,
			    	pdcnt		: _pdcnt
			    },
			    success: function(result) {
			    	if(result["status"] == "fail") {
			    		alert(result["message"]);
			    	} else {
		    			var prevcnt = $("#pdcnt_"+idx).val();
		    			var prevamount = parseInt(_pdamount);
		    			var qty = gubun == "P" ? parseInt(prevcnt) + _pdcnt : prevcnt - _pdcnt;
		    			
		    			$("#pdcnt_"+idx).val(qty);
		    			$("#orderamount_"+idx).val(prevamount*qty);
		    			$("table#giftTable_"+idx).find("tr[data-value='"+idx+"'] td:eq(1) p").text(qty+"개");
		    			
		    			$("#giftTable_"+idx).find("p#gift_price").text(CNTApi.getMoneyFormat(parseInt(prevamount*qty)) + "원");
		    			$("table#orderSummary").find("tr[data-value='"+idx+"'] td:eq(1) p").text(qty+"개");
			    	}
			    }
			});
		 		
		 	for (var int = 0; int < this.cart.length; int++) {
		 		if(this.cart[int].code == _pdid){
		 			tt = int;
		 			break;
		 		}
			}
		 	
		 	if(tt != null){
		 		if(this.updateCart(this.makeItem(this.cart[tt].idx, this.cart[tt].code, this.cart[tt].name, _qty, this.cart[tt].price, this.cart[tt].brand))){
		 			this.reloadCount();
		 		}
		 	}
		},
		onChangeQty : function(e){
			console.log("onChangeQty");
			var li = $(e.target);
			var tr = li.parents('div:first');
			if(this.pagetype=="register" ) {
				 tr = li.parents('tr:first');
			}
			var tt =  tr.attr("data-value");
			this.cart[tt].qty = parseInt(tr.find('input[name=qty]:first').val());
			this.reloadCount();
		},
		onSubmit: function (e){
			var $local = this;
			if(this.getCartPrice() < 0){
				$('.dimmed').show();
				$('#orderqty').show();
			} else {
				if(this.pagetype=="register"){
					e.preventDefault();
					var submitYN = true;
					
					$("input:text[numberOnly]", $("tbody#receiptbody:visible", $("div#content"))).each(function(){
						if(CNTApi.isEmpty(this.value) || this.value == ""){
			        		alert("전화번호는 필수 입니다.");
			        		$(this).focus();
			        		submitYN = false;
			        		
			        		return false;
			        	}
					});
					
					if(submitYN){
						$("div[id^='orderinfo_']").each(function(i){
							$_orderInfo = $(this);
							var _index = $_orderInfo.attr("id").replace("orderinfo_", "");
							var _pdtitle = $("#giftTable_"+_index+" tbody tr:eq(0)", $_orderInfo).find("strong").text();
							var _pdcnt = $("input#pdcnt_"+_index).val();
							
							// 직접입력 Validation
							var _reciptcnt = 0;
							$("tbody#receiptbody", $_orderInfo).each(function(){
								_reciptcnt += parseInt($("input#reciptcnt", $(this)).val());
							});
							
							if(_pdcnt > _reciptcnt){
								alert(_pdtitle + " 상품의\n입력하신 수량 " + _reciptcnt + " 이 총수량 " + _pdcnt + " 보다 적습니다.");
//									alert("입력하신 수량 " + _reciptcnt + " 이 총수량 " + _pdcnt + " 보다 적습니다.");
								$("input#reciptcnt", $("tbody#receiptbody:eq(0)", $_orderInfo)).focus();
								submitYN = false;
								return false;
							}else if(_pdcnt < _reciptcnt){
								alert(_pdtitle + " 상품의\n입력하신 수량 " + _reciptcnt + " 이 총수량 " + _pdcnt + " 보다 많습니다.");
//									alert("입력하신 수량 " + _reciptcnt + " 이 총수량 " + _pdcnt + " 보다 많습니다.");
								$("input#reciptcnt", $("tbody#receiptbody:eq(0)", $_orderInfo)).focus();
								submitYN = false;
								return false;
							}
						});	
					}
					
					if(submitYN){
						var recipients = [];
//						var arr = {};
						var idx = 0;
						// 휴대폰 전송 - 타입, 카트번호, 메뉴코드, 받는사람이름, 받는사람전화번호, 전송수량, 예약구분, 예약발송 일, 예약발송 시간, 예약발송 분, 선물메시지
						$("div[id^='orderinfo_']").each(function(){
							$_orderInfo = $(this);
							var _index = $_orderInfo.attr("id").replace("orderinfo_", "");
							// 휴대폰 전송
							var $tbody = $("tbody#receiptbody:visible", $_orderInfo);
							
							$tbody.each(function(){
								/*var obj = [];
								// 타입
								obj.push("multi");
								// 카트번호
								obj.push(cart_Id);
								// 메뉴코드
								obj.push($("input#pdid_"+_index).val());
								
								// 받는사람이름
//								obj.push($("input#reciptnm", this).val());
								obj.push("");
								
								// 받는사람전화번호
								var recvhp = $("input:text[numberOnly]", this).val();
								obj.push(recvhp);
								
								// 전송수량
								obj.push(1);
								
								// 예약구분
								obj.push($("div.item_count", this).attr("reserveflag"));
								
								// 예약발송 일
								var _date = $("#Datepicker", this).val() != undefined ? $("#Datepicker", this).val().replace(/-/gi, "") : "";
								obj.push(_date);
								
								// 예약발송 시간
								var _hour = $("select[name='hour']", this).length > 0 ? $("select[name='hour'] option:selected", this).val() : "";
								obj.push(_hour);
								
								// 예약발송 분
								var _min = $("select[name='min']", this).length > 0 ? $("select[name='min'] option:selected", this).val() : "";
								obj.push(_min);

								$parnetTB = $(this).parents("table");
								$selected = $parnetTB.find("select[name='msg'] option:selected");
								var _message = ($selected.val() == "0" || $selected.val() == "") ? $parnetTB.find("textarea#gift_message").val() : $selected.text();
								// 선물메시지
								obj.push(_message);
								
								var reciptcnt = parseInt($("input#reciptcnt", this).val());
								
								for (var int = 0; int < reciptcnt; int++) {
									arr[idx] = obj;
									idx++;
								}*/
								
								var	Item = {};
								// 타입
								Item["type"] = "multi";
								// 카트번호
								Item["cartid"] = cart_Id;
								// 메뉴코드
								Item["pdid"] = $("input#pdid_"+_index).val();
								// 받는사람이름
								Item["name"] = "";
								// 받는사람전화번호
								var recvhp = $("input:text[numberOnly]", this).val();
								Item["hp"] = recvhp;
								// 전송수량
								Item["cnt"] = "1";
								
								// 예약구분
								Item["reserveflag"] = $("div.item_count", this).attr("reserveflag");
								// 예약발송 일
								var _date = $("#Datepicker", this).val() != undefined ? $("#Datepicker", this).val().replace(/-/gi, "") : "";
								Item["reservedd"] = _date;
								// 예약발송 시간
								var _hour = $("select[name='hour']", this).length > 0 ? $("select[name='hour'] option:selected", this).val() : "";
								Item["reservehh"] = _hour;
								// 예약발송 분
								var _min = $("select[name='min']", this).length > 0 ? $("select[name='min'] option:selected", this).val() : "";
								Item["reservemm"] = _min;
								$parnetTB = $(this).parents("table");
								$selected = $parnetTB.find("select[name='msg'] option:selected");
								var _message = ($selected.val() == "0" || $selected.val() == "") ? $parnetTB.find("textarea#gift_message").val() : $selected.text();
								// 선물메시지
								Item["msg"] = _message;
								
								var reciptcnt = parseInt($("input#reciptcnt", this).val());
								
								for (var int = 0; int < reciptcnt; int++) {
									recipients.push(Item);
									idx++;
								}
							});
						});
						
						$.ajax({
							url: "/order/gift/history",
							data: {arr : JSON.stringify(recipients)},
							success: function(result) {
								if(result.status == "success"){
									location.replace("/order/gift/payment?cartId=" + cart_Id);
								}else if(result.status == "fail"){
									$local.removeCookie();
					    			alert("카트 정보가 없습니다.");
					    			location.replace("/order/main");
								}else if(result.status == "eventfail"){
					    			alert(result.msg);
					    			$local.onEmptyCart();
					    			location.replace("/order/gift/menu");
								}
							}
						});
					}

					
				} else if(this.pagetype=="payment"){
					
					// Validation Check
					if (parseInt($("#totalpayamount").text().replace(/,/g, "")) > 0 ){
						if(!$(":radio[name='category']").parents("div.radio_box").hasClass("on")){
							alert("결제방법을 선택해주세요.");
							return false;
						}
						
						if(!$('.card_list').hasClass("hide") && $("select#card_list").find("option:selected").val() == ""){
							alert("카드사를 선택해주세요.");
							return false;
						}
					}
					
					if(!$(":checkbox[id='form-saveid']").parents("label.custom-chkbox").find("span.checkbox").hasClass("checked")){
						alert("주문동의에 체크해주세요.");
						return false;
					}
					
//					var frm = document.kcpForm;
//					frm
//					window.open("", "popup_kcp", "width=1000, height=700, scrollbars=no");
//					frm.target = "popup_kcp";
//					frm.submit();
					
					var submitYN = false;
					var point_price = $("#totalpointprice").text().replace(/,/g, "");
					var total_pay_amount = $("#totalpayamount").text().replace(/,/g, "");
					
					if(point_price > 0){
						if(confirm("본포인트를 사용하실 경우 당월에 한해 구매취소 또는 환불 신청이 가능합니다.\n포인트를 사용하시겠습니까?")){
							submitYN = true;
						}else{
							$("input#pointprice").val(0);
							$("#totalpointprice").text(0);
							fnCalculate();
						}
					}else{
						submitYN = true;
					}
					
					if(submitYN){
						$.ajax({
							url: "/order/gift/prep_order",
							data: {
								cart_id : cart_Id,
								point_price : point_price,
								total_pay_amount : total_pay_amount
							},
							success: function(result) {
								if(result.status == "success"){
									if(result.paymentInfo.totpayamount == 0){
										window.location.href="/order/gift/payment_success?cartId=" + cart_Id;
									}else{
										var $frm = $("form#kcpForm");
										
										$frm.find("input#pay_type").val($("div.radio_box.on").find(":radio[name='category']").val());
//										$frm.find("input#coupon_price").val($("#totalcouponprice").text().replace(/,/g, ""));
										$frm.find("input#point_price").val($("#totalpointprice").text().replace(/,/g, ""));
//										$frm.find("input#giftcard_price").val($("#giftcard_price").text().replace(/,/g, ""));
										$frm.find("input#total_pay_amount").val($("#totalpayamount").text().replace(/,/g, ""));
										$frm.find("input#card_cd").val($("select#card_list").find("option:selected").val());
										
//										window.open("", "popup_kcp", "width=1000, height=800, scrollbars=no");
										
										if(!$('.card_list').hasClass("hide") && $("select#card_list").find("option:selected").val() != ""){
											$frm.attr("action", "/order/kcp/smarthub/order_pay");
										}else{
											$frm.attr("action", "/order/kcp/order_mobile");
										}
										
										$frm.submit();
									}
								}else if(result.status == "fail"){
									if(result.ordertype == "payment" || result.ordertype == ""){
										$local.removeCookie();
						    			alert("카트 정보가 없습니다.");
						    			location.replace("/order/main");
						    		}else{
						    			alert(result.msg);
						    		}
								}else if(result.status == "eventfail"){
					    			alert(result.msg);
					    			$local.onEmptyCart();
					    			location.replace("/order/gift/menu");
								}
							}
						});
					}
				} else if(this.pagetype=="menu"){
					if(this.cart.length > 0){
						$.ajax({
							url: "/order/gift/check",
							data: {
								cart_id : cart_Id
							},
							success: function(result) {
								if(result.status == "success"){
									location.href = "/order/gift/order?cartId=" + cart_Id;
								}else{
									alert(result.msg);
									$local.onEmptyCart();
								}
							}
						});
					}else{
						alert("선물하실 메뉴를 선택해주세요.");
					}
				}
			}
		},
		getCart:function (){
			console.log("getCart");
			this.reloadCount();
			
		},
		getCartCount : function(pdid){
			console.log("getCartCount="+pdid);
			if(this.cart == null){
				this.cart = [];
			}
			var qty = 0;
			var pdqty = 0;
			for(var i = 0; i < this.cart.length; i++){
				if(pdid == this.cart[i].code){
					pdqty += parseInt(this.cart[i].qty);
				}
				qty += parseInt(this.cart[i].qty);
			}
			console.log(pdqty+"/"+qty);
			if( !CNTApi.isEmpty(pdid)){
				return pdqty;
			} 
			return qty;
		},
		getCartPrice : function(pdid){
			console.log("getCartPrice="+pdid);
			if(this.cart == null){
				this.cart = [];
			}
			var qty = 0;
			var pdqty = 0;
			for(var i = 0; i < this.cart.length; i++){
				if(pdid == this.cart[i].code){
					pdqty += (parseInt(this.cart[i].qty)*parseInt(this.cart[i].price));
				}
				qty += (parseInt(this.cart[i].qty)*parseInt(this.cart[i].price));
			}
			console.log(pdqty+"/"+qty);
			if( !CNTApi.isEmpty(pdid)){
				return pdqty;
			} 
			return qty;
		},
		paintItemList : function(e){
			CNTApi.log("paintItemList");
			CNTApi.log(e);

			if(this.pagetype != "register"){
				this.htLayer.list.html('');
				$(this.htLayer.table).find("tbody").remove();
			}
			
			var qty = 0;
			var price = 0;
			var blist = [];
			if(this.cart != null) {
				for(var i = 0; i <  this.cart.length; i++){
					qty += parseInt(this.cart[i].qty);
					var pdprice = (parseInt(this.cart[i].qty)*parseInt(this.cart[i].price));
					price += parseInt(pdprice);
					blist.push(this.cart[i].brand);
				}
			}
			
			$("#total_price").html(CNTApi.getMoneyFormat(parseInt(price))+" <span class=\"txt\">원</span>");
			
			//에이스카운터 2017-07-18
			this.AceCounter_cartlist(this.cart);
		},
		
		//에이스카운터 2017-07-18
		
		//장바구니 삭제
		AceCounter_delete_cart : function(){
			console.log("[AceCounter_delete_cart]");
			AM_CARTDEL();
		},
		//장바구니 제품 수량 변경
		AceCounter_product: function(pdid,pcnt,delflag){
			console.log("[AceCounter_product] pdid : "+ pdid + " pcnt : " + pcnt);
			
			if(pdid == 'undefined' || pcnt == 'undefined')
				return;
			
			//선택한 제품 장바구니에서 삭제
			if(delflag =='Y'){
				AM_DEL(pdid, pcnt);
				console.log("[AceCounter_product] : del one product");
			}
			//선택한 제품을 세팅한 수량을 pcnt로 초기화 시킴
			else {
				AM_INOUT(pdid, pcnt);
				console.log("[AceCounter_product] : change quantity");
			}
		},
		//장바구니 리스트업
		AceCounter_cartlist: function(cart){
			console.log("[AceCounter_cartlist]");
			if(cart == null)
				return;
			else {
				var length = cart.length;
				var list = "";
				for(var i = 0; i <  length; i++){
					var script = "<script language='javascript'> var AM_Cart=(function(){var c = {";
					script += "pd:'"+cart[i].code+"', pn:'"+cart[i].name+"', am:'"+cart[i].price*cart[i].qty+"', qy:'"+cart[i].qty+"', ct:'"+cart[i].brand+"'";
					script += "};var u=(!AM_Cart)?[]:AM_Cart; u[c.pd]=c;return u;})();</script>";
					list += script;
				}
				$("#cartlist").html(list);
			}
			console.log(list);
		}
		//에이스카운터 2017-07-18
};
