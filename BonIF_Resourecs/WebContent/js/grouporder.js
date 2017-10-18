if(typeof CNTLib === 'undefined'){
	CNTLib = {};
}

CNTLib.GroupOrder = function(el,pt,nm){
	CNTApi.log("create");
	this.$el = $(el);
	this.pagetype = pt; //pt list = "List" : page type param
	this.nextpage = nm;
	this.init();
	
};
CNTLib.GroupOrder.prototype ={
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
						save : this.$el.find(".btn_order:first")
				};	
				
			} else if( this.pagetype == "register" ){
				this.htLayer = {
						list : this.$el.find(".data_list:first"),
						form : this.$el.find("form[name=orderForm]"),
						btn_orderend : this.$el.find(".btn_orderend:first")
				};

			} 
			if(typeof $.cookie( CNTApi.sGroupCartId) === 'undefined'){
				this.cart = [];
			} else {
				this.cart = eval($.cookie( CNTApi.sGroupCartId));
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
			if(this.pagetype == "init"){
				this.onEmptyCart();
			} else if(this.pagetype == "menu"){
				this.onEmptyCart();
				this.htLayer.addcart.bind('click',$.proxy(this.onAddCart,this));
				this.htLayer.save.bind('click',$.proxy(this.onSubmit,this));
				this.htLayer.btn_empty.bind('click',$.proxy(this.onEmptyCart,this));
				this.htLayer.list.bind('click',$.proxy(this.onClick,this));
				this.getCart();
			} else if(this.pagetype == "register"){
				this.htLayer.list.bind('click',$.proxy(this.onClick,this));
				this.htLayer.btn_orderend.bind('click',$.proxy(this.onSubmit,this))
				
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
		makeItem : function (idx, code, name, qty, price, brand_spart, brand){
			var	CartItem = {};
			CartItem["idx"] = idx;
			CartItem["code"] = code;
			CartItem["name"] = name;
			CartItem["qty"] = qty;
			CartItem["price"] = price;
			CartItem["brandspart"] = brand_spart;
			CartItem["brand"] = brand;
			return CartItem;
		},
		onAddCart : function(e){
			CNTApi.log("onAddCart");
			
			var el = $(e.target);
			var nowtag =  e.target.tagName;
			CNTApi.log(" event name : "+ nowtag);
			
			var tr = $(e.target).parents("li");
			
			if(this.updateCart(this.makeItem(tr.attr('data-value'),tr.attr('data-value'),tr.attr('data-title'),1,tr.attr('data-price'), brand_spart, brand))
			){
				// updateCart in Process
				this.reloadCount();
			}
			
		},
		onEmptyCart : function (){
			this.cart = [];
			this.reloadCount();
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
			for(var tt = 0 ; tt < this.cart.length ; tt++){
				if( parseInt(this.cart[tt].qty) < 1 ){
					console.log('delete');
				} else {
					newcart.push(this.makeItem(this.cart[tt].idx, this.cart[tt].code, this.cart[tt].name, this.cart[tt].qty, this.cart[tt].price, this.cart[tt].brandspart, this.cart[tt].brand));
				} 
			}
			$.cookie( CNTApi.sGroupCartId, JSON.stringify(newcart), CNTApi.sPath );
			this.cart = eval($.cookie( CNTApi.sGroupCartId));
			
			if(this.pagetype == "register"){
				this.htLayer.form.find('input[name=dosirak_content]').val( JSON.stringify(newcart));
			}
			$("#cart_count").html(this.getCartCount());
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
			
			var el = $(e.target);
			var nowtag =  e.target.tagName;
			CNTApi.log(" event name : "+ nowtag);			
			if( nowtag == "A") {
				
				CNTApi.log(" el : "+ el.attr('class'));
				
				var li = $(e.target);
				if(li.attr('class').indexOf("btn_del") > -1 ){
					var newcart = [];
					var lastYN = li.parents("tbody").find("tr").length == 1 ? true : false;
					var _tmpConts = lastYN ? "입력하신 내용이 삭제된 후 단체주문 페이지로 이동합니다." : "선택하신 메뉴를 삭제하시겠습니까?";
					
					if(confirm(_tmpConts)){
						
						
						for(var tt = 0 ; tt < this.cart.length ; tt++){
							CNTApi.log(this.cart[tt].code);
							var tr = li.parents('div:first');
							if(this.pagetype=="register" ) {
								tr = li.parents('tr:first');
							}
							CNTApi.log(tt+"/"+tr.attr("item-value"));
							if(  tt == parseInt(tr.attr("data-value")) && CNTApi.trim(this.cart[tt].code) == CNTApi.trim(tr.attr("item-value")) ){
								
							} else {
								newcart.push(this.makeItem(this.cart[tt].idx, this.cart[tt].code, this.cart[tt].name, this.cart[tt].qty, this.cart[tt].price, this.cart[tt].brandspart, this.cart[tt].brand));
							} 
							
						}
						$.cookie( CNTApi.sGroupCartId, JSON.stringify(newcart), CNTApi.sPath );
						this.cart = eval($.cookie( CNTApi.sGroupCartId));
						
						this.getCart();
						
						if(lastYN){
			    			location.href = "/group/order_home";
			    		}
					}else{
						return false;
					}
				} else if(li.attr('class').indexOf("btn_plus") > -1 ){
					var tr = li.parents('div:first');
					if(this.pagetype=="register" ) {
						 tr = li.parents('tr:first');
					}
					var tt =  tr.attr("data-value")
					if( this.updateCart(this.makeItem(this.cart[tt].idx, this.cart[tt].code, this.cart[tt].name, 1, this.cart[tt].price, this.cart[tt].brandspart, this.cart[tt].brand))){
						this.reloadCount();
					}
				} else if(li.attr('class').indexOf("btn_minus") > -1 ){
					var tr = li.parents('div:first');
					if(this.pagetype=="register" ) {
						 tr = li.parents('tr:first');
					}
					var tt =  tr.attr("data-value")
					if( this.updateCart(this.makeItem(this.cart[tt].idx, this.cart[tt].code, this.cart[tt].name, -1, this.cart[tt].price, this.cart[tt].brandspart, this.cart[tt].brand))){
						this.reloadCount();
					}	
				}
			
			} 
			return false;
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
		onSubmit: function (){
//			if(this.getCartCount() < 1){
//				alert("메뉴를 선택하지 않았습니다.");
				//$('.dimmed').show();
				//$('#orderqty').show();
//			} else {
				if(this.pagetype=="register"){
//					if(this.getCartCount() < 30){
//						$('.dimmed').show();
//						$('#orderqty').show();
//					}else{
					var form = this.htLayer.form;
					if(!$("#agree2").is(".checked")){
						$("#agree2_focus").focus();
						alert("개인정보처리방침에 동의하셔야 합니다.");
						return false;
					}
					
					var tel=this.$el.find('input[name=tel1]').val().replace("-", "").replace("-", "");
					
					if (isNaN(tel) || tel.length>11 || tel.length<8){
						this.$el.find('input[name=tel1]').focus();
						alert("전화번호를 확인해주세요.");
						return;
					}

					form.find('input[name=email]').val(this.$el.find('input[name=email]').val());
					
					
					form.find('input[name=delivery_date]').val(this.$el.find('#my_select1 option:selected').text().replace("년", "-")+this.$el.find('#my_select2 option:selected').text().replace("월", "-")+this.$el.find('#my_select3 option:selected').text().replace("월", "-").replace("일", "") );
					
					
					form.find('input[name=delivery_hh]').val(this.$el.find('#my_select4 option:selected').text().substring(0,2));
					form.find('input[name=delivery_mm]').val(this.$el.find('#my_select5 option:selected').text().substring(0,2));
					form.find('input[name=event_kind_text]').val(this.$el.find('#my_select6 option:selected').text());
					console.log(form);
					//var formData = new FormData(form);
			        //console.log(formData);
					var validate = [
						{"dest":"input[name=name]","alert":"이름을 입력해주세요","defaultvalue":""},
		                {"dest":"input[name=tel1]","alert":"전화번호는 필수 입니다.","defaultvalue":""},
//		                {"dest":"input[name=email]","alert":"이메일을 확인해 주세요","defaultvalue":"@"},
//		                {"dest":"input[name=delivery_date]","alert":"배송일자를 입력해주세요" ,"defaultvalue":""},
//		        		{"dest":"input[name=delivery_hh]","alert":"배송시간을 입력해주세요" ,"defaultvalue":""},
//		                {"dest":"input[name=delivery_mm]","alert":"배송시간을 입력해주세요" ,"defaultvalue":""},
//		                {"dest":"input[name=company_name]","alert":"단체명을 입력해주세요" ,"defaultvalue":""},
//		                {"dest":"input[name=addr1]","alert":"배송주소를 입력해주세요" ,"defaultvalue":""},
//		                {"dest":"input[name=addr2]","alert":"배송주소를 입력해주세요" ,"defaultvalue":""},
		                //{"dest":"input[name=event_kind_text]","alert":"행사종류를 입력해주세요" ,"defaultvalue":"행사유형선택"},
//		                {"dest":"input[name=title]","alert":"제목을 입력해주세요" ,"defaultvalue":""},
		                {"dest":"textarea[name=content]","alert":"내용을 입력해주세요" ,"defaultvalue":""}
		        		];
					
					for(var i = 0; i < validate.length;i++){
			        	var vd = validate[i];
			        	var obj = this.htLayer.form.find(vd.dest);
			        	console.log(vd.dest);
			        	console.log(obj[0]);
			        	
			        	if (obj[0].type == "select-one" || obj[0].nodeName == "checkbox" || obj[0].nodeName == "radio"){
			        		if(!obj.hasClass('focus')){
			        			obj.addClass('focus');
			        		}
				        	if(CNTApi.isEmpty( obj.val() ) || obj.val() == vd.defaultvalue){
				        		alert(vd.alert);
				        		obj.focus();
				        		return ;
				        	} else {
				        		if( obj.hasClass('focus')){
				        			obj.removeClass('focus');
				        		}
				        	}
			        	} else {
			        		if(CNTApi.isEmpty( obj.val() ) || obj.val() == vd.defaultvalue ){
				        		alert(vd.alert);
				        		obj.focus();
				        		return ;
				        	} 
			        	}
			        	
			        }	
					var email  = this.htLayer.form.find('input[name=email]').val();					
					if(!email.isEmail()) {
						this.htLayer.form.find('input[name=email1]').focus();
						alert('이메일을 확인해주세요');
						return;
					}
					
					if (this.$el.find('#my_select1 option:selected').text()=="년도"){
						alert("배송일자를 입력해주세요");
						this.$el.find('#my_select1').focus();
						return false;
					}
					if (this.$el.find('#my_select2 option:selected').text()=="월"){
						alert("배송일자을 입력해주세요");
						this.$el.find('#my_select2').focus();
						return false;
					}
					if (this.$el.find('#my_select3 option:selected').text()=="일"){
						alert("배송일자을 입력해주세요");
						this.$el.find('#my_select3').focus();
						return false;
					}
					if (this.$el.find('#my_select4 option:selected').text()=="시"){
						alert("배송시간을 입력해주세요");
						this.$el.find('#my_select4').focus();
						return false;
					}
					if (this.$el.find('#my_select5 option:selected').text()=="분"){
						alert("배송시간을 입력해주세요");
						this.$el.find('#my_select5').focus();
						return false;
					}
					
					if (this.$el.find('#my_select6 option:selected').text()=="선택"){
						alert("행사유형을 입력해주세요");
						this.$el.find('#my_select6').focus();
						return false;
					}
					var tel1=tel.substring(0,3);
					var tel2=tel.substring(3,7);
					var tel3=tel.substring(7,11);
					form.find('input[name=tel1]').val(tel1);
					form.find('input[name=tel2]').val(tel2);
					form.find('input[name=tel3]').val(tel3);
					
					
					
			        var self= this;
			        
			        form.ajaxSubmit({
						success : function(data) {
							console.log(data);							
							 if(data != null){
								 data = JSON.parse(data);
								if(data.result == 1){
//									$('.dimmed').show();
//									$('#orderend').show();
									self.onEmptyCart();
									location.href = "/group/finish";
								} else {
									alert(data.result);
								}
							}

						},
						error : function(error) {
							alert("요청 처리 중 오류가 발생하였습니다.");
						}

					});
			        
//				  }  
				} else {
					location.href="/group/order_register";	
				}
//			}
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
		paintItemList : function(e){
			CNTApi.log("paintItemList");
			CNTApi.log(e);

			if(this.pagetype != "init"){
				this.htLayer.list.html('');
			}
			
			var qty = 0;
			var price = 0;
			var blist = [];
			var spartlist = [];
			if(this.cart != null) {
				for(var i = 0; i <  this.cart.length; i++){
					qty += parseInt(this.cart[i].qty);
					var pdprice = (parseInt(this.cart[i].qty)*parseInt(this.cart[i].price));
					price += parseInt(pdprice);
					blist.push(this.cart[i].brand);
					spartlist.push(this.cart[i].brandspart);
					if(this.pagetype == "register") {
						var tr = "<tr  data-value=\""+i+"\" item-value=\""+this.cart[i].code+"\">"
						+	"<td>"
						+   "<strong class=\"tit\">"+this.cart[i].name+"</strong>"
						+	"	<div class=\"item_count\">"
						+	"		<a href=\"#\" class=\"btn_minus\">―</a>"
						+	"		<span class=\"input_text\"><input type=\"text\" name=\"qty\" value=\""+this.cart[i].qty+"\"></span>"
						+	"		<a href=\"#\" class=\"btn_plus\">+</a>"
						+	"	</span>"
						+	"</td>"
						+	"<td>"
						+	"	<p class=\"text-right f_orange font_space f30\">"+CNTApi.getMoneyFormat(pdprice)+"원</b><a href=\"#\" class=\"btn_del\"><span class=\"blind\">삭제</span></a>"
						+	"</td>"
						+ "</tr>";
						this.htLayer.list.append(tr);
					} else {
						var tr = "<div class=\"item_box\" data-value=\""+i+"\" item-value=\""+this.cart[i].code+"\">"
						+"<p class=\"item\"><strong>"+this.cart[i].name+"</strong></p>"
						+"	<span class=\"item_count\"> "
						+"  <a href=\"#\" class=\"btn_minus\"><span class=\"blind\">감소</span></a> "
						+"	<span class=\"input_text\"><input type=\"text\" name=\"qty\" value=\""+this.cart[i].qty+"\"></span> "
						+"	<a href=\"#\" class=\"btn_plus\"><span class=\"blind\">증가</span></a> "
						+"	</span>"
						+"	<strong class=\"price font_space\">"+CNTApi.getMoneyFormat(pdprice)+" <span class=\"txt\">원</span></strong>"
						+"	<a href=\"#\" class=\"btn_del\"><span class=\"blind\">삭제</span></a>"
						+"</div>";
						this.htLayer.list.append(tr);
					}
				}
				
				this.htLayer.list.find('input[name=qty]').unbind('blur');				
				this.htLayer.list.find('input[name=qty]').bind('blur',$.proxy(this.onChangeQty,this));
				
				if(this.pagetype == "register") {
					var strblist = $.unique(blist);
					
					$('#brand_list').html(strblist.join());
					if(this.htLayer.form.find('input[name=title]').val() == ""){
						this.htLayer.form.find('input[name=title]').val(strblist.join()+" 단체주문 문의드려요.");
					}
					
					var strspartlist = $.unique(spartlist);
					this.htLayer.form.find('input[name=spart]').val(Number(strspartlist.join()));
				}
			}
			$("#total_price").html(CNTApi.getMoneyFormat(parseInt(price))+" <span class=\"txt\">원</span>");
		}
};
