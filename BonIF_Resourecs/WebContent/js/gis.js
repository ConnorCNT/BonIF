if(typeof CNTLib === 'undefined'){
	CNTLib = {};
}

CNTLib.GIS = function(el,parentobj){
	this.$el = $(el);
	this.addr1 = this.$el.find('input[name=address1]');
	this.addr2 = this.$el.find('input[name=address2]');
	this.px = this.$el.find('input[name=pointx]');
	this.py = this.$el.find('input[name=pointy]');
	this.si = this.$el.find('input[name=si]');
	this.gu = this.$el.find('input[name=gu]');
	this.dong = this.$el.find('input[name=dong]');
	this.ri = this.$el.find('input[name=ri]');
	this.roadname = this.$el.find('input[name=roadname]');
	this.placename = this.$el.find('input[name=placename]');
	this.parentobj = parentobj;
	
	this.init();
};
CNTLib.GIS.prototype ={
	init : function(){
		this.initVar();
		this.bindEvent();
	},
	initVar :function(){
		CNTApi.log("initVar");
		
		this.htLayer = {
				jibun : this.$el.find("#tabAddress1"),
				roadname : this.$el.find("#tabAddress2"),
				list : this.$el.find(".li_address:first"),
				selectaddr : this.$el.find(".select_address:first"),
				selectstore : this.$el.find(".select_store:first"),
				appendaddr : this.$el.find("input[name=append_address]"),
				btn_clear : this.$el.find(".btn_clear:first"),
				btn_confirm :this.$el.find(".btn_confirm:first"),
				sel_type : this.$el.find('.sel_type:first'),
				pop_close : this.$el.find('.pop_close:first')
		};
		this.htJibun = {
				txt_dong : this.$el.find("input[name=txt_dong]"),
				btn_dong : this.$el.find(".btn_dong:first"),
				txt_place : this.$el.find("input[name=txt_place]"),
				btn_jibun : this.$el.find(".btn_jibun:first"),
				btn_building : this.$el.find(".btn_building:first")
		};
		this.htRoadName = {
				txt_road : this.$el.find("input[name=txt_road]"),
				btn_road : this.$el.find(".btn_road:first"),
				txt_bdnum : this.$el.find("input[name=txt_bdnum]"),
				btn_bdnum : this.$el.find(".btn_bdnum:first")
		};
		
		this.api = "/get.do";
		this.tpl =  {
				list_init : '<li>동이나 도로명 검색을 해주세요</li>',
				list_loading : '<li class="t_red">데이터를 검색중 입니다.</li>',
				//list_addr1 : '<li data-idx="{=IDX}"><a href="javascript:void(0);">{=ADDR}<SPAN class="t_red">[선택]</SPAN></a></li>',
				list_addr1 : '<p class="p_list" data-idx="{=IDX}"><a href="javascript:void(0);">{=ADDR}</a></p>',
				list_empty : '<li class="t_red">검색 조건에 맞는 데이터가 없습니다.</li>',
				list_nostore : '<li class="t_red">죄송합니다. 배달 가능한 매장이 없습니다.</li>',
				list_branch : '<li class="t_red">{=NAME}에서 배달 가능합니다.</li>'
		};
		this.donglist = [];
		this.selectDongIdx = null;
		this.placelist = [];
		this.selectPlaceIdx = null;
		this.addrtype = "";
		this.protocol="http";
		this.url="59.10.203.212";
		this.port="8080";
	},
	bindEvent : function(){
		CNTApi.log("bindEvent");
		this.htJibun.txt_dong.bind("keyup",$.proxy(this.onKeyEnter,this));
		this.htJibun.btn_dong.bind("click",$.proxy(this.onClick,this));
		this.htJibun.btn_jibun.bind("click",$.proxy(this.onClick,this));
		this.htJibun.btn_building.bind("click",$.proxy(this.onClick,this));
		this.htRoadName.txt_road.bind("keyup",$.proxy(this.onKeyEnter,this));
		this.htRoadName.btn_road.bind("click",$.proxy(this.onClick,this));
		this.htRoadName.txt_bdnum.bind("keyup",$.proxy(this.onKeyEnter,this));
		this.htRoadName.btn_bdnum.bind("click",$.proxy(this.onClick,this));
		this.htLayer.btn_clear.bind("click",$.proxy(this.onClick,this));
		this.htLayer.btn_confirm.bind("click",$.proxy(this.onClick,this));
		this.htLayer.sel_type.bind("change",$.proxy(this.onChange,this));
		
		CNTApi.log("addr1="+this.addr1);
		if(CNTApi.isEmpty(this.addr1)){ 
			this.htLayer.btn_clear.find("SPAN:first").text("다른 주소 검색");
			this.htLayer.btn_confirm.find("SPAN:first").text("닫기");
			this.htLayer.appendaddr.hide();
			this.$el.find(".tit_red:first").hide();
			this.$el.find(".li_info:first").hide();
			
		}
	},
	clear : function(){
		this.htLayer.list.html(this.tpl.list_init);
		this.htJibun.txt_dong.val('');
		this.htJibun.txt_place.val('');
		this.htRoadName.txt_road.val('');
		this.htRoadName.txt_bdnum.val('');
		this.donglist = [];
		this.selectDongIdx = null;
		this.placelist = [];
		this.selectPlaceIdx = null;
		this.addrtype = "";
		this.htLayer.selectaddr.html(null);
		this.htLayer.appendaddr.val('');
	},
	show : function(){
		this.clear();
		var vCont = this.$el;
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
	hide : function(){
		var vCont = this.$el;
		$('.bgLayer').remove();
		$('.dim').remove(); 
		this.$el.hide();
	},
	onKeyEnter : function(e) {
		CNTApi.log("onKeyEnter");
		var el = $(e.target);
		if(e.keyCode == 13){
			CNTApi.log("Enter");
			if(el.is(this.htJibun.txt_dong)){
				this.getList('dong');
			} else if(el.is(this.htRoadName.txt_road)){
				this.getList('roadname');
			} else if(el.is(this.htRoadName.txt_bdnum)){
				this.getList('bdnum');
			}
		}
		
	},
	onClick : function(e){
		CNTApi.log("onClick");
		var el = $(e.target);
		var nowtag =  e.target.tagName;
		CNTApi.log(" event name : "+ nowtag);	
		if(nowtag == "A" || nowtag == "SPAN" ){
			if(nowtag == "SPAN") {
				var li = $(e.target).parents('A:first');	
			} else {
				var li = $(e.target);
			}
			CNTApi.log(" attr name : "+ li.attr("class"));	
			if(typeof li.attr("class") === "undefined"){
			
			} else {
				if(li.attr("class").indexOf("btn_dong") > -1 ){
					this.getList("dong");
				} else if(li.attr("class").indexOf("btn_jibun") > -1 ){
					this.getList("jibun");
				} else if(li.attr("class").indexOf("btn_building") > -1 ){
					this.getList("building");
				} else if(li.attr("class").indexOf("btn_road") > -1 ){
					this.getList("roadname");
				} else if(li.attr("class").indexOf("btn_bdnum") > -1 ){
					this.getList("bdnum");
				} else if(li.attr("class").indexOf("btn_clear") > -1 ){
					this.clear();
				} else if(li.attr("class").indexOf("btn_confirm") > -1 ){
					if(!CNTApi.isEmpty(this.addr1)){
						if(CNTApi.isEmpty(this.htLayer.appendaddr.val())){
							alert("추가주소를 입력해주셔야 합니다.");
							return;
						}
						if(this.selectDongIdx == null){
							alert("동 또는 도로명 검색을 해주세요");
							return;
						}
						if(this.selectPlaceIdx == null){
							alert("상세 주소를 검색해야 합니다.");
							return;
						}
						var ev = this.donglist[this.selectDongIdx];
						var ev2 = this.placelist[this.selectPlaceIdx];
					
						this.addr1.val(this.htLayer.selectaddr.html());
						this.addr2.val(this.htLayer.appendaddr.val());
						console.log(ev);
						console.log(ev2);
						this.roadname.val('');
						this.placename.val('');
						if(this.addrtype == "J"){
							this.px.val(ev2.cx);
							this.py.val(ev2.cy);
							this.si.val(ev.sido);
							this.gu.val(ev.gugun);
							this.dong.val(ev.dong);
							this.ri.val(ev.ri);
							this.roadname.val("");
							var strPlace = "";
							if(ev2.san == "1" || ev2.san == "산") {
								strPlace = "산";
							}
							strPlace += ev2.bunji;
							if(ev2.ho != "" && ev2.ho != "0"){
								strPlace += "-"+ev2.ho;
							}
							this.placename.val(strPlace);
							if(!CNTApi.isEmpty(this.parentobj)){
								this.parentobj.getDelivery();
							}
							this.htLayer.pop_close.click();
						} else if(this.addrtype == "B"){
							this.px.val(ev2.point_x);
							this.py.val(ev2.point_y);
							this.si.val(ev.sido);
							this.gu.val(ev.gugun);
							this.dong.val(ev.dong);
							this.ri.val(ev.ri);
							this.placename.val(ev2.viewStr);
							//this.hide();
							if(!CNTApi.isEmpty(this.parentobj)){
								this.parentobj.getDelivery();
							}
							this.htLayer.pop_close.click();
						} else if(this.addrtype == "R"){
							this.px.val(ev2.point_x);
							this.py.val(ev2.point_y);
							this.si.val(ev.sido);
							this.gu.val(ev.gugun);
							this.dong.val(ev.dong);
							this.ri.val(ev.ri);
							this.roadname.val(ev.roadname);
							this.placename.val(this.selectedroadaddr);
							//this.hide();
							if(!CNTApi.isEmpty(this.parentobj)){
								eval(this.parentobj);
							}
							if(!CNTApi.isEmpty(this.parentobj)){
								this.parentobj.getDelivery();
							}
							this.htLayer.pop_close.click();
						} else {
							return;
						}
					} else {
						this.htLayer.pop_close.click();
					}
				}
			}
			
		}
		
	},
	onChange : function(e){
		var el = $(e.target);
		
		if(el.val() == '1'){
			$(".btn_jibun").parent().removeClass("hide");
			$(".btn_building").parent().addClass("hide");
		}
		else{
			$(".btn_jibun").parent().addClass("hide");
			$(".btn_building").parent().removeClass("hide");
		}
		
	},
	getList : function(strtype){
		CNTApi.log("getList");
		var param = [];
		param.push("ex=Gis");
		param.push("protocol="+this.protocol);
		param.push("url="+this.url);
		param.push("port="+this.port);
		if(strtype=="dong") {
			//getAddrSearch_Dong_Name2.do
			var strSearch = this.htJibun.txt_dong.val();
			if(CNTApi.isEmpty(strSearch)){
				alert("동이름을 입력해주세요");
				return;
			}
			param.push("ac=dongsearch");
			//param.push("method=getAddrSearch_Dong_Name2.do");
			param.push("method=API%2FgetAddrSearch_Dong_Name2_db.do");
			param.push("name="+encodeURI(strSearch));
			
			this.htLayer.list.unbind("click");
			this.htLayer.list.bind("click",$.proxy(this.selectDong,this));
			this.selectDongIdx = null;
			this.selectPlaceIdx = null;
			this.placelist = [];
		} else if(strtype=="jibun") {
			if(this.selectDongIdx == null && this.donglist.length == 0) {
				alert("동검색을 먼저해야 합니다.");
				return;
			} else if(this.donglist.length > 0 && this.selectDongIdx == null){
				alert("동을 선택해 주세요");
				return;
			}
			var strSearch = this.htJibun.txt_place.val();

			param.push("ac=jibunsearch");
			//param.push("method=getAddrJibun3.do");
			param.push("method=API%2FgetAddrJibun3_db.do");
			param.push("code="+this.donglist[this.selectDongIdx].code);
			param.push("bunji="+encodeURI(strSearch));
			
			this.htLayer.list.unbind("click");
			this.htLayer.list.bind("click",$.proxy(this.selectPlace,this));
		} else if(strtype=="building") {
			if(this.selectDongIdx == null && this.donglist.length == 0) {
				alert("동검색을 먼저해야 합니다.");
				return;
			} else if(this.donglist.length > 0 && this.selectDongIdx == null){
				alert("동을 선택해 주세요");
				return;
			}
			var strSearch = this.htJibun.txt_place.val();

			param.push("ac=buildingsearch");
			//param.push("method=poiSearch2.do");
			param.push("method=API%2FpoiSearch2.do");
			param.push("dongcode="+encodeURI(this.donglist[this.selectDongIdx].code));
			param.push("sido="+encodeURI(this.donglist[this.selectDongIdx].sido));
			param.push("sigungu="+encodeURI(this.donglist[this.selectDongIdx].gugun));
			param.push("dong="+encodeURI(this.donglist[this.selectDongIdx].dong));
			param.push("ri="+encodeURI(this.donglist[this.selectDongIdx].ri));
			param.push("listcount=9999");
			param.push("pagenum=0");
			param.push("name="+encodeURI(strSearch));
			this.htLayer.list.unbind("click");
			this.htLayer.list.bind("click",$.proxy(this.selectPlace,this));
		} else if(strtype=="roadname") {
			var strSearch = this.htRoadName.txt_road.val();
			if(CNTApi.isEmpty(strSearch)){
				alert("도로명을 입력해주세요");
				return;
			}
			param.push("ac=roadsearch");
			//param.push("method=getRoadname2.do");
			param.push("method=API%2FgetRoadname2_db.do");
			param.push("name="+encodeURI(strSearch.replace(/\s/g,"")));
			
			this.htLayer.list.unbind("click");
			this.htLayer.list.bind("click",$.proxy(this.selectRoad,this));
			this.selectDongIdx = null;
			this.selectPlaceIdx = null;
			this.placelist = [];
		} else if(strtype=="bdnum") {
			var strSearch = this.htRoadName.txt_bdnum.val();
			if(CNTApi.isEmpty(strSearch)){
				alert("건물번호를 입력해주세요");
				return;
			}
			
			var roadcode = null;
			try {
				roadcode = this.donglist[this.selectDongIdx].roadcode;
			} catch (e) {
				console.log(e);
				alert("도로명 주소를 선택해주세요");
				return;
			}
			
			param.push("ac=bdnumsearch");
			//param.push("method=getRoadaddrSearchList2.do");
			param.push("method=API%2FgetRoadaddrSearchList2_db.do");
			param.push("roadnum="+encodeURI(strSearch.replace(/\s/g,"")));
			param.push("code="+this.donglist[this.selectDongIdx].roadcode);
			this.htLayer.list.unbind("click");
			this.htLayer.list.bind("click",$.proxy(this.selectPlace,this));
		}
		this.htLayer.list.html(this.tpl.list_loading);
		CNTApi.log(param.join('&'));
		
		var self = this;
		$.ajax({
			type: 'GET',
			url : this.api,
			data : param.join("&"),
			dataType : 'jsonp',
			contentType:'application/json; charset=utf-8',
			error:function(jqXHR, textStatus, errorThrown){
				CNTApi.log(jqXHR);
			},
			success: function(data){
				CNTApi.log("result");
				CNTApi.log(data);
				
				if(data != null){
					try {
						CNTApi.log(data.length);
						if(data.length == 0 || data[0].result != null ) {
							self.htLayer.list.html(self.tpl.list_empty);
						} else {
							self.htLayer.list.html(null);
							if(strtype=="dong" || strtype=="roadname") {
								self.donglist = data;
							} else if(	strtype == "jibun" || strtype=="building" || strtype=="roadnum" || strtype=="bdnum"){
								self.placelist = data;
							}
							for(var i=0 ; i < data.length;i++){
								var ev = data[i];
								if(strtype=="dong") {
									self.htLayer.list.append(self.tpl.list_addr1.replace(/{=ADDR}/g,ev.fullname).replace(/{=IDX}/g,i));
								} else if(strtype=="roadname") {
										self.htLayer.list.append(self.tpl.list_addr1.replace(/{=ADDR}/g,ev.roadaddr+"("+ev.dong+")").replace(/{=IDX}/g,i));
								} else if(	strtype == "jibun" ) {
									var strPlace = "";
									if(ev.san == "1" || ev.san == "산") {
										strPlace = "산";
									}
									strPlace += ev.bunji;
									if(ev.ho != "" && ev.ho != "0"){
										strPlace += "-"+ev.ho;
									}
									self.addrtype = "J";
									self.htLayer.list.append(self.tpl.list_addr1.replace(/{=ADDR}/g,strPlace).replace(/{=IDX}/g,i));
									
								} else if(	strtype=="building" ){
									var strPlace = "";
									strPlace = ev.viewStr;
									if(ev.addr_bun != "" && ev.addr_bun != "0"){
										strPlace += "("+ev.addr_bun;
										if(ev.addr_ho != "" && ev.addr_ho != "0"){
											strPlace += "-"+ev.addr_ho;
										}
										strPlace += ")";
									}
									
									self.addrtype = "B";
									self.htLayer.list.append(self.tpl.list_addr1.replace(/{=ADDR}/g,strPlace).replace(/{=IDX}/g,i));
								} else if(	strtype=="bdnum" ){
									var strPlace = "";
									strPlace = ev.mn;
									self.addrtype = "R";
									if(ev.sn != "" && ev.sn != "0"){
										strPlace += "-"+ev.sn;
									}
									self.htLayer.list.append(self.tpl.list_addr1.replace(/{=ADDR}/g,strPlace).replace(/{=IDX}/g,i));
								}
							}
						}
					} catch(e){
						alert(e);
					}
				} else {
					self.htLayer.list.html(self.tpl.list_empty);
				}	 			
			}
		});
		
	},
	selectDong : function(e){
		CNTApi.log("selectDong");
		var el = $(e.target);
		var nowtag =  e.target.tagName;
		CNTApi.log(" event name : "+ nowtag);	
		
		if(nowtag == "A" || nowtag == "SPAN") {
			//var li = $(e.target).parents('li:first');
			var li = $(e.target).parents('p:first');
		} else {
			var li = $(e.target);
		}	
		if(typeof li.attr("data-idx") === "undefined"){
		
		} else {
			this.selectDongIdx = li.attr("data-idx");
			CNTApi.log(this.selectDongIdx);
			var ev = this.donglist[this.selectDongIdx];
			CNTApi.log(ev);
			this.htLayer.selectaddr.html(ev.fullname);
			this.htJibun.txt_place.focus();
			this.htLayer.list.html(null);
		}
	},
	selectRoad : function(e){
		CNTApi.log("selectDong");
		var el = $(e.target);
		var nowtag =  e.target.tagName;
		CNTApi.log(" event name : "+ nowtag);	
		
		if(nowtag == "A" || nowtag == "SPAN") {
			//var li = $(e.target).parents('li:first');	
			var li = $(e.target).parents('p:first');
		} else {
			var li = $(e.target);
		}	
		if(typeof li.attr("data-idx") === "undefined"){
		
		} else {
			this.selectDongIdx = li.attr("data-idx");
			CNTApi.log(this.selectDongIdx);
			var ev = this.donglist[this.selectDongIdx];
			CNTApi.log(ev);
			this.htLayer.selectaddr.html(ev.roadaddr);
			this.htRoadName.txt_bdnum.focus();
			this.htLayer.list.html(null);
		}
	},
	selectPlace : function(e){
		CNTApi.log("selectDong");
		var el = $(e.target);
		var nowtag =  e.target.tagName;
		CNTApi.log(" event name : "+ nowtag);	
		
		if(nowtag == "A" || nowtag == "SPAN") {
			//var li = $(e.target).parents('li:first');	
			var li = $(e.target).parents('p:first');
		} else {
			var li = $(e.target);
		}	
		if(typeof li.attr("data-idx") === "undefined"){
		
		} else {
			this.selectPlaceIdx = li.attr("data-idx")
			var strPlace = "";
			var ev = this.donglist[this.selectDongIdx];
			var ev2 = this.placelist[this.selectPlaceIdx];
			CNTApi.log(ev);
			CNTApi.log(ev2);
			
			if(this.addrtype == "J") {
				strPlace += ev.fullname;
				strPlace += " ";
				CNTApi.log(this.selectDongIdx);
				
				if(ev2.san == "1" || ev2.san == "산") {
					strPlace += "산";
				}
				strPlace += ev2.bunji;
				if(ev2.ho != "" && ev2.ho != "0"){
					strPlace += "-"+ev2.ho;
				}
			} else if(this.addrtype == "B") {
				strPlace += ev.fullname;
				strPlace += " ";
				strPlace += ev2.viewStr;
				if(ev2.addr_bun != "" && ev2.addr_bun != "0"){
					strPlace += "("+ev2.addr_bun;
					this.selectedroadaddr = "("+ev2.addr_bun; 
					if(ev2.addr_ho != "" && ev2.addr_ho != "0"){
						this.selectedroadaddr = this.selectedroadaddr + "-"+ev2.addr_ho;
						strPlace += "-"+ev2.addr_ho;
					}
					strPlace += ")";
					this.selectedroadaddr = this.selectedroadaddr + ")";
				}
			} else if(this.addrtype == "R") {
				strPlace += ev.roadaddr;
				strPlace += " ";
				strPlace += ev2.mn;
				this.selectedroadaddr = ev2.mn; 
			}
			
			this.htLayer.selectaddr.html(strPlace);
			//if(CNTApi.isEmpty(this.addr1)){ 
				if(this.addrtype == "J"){
					this.getFindStore(ev2.cx,ev2.cy)
				} else if(this.addrtype == "B"){
					this.getFindStore(ev2.point_x,ev2.point_y)
				} else if(this.addrtype == "R"){
					this.getFindStore(ev2.point_x,ev2.point_y)
				} else {
					return;
				}
			//} 
		}
			
		
	},
	getFindStore : function(x, y){
		CNTApi.log("getFindStore");
		if(CNTApi.isEmpty(x)|| CNTApi.isEmpty(y)){
			this.gis.show();
		} else {
			CNTApi.log("여기에 상권검색 로직을 넣습니다.");
			var param = [];
			param.push("ex=Gis");
			param.push("ac=findstore");
			param.push("x="+x);
			param.push("y="+y);
			var self = this;
			$.ajax({
				type: 'GET',
				url : this.api,
				data : param.join("&"),
				dataType : 'jsonp',
				contentType:'application/json; charset=utf-8',
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
								self.htLayer.list.html(self.tpl.list_nostore);
								CNTApi.log("상권없음");
							} else {
								CNTApi.log("상권있음");
								self.htLayer.list.html(self.tpl.list_branch.replace(/{=NAME}/g,ev.a_branch_name));
								$(".select_store").html(ev.a_branch_name);
							}
						}
								
					}
				}
			});
		}
	}
}
