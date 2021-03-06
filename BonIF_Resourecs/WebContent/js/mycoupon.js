if(typeof CNTLib === 'undefined'){
	CNTLib = {};
}

CNTLib.MyCoupon = function(el){
	this.init();
};
CNTLib.MyCoupon.prototype ={
	init : function(){
		this.initVar();
		this.bindEvent();
	},
	initVar :function(){
		CNTApi.log("initVar");
	},
	bindEvent : function(){
		CNTApi.log("bindEvent");
	},
	clear : function(){

	},
	show : function(){
		this.clear();
	},
	hide : function(){
	},
	onKeyEnter : function(e) {

	},
	onClick : function(e){
		CNTApi.log("onClick");
	},
	onChange : function(e){
		var el = $(e.target);
		
	},
	selectMyCouponList : function(){
		CNTApi.log("selectMyCouponList");
		
		CNTApi.getUserInfo();
		
		var userseq = UserInfo.user_no;
		
		if( userseq == 0 ){
			alert("로그인 후 확인 하세요.");
			location.href="/login";
			return;
		}
		
		var getCouponList = $(".getCouponList");
		var myCouponCnt = $(".myCouponCnt");
		getCouponList.empty();
		myCouponCnt.html(0);
		
		var param = [];
		param.push('ex=Coupon');
		param.push("ac=selectMyCouponList");
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

				}
				else if( ev != null && ev.length > 0){
					for(i = 0; i < ev.length; i++){

						if( ev[i].offer_nm != "" ){
							strhtml += '<div class="box center">';
							//종료일자 7일전 표기
							if( parseInt(ev[i].diff_end_dd) <= 7 ){
							strhtml += '	<span class="fin_label">마감임박</span>';
							}else if ( ev[i].cpn_status == "U" ){
								strhtml += '	<span class="fin_label use_end">사용완료</span>';
							}
							strhtml += '	<div class="coupon">';
							if(ev[i].bnf_value == null || ev[i].bnf_value == "")
								strhtml += '			<a href="javascript:void(0)" class="click_wrap open_popup_btn" onclick="mycoupon.updateCouponMapping(this, '+ev[i].seq+')">';
							else if(ev[i].bnf_value != "" && ev[i].cpn_status != "U")
								strhtml += '			<a href="javascript:void(0)" class="click_wrap open_popup_btn" onclick="mycoupon.selectMyCouponDetail('+ev[i].seq+',event)">';
							else if(ev[i].bnf_value != "" && ev[i].cpn_status == "U")
								strhtml += '			<a href="javascript:void(0)" class="click_wrap open_popup_btn">';
							strhtml += '				<strong class="coupon_txt">';
							strhtml += '				<span class="cp_promo">'+ev[i].offer_nm+'</span>';
							strhtml += '				<span class="cp_tit">';
							strhtml += '					'+ev[i].cpn_desc;
							strhtml += '				</span>';
							strhtml += '				</strong>';
							strhtml += '			</a>';
							strhtml += '	</div>';
							strhtml += '	<div class="use_date_area">';
							strhtml += '		<p class="text">'+ev[i].brd_nm+'</p>';
							strhtml += '		<P class="date">유효기간 : <span class="font_space">'+CNTApi.getDateFormat(ev[i].aply_start_dd)+'~'+CNTApi.getDateFormat(ev[i].aply_end_dd)+'</span></P>';
							strhtml += '	</div>';
							if(ev[i].bnf_value == null || ev[i].bnf_value == "")
								strhtml += '	<div class="down_area"><a href="javascript:void(0)" class="down_btn" onclick="mycoupon.updateCouponMapping(this, '+ev[i].seq+')">다운로드</a></div>';
							else if(ev[i].bnf_value != "" && ev[i].cpn_status != "U")
								strhtml += '	<div class="down_area"><a href="javascript:void(0)" class="use_btn" onclick="mycoupon.selectMyCouponDetail('+ev[i].seq+',event)">사용하기</a></div>';
							else if(ev[i].bnf_value != "" && ev[i].cpn_status == "U")
								strhtml += '	<div class="down_area use_end"><a href="javascript:void(0)" class="use_btn">사용완료</a></div>';
							strhtml += '</div>';
							
							if(ev[i].cpn_status != "U")
								cnt++;
						}
						else{

						}
					}
				}
				getCouponList.append(strhtml);
				myCouponCnt.html(cnt);
			}
		});
	},
	selectMyCouponDetail : function(seq, e){
		CNTApi.log("selectMyCouponDetail");
		CNTApi.getUserInfo();
		var userseq = UserInfo.user_no;
		
		if( userseq == 0 ){
			alert("로그인 후 확인 하세요.");
			location.href="/login";
			return;
		}
		
		var useDate = $(".useDate");
		var couponImg = $("#couponImg");
		var subject = $(".subject");
		var barCode = $("#barCode");
		var brandname = $(".brandname");
		
		useDate.empty();
		couponImg.attr("src", "");
		barCode.src = "";
		subject.empty();
		
		var param = [];
		param.push('ex=Coupon');
		param.push("ac=selectMyCouponDetail");
		param.push('userseq=' + userseq);
		param.push('seq=' + seq);
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
				
				if( ev == null || ev.length == 0 ){
					alert("쿠폰이 존재하지 않습니다.");
					return;
				}
				else if( ev != null && ev.length > 0){
					if( ev[0].offer_nm != "" ){
						useDate.html("유효기간 : " + CNTApi.getDateFormat(ev[0].aply_start_dd)+' ~ '+CNTApi.getDateFormat(ev[0].aply_end_dd));
						subject.html(ev[0].offer_nm);
						brandname.html(ev[0].cpn_desc);
						
						couponImg.attr("src", ev[0].file_path1);
						barCode.attr("src","/uploaded-files/barcode_mb/"+ev[0].bnf_value+".jpg");
						
						e.preventDefault();
						var bW = $(window).width();
						var bH = $(window).height();
						var elW = $('#popCoupon').width();
						var elH = $('#popCoupon').height();
						var pT = ((bH/2)-(elH/2));
						var pL = ((bW/2)-(elW/2));
						$('#popCoupon').addClass('on').show();
						$('#popCoupon').css({
							//top: pT+'px',
							top: '0',
							left: pL+'px'
						});	
						$('.dimmed').addClass('on').show();
						$('body').addClass('fixed');			
					}
				}
			}
		});
	},
	updateCouponMapping : function(obj, seq){
		if(!confirm("쿠폰을 다운로드 하시겠습니까?")){
			return;
		}
		
		CNTApi.log("updateCouponMapping");
		CNTApi.getUserInfo();
		var userseq = UserInfo.user_no;
		
		if( userseq == 0 ){
			alert("로그인 후 확인 하세요.");
			location.href="/login";
			return;
		}
		
		var param = [];
		param.push('ex=Coupon');
		param.push("ac=updateCouponMapping");
		param.push('userseq=' + userseq);
		param.push('seq=' + seq);
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
				if (typeof data[0] == "undefiend") {
					alert("다운로드에 실패 했습니다. 다시시도하세요.");
					return;
				}
				
				var ev = JSON.parse(data);
				
				if( ev == null || ev.length == 0 ){
					alert("다운로드에 실패 했습니다. 다시시도하세요.");
					return;
				}
				
				if (ev[0].result == 0) {
					alert(ev[0].message);
				}else{
					alert("다운로드 완료 하였습니다.");
					mycoupon.selectMyCouponList();
				}
			}
		});
	}
}
