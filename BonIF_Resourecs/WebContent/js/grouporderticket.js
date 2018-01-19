if(typeof CNTLib === 'undefined'){
	CNTLib = {};
}

CNTLib.GroupTicket = function(el,pt,nm){
	CNTApi.log("create");
	this.$el = $(el);
	this.pagetype = pt; //pt list = "List" : page type param
	this.nextpage = nm;
	this.init();
	
};
CNTLib.GroupTicket.prototype ={
		init : function(){
			CNTApi.log("init");
			this.initVar();
			this.bindEvent();
		},
		initVar : function(){
			CNTApi.log("initVar:"+this.pagetype);
			
			if(this.pagetype == "company"){
				this.htLayer = {
						form : this.$el.find("form[name=companyForm]"),
						btn_orderend : $("#btn_orderend")
				};
				
			} else if( this.pagetype == "ticket" ){
				this.htLayer = {
						form : this.$el.find("form[name=ticketForm]"),
						btn_orderend : $("#btn_orderend")
				};

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
			if(this.pagetype == "company"){
				this.htLayer.form.find('input[name=tel2]').bind('keyup',$.proxy(CNTApi.onlyNumber,this));
				this.htLayer.form.find('input[name=tel3]').bind('keyup',$.proxy(CNTApi.onlyNumber,this));
				//this.htLayer.btn_orderend.bind('click',$.proxy(this.onSubmit,this));
			} else if(this.pagetype == "ticket"){
				this.htLayer.form.find('input[name=tel2]').bind('keyup',$.proxy(CNTApi.onlyNumber,this));
				this.htLayer.form.find('input[name=tel3]').bind('keyup',$.proxy(CNTApi.onlyNumber,this));
				//this.htLayer.btn_orderend.bind('click',$.proxy(this.onSubmit,this));
				this.htLayer.form.find('input[name=qty_5000]').bind('keyup',$.proxy(CNTApi.onlyNumber,this));
				this.htLayer.form.find('input[name=qty_8000]').bind('keyup',$.proxy(CNTApi.onlyNumber,this));
				this.htLayer.form.find('input[name=qty_5000]').bind('blur',$.proxy(this.onChangeQty,this));
				this.htLayer.form.find('input[name=qty_8000]').bind('blur',$.proxy(this.onChangeQty,this));
			}
			
			
			var self=this;
			this.htLayer.form.find('input[type=file]').change(function () {
				self.htLayer.form.find('.filename').text(this.files[0].name);
			});
			this.htLayer.form.find('textarea').keyup(function(){
				//남은 글자수 구하기
				var inputLength = $(this).val().length;
				var maxlength = 2000;
				var remain = maxlength - inputLength;
				
				self.htLayer.form.find('.number').html( CNTApi.getMoneyFormat(inputLength)+"/"+ CNTApi.getMoneyFormat(maxlength));
				
				if(remain >= 0) {
					self.htLayer.form.find('.number').css('color', 'black');
				} else {
					self.htLayer.form.find('.number').css('color', 'red');
				}
			});
			
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
		makeItem : function (name, qty, price){
			var	CartItem = {};
			CartItem["name"] = name;
			CartItem["qty"] = qty;
			CartItem["price"] = price;			
			return CartItem;
		},
		onChangeQty : function(e){
			console.log("onChangeQty");
			var q5 = this.htLayer.form.find('input[name=qty_5000]').val();
			var q8 = this.htLayer.form.find('input[name=qty_8000]').val();
			this.$el.find('.total_price').html("총 금액 : "+ CNTApi.getMoneyFormat(q5 * 5000 + q8 * 8000) +"원");
		},
		onSubmit: function (e){
			console.log("onSubmit:"+this.pagetype);
			if(this.pagetype=="company" || this.pagetype=="ticket"){

				var form = this.htLayer.form;
				var tel=this.$el.find('input[name=tel1]').val().replace("-", "").replace("-", "");
				
				if(this.pagetype=="company") {
					if(!$("#agree1").is(".checked")){
						$("#agree1_focus").focus();
						alert("개인정보취급방침에 동의하셔야 합니다.");
						return false;
					}
				} else if(this.pagetype=="ticket") {
					if(!$("#agree2").is(".checked")){
						$("#agree2_focus").focus();
						alert("개인정보취급방침에 동의하셔야 합니다.");
						return false;
					}
				}
				
				if (isNaN(tel) || tel.length>11 || tel.length<8){
					this.$el.find('input[name=tel1]').focus();
					alert("전화번호를 확인해주세요.");
					return;
				}

				
				console.log(form);
				//form.find('input[name=tel1]').val(this.$el.find('.tel1:first').text());
				form.find('input[name=email]').val(this.$el.find('input[name=email1]').val());
				
				
				var validate = [];
				if(this.pagetype=="company"){
					validate = [
						{"dest":"input[name=company_name]","alert":"기업명를 입력해주세요" ,"defaultvalue":""},
//						{"dest":"input[name=name]","alert":"이름을 입력해주세요","defaultvalue":""},
		                {"dest":"input[name=tel1]","alert":"전화번호는 필수 입니다.","defaultvalue":""},
//		                {"dest":"input[name=tel2]","alert":"전화번호는 필수 입니다.","defaultvalue":""},
//		                {"dest":"input[name=tel3]","alert":"전화번호는 필수 입니다.","defaultvalue":""},
//		                {"dest":"input[name=email]","alert":"이메일을 확인해 주세요","defaultvalue":"@"},
//		                {"dest":"input[name=email1]","alert":"이메일을 확인해 주세요","defaultvalue":""},
		                //{"dest":"input[name=email2]","alert":"이메일을 확인해 주세요","defaultvalue":"직접입력"},		                
		                {"dest":"textarea[name=content]","alert":"내용을 입력해주세요" ,"defaultvalue":""}
		        		];

				} else if(this.pagetype=="ticket") {
					form.find('input[name=payment]').val("bank");
					
					var q5 = this.htLayer.form.find('input[name=qty_5000]').val();
					var q8 = this.htLayer.form.find('input[name=qty_8000]').val();
					var cart = [];
					cart.push(this.makeItem( "5000원권" ,q5 , "5000") );
					cart.push(this.makeItem( "8000원권" ,q8 , "8000") );
					
					if(q5+q8 == 0){
						alert('수량을 입력해주세요');
						this.htLayer.form.find('input[name=qty_8000]').focus();
						return;
					}
					
					form.find('input[name=email]').val(this.$el.find('input[name=email1]').val());
					
					form.find('input[name=order_content]').val( JSON.stringify(cart) );
					
					validate = [
						{"dest":"input[name=name]","alert":"이름을 입력해주세요","defaultvalue":""},
		                {"dest":"input[name=tel1]","alert":"전화번호는 필수 입니다.","defaultvalue":""},
//		                {"dest":"input[name=tel2]","alert":"전화번호는 필수 입니다.","defaultvalue":""},
//		                {"dest":"input[name=tel3]","alert":"전화번호는 필수 입니다.","defaultvalue":""},
//		                {"dest":"input[name=email]","alert":"이메일을 확인해 주세요","defaultvalue":"@"},
//		                {"dest":"input[name=email1]","alert":"이메일을 확인해 주세요","defaultvalue":""},
		                //{"dest":"input[name=email2]","alert":"이메일을 확인해 주세요","defaultvalue":"직접입력"},
//		                {"dest":"input[name=useplace]","alert":"사용처를 입력해주세요" ,"defaultvalue":""},
//		                {"dest":"input[name=addr1]","alert":"배송주소를 입력해주세요" ,"defaultvalue":""},
//		                {"dest":"input[name=addr2]","alert":"배송주소를 입력해주세요" ,"defaultvalue":""},		                
		                {"dest":"textarea[name=content]","alert":"내용을 입력해주세요" ,"defaultvalue":""}
		        		];
				}
				
				for(var i = 0; i < validate.length;i++){
		        	var vd = validate[i];
		        	var obj = this.htLayer.form.find(vd.dest);
		        	console.log(vd.dest);
		        	
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
								location.href="/group/companyfinish";				
							} else {
								alert(data.result);
							}
						}

					},
					error : function(error) {
						console.log(error);
						alert("요청 처리 중 오류가 발생하였습니다.");
					}

				});
		        
			}
			
		}
};
