/**
 * @매장 찾기
 */
if (typeof CNTLib === 'undefined') {
	CNTLib = {};
}
CNTLib.Delivery = function(el) {
	this.$el = $(el);
	var params = document.location.search;

	this.type = params.getValueByKey("type");
	
	this.init();
};
CNTLib.Delivery.prototype = {
	init : function() {
		this.initVar();
		this.bindEvent();
		
	},
	initVar : function() {
		/**주소 검색 용 **/
		this.htLayer = {
				list : this.$el.find('.addrlist:first'),
				btn_gis : this.$el.find('.btn_gis:first'),
				btn_select : this.$el.find('.btn_select:first'),
				form : this.$el.find('form[name=address]'),
				popup : this.$el.find('#pop_wrap'),
				
				order_gubun : this.$el.find(":radio[name=order_gubun]"),
				order_type : this.$el.find(":radio[name=order_type]"),
				btn_payment : this.$el.find(".btn_payment:first")
		};
		
		this.addaddress = {
				txt_address1 : this.htLayer.form.find('input[name=address1]'),
				txt_address2 : this.htLayer.form.find('input[name=address2]'),
				txt_si : this.htLayer.form.find('input[name=si]'),
				txt_gu : this.htLayer.form.find('input[name=gu]'),
				txt_dong : this.htLayer.form.find('input[name=dong]'),
				txt_ri : this.htLayer.form.find('input[name=ri]'),
				txt_roadname : this.htLayer.form.find('input[name=roadname]'),
				txt_placename : this.htLayer.form.find('input[name=placename]'),
				txt_px : this.htLayer.form.find('input[name=pointx]'),
				txt_py : this.htLayer.form.find('input[name=pointy]'),
				txt_branch_id : this.htLayer.form.find('input[name=branch_id]'),
				txt_poscode1 : this.htLayer.form.find('input[name=poscode1]'),
				txt_branch_sector: this.htLayer.form.find('input[name=branch_sector]'),
				txt_branch_name: this.htLayer.form.find('input[name=branch_name]'),
				txt_branch_time: this.htLayer.form.find('input[name=branch_time]'),
				userselectedaddr : this.htLayer.form.find('.userselectedaddr:first')
		};
		this.gis = new CNTLib.GIS("#address_pop",this);
		this.htStoreInfo = {
				storeinfo : this.$el.find('.storeinfo:first'),
				storeaddr : this.$el.find('.storeaddr:first'),
				button_store_area : this.$el.find('.button_store_area:first'),
				storeagree : this.$el.find('.storeagree:first')
		};
		/**주소 검색 용 **/
		this.userAddrPOP = $('#pop_addCh');
		this.userAddrList = this.userAddrPOP.find(".useraddedaddrlist:first");
		this.useraddrcnt = 0;
		
		this.storeinfviewer = this.$el.find('.storeinfviewer:first');
		this.storeemptyviewer = this.$el.find('.storeemptyviewer:first');
		
		
		this.btnLayer = {
				btn_useraddrlist: this.$el.find(".btn_useraddrlist:first"),
				btn_popaddaddr : this.$el.find(".btn_popaddaddr:first"),
				btn_useraddrdel : this.userAddrPOP.find(".btn_useraddrdel:first"),
				btn_useraddroppop : this.userAddrPOP.find(".btn_useraddroppop:first"),
				btn_useraddagree : this.userAddrPOP.find(".btn_useraddagree:first")
		};
		
		this.api = CNTApi.sApi;
		
		this.tpl = {
				useraddrlist :
					'<tr><th scope="row">배달매장</th>'
					+ '<td>{=STORE_NM} (TEL.{=STORE_TEL})</td></tr>'
					+ '<tr data-seq="{=seq}"><th scope="row">배달주소</th>'
					+ '<td>{=addrtext}'
					+ '<p class="order02_bt">'
					+ '<span class="order_bt1">'
					+ '<a href="javascript:void(0);" class="btn_delete">삭제</a>'
					+ '</span>'
					+ '<span class="order_bt2">'
					+ '<a href="javascript:void(0);" name="seluseraddr" class="btn_select" data-si="{=si}" data-gu="{=gu}" data-dong="{=dong}" data-newx="{=newx}" data-newy="{=newy}" data-addr1="{=addr1}" data-addr2="{=addr2}" data-seq="{=seq}" data-roadname="{=roadname}" data-placename="{=placename}">선택</a>'
					+ '</span>'
					+ '</p></td></tr>',
				storeinfo : "{=NAME} / 연락처 : {=TEL}",
				storeaddr : "주소 : {=ADDRESS}",
				storebtn :	"<a href=\"/news/store.jsp?storeid={=storeid}\" class=\"button\" target=\"_blank\"><span>지도보기</span></a></p>",
				storeempty :"<span class='t_red'>죄송합니다. 배달가능한 매장이 없습니다.</span>"
		};
		
		this.notselectedStore = true;
		
		this.selectStoreInfo = null;
	},
	bindEvent : function() {
		this.htLayer.btn_gis.bind('click', $.proxy(this.showGisPopup, this));
		this.htLayer.btn_select.bind('click',$.proxy(this.selectUserAddr,this));
		this.htLayer.list.bind('click',$.proxy(this.selectUserAddr,this));
		
		this.htLayer.order_gubun.bind('click',$.proxy(this.onClick2,this));
		this.htLayer.order_type.bind('click',$.proxy(this.onClick,this));
		
		//this.getUserAddrList(); // 등록된 주소 조회
		//this.newCartId();
		
		if(this.type == 'P')
			this.$el.find(":radio[name=order_type]:eq(1)").click();
		else
			this.$el.find(":radio[name=order_type]:eq(0)").click();
			
			
		if(this.pagetype == "payment"){
			//this.htLayer.btn_payment.bind('click',$.proxy(this.onSubmit,this));
			//this.getCart();
		}
	},
	showGisPopup:function(){
		CNTApi.log("Aaa");
		this.gis.clear();
		if(this.useraddrcnt > 4){
			alert('고객 주소 저장은 최대 5개까지 가능합니다. 사용하지 않는 주소를 삭제 해 주세요');
		}else{
			layerShow('#address_pop');
		}	
	},
	/**외부용 함수**/
	getSelectedStore :function(){
		if(this.notselectedStore == false){
			return true;
		}else{
			return false;
		}
	},
	
	onClick : function(e){
		var el = $(e.target);
		if(el.val() == "D"){
			$(".order01").removeClass("hide");
			$(".order02").addClass("hide");
		}else{
			$(".order01").addClass("hide");
			$(".order02").removeClass("hide");
		}
	},
	onClick2 : function(e){
		var el = $(e.target);
		if(el.val() == "E"){
			$("#ex_rd3").next().attr("style","display:none;");
			$("#ex_rd4").click();
		}else{
			$("#ex_rd3").next().removeAttr("style");
		}
	},
	onKeyEnter : function(e) {
		var el = $(e.target);
		CNTApi.log("aaaa");
		CNTApi.log(el);
		if (e.which == 13) {

		}
	},
	openAddresPopup :function(e){
		CNTApi.log("Aaa");
		if(this.useraddrcnt > 4){
			alert('고객 주소 저장은 최대 3개까지 가능합니다. 사용하지 않는 주소를 삭제 해 주세요');
		}else{
			this.gis.show();
		}
	},
	getDelivery : function(e){
		CNTApi.log("getDelivery");
		if(CNTApi.isEmpty(this.addaddress.txt_px.val())|| CNTApi.isEmpty(this.addaddress.txt_py.val())){
			this.gis.show();
		} else {
			this.addaddress.userselectedaddr.html(this.addaddress.txt_address1.val() + ' ' +this.addaddress.txt_address2.val());
			CNTApi.log("여기에 상권검색 로직을 넣습니다.");
			var param = [];
			param.push("ex=Gis");
			param.push("ac=findstore");
			param.push("x="+this.addaddress.txt_px.val());
			param.push("y="+this.addaddress.txt_py.val());
			//param = paramEncriptPost(param);
			
			var self = this;
			$.ajax({
				type : 'get',
				//async : false,
				url : this.api,
				data : param,
				dataType : 'jsonp',
				contentType : 'application/json; charset=UTF-8',
				error:function(jqXHR, textStatus, errorThrown){
					CNTApi.log(jqXHR);
				},
				success: function(data){
					CNTApi.log("result");
					CNTApi.log(data);
					
					if(data != null){
						for(var i = 0 ; i < data.length; i++){
							var ev = data[0];
							if(ev.a_branch_id == ""){
								self.notselectedStore = true;
								/**if(self.htLoginLayer.list.hasClass('hide') == true){
									self.htLoginLayer.list.removeClass('hide');
								}**/
								self.htStoreInfo.storeinfo.html(self.tpl.storeempty);
								self.storeinfviewer.hide();
								self.storeemptyviewer.show();
							} else {
								self.notselectedStore = false;
								/**
								if(self.htLoginLayer.list.hasClass('hide') == true){
									self.htLoginLayer.list.removeClass('hide');
								}
								**/
								self.storeinfviewer.show();
								self.storeemptyviewer.hide();
								var address = [];
								address.push(ev.a_si);
								address.push(ev.a_gu);
								address.push(ev.a_dong);
								address.push(ev.a_address);
								address.push(ev.a_add_ref);
								
								self.addaddress.txt_branch_id.val(ev.a_branch_id);
								self.addaddress.txt_branch_sector.val(ev.zonetitle);
								self.addaddress.txt_branch_name.val(ev.a_branch_name);
								
								delitime = CNTApi.getStoreTime(ev.a_branch_id);
								self.addaddress.txt_branch_time.val(delitime);
								self.htStoreInfo.storeagree.html('배달 예상 시간 :' + delitime + '분');
								self.htStoreInfo.storeinfo.html(self.tpl.storeinfo.replace(/{=NAME}/g,ev.a_branch_name).replace(/{=TEL}/g,CNTApi.autoHypenPhone(ev.a_phone)));
								self.htStoreInfo.button_store_area.html(self.tpl.storebtn.replace(/{=storeid}/g,ev.a_branch_id));
								self.htStoreInfo.storeaddr.html( self.tpl.storeaddr.replace(/{=ADDRESS}/g,address.join(' ')));
							}
						}
						self.regSelectedAddress();
								
					}
				}
			});
		}
	},
	/**주소 등록 **/
	regSelectedAddress :function(){
		CNTApi.log("regSelectedAddress");
		
		var param = [];
		param.push('id=Address');
		param.push('ac=insertcustaddr');
		param.push('cust_id=' + UserInfo.user_no);
		//param.push('si=' +  encodeURIComponent(this.addaddress.txt_si.val()));
		param.push('si=' +  this.addaddress.txt_si.val());
		param.push('gu=' + this.addaddress.txt_gu.val());
		param.push('dong=' + this.addaddress.txt_dong.val() +' '+this.addaddress.txt_ri.val());
		
		if(this.addaddress.txt_roadname.val() == '' && this.addaddress.txt_placename.val() != ''){
			param.push('bunji=' + this.addaddress.txt_placename.val());
		}else{
			param.push('addr_append=' + this.addaddress.txt_roadname.val()+' '+this.addaddress.txt_placename.val());
		}
		
		param.push('addr_desc=' + this.addaddress.txt_address2.val());
		param.push('branch_id=' + this.addaddress.txt_branch_id.val());
		param.push('branch_sector=' + this.addaddress.txt_branch_sector.val());
		param.push('add_new_gubun=1');
		param.push('point_new_x=' + this.addaddress.txt_px.val());
		param.push('point_new_y=' + this.addaddress.txt_py.val());
		CNTApi.log(param.join('&'));
		//param = paramEncriptPost(param);
		
		var self = this;
		$.ajax({
			type : 'post',
			url : this.api,
			data : param,
			dataType : 'jsonp',
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			error : function(e) {
				CNTApi.log(e);
				alert('에러:데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				CNTApi.log(data);
				if(data[0].result == '1'){
					self.getUserAddrList();
				}
			}
		});
	},
	/**주소 검색**/
	getUserAddrList :function(){
		CNTApi.log("getUserAddrList");
		var param = [];
		param.push('id=Address');
		param.push('ac=getuseraddrlist');
		param.push('mb_no=' + UserInfo.user_no);
		CNTApi.log(param.join('&'));
		//param = paramEncriptPost(param);
		CNTApi.log("getUserAddrList : "+param);
		var self = this;
		$.ajax({
			type : 'post',
			async : false,
			url : this.api,
			data : param,
			dataType : 'jsonp',
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			error : function(e) {
				CNTApi.log(e);
				alert('에러:데이터 송수신에 문제가 있습니다.');
				// CNTApi.log('에러:주문 데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				self.paintUserAddrList(data);
			}
		});
	},
	paintUserAddrList :function(data){
		if(data != null){
			this.useraddrcnt = 0;
			this.htLayer.list.html(null);
			for(var i = 0 ; i < data.length; i++){
				ev = data[i];
				CNTApi.log(ev);
				if(ev.addr1 != ''){
					this.useraddrcnt ++;
					
					var tel = ev.store_id;
					if(CNTApi.isEmpty(tel))
						tel = "1599-1082";
					
					this.htLayer.list.append(this.tpl.useraddrlist
							.replace(/{=si}/g,ev.si)
							.replace(/{=gu}/g,ev.gu)
							.replace(/{=dong}/g,ev.dong)
							.replace(/{=newx}/g,ev.point_new_x)
							.replace(/{=newy}/g,ev.point_new_y)
							.replace(/{=addr1}/g,ev.addr1)
							.replace(/{=addr2}/g,ev.addr2)
							.replace(/{=roadname}/g,ev.roadname)
							.replace(/{=placename}/g,ev.placename)
							.replace(/{=seq}/g,ev.seq)
							.replace(/{=addrtext}/g,ev.addr1 + ' ' + ev.addr2)
							.replace(/{=STORE_NM}/g,ev.store_name)
							.replace(/{=STORE_TEL}/g,tel)
					);
					/*
					if(i == 0&&this.addaddress.txt_address1.val()=='' ){
						CNTApi.log("22");
						this.addaddress.txt_address1.val(ev.addr1);
						this.addaddress.txt_address2.val(ev.addr2);
						this.addaddress.txt_si.val(ev.si);
						this.addaddress.txt_gu.val(ev.gu);
						this.addaddress.txt_dong.val(ev.dong);
						this.addaddress.txt_ri.val('');
						this.addaddress.txt_roadname.val(ev.roadname);
						this.addaddress.txt_placename.val(ev.placename);
						this.addaddress.txt_px.val(ev.point_new_x);
						this.addaddress.txt_py.val(ev.point_new_y);
						this.addaddress.txt_branch_id.val('');
						this.addaddress.txt_branch_sector.val('');
						this.getDelivery2();
					}
					*/
				} else {
					this.htLayer.list.html('<tr><td colspan=3>배송지를 등록해주세요</td></tr>');
				}
			}
		}	else {
			this.htLayer.list.html('<tr><td colspan=3>배송지를 등록해주세요</td></tr>');
		}
	},
	selectUserAddr : function(e) {
		
		var el = $(e.target);
		var nowtag = e.target.tagName;
		CNTApi.log(" event name : " + nowtag);
		CNTApi.log( el);
		if (nowtag == "A"){
			e.preventDefault();
			var li = el.parents("tr");
			var nowcls = el.attr("class");
			if(nowcls.indexOf("btn_delete") > -1 ){
				if(confirm("삭제 하시겠습니까?")){
					var seq = li.attr('data-seq');
					this.deleteUserAddr(seq);
				}
			} else if (nowcls.indexOf("btn_select") > -1) {
				CNTApi.log("btn_select");
				el2 = el;
				
				this.updateOrderData(el2);
				//this.getDelivery2();
			}
		} else if (nowtag == "SPAN") {
			el2 = this.userAddrList.find('a[name="seluseraddr"]');
			btnclass = el.parents('a:first').attr('class');
			CNTApi.log(el2);
			CNTApi.log(btnclass);
			if (btnclass.indexOf("btn_useraddroppop") > -1) {
				if(this.useraddrcnt > 2){
					alert('고객 주소 저장은 최대 3개까지 가능합니다. 사용하지 않는 주소를 삭제 해 주세요');
					return false;
				}else{
					this.gis.clear();
					this.closeAddrListPopUp();
					this.gis.show();
				}
			}else{
				var seq=el2.attr('data-seq');
				var notSelect = false;
				if (typeof seq === 'undefined'){
					notSelect = true;
				}
				if(notSelect){
					alert("주소를 먼저 선택해주세요!");
					return false;
				}
				
				if(btnclass.indexOf("btn_useraddrdel") > -1) {
					if(seq == '0'){
						alert("기본 주소는 삭제 할수 없습니다.");
						return false;
					}else{
						this.deleteUserAddr(seq);
					}
				}else if(btnclass.indexOf("btn_useraddagree") > -1) { 
					var addr1=el2.attr('data-addr1');
					var addr2=el2.attr('data-addr2');
					var dong=el2.attr('data-dong');
					var gu=el2.attr('data-gu');
					var newx=el2.attr('data-newx');
					var newy=el2.attr('data-newy');
					var si=el2.attr('data-si');
					var roadname = el2.attr('data-roadname');
					var placename = el2.attr('data-placename');
					
					this.addaddress.txt_address1.val(addr1);
					this.addaddress.txt_address2.val(addr2);
					this.addaddress.txt_si.val(si);
					this.addaddress.txt_gu.val(gu);
					this.addaddress.txt_dong.val(dong);
					this.addaddress.txt_ri.val('');
					this.addaddress.txt_roadname.val(roadname);
					this.addaddress.txt_placename.val(placename);
					this.addaddress.txt_px.val(newx);
					this.addaddress.txt_py.val(newy);
					this.addaddress.txt_branch_id.val('');
					this.addaddress.txt_branch_sector.val('');
					$('.bgLayer').remove();   
					this.userAddrPOP.hide();
					this.getDelivery2();
				}
			}
		}
	},
	deleteUserAddr : function(seq){
		var param = [];
		param.push('id=Address');
		param.push('ac=deluseraddr');
		param.push('mb_no=' + UserInfo.user_no);
		param.push('seq=' + seq);
		CNTApi.log(param.join('&'));
		//param = paramEncriptPost(param);

		var self = this;
		$.ajax({
			type : 'post',
			async : false,
			url : this.api,
			data : param,
			dataType : 'jsonp',
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			error : function(e) {
				CNTApi.log(e);
				alert('에러:데이터 송수신에 문제가 있습니다.');
				// CNTApi.log('에러:주문 데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				CNTApi.log("result");
				CNTApi.log(data);
				if(data != null){
					if(data[0].result == '1'){
						alert('삭제되었습니다.');
						self.getUserAddrList();
					}
				}
			}
		});
	},
	openAddrListPopUp :function(){
		//CNTApi.log('aaaaaaaaa');
		var vCont = $('#pop_addCh');
		$('#container').after('<span class=bgLayer></span>');
        $('.bgLayer').fadeTo('fast', 0.6, function() {
        	$(vCont).show(300, function() {
				  $(this).attr('tabIndex',0).focus();
				});
            $(vCont).find('.popClose').click(function() {
                $('.bgLayer').remove(); 
				$(this).parents('.popLayer').hide(300,function(){
					$(vCont).removeAttr('tabindex');
					//_this.focus();
				});
				return false;
            });
        });
		return false;
	},
	closeAddrListPopUp :function(){
		$('.bgLayer').remove();   
		$('#pop_addCh').hide();
	},
	
	//매장 권역 확인
	findStoreXY : function(x, y){
		CNTApi.log("findStoreXY : "+ x +","+ y);
		//this.addaddress.userselectedaddr.html(this.addaddress.txt_address1.val() + ' ' +this.addaddress.txt_address2.val());
		
		if(CNTApi.isEmpty(x) || CNTApi.isEmpty(y))
			return false;
		
		else{
			var isOK = false;
			var param = [];
			param.push("ex=Gis");
			param.push("ac=findstore");
			param.push("x="+x);
			param.push("y="+y);
			
			var self = this;
			$.ajax({
				type : 'get',
				async : false,
				url : this.api,
				data : param.join('&'),
				dataType : 'jsonp',
				contentType : 'application/json; charset=UTF-8',
				error:function(jqXHR, textStatus, errorThrown){
					CNTApi.log(jqXHR);
				},
				success: function(data){
					CNTApi.log("result");
					CNTApi.log(data);
					
					if(data != null){
						for(var i = 0 ; i < data.length; i++){
							var ev = data[i];
							if(CNTApi.isEmpty(ev.a_branch_id)){
								isOK = false;
								
								alert("죄송합니다.\n고객님의 주소로 배달할 수 있는 매장이 없습니다.\n인근 매장에서 방문포장으로 이용하실 수 있습니다.");
							} else {
								isOK = true;
								
								self.addaddress.txt_poscode1.val(ev.a_branch_id);
								self.addaddress.txt_branch_sector.val(ev.zonetitle);
								self.addaddress.txt_branch_time.val(ev.time);
							}
						}
					}
				}
			});
			
			return isOK;
		}
	},
	
	//GIS ID로 매장 정보 검색
	getGisStoreInfo: function(poscode1){
		
		CNTApi.log("[getGisStoreInfo] : " + poscode1);
		
		var isOK = false;
		var param = [];
		param.push("id=Store");
		param.push("ac=getGisStore");
		param.push("poscode1="+poscode1);
		
		var self = this;
		$.ajax({
			type : 'get',
			async : false,
			url : this.api,
			data : param.join('&'),
			dataType : 'jsonp',
			contentType : 'application/json; charset=UTF-8',
			error:function(jqXHR, textStatus, errorThrown){
				CNTApi.log(jqXHR);
			},
			success: function(data){
				CNTApi.log(data);
				
				if(data != null){
					for(var i = 0 ; i < data.length; i++){
						var ev = data[i];
						if(!CNTApi.isEmpty(ev.store_id)){
							self.addaddress.txt_branch_id.val(ev.store_id);
							self.addaddress.txt_branch_name.val(ev.store_name);
							CNTApi.setStoreId(ev.store_id);
							
							isOK = true;
						} else {
							alert("사용할 수 없는 매장입니다.");
							isOK = false;
						}
					}
				}
			}
		});
		
		return isOK;
	},
	
	//매장 주문가능상태 체크(배달/포장 여부, 영업 시간)
	chkStoreInfo: function(store_id){
		CNTApi.log("getStoreInfo : "+store_id);
		
		var isOK = false;
		
		if(CNTApi.isEmpty(store_id)){
			alert("사용할 수 없는 매장입니다.");
			isOK = false;
		}
		else{
			
			var param = [];
			param.push("ex=Store");
			param.push("ac=storetimeinfo");
			param.push("storeid="+store_id);
			
			CNTApi.log(param.join('&'));
			
			var self = this;
			$.ajax({
				type : 'get',
				async : false,
				url : this.api,
				data : param.join('&'),
				dataType : 'jsonp',
				contentType : 'application/json; charset=UTF-8',
				error:function(){
					//CNTApi.log('에러:주문 데이터 송수신에 문제가 있습니다.');
				},
				success: function(data){
					console.log(data);
					if(data != null){
						try {
							console.log(data);
							var ev = data[0];
								if(CNTApi.isEmpty(ev.storeid)){
									isOK = false;
									
									alert("죄송합니다.\n고객님의 주소로 배달할 수 있는 매장이 없습니다.\n인근 매장에서 방문포장으로 이용하실 수 있습니다.");
								} else {
									
									//매장 주문가능 시간 확인
									if(ev.time_status == "OP"){
										isOK = true;
										
										self.addaddress.txt_branch_id.val(ev.storeid);
										self.addaddress.txt_branch_name.val(ev.storename);
									}
									else if(ev.time_status == "TM"){
										isOK = false;
										alert("지금은 매장 주문 가능 시간이 아닙니다.\n"+ ev.storename +"은 "+ ev.ophh +":"+ ev.opmm +" ~ "+ ev.clhh +":"+ ev.clmm +"사이 주문 가능합니다.");
									}
									else{
										isOK = false;
										alert(ev.memo);
									}
									
									if(isOK){
										
										//배달, 포장 가능 확인
										if($(":radio[name=order_type]:checked").val() == 'D' && ev.delivery_yn == 'Y'){
											isOK = true;
										}else if($(":radio[name=order_type]:checked").val() == 'P' && ev.package_yn == 'Y'){
											isOK = true;
										}else{
											isOK = false;
											
											if($(":radio[name=order_type]:checked").val() == 'D')
												alert("죄송합니다. 매장이 현재 배달주문 불가능한 상태입니다.");
											else if($(":radio[name=order_type]:checked").val() == 'P')
												alert("죄송합니다. 매장이 현재 포장주문 불가능한 상태입니다.");
										}
									}
								}
	
						} catch(e){
							alert(e);
							isOK = false;
						}
					} else {
						isOK = false;
					}				
				}
			});
		}
		
		return isOK;
	},
	
	//포스 상태 체크
	chkPosStatus : function(storeid) {
		CNTApi.log("chkPosStatus : "+storeid);
		
		var param = [];
		param.push("ex=Linked");
		param.push("ac=checksalesstore");
		param.push("storeid="+storeid);
		var isOK = false;
		CNTApi.log(param.join('&'));
		
		$.ajax({
			type : 'get',
			async : false,
			url : this.api,
			data : param.join('&'),
			dataType : 'jsonp',
			contentType : 'application/json; charset=UTF-8',
			error : function(e) {
				//console.log(e);
			},
			success : function(data) {
				CNTApi.log(data);
				
				if (data != null) {
					try {
						if(typeof data[0].sd_ro_mk !=='undefined'){
							if(CNTApi.isEmpty(data[0].sd_ro_mk)){
								isOK = true;
							}else {
								alert('해당 매장은 현재 주문 불가능한 매장입니다.다른 매장을 선택해 주세요.');
							}
						}else{
							alert('매장 상태를 확인 할수 없습니다. 잠시 후 다시 시도해 주세요');
						}
					} catch (e) {
						alert(e);
						return isOK;
					}
				}else{
					alert('매장 상태를 확인 할수 없습니다. 잠시 후 다시 시도해 주세요');
					return isOK;
				}
		}});
		
		return isOK;
	},
	updateOrderData : function(el) {
		CNTApi.log("--updateOrderData");
		CNTApi.log("object : " + el);
		
		var isOK = false;
		
		if($(":radio[name=order_gubun]:checked").val() == "E" && $(":radio[name=order_type]:checked").val() == "D"){
			alert("E쿠폰주문은 포장주문만 가능합니다.");
			return false;
		}
		
		var coupon_flag = true;
		if(CNTApi.getEcoupon() == "E"){
			coupon_flag = confirm("일반 주문으로 주문 유형 변경 시 기존에 담았던 E쿠폰 제품이 사라지게 됩니다.\n일반 주문으로 진행하시겠습니까?");
		}
		
		if(coupon_flag){
			//폼에 선택매장 데이터 저장
			var addr1=el2.attr('data-addr1');
			var addr2=el2.attr('data-addr2');
			var dong=el2.attr('data-dong');
			var gu=el2.attr('data-gu');
			var newx=el2.attr('data-newx');
			var newy=el2.attr('data-newy');
			var si=el2.attr('data-si');
			var roadname = el2.attr('data-roadname');
			var placename = el2.attr('data-placename');
			
			this.addaddress.txt_address1.val(addr1);
			this.addaddress.txt_address2.val(addr2);
			this.addaddress.txt_si.val(si);
			this.addaddress.txt_gu.val(gu);
			this.addaddress.txt_dong.val(dong);
			this.addaddress.txt_ri.val('');
			this.addaddress.txt_roadname.val(roadname);
			this.addaddress.txt_placename.val(placename);
			this.addaddress.txt_px.val(newx);
			this.addaddress.txt_py.val(newy);
			this.addaddress.txt_branch_id.val('');
			this.addaddress.txt_branch_sector.val('');
			this.addaddress.txt_branch_name.val('');
			this.addaddress.txt_branch_time.val('');
			
			//배송지 좌표로 주변 매장 검색
			if(this.findStoreXY(newx, newy)){
				//poscode로 매장정보 가져오기
				if(this.getGisStoreInfo(this.addaddress.txt_poscode1.val())){
					//매장 주문가능상태 체크(배달/포장 여부, 영업 시간)
					if(this.chkStoreInfo(this.addaddress.txt_branch_id.val())){
						//포스 상태 체크
						//if(this.chkPosStatus(this.addaddress.txt_branch_id.val())){
							isOK = true;
						//}
					}
				}
			}
			
			if(isOK){
				this.nowUpdate = true;
				var orderdate = null;
				var ordertime = null;
				var ordertype = $(":radio[name=order_type]:checked").val();
	
				var paytype = null;
				
				var addAddrString = '';
				var paycode = null;
				var cardseq = null;
				var cardamount = 0;
				var cashamount = 0;
				var couponamount = 0;
				
				var couponseq = null;
				if($(":radio[name=order_gubun]:checked").val() == "E")
					couponseq = "Y";
				
				var addrcode = null;
				var addrname = null;
				var addrsi = this.addaddress.txt_si.val();
				var addrdo = this.addaddress.txt_gu.val();
				var addrdong = this.addaddress.txt_dong.val();
				var addrli = this.addaddress.txt_ri.val();
	
				
				if (this.addaddress.txt_roadname.val() == '' && this.addaddress.txt_placename.val() != '') {
					addAddrString = this.addaddress.txt_placename.val();
				} else {
					addAddrString = this.addaddress.txt_roadname.val() + ' ' + this.addaddress.txt_placename.val();
				}
				
				var addDirectionStr = "";
			
				var forcastmin = this.addaddress.txt_branch_time.val();
				var addrdetail = addAddrString + ' ' + this.addaddress.txt_address2.val();
				var addrtext = this.addaddress.txt_address1.val() + ' ' + this.addaddress.txt_address2.val();
				var addrsector = this.addaddress.txt_branch_sector.val();
				var addrx = this.addaddress.txt_px.val();
				var addry = this.addaddress.txt_py.val();
				var storeid = this.addaddress.txt_branch_id.val();
				var storename = this.addaddress.txt_branch_name.val();
				var userseq = UserInfo.user_no;
				var userid = UserInfo.user_id;
				var usertel = UserInfo.user_phone;
				var username = UserInfo.user_name;
				var recipttel = UserInfo.user_phone;
				var reciptname = UserInfo.user_name;
				var direction = "";
				var cartid = CNTApi.getCartId();
	
				var nomempw = "";
	
				// form 설정
				var orderexefrm = document.orderexefrm;
				orderexefrm.cartid.value = cartid;
				orderexefrm.ordertype.value = ordertype;
				orderexefrm.route.value = CNTApi.getThisRoute();
				orderexefrm.orderdate.value = orderdate;
				orderexefrm.ordertime.value = ordertime;
				orderexefrm.paytype.value = paytype;
				orderexefrm.paycode.value = paycode;
				orderexefrm.cardseq.value = cardseq;
				orderexefrm.cardamount.value = cardamount;
				orderexefrm.couponamount.value = couponamount;
				orderexefrm.couponseq.value = couponseq;
				orderexefrm.cashamount.value = cashamount;
				orderexefrm.addrcode.value = addrcode;
				orderexefrm.addrname.value = addrname;
				orderexefrm.addrsi.value = addrsi;
				orderexefrm.addrdo.value = addrdo;
				orderexefrm.addrdong.value = addrdong;
				orderexefrm.addrli.value = addrli;
				orderexefrm.addrdetail.value = addrdetail;
				orderexefrm.addrtext.value = addrtext;
				orderexefrm.addrsector.value = addrsector;
				orderexefrm.addrx.value = addrx;
				orderexefrm.addry.value = addry;
				orderexefrm.storeid.value = storeid;
				orderexefrm.storename.value = storename;
				orderexefrm.userseq.value = userseq;
				orderexefrm.userid.value = userid;
				orderexefrm.usertel.value = usertel;
				orderexefrm.username.value = username;
				orderexefrm.recipttel.value = recipttel;
				orderexefrm.reciptname.value = reciptname;
				orderexefrm.direction.value = addDirectionStr+direction;
				orderexefrm.forcastmin.value = forcastmin;
				orderexefrm.nomempw.value = nomempw;
				
				var self = this;
	
				if(CNTApi.isEmpty(storeid)){
					alert("주소를 선택해주세요");
					return;
				}
				
				var sandForm = formEncript($('#orderexefrm'));
				$.post("/get.do", sandForm.serialize(), function(data) {
					CNTApi.log(data);
					if (data != null) {
						try {
							self.nowUpdate = false;
							CNTApi.log(data);
							if (typeof data[0].cartid !== "undefiend") {
								if (data[0].cartid > 0) {
									CNTApi.setEcoupon($(":radio[name=order_gubun]:checked").val());
									CNTApi.setOrderType($(":radio[name=order_type]:checked").val());
									CNTApi.setCartId(data[0].cartid);
									
									if(CNTApi.getEcoupon() == "E")
										location.href="/order/ordercoupon.jsp";
									else
										location.href="/order/menulist.jsp?cc=1";
								} else {
									alert(data[0].message);
									CNTApi.setCartId(0);
									//self.newCartId();
								}
							} else {
								alert("배송지 설정 응답이 없습니다 !");
							}
						} catch (e) {
							self.nowUpdate = false;
							alert(e);
						}
					}
				}, 'jsonp');
			}
		}
	},
	//order/packing/payment
	cartDetail : function(){
		$(".content").empty();
		var topping_price = 0;
		var param = [];
		param.push("ex=Cart");
		param.push("ac=selectCartDetail");
		param.push("cartid="+CNTApi.getCartId());
		var self = this;
		
		//alert(CNTApi.getCartId());
		
		if( CNTApi.getCartId() == "0" ){ alert("카트 정보가 없습니다."); window.history.back(-1); }
		
		$.ajax({
			type: 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'jsonp',
			async:false,
			error:function(){
				console.log("error");
			},
			success: function(data){
				var html = "";
				if(data != null){
					var totprice = 0;
					var tot_tp_price = 0;
					for (var i = 0; i < data.length; i++){
						var topping_price = 0;
						var ev = data[i];
						
						totprice = Number(totprice) + Number(ev.pdcnt * ev.cartamount);
						
						if ("BD100001" == ev.op1pos1) {
							continue;
						}
						
						html +='<tr>'
						+'<td><strong class="tit">'+ev.detailname+''
						if(ev.op1val2 != null && ev.op1val2 != ""){
							$.each(JSON.parse(ev.op1val2), function(k,v){
								console.log(v);
								html +='('+v.packing_name+')'
							});
						}
						if(ev.op1val1 != null && ev.op1val1 != ""){
							$.each(JSON.parse(ev.op1val1), function(k,v){
								html +='<br/>('+v.topping_name+'<em class="f_orange font_space"> '+v.count+') </em>'
								topping_price += (Number(v.count) * Number(v.price));
							});
							totprice +=Number(ev.pdcnt * topping_price);
						}
						html +='</strong></td>'
						html +='<td><p class="font_space">'+ev.pdcnt+'개</p></td>'
						+'<td><p class="text-right f_orange font_space f30">'+numberWithCommas(Number(ev.cartamount)+Number(topping_price))+'원</p></td>'
						//+'<td><p class="text-right f_orange font_space f30">'+numberWithCommas(Number(ev.pdcnt) * (Number(ev.cartamount)+Number(topping_price)))+'원</p></td>'
						+'</tr>'
					}
					
					for (var i = 0; i < data.length; i++){
						var ev = data[i];
						if ("BD100001" == ev.op1pos1) {
							html +='<tr>'
								+'<td><strong class="tit">'+ev.detailname+''
							    +'</strong></td>'
								+'<td></td>'
								+'<td><p class="text-right f_orange font_space f30">'+numberWithCommas(ev.pdcnt * (Number(ev.cartamount)))+'원</p></td>'
								+'</tr>'
							
						}
					}
					
					$(".content").append(html);
					
					$(".totAmt").text(numberWithCommas(totprice)+"원");
					$("#totalorderprice").text(numberWithCommas(totprice));
					$("#totalpayamount").text(numberWithCommas(totprice));
					
					
					
				}else{
					html +='<tr class="nolist">'
						+'<p>주문표에 담긴 <br>메뉴가 없습니다.</p>'
						+'</tr>';
					$(".content").append(html);
				}
			}
		});
	},
	//order/packing/order
	cartDetail2 : function(){
		$(".content").empty();
		var param = [];
		param.push("ex=Cart");
		param.push("ac=selectCartDetail");
		param.push("cartid="+CNTApi.getCartId());
		
		//alert(CNTApi.getCartId());
		
		if( CNTApi.getCartId() == "0" ){ alert("카트 정보가 없습니다."); window.history.back(-1); }

		var self = this;
		$.ajax({
			type: 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'jsonp',
			async:false,
			error:function(){
				console.log("error");
			},
			success: function(data){
				console.log("cartDetail2");
				var html = "";
				if(data != null){
					var tot_tp_price = 0;
					var totprice = 0;
					for (var i = 0; i < data.length; i++){
						var topping_price = 0;	
						var ev = data[i];
						totprice = Number(totprice) + Number(ev.pdcnt * ev.cartamount);
						
						if ("BD100001" == ev.op1pos1) {
							continue;
						}
						
						html +='<tr>'
						+'<td><strong class="tit">'+ev.detailname+' '
						if(ev.op1val2 != null && ev.op1val2 != ""){
							$.each(JSON.parse(ev.op1val2), function(k,v){
								console.log(v);
								html +='('+v.packing_name
							});
						}
						if(ev.op1val1 != null && ev.op1val1 != ""){
							$.each(JSON.parse(ev.op1val1), function(k,v){
								html +=''+v.topping_name+'<em class="f_orange font_space"> '+v.count+' </em>'
								topping_price += (Number(v.count) * Number(v.price));
							});
							totprice +=Number(ev.pdcnt * topping_price);
						}
						html +=')</strong>'
						+'<div class="item_count">'
						+'<a href="javascript:void(0);" class="btn_minus" onClick="cMin('+ev.detailid+');">―</a><span class="input_text"><input type="text" value="'+ev.pdcnt+'" id="pd_cnt_'+ev.detailid+'" readOnly="true"></span>'
						+'<a href="javascript:void(0);" class="btn_plus" onClick="cPlus('+ev.detailid+');">+</a>'
						+'</div></td>'
						+'<td><p class="text-right f_orange font_space f30">'+numberWithCommas(Number(ev.cartamount)+Number(topping_price))+'원</p></td>'
						//+'<td><p class="text-right f_orange font_space f30">'+numberWithCommas(ev.pdcnt * (Number(ev.cartamount)+Number(topping_price)))+'원<a href="javascript:condel('+ev.detailid+');" class="btn_del btn_order"><span class="blind">삭제</span></a></p></td>'
						+'</tr>'
					}
					
					for (var i = 0; i < data.length; i++){
						var ev = data[i];
						if ("BD100001" == ev.op1pos1) {
							html +='<tr>'
								+'<td><strong class="tit">'+ev.detailname+''
							    +'</strong></td>'
								+'<td><p class="text-right f_orange font_space f30">'+numberWithCommas(ev.pdcnt * (Number(ev.cartamount)))+'원</p></td>'
								+'</tr>'
							
						}
					}
					
					$(".content").append(html);
					$(".totAmt").text(numberWithCommas(Number(totprice))+"원");
					
				}else{
					html +='<tr class="nolist">'
						+'<td colspan="3"><p>주문표에 담긴 <br>메뉴가 없습니다.</p></td>'
						+'</tr>';
					$(".content").append(html);
				}
			}
		});
	},
	getOrderInfo : function(){
		$(".contentList").empty();
		var userseq = $("#userSeq").val();
		var param = [];
		param.push("ex=Order");
		param.push("ac=selectOrderInfo");
		param.push("cartid="+CNTApi.getCartId());
		param.push("addr_seq="+CNTApi.getMyAddrSeq());
		param.push("userseq="+userseq);
		console.log(param);
		if( CNTApi.getCartId() == "0" ){ alert("카트 정보가 없습니다."); window.history.back(-1); }

		var self = this;
		$.ajax({
			type: 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'jsonp',
			async:false,
			error:function(){
				console.log("error");
			},
			success: function(data){
				console.log(data);
				var html = "";
				if(data != null){
					var totprice = 0;
										
					for (var i = 0; i < data.length; i++){					
						var ev = data[i];
						
						$(".chainInfo").append("");
						html = ev.chainname + '<br>' + ev.addr1 + '&nbsp;' + ev.addr2;
						html += '<a href="'+ ev.tel1 +'" class="btn_phone"><span class="blind">전화</span></a>'
											
						var userName = $("#userName").val();
						var userHp = $("#userTel1").val()+"-" + $("#userTel2").val() + "-" + $("#userTel3").val();
						
						
						$(".tdUserName").html(userName);
						$(".tdUserPhone").html(userHp);
						
					
						if(ev.ordertype == "P"){
							$(".ordertype").html("방문포장 주문하기");
							$(".chainType").text("방문매장");
						}else{
							$(".ordertype").html("배달 주문하기");
							$(".chainType").text("배달매장");
							$(".txt_address").parent().parent().show();
							$(".txt_address").html('<span class="font_space">'+ ev.fulladdr +'</span><a href="/order/deliver_popup_post?part=3" class="btn gray" style="margin-left:21px">배송지변경</a>');
						}
					}
					
					$(".chainInfo").append(html);
					
				}else{
					html ='';
					$(".chainInfo").append(html);
				}
			}
		});
	},
	PackingOrderStep01 : function(){
		console.log("주문 프로세스 확인중입니다. ");
		var totAmt = $(".totAmt");
		
		var isAmt = true;
		
		if (CNTApi.getCartId() != 0) {
			CNTApi.log("cartInfo");
			var param = [];
			param.push('ex=Order');
			param.push('ac=selectCartInfo');
			param.push('cartid=' + CNTApi.getCartId());

			var self = this;
			$.ajax({
				type : 'get',
				url : "/api.do",
				data : param.join('&'),
				dataType : 'text',
				contentType : 'application/json; charset=UTF-8',
				error : function() {
					// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				},
				success : function(data) {
					var tot_tp_price = 0;
					var ev = JSON.parse(data);
					
					if(ev[0].ordertype  == "D" && parseInt(totAmt.html().replace("원","").replace(/,/g,"")) < 15000 ){
						alert("15,000원 이상부터 배달주문 가능합니다.");
						isAmt = false;
						return;
					}
					
					var reciptTel = "";
					
					if($("#reciptName").val().replace(/,/g, "") == "" ){
						alert("주문 고객님명이 정확하지 않습니다.");
						return;
					}
					
					if( $("#packTel").val().replace(/,/g, "") == "" ){
						alert("주문 고객님의 핸드폰번호가 정확하지 않습니다.");
						return;
					}
					
					reciptTel = $("#packTel").val().replace(/,/g, "");
					
					var DIRECTION = $('#DIRECTION').val();
					
					if (typeof DIRECTION == 'undefined' || DIRECTION == null) {
						DIRECTION = '';
					}

					var param = [];
					param.push("ex=Order");
					param.push("ac=PackingOrderStep01");
					param.push("RECIPTTEL="+ reciptTel);
					param.push("RECIPTNAME="+encodeURI($("#reciptName").val()));
					param.push("DIRECTION="+encodeURI(DIRECTION));
					param.push("cartid="+CNTApi.getCartId());
					
					if( CNTApi.getCartId() == "0" ){ alert("카트 정보가 없습니다."); window.history.back(-1); }

					var self = this;
					$.ajax({
						type: 'get',
						url : "/api.do",
						data : param.join('&'),
						dataType : 'jsonp',
						async:false,
						success: function(data){
							if(data[0].result == 1){
								location.href="/order/packing/payment";
							} else {
								alert(data[0].msg);
							}
						},
						error:function(){
							console.log("error");
						}
					});
				}
			});
		}
		else{
			alert("장바구니 정보가 없습니다. 다시 하시하세요.");
			return;
		}
	},
	/**주문 처리**/
	completeOrder : function() {
		//apiutil.log("==completeOrder");
		
		
		var param = [];
		param.push("ex=Order");
		param.push("ac=completeorder");
		param.push("cartid=" + CNTApi.getCartId());


		var self = this;
		$.ajax({
			type: 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'jsonp',
			async:false,
			error:function(){
				self.nowUpdate = false;
				alert('에러:데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				self.nowUpdate = false;
				if (data != null) {
					//apiutil.log(data);
					if (typeof data[0].result !== "undefiend") {
						
						CNTApi.setCompleteId(data[0].masterseq);
						
						if (data[0].result == 1) {
							alert("주문 처리가 완료되었습니다.");
							location.href="/order/packing/order_end";
						} else {
							alert(data[0].message);
						}
					} else {
						alert("주문 처리 오류 ");
					}
				}
			}
		});
	},

	
	updateOrderData22 : function() {
		//apiutil.log("updateOrderData");
		this.nowUpdate = true;
		var orderdate = null;
		var ordertime = null;
		var ordertype = null;
		var cartid = CNTApi.getCartId();
		
		var addAddrString = ''
		var paycode = null;
		
		var paytype = "BCARD";
		paycode = "03";
		//var addDirectionStr = '[선결제카드]';

		var cardseq = null;
		var cardamount = 0;
		var cashamount = 0;
		var couponamount = 0;
		if (paytype == "BCARD") {
			cardamount = 0;
		}

		var orderexefrm = document.orderexefrm;
		orderexefrm.cartid.value = cartid;
		orderexefrm.ordertype.value = "P";
		orderexefrm.orderdate.value = orderdate;
		orderexefrm.ordertime.value = ordertime;
		orderexefrm.paytype.value = paytype;
		orderexefrm.paycode.value = paycode;
		orderexefrm.cardseq.value = "0";
		orderexefrm.cardamount.value = cardamount;
		orderexefrm.cashamount.value = cashamount;
		//orderexefrm.direction.value = addDirectionStr;
		
		
		var self = this;
		//var sandForm = formEncript($('#orderexefrm'));
		
		$.post("/api.do", $('#orderexefrm').serialize(), function(data) {
			//apiutil.log(data);
			if (data != null) {
				try {
					self.nowUpdate = false;
					if (typeof data[0].result !== "undefiend") {
						if (data[0].result == 1) {
							if (paytype == "BCARD") {
								self.completeOrder();
							} else {
								self.completeOrder();
							}
						} else {
							alert(data[0].message);
						}
					} else {
						alert("주문 처리 응답이 없습니다 !");
					}
				} catch (e) {
					self.nowUpdate = false;
					alert(e);
				}
			}
		}, 'jsonp');

	},
	updateOrderData : function() {
		
		if(!$(":radio[name='category']").parents("div.radio_box").hasClass("on")){
			alert("결제방법을 선택해주세요.");
			return false;
		}
		
		if(!$('.card_list').hasClass("hide") && $("select#card_list").find("option:selected").val() == ""){
			alert("카드사를 선택해주세요.");
			return false;
		}
		
		if(!$(":checkbox[id='form-saveid']").parents("label.custom-chkbox").find("span.checkbox").hasClass("checked")){
			alert("주문동의에 체크해주세요.");
			return false;
		}
		
		//매장 상태 체크
		if( CNTApi.getStoreInfo(CNTApi.getStoreId()) ){
			if(CNTApi.setStoreInfo()) {
				if(StoreInfo.store_del_mk == "L"){
					var retmsg = CNTApi.checkPosStore();
					console.log("매장상태는:"+retmsg);
					if(retmsg != "1") {
						alert(retmsg);
						return;
					}
				}else{
					alert("본주문이 불가한 매장입니다.");
					return;
				}
			} else {
				alert("매장정보 설정 중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
				return;
			}
		} else {
			alert("매장정보 설정중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
			return;
		}

		//메뉴 결품 체크
		var isMenu = true;
		
		var param = [];
		param.push("ex=Order");
		param.push("ac=getvposstorecmdtlocal");
		param.push("cartid="+CNTApi.getCartId());

		var self = this;
		$.ajax({
			type: 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'jsonp',
			async:false,
			error:function(){
				console.log("error");
				isMenu = false;
			},
			success: function(data){
				//console.log(data);
				if(data[0].result == "0"){
					isMenu = false;
					alert("선택하신 메뉴 중 " + data[0].message + "은(는) 현재 해당 매장에서 주문하실 수 없습니다.");
					location.href = "/order/packing/order";
					return;
				}
			}
		});
		
		if( !isMenu ){
			return;
		}
		
		/*
		 * 현금 영수증 관련 내용
		 */
		var cashRecpyn = "N";
		var tr_code = "";
		var id_info = "";
		
		if(!$("#mod_com_list").hasClass('hide')){
			cashRecpyn = "Y";
			var num = "";
			if($(".persnal").hasClass('on')){
				
				num += $("#txtphnnum1").val().replace(/,/g, "");
				
				if(($("#txtphnnum2").val().replace(/,/g, "") == "") || ($("#txtphnnum3").val().replace(/,/g, "") == "")){
					alert("전화 번호를 정확히 입력하세요");
					return;
				}
				if(($("#txtphnnum3").val().replace(/,/g, "").length < 3) || ($("#txtphnnum3").val().replace(/,/g, "").length != 4)){
					alert("전화 번호를 정확히 입력하세요");
					return;
				}
				
				num += $("#txtphnnum2").val().replace(/,/g, "");
				num += $("#txtphnnum3").val().replace(/,/g, "");
				
				id_info = num;
				
				tr_code = "0";
			}
			else{
				
				if(($("#txtcompnum1").val().replace(/,/g, "") == "") || ($("#txtcompnum2").val().replace(/,/g, "") == "") || ($("#txtcompnum3").val().replace(/,/g, "") == "")){
					alert("사업자 번호를 정확히 입력하세요");
					return;
				}
				if(($("#txtcompnum1").val().replace(/,/g, "").length != 3) || ($("#txtcompnum2").val().replace(/,/g, "").length != 2) || ($("#txtcompnum3").val().replace(/,/g, "")).length != 5){
					alert("사업자 번호를 정확히 입력하세요");
					return;
				}
				num += $("#txtcompnum1").val().replace(/,/g, "");
				num += $("#txtcompnum2").val().replace(/,/g, "");
				num += $("#txtcompnum3").val().replace(/,/g, "");
				
				tr_code = "1";
				
				id_info = num;
			}
		}
		
		//apiutil.log("updateOrderData");
		this.nowUpdate = true;
		var orderdate = null;
		var ordertime = null;
		var ordertype = null;
		var cartid = CNTApi.getCartId();
		
		var addAddrString = ''
		var paycode = null;
		
		var paytype = "";
		//var addDirectionStr = '[선결제]';

		var cardseq = null;
		var cardamount = 0;
		var cashamount = 0;
		var pointamount = 0;
		var couponamount = 0;
		
		var pointamount = $("#totalpointprice").text().replace(/,/g, "");
		
		paytype = $("div.radio_box.on").find(":radio[name='category']").val();
		paycode = $("select#card_list").find("option:selected").val();
		
		if(parseInt($("#totalpayamount").text().replace(/,/g, "")) > 0 && parseInt($("#totalpayamount").text().replace(/,/g, "")) < 1000){
			alert("포인트 사용시 총 결제금액이 0원이 아니면 최소 결제금액은 1,000원 이상이어야 합니다.");
			return;
		}
		
		//포인트 전액 결제 추가
		if (parseInt($("#totalpayamount").text().replace(/,/g, "")) == 0 ){
			paytype = "point";
			paycode = "";
		}

		var orderexefrm = document.orderexefrm;
		orderexefrm.cartid.value = cartid;
		orderexefrm.orderdate.value = orderdate;
		orderexefrm.ordertime.value = ordertime;
		orderexefrm.paytype.value = paytype;
		orderexefrm.paycode.value = paycode;
		orderexefrm.cardseq.value = "0";
		orderexefrm.cardamount.value = cardamount;
		orderexefrm.cashamount.value = cashamount;
		orderexefrm.pointamount.value = pointamount;
		//orderexefrm.direction.value = addDirectionStr;
		
		orderexefrm.cashrecpt_yn.value = cashRecpyn;
		orderexefrm.userflag.value = tr_code;
		orderexefrm.idnum.value = id_info;
		
		var self = this;
		
		$.post("/api.do", $('#orderexefrm').serialize(), function(data) {
			//apiutil.log(data);
			if (data != null) {
				try {
					self.nowUpdate = false;
					if (typeof data[0] !== "undefiend") {
						if (data[0].result == 0) {
							alert(data[0].message);
						}else{
							//포인트 전액 결제 추가
							if (data[0].totpayamount == 0 && parseInt( pointamount ) > 0){
								self.completeOrder();
								return;
							}
							
							var $frm = $("form#kcpForm");
							
							$frm.find("input#pay_type").val($("div.radio_box.on").find(":radio[name='category']").val());
//							$frm.find("input#coupon_price").val($("#totalcouponprice").text().replace(/,/g, ""));
							$frm.find("input#point_price").val($("#totalpointprice").text().replace(/,/g, ""));
//							$frm.find("input#giftcard_price").val($("#giftcard_price").text().replace(/,/g, ""));
							$frm.find("input#total_pay_amount").val($("#totalpayamount").text().replace(/,/g, ""));
							$frm.find("input#card_cd").val($("select#card_list").find("option:selected").val());
							
							$frm.find("input#cart_id").val(data[0].cartid);
							$frm.find("input#good_name").val(data[0].detailname);
							$frm.find("input#good_mny").val(data[0].totpayamount);
							$frm.find("input#buyr_name").val(data[0].username);
							$frm.find("input#buyr_mail").val("");
							//$frm.find("input#buyr_mail").val(UserInfo.user_email);
							$frm.find("input#buyr_tel1").val(data[0].usertel);
							$frm.find("input#buyr_tel2").val(data[0].usertel);
							
//							window.open("", "popup_kcp", "width=1000, height=800, scrollbars=no");
							
							if(!$('.card_list').hasClass("hide") && $("select#card_list").find("option:selected").val() != ""){
								$frm.attr("action", "/order/kcp/smarthub/packing/order_pay");
							}else{
								$frm.attr("action", "/order/kcp/packing/order_mobile");
							}
							
							$frm.submit();
						}
					} else {
						alert("주문 처리 응답이 없습니다 !");
					}
				} catch (e) {
					self.nowUpdate = false;
					alert(e);
				}
			}
		}, 'jsonp');

	},
	loadPackOrder : function() {

		console.log(CNTApi.getCompleteId());
		if (CNTApi.getCompleteId() != 0) {
			CNTApi.log("loadCart");
			var param = [];
			param.push('ex=Order');
			param.push('ac=PackingComplete');
			param.push('masterseq=' + CNTApi.getCompleteId());
			//param.push('userseq=' + '');
			
			
			var self = this;
			$.ajax({
				type : 'get',
				url : "/api.do",
				data : param.join('&'),
				dataType : 'text',
				contentType : 'application/json; charset=UTF-8',
				error : function() {
					// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				},
				success : function(data) {
					self.paintPackOrder(data);
				}
			});
		} else {
			alert("올바른 접근이 아닙니다.");
		}
	},
	//order_end/
	paintPackOrder : function(data) {
		var ev = JSON.parse(data);
		//console.log(ev);
		$(".contentList1").empty();
		$(".contentsList2").empty();
		
		var htmlCont1 = "";
		var htmlCont2 = "";
		var tot_tp_price = 0;
		
		$("#orderId").html();
		$("#orderDate").html();
		$(".tdStore").html();
		$(".tdRecpInfo").html();
		$("#orderName").html();
		$("#orderTel").html();
		$(".totAmout").html();
		
		if(ev[0].ordertype == "P"){
			$("#order_type_info").text("매장정보");
			$("#packing_info").show();
			$("#order_type").html("");
			$("#order_type").append("<span class='color_green'>방문포장주문이 완료되었습니다.</span><br/>예약하신 시간에 맞추어 매장을 방문하여 수령해주시기 바랍니다.");
			$(".ordertype").empty();
			$(".ordertype").html("방문포장");
		}else{
			$("#order_type_info").text("배송정보");
			$("#delivery_info").show();
			$("#order_type").html("");
			$("#order_type").append("<span class='color_green'>배달주문이 완료되었습니다.</span><br>주문하신 음식을 정성껏 준비하여 빠른 시간 안에 배달하겠습니다.");
			$(".ordertype").empty();
			$(".ordertype").html("배달주문");
			$(".tdAddress").text(ev[0].addrdetail+" "+ev[0].addrtext);
		}
		

		if (ev[0].ordertype == 'R') {
			
			var orderDirection =  ev[0].direction;
			$(".tdDirection").html('<span>'+orderDirection.replace(/\n/g,'<br/>')+'</span>');
		}
		

		
		for (var i = 0; i < ev.length; i++) {
			var topping_price = 0;
			htmlCont1 += "<tr>";
			htmlCont1 += "<td><strong class='tit'>"+ev[i].detailname;
			if(ev[i].op1val2 != null && ev[i].op1val2 != ""){
				$.each(JSON.parse(ev[i].op1val2), function(k,v){
					htmlCont1 += "("+v.packing_name+")"
				});
			}
			if(ev[i].op1val1 != null && ev[i].op1val1 != ""){
				$.each(JSON.parse(ev[i].op1val1), function(k,v){
					htmlCont1 += "<br/>&nbsp;&nbsp;-&nbsp;&nbsp;"+v.topping_name+"<em class='font_space color_orange'> "+v.count+" </em>"
					topping_price += (Number(v.count) * Number(v.price));
				});
				tot_tp_price +=Number(topping_price);
			}
			htmlCont1 += "</strong></td><td><p class='text-right font_space'>"+numberWithCommas(ev[i].pdcnt)+"개</p></td>";
			htmlCont1 += "<td><p class='text-right f_orange font_space f30'>"+numberWithCommas(Number(ev[i].orderamount)+Number(topping_price))+"원</p></td>";
			//htmlCont1 += "<td><p class='txt_right font_space'>"+numberWithCommas(Number(ev[i].pdcnt) * (Number(ev[i].orderamount)+Number(topping_price)))+"원</p></td>";
			htmlCont1 += "</tr>";
				
			if (i == 0) {
				
				$("#orderId").html(ev[i].masterseq);
				$("#orderDate").html("("+ CNTApi.getDateFormat( ev[i].orderdate ) + ")");
				$(".tdStore").html( ev[i].chainname + "<span class='font_space'>(" + CNTApi.autoHypenPhone( ev[i].tel1) + ")</span>" + ev[i].addr1 +" "+ ev[i].addr2);
				$(".tdRecpInfo").html(ev[i].reciptname + " / <span class='font_space'>"+CNTApi.autoHypenPhone(ev[i].recipttel)+"</span>");
				$("#orderName").html(ev[i].username);
				$("#orderTel").html(CNTApi.autoHypenPhone(ev[i].usertel));
				
				$(".totAmout").html(numberWithCommas(Number(ev[i].totorderamount)) + "원");
				
				var paytype = "신용카드";
				if(ev[i].paytype == "card")
					paytype = "신용카드";
				else if(ev[i].paytype == "phone")
					paytype = "휴대폰";
				else if(ev[i].paytype == "payco")
					paytype = "페이코";
				else if(ev[i].paytype == "transfer")
					paytype = "계좌이체";
				else if(ev[i].paytype == "point")
					paytype = "포인트";
				
				$(".totOrderamount").text(numberWithCommas(Number(ev[i].totorderamount)) + "원");
				$(".usepointamount").text(numberWithCommas(Number(ev[i].pointamount)) + "원");
				$(".paytype").text(paytype);
				$(".totPayamount").text(numberWithCommas(Number(ev[i].totpayamount)) + "원");
				$(".addpointamount").text(numberWithCommas(Number(ev[i].sp_pnt_add)) + "P");
				
				if (ev[i].ordertype == 'R') {
					var orderDirection =  ev[i].direction;
					$(".tdDirection").html(orderDirection.replace(/\n/g,'<br/>'));
					
					$("#deliveryAddress").show();
					$(".tdDeliveryAddress").html(ev[i].addrdetail+' '+ev[i].addrtext);
				}
				
			}
		}
		
		$(".contentList1").append(htmlCont1);

		
		CNTApi.setCartId(0);
	},
	orderReset : function() {
		//CNTApi.setCartId(0);
		location.href="/order/menu?part="+CNTApi.menuSelectPage();
	},
	orderReset2 : function() {
		if(confirm("장바구니가 초기화 됩니다. 계속 하시겠습니까?")){
			CNTApi.setCartId(0);
			location.href="/order/main";
		}
	},
	myOrderList : function(seq) {

		var param = [];
		param.push('ex=Order');
		param.push('ac=myOrderList');
		param.push('userseq=' + seq);
		
		
		if( seq == 0 ){
			alert("료그인 후 확인 하세요.");
			location.href="/login";
			return;
		}

		var contentList = $(".contentList");
		contentList.empty();
		
		var strhtml ="";
		
		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'text',
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				var ev = JSON.parse(data);
				
				if( ev == null || ev.length == 0 )
				{
					contentList.append("<tr><td colspan='6' style='height:300px'><p class='error_text'>이번달 주문 내역이 없습니다.</p></td></tr>");
				}
				else if( ev != null && ev.length > 0){
					for(i = 0; i < ev.length; i++){
						var status = CNTApi.getOrderStatusStr(ev[i].orderstatus,ev[i].ordertype);
						
						strhtml += "	<tr> ";
						strhtml += "		<td><input type='checkbox' id='chk_"+ i +"' name='reorders' value='"+ev[i].cartid+"'></td>";
						strhtml += "		<td><span class='font_space'>"+ CNTApi.getDateFormat(ev[i].orderdate) +"</span></td>";
						strhtml += "		<td><a href='/mypage/order_list' class='font_space'>"+ev[i].masterseq+"</a></td>";
						strhtml += "		<td><span class='font_space'>"+numberWithCommas(ev[i].totorderamount)+"원</span></td>";
						strhtml += "		<td>"+ev[i].chainname+"</td>";
						strhtml += "		<td>"+status+"</td>";
						strhtml += "	</tr>"
							
							
					}
					strhtml += "<tr>";
					strhtml += "<td colspan='6'><a href='javascript:order.checkReOrder()' class='btn od_status re_order'>재주문하기</a></td>";
					strhtml += "</tr>";
					
					contentList.append(strhtml);
				}
			}
		});
	},
	//mypage/order_packing List
	loadPackOrder2 : function() {

		console.log(CNTApi.getCompleteId());
		if (CNTApi.getCompleteId() != 0) {
			CNTApi.log("loadCart");
			var param = [];
			param.push('ex=Order');
			param.push('ac=PackingComplete');
			param.push('masterseq=' + CNTApi.getCompleteId());
			//param.push('userseq=' + '');
			
			
			var self = this;
			$.ajax({
				type : 'get',
				url : "/api.do",
				data : param.join('&'),
				dataType : 'text',
				contentType : 'application/json; charset=UTF-8',
				error : function() {
					// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				},
				success : function(data) {
					var tot_tp_price = 0;
					var ev = JSON.parse(data);
					
					$(".contentList1").empty();
					
					var htmlCont1 = "";
					
					$("#orderId").html();
					$(".tdStore").html();
					$(".tdRecpInfo").html();
					$(".tdRecpInfo2").html();
					$(".totAmout").html();
					$(".orderDt").html();
					
					if(ev[0].ordertype == "P"){
						$("#order_type_txt").text("방문매장");
					}else{
						$("#order_type_txt").text("배달매장");
					}
					
					var cartid = "";
					
					for (var i = 0; i < ev.length; i++) {
						var topping_price = 0;
						htmlCont1 += "<tr>";
						htmlCont1 += "<th scope='row' class='text-left'><span>"+ev[i].detailname+""
						if(ev[i].op1val2 != null && ev[i].op1val2 != ""){
							$.each(JSON.parse(ev[i].op1val2), function(k,v){
								htmlCont1 += "&nbsp;&nbsp;("+v.packing_name+")"
							});
						}
						if(ev[i].op1val1 != null && ev[i].op1val1 != ""){
							$.each(JSON.parse(ev[i].op1val1), function(k,v){
								htmlCont1 += v.topping_name+ v.count;
								topping_price += (Number(v.count) * Number(v.price));
								tot_tp_price +=(Number(ev[i].pdcnt) * Number(topping_price));
							});
						}
						htmlCont1 += "</span></th>";
						htmlCont1 += "<td class='text-center'><span class='font_space'>"+numberWithCommas(ev[i].pdcnt)+"</span></td>";
						htmlCont1 += "<td class='text-right'>"+numberWithCommas(Number(ev[i].orderamount) + Number(topping_price))+"원</td>";
						//htmlCont1 += "<td class='text-right'><p class='txt_right font_space'>"+numberWithCommas(Number(ev[i].pdcnt) * (Number(ev[i].orderamount) + Number(topping_price)))+"원</p></td>";
						htmlCont1 += "</tr>";
						
						if (i == 0) {
							cartid = ev[i].cartid;
							
							$("#orderId").html(ev[i].masterseq);
							$(".tdStore").html( ev[i].chainname + "<span class='font_space'>(" + CNTApi.autoHypenPhone( ev[i].tel1) + ")</span>" + ev[i].addr1 +" "+ ev[i].addr2);
							$(".tdRecpInfo").html(ev[i].reciptname);
							$(".tdRecpInfo2").html(CNTApi.autoHypenPhone(ev[i].recipttel));
							$(".orderDt").html(CNTApi.getDateFormat(ev[i].orderdate) + " " +  CNTApi.getTimeFormat(ev[i].ordertime) );
							
							$(".totAmout").html(numberWithCommas(Number(ev[i].totorderamount)) + "원");
							$(".totpayAmout").html(numberWithCommas(Number(ev[i].totpayamount)) + "원");
							$(".pointprice").html(numberWithCommas(Number(ev[i].pointamount)) + "원");
							$(".couponprice").html(numberWithCommas(0) + "원");
							
							$(".disprice").html(numberWithCommas(Number(ev[i].pointamount)) + "원");
							$(".addpointprice").html(numberWithCommas(Number(ev[i].sp_pnt_add)) + "P");
							
							
							var status = CNTApi.getOrderStatusStr3(ev[i].orderstatus,ev[i].ordertype);
							
							$(".od_status").html(status);
							
							var paytype = "(신용카드)";
							if(ev[i].paytype == "card")
								paytype = "(신용카드)";
							else if(ev[i].paytype == "phone")
								paytype = "(휴대폰)";
							else if(ev[i].paytype == "payco")
								paytype = "(페이코)";
							else if(ev[i].paytype == "transfer")
								paytype = "(계좌이체)";
							else if(ev[i].paytype == "point")
								paytype = "(포인트)";
							$(".paytype").html(paytype);
							
							if (ev[i].ordertype == 'R') {
								
								var orderDirection =  ev[i].direction;
								$(".tdDirection").html('<span>'+orderDirection.replace(/\n/g,'<br/>')+'</span>');
								
								$("#deliveryAddress").show();
								$(".tdDeliveryAddress").html('<span>'+ev[i].addrdetail+' '+ev[i].addrtext+'</span>');
							}
							
						}
					}
					
					$(".contentList1").append(htmlCont1);
					
					if( cartid != "" ){
						$(".btnReorder").bind("click", function(){
							if (order.isChcekedStore(cartid)) {
								order.checkReOrder2(cartid);
							}
						});
					}
				}
			});
		} else {
			alert("올바른 접근이 아닙니다.");
		}
	},
	cartInfo : function() {
		console.log(CNTApi.getCartId());
		if (CNTApi.getCartId() != 0) {
			CNTApi.log("cartInfo");
			var param = [];
			param.push('ex=Order');
			param.push('ac=selectCartInfo');
			param.push('cartid=' + CNTApi.getCartId());

			var self = this;
			$.ajax({
				type : 'get',
				url : "/api.do",
				data : param.join('&'),
				dataType : 'text',
				contentType : 'application/json; charset=UTF-8',
				error : function() {
					// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				},
				success : function(data) {
					var tot_tp_price = 0;
					var ev = JSON.parse(data);
					$(".ordertype").empty();
					var ordertype = (ev[0].ordertype == "P")?"방문포장":"배달주문";
					$(".ordertype").html(ordertype);
				}
			});
		}
	},
	registCardNo : function(c_no) {
		//포인트 카드 등록
		CNTApi.getUserInfo();
		
		CNTApi.log("registCardNo");
		var param = [];
		param.push('ex=Order');
		param.push('ac=registCardNo');
		param.push('userid=' + UserInfo.user_id);
		param.push('cardno=' + c_no);

		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'text',
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				return false;
			},
			success : function(data) {
				if( data == null){
					alert("등록 중 오류가 발생했습니다. 다시 시도하세요.");
					return false;
				}
				var ev = JSON.parse(data);
				
				if (ev[0].result == "0") {
					alert(ev[0].message);
					return false;
				}
				
				alert("등록 되었습니다.");
				
				$(".btnPointPop").addClass('hide');
				$('#pop_point_card').hide();
				
				return true;
			}
		});
	},
	registMobileCard : function() {
		//모바일 카드 등록
		CNTApi.getUserInfo();
		
		CNTApi.log("registMobileCard");
		var param = [];
		param.push('ex=Order');
		param.push('ac=registMobileCard');
		param.push('userid=' + UserInfo.user_id);

		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'text',
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				return false;
			},
			success : function(data) {
				if( data == null){
					alert("등록 중 오류가 발생했습니다. 다시 시도하세요.");
					return false;
				}
				var ev = JSON.parse(data);

				if (ev[0].result == "0") {
					alert(ev[0].message);
					return false;
				}
				
				alert("발급 되었습니다.");
				
				$(".btnPointPop").addClass('hide');
				$('#pop_point_card').hide();
				return true;
			}
		});
	},
	checkReOrder : function() {
		CNTApi.setCartId(0);
		CNTApi.setStoreId(0);
		
		var cnt = 0;
		$("input[name=reorders]:checked").each(function() {
			cnt ++;
		});
		
		if( cnt == 0 ){
			alert("재주문할 주문 건을 선택하세요.");
			return false;
		}
		
		if( cnt > 1 ){
			alert("재주문은 1건씩만 가능합니다.");
			return false;
		}
		
		if(!confirm("선택하신 주문내역으로 재주문하시겠습니까?")){
			return false;
		}
		
		var cartid = 0;
		
		$("input[name=reorders]:checked").each(function() {
			cartid = $(this).val();
			console.log(cartid);
		});
		
		if (!order.isChcekedStore(cartid)) {
			return false;
		}
		
		CNTApi.log("reOrder");
		var param = [];
		param.push('ex=Order');
		param.push('ac=reOrder');
		param.push('cartid=' + cartid);

		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'text',
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				return false;
			},
			success : function(data) {
				if( data == null){
					alert("등록 중 오류가 발생했습니다. 다시 시도하세요.");
					return false;
				}
				var ev = JSON.parse(data);

				if (ev[0].result == "1") {
					alert(ev[0].message);
					return false;
				}
				
				if (ev[0].result == "2") {
					alert(ev[0].message);
					CNTApi.setCartId(ev[0].cartid);
					CNTApi.setStoreId(ev[0].storeid);
					
					if ("R" == ev[0].ordertype) {
						CNTApi.setMyAddrSeq(ev[0].addrcode);
					}
					location.href="/order/order";
					return true;
				}
				
				if (ev[0].result == "0") {
					CNTApi.setCartId(ev[0].cartid);
					CNTApi.setStoreId(ev[0].storeid);
					
					if ("R" == ev[0].ordertype) {
						CNTApi.setMyAddrSeq(ev[0].addrcode);
					}
					location.href="/order/order";
					return true;
				}
				return true;
			}
		});
	},
	checkReOrder2 : function(cartid) {
		if(!confirm("선택하신 주문내역으로 재주문하시겠습니까?")){
			return false;
		}
		
		CNTApi.setCartId(0);
		CNTApi.setStoreId(0);

		CNTApi.log("reOrder2");
		var param = [];
		param.push('ex=Order');
		param.push('ac=reOrder');
		param.push('cartid=' + cartid);

		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'text',
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				alert('에러:주문 데이터 송수신에 문제가 있습니다.');
				return false;
			},
			success : function(data) {
				if( data == null){
					alert("등록 중 오류가 발생했습니다. 다시 시도하세요.");
					return false;
				}
				var ev = JSON.parse(data);

				if (ev[0].result == "1") {
					alert(ev[0].message);
					return false;
				}
				
				if (ev[0].result == "2") {
					alert(ev[0].message);
					CNTApi.setCartId(ev[0].cartid);
					CNTApi.setStoreId(ev[0].storeid);
					
					if ("R" == ev[0].ordertype) {
						CNTApi.setMyAddrSeq(ev[0].addrcode);
					}
				
					location.href="/order/order";
					return true;
				}
				
				if (ev[0].result == "0") {
					CNTApi.setCartId(ev[0].cartid);
					CNTApi.setStoreId(ev[0].storeid);
					
					if ("R" == ev[0].ordertype) {
						CNTApi.setMyAddrSeq(ev[0].addrcode);
					}
					
					location.href="/order/order";
					return true;
				}
				return true;
			}
		});
	},
	myOrderList : function(tabseq, page){

		for(i = 1; i < 5; i++){
			$("#contentList" +i).empty();
			$("#totCount" +i).empty();
			$("#paging" +i).empty();
		}
		
		var cont = $("#contentList" + tabseq);
		var count = $("#totCount" + tabseq);
		var pageing = $("#paging" + tabseq);
		
		
		var thispage = page;
		
		var rowCnt = 5;
		var totPage = 0;
		
		var param = [];
		param.push("ex=Order");
		param.push("ac=myOrderListbyPaging");
		param.push('size=' + rowCnt);
		param.push('offset=' +  (thispage-1) * rowCnt);
		param.push('userseq='+UserInfo.user_no);
		//param.push('userseq=563682');
		
		param.push('orderflag='+ tabseq);
		
		
		
		if( tabseq == 4 ){
			var from = $("#txtfrom").val().replace(/,/g, "");
			var to = $("#txtto").val().replace(/,/g, "");
			
			var startDate = from;
	        var startDateArr = startDate.split('-');
	         
	        var endDate = to;
	        var endDateArr = endDate.split('-');
	                 
	        var startDateCompare = new Date(startDateArr[0], startDateArr[1], startDateArr[2]);
	        var endDateCompare = new Date(endDateArr[0], endDateArr[1], endDateArr[2]);
	         
	        if(startDateCompare.getTime() > endDateCompare.getTime()) {
	            alert("시작날짜와 종료날짜를 확인해 주세요.");
	            return;
	        }
			
			param.push('orderfrom='+ from);
			param.push('orderto='+ to);
		}
		
		//alert(CNTApi.getCartId());
		
		//if( CNTApi.getCartId() == "0" ){ alert("카트 정보가 없습니다."); window.history.back(-1); }

		var self = this;
		$.ajax({
			type: 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'jsonp',
			async:false,
			error:function(){
				console.log("error");
			},
			success: function(data){

				console.log("myOrderList");
				var html = "";
				if(data != null){
					var evs = data;
					for (var i = 0; i < evs.length; i++){
						var ev = evs[i];
						
						if( i == 0){
							count.html("총 " + numberWithCommas(ev.tot_cnt) + "건");
							totPage = (ev.tot_cnt % rowCnt == 0)?parseInt(ev.tot_cnt/rowCnt) : parseInt(ev.tot_cnt/rowCnt) + 1;
						}
						
						var status = CNTApi.getOrderStatusStr3(ev.orderstatus, ev.ordertype);
						
							html +='<tr>'
								 + '<td class="text-center">'
								 + '<label for="form-saveid" class="custom-chkbox middle">'
								 + '<input type="checkbox" id="chk_'+ i +'" name="reorders" value="'+ev.cartid+'">'
								 + '<span class="checkbox ml0"></span>'
								 + '</label></td>'
								 + '<td class="text-center"><span class="font_space">'+ CNTApi.getDateFormat( ev.orderdate ) +'</span></td>'
								 + '<td class="text-center"><a href="javascript:void(0)" class="font_space f_green" onclick=order.gourl("/mypage/myorderdetail",' + ev.masterseq + ') >' + ev.masterseq +  '</a></td>'
								 + '<td class="text-center">'+status+'</td>'
								 + '</tr>';
					}
					
					cont.html(html);
					
					var nextPage = (page == totPage) ? page : parseInt(page + 1);
					var pravPage = (page <= 1)? 1 : parseInt(page - 1);
					
					
					
					
					var pageHtml = "";
					pageHtml += '<span class="paging-count"><strong>'+page+'</strong> / '+totPage+'</span>'
						     +  '<a class="prev" href="javascript:void(0)" onclick="order.myOrderList('+ tabseq +', '+pravPage+')"></a>'
						     +  '<a class="next" href="javascript:void(0)" onclick="order.myOrderList('+ tabseq +', '+nextPage+')"></a>';
								
					pageing.html(pageHtml);
					
					  $('.custom-chkbox').unbind("click").bind("click", function(e){
						  e.preventDefault();
						  toggleChkbox($(this));
					  });

				}else{
					html +='<tr class="nolist">'
						+'<td colspan="3"><p>주문표에 담긴 <br>메뉴가 없습니다.</p></td>'
						+'</tr>';
					$("#contentList" +tabseq).append(html);
				}
			}
		});
	},
	gourl : function(url,seq) {
		console.log('gourl'+seq);
		CNTApi.setCompleteId(seq);
		
		location.href = url;
	},
	isChcekedStore : function (cartid) {
		
		// 이 함수는 주문중 본라이더 일경우 체크를 위한 함수임
		// 해당 Bean을 분석해보면 본라이더일경우를 제외한 나머지 주문 타입은 무조건 성공 임
		
		var deliveryParam = [];
		deliveryParam.push('ex=Delivery');
		deliveryParam.push('ac=isChcekedStore');
		deliveryParam.push('cartid=' + cartid);
		
		var isContinue = false;

		$.ajax({
			type : 'get',
			url : "/api.do",
			data : deliveryParam.join('&'),
			dataType : 'json',
			async:false,
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				console.log(data);
				if ("SUCCESS" == data.result) {
					isContinue = true; 
				}
			}
		});
		
		if (!isContinue) {
			alert("재주문에 실패 했습니다.");			
		}
		
		return isContinue;
	},
	selectDoMyCouponList : function(){
		CNTApi.log("selectDoMyCouponList");
		
		CNTApi.getUserInfo();
		
		var userseq = UserInfo.user_no;
		
		if( userseq == 0 ){
			alert("로그인 후 확인 하세요.");
			location.href="/login";
			return;
		}
		
		var getCouponList = $(".getCouponList");
		getCouponList.empty();
		
		var param = [];
		param.push('ex=Coupon');
		param.push("ac=selectDoMyCouponList");
		param.push('userseq=' + userseq);
		CNTApi.log(param.join('&'));
		var strhtml ="";
		
		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'text',
			contentType : 'application/json; charset=UTF-8',
			error:function(jqXHR, textStatus, errorThrown){
				CNTApi.log(jqXHR);
			},
			success: function(data){
				CNTApi.log("result");
				CNTApi.log(data);
				
				if(data == null){
					alert("데이터 조회가 정상적이지 않습니다. 다시 시도해주세요.");
					return;
				}
				var cnt = 0;
				
				CNTApi.log(data.length);
				var ev = JSON.parse(data);
				
				if( ev == null || ev.length == 0 )
				{
					alert("등록된 쿠폰이 없습니다");
					return;
				}
				
				if(ev.result == "0"){
					alert(ev.message);
					return;
				}

				if( ev != null && ev.length > 0){
					for(i = 0; i < ev.length; i++){
						
						if( ev[i].msg_subject != ""){
							strhtml += '<li>';
							strhtml += '	<p class="radio_box">';
							strhtml += '		<input type="radio" name="couponradio" id="couponradio'+i+'" checked="checked" class="input_check" value="'+ev[i].dc_amt+'|'+ev[i].dc_type_cd+'">';
							strhtml += '		<span class="fake"></span>';
							var range = "원";
							if( ev[i].dc_type_cd == "02")
								range = "%";
	
							strhtml += '		<label for="couponradio" class="check"><strong class="font_space">'+numberWithCommas(Number(ev[i].dc_amt)) + range +'  할인</strong> - '+ ev[i].msg_subject +'</label>';
							strhtml += '	</p>';
							strhtml += '</li>';
							
							cnt++;
						}
						
					}
					getCouponList.append(strhtml);
					if( cnt == 0){
						alert("사용가능한 쿠폰이 존재하지 않습니다.");
						return;
					}
					
					$('#couponDiv li .radio_box').click(function(){
						$(this).parent("li").each(function(index){
							$(this).removeClass("on");
						});
						$(this).addClass("on");
					});	

					var bW = $(window).width();
					var bH = $(window).height();
					var elW = $('#pop_couponuse').width();
					var elH = $('#pop_couponuse').height();
					var pT = ((bH/2)-(elH/2));
					var pL = ((bW/2)-(elW/2));
					$('#pop_couponuse').show();
					$('#pop_couponuse').css({
						//top: pT+'px',
						top: '0',
						left: pL+'px'
					});	
					$('.dimmed').show();
				}
			}
		});
	},
	selectDoMyCouponCnt : function(){
		CNTApi.log("selectDoMyCouponCnt");
		
		CNTApi.getUserInfo();
		
		var userseq = UserInfo.user_no;
		
		if( userseq == 0 ){
			alert("로그인 후 확인 하세요.");
			location.href="/login";
			return;
		}
		
		var couponCnt = $(".couponCnt");
		couponCnt.html(0);
		
		var param = [];
		param.push('ex=Coupon');
		param.push("ac=selectDoMyCouponList");
		param.push('userseq=' + userseq);
		CNTApi.log(param.join('&'));
		var strhtml ="";
		
		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'text',
			contentType : 'application/json; charset=UTF-8',
			error:function(jqXHR, textStatus, errorThrown){
				CNTApi.log(jqXHR);
			},
			success: function(data){
				CNTApi.log("result");
				CNTApi.log(data);
				
				if(data == null){
					alert("데이터 조회가 정상적이지 않습니다. 다시 시도해주세요.");
					return;
				}
				var cnt = 0;
				
				CNTApi.log(data.length);
				var ev = JSON.parse(data);
				
				if( ev == null || ev.length == 0 )
				{
					return;
				}
				
				if(ev.result == "0"){
					return;
				}

				if( ev != null && ev.length > 0){
					for(i = 0; i < ev.length; i++){
						
						if( ev[i].msg_subject != ""){
							cnt++;
						}
						
					}
					couponCnt.html(cnt);
				}
			}
		});
	},
	setCoupon : function(){
		CNTApi.log("setCoupon");
		var dc_amt = $(".dc_amt").html(0);
		var unit = $(".unit").html("원");
		var totalcouponprice = $("#totalcouponprice").html(0);
		var cnt = 0;
		
		$('#couponDiv li').each(function(index){
			if($(this).find("p").hasClass('on') ){

				var cp_val = $(this).find("p").children("input").val();
				
				if( cp_val != ""){
					var amt = cp_val.split("|")[0];
					var un = cp_val.split("|")[1];
					
					dc_amt.html(numberWithCommas(Number(amt)));
					unit.html( (un == "01")?"원":"%" );
					
					
					if( un == "02"){
						var totalorderprice = parseInt($("#totalorderprice").text().replace(/,/g, ""));
						
						totalcouponprice = numberWithCommas(parseInt((totalorderprice / amt) * 100));
					}else{
						totalcouponprice.html(numberWithCommas(Number(amt)));
					}
					fnCalculate();
					cnt++;
					$('#pop_couponuse').hide();
					$('.dimmed').hide();
				}
			}
		});	
		
		if( cnt == 0){
			alert("선택된 쿠폰이 없습니다.");
			return;
		}
	}
};
