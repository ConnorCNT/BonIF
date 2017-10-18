$(document).ready(function(){
	//$(".content").empty();
	cartDetail();
	selectBrand();
	getMenuTitle();
	
	/*var t_cnt = $(".order_box").find("strong[name=tot_cnt]").text();
	if(t_cnt > 0){
		$(".loginControll").css("display", "block");
	}*/
	$(".radio_box").click(function(){
		$(".size_area .radio_box").removeClass("on");
		$(this).addClass("on");
		return false;
	});
	$(".price_area .radio_box").click(function(){
		$(".price_area .radio_box").removeClass("on");
		$(this).addClass("on");
		return false;
	});

	$('.ly_close').click(function(){
		$('.item_choice a.item_size').addClass("on");
	});
	$('#packing_choice_ok').click(function(){
		$('.item_choice a.item_size').addClass("on");
		$('.packing_choice').hide();
		$(".dimmed").hide();
	});
//용기선택시 제어함수
	$('.radio_box').click(function(){
		var c_idx = $(".packing_choice").find("input[name=idx]").val();
		$(".list_box").find("li:eq("+c_idx+")").find('.item_choice a.item_size').html('소');
		if($('ul.pop_packing_sel li:nth-child(1) .radio_box').hasClass('on')){
			$(".packing:eq("+c_idx+")").find('.item_choice a.item_size').html('대');
			$(".packing:eq("+c_idx+")").find('.item_choice a.item_size').addClass("on");

		}else if($('.pop_packing_sel li:nth-child(2) .radio_box').hasClass('on')){
			$(".packing:eq("+c_idx+")").find('.item_choice a.item_size').html('중');
		}else{
			$(".packing:eq("+c_idx+")").find('.item_choice a.item_size').html('소');
		}
	});

	//$('.add_topping').hide();
//type2
	/*$('#type2_topping_choice ul li').click(function(){
		var topping_index = $("#type2_topping_choice ul li").index(this);
		if(topping_index=='0'){
			alert('토핑을 선택하세요.');
		}
		$('#type2_add_topping' + topping_index).show();
	});*/
	
	/*$(document).on("click","#type2_topping_choice ul li",function(e){
		//console.log(e);
		//var topping_index = $("#type2_topping_choice ul li").find("a").attr("tabindex");
		var topping_index = $(this).find("a").attr("tabindex");
		//console.log($(this).parent().parent().parent().parent().html());
		$(this).parent().parent().parent().parent().find('#type2_add_topping' + topping_index).first().show();
	});*/
	/*$('.btn_del2').click(function(){
		var pare_id = $(this).parent().parent().attr('id');
		$('#'+pare_id).hide();
	});*/
	$(document).on("click",".btn_del2",function(){
		var pare_id = $(this).parent().parent().parent().attr('idx');
		var selectvalue = $(this).parent().attr('id');
		$('.'+pare_id+'').find('input[name=tp_cnt]').val("1");
		$('.'+pare_id+'').find('#'+selectvalue).hide();
	});
	
});

function selectBrand(){
	var part = $("input[name=part]").val();
	var param = [];
	param.push("id=Brand");
	param.push("ac=BrandList");
	
	$.ajax({
		url: "/api.do",
		method: "post",
		data : param.join('&'),
		success: function(data) {
			var html = "";
			$.each($.parseJSON(data), function(k,v){
				if(part == v.id){
					html +='<option selected>'+v.name+'</option>'
				}else{
					html +='<option>'+v.name+'</option>'
				}
			});
			$("#my_select").append(html);
		}
	});
	//selectMenuDetail();
}

function selectMenu(){
	var part = $("input[name=part]").val();
	var param = [];
	param.push("ex=Menu");
	param.push("ac=menuList");
	param.push("part="+part);
	$.ajax({
		url: "/api.do",
		method: "post",
		data : param.join('&'),
		success: function(data) {
			var seq = null;
			var mastercode = null
			if(data != null){
				var param = [];
				param.push("ex=Menu");
				param.push("ac=menuDetail");
				param.push("part="+part);
				$.ajax({
					url: "/api.do",
					method: "post",
					data : param.join('&'),
					success: function(data1) {
						$.each($.parseJSON(data), function(k,v){
							var html = "";
							seq = v.seq;
							if(part == 1 || part == 5){
								html+='<li idx="'+k+'" style="cursor: pointer;">'
								+'<div class="inner">'
								+'<div class="product">'
								+'<div class="thumb"><div class="img" style="background-image:url('+v.filename1+');"></div></div>'
								+'<div class="description">'
								+'<strong class="name">'+v.title+'</strong>'
								+'<p class="f_orange font_space">'+numberWithCommas(v.price)+'원</p>'
								+'</div>'
								+'</div>'
								+'</div>'
								+'</li>'
								+'<div class="menu_dsc '+k+' hide" style="top: 299px;">'
								+'<form idx="'+k+'" id="'+v.seq+'">'
								+'<div class="category-nav">'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if(v.val10 == "0"){
								html+='<div class="top_box">'
								+'<span class="tping_view"></span>'
								+'<span class="item_choice choice_box item_size">대</span>'
								+'<a href="javascript:void(0);" class="btn bg_gray pop_on_btn">용기선택</a>'
								+'</div>'
										}
									}
								});
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if($.parseJSON(v.oppos1)[0].master_code != ""){
										html +='<select class="mt20 topping_select">'
										+'<option value="">토핑선택</option>'
										}
									}
								});
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										$.each($.parseJSON(v.oppos1), function(k,v){
											if(v.master_code != ""){
												if(v.sale == 'y'){
													html +='<option value="'+k+'">'+v.topping_name+' +'+numberWithCommas(v.price)+'원</option>'
												}
											}
										});
									}
								});
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if($.parseJSON(v.oppos1)[0].master_code != ""){
										html+='</select>'
										}
									}
								});
								+'<!-- 토핑 선택 하단 -->'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if($.parseJSON(v.oppos1)[0].master_code != ""){
											$.each($.parseJSON(v.oppos1), function(k,v){
												html +='<div class="count_box mt20 add_topping" id="type2_add_topping'+k+'" style="display: none;">'
												+'<span class="count_text title">'+v.topping_name+'</span>'
												+'<div class="item_count">'
												+'<a href="javascript:void(0);" class="btn_minus">―</a>'
												+'<span class="input_text"><input type="text" name="tp_cnt" value="1"></span>'
												+'<a href="javascript:void(0);" class="btn_plus">+</a>'
												+'</div>'
												+'<a href="javascript:void(0);" class="cancel_btn btn_del2">x</a>'
												+'</div>'
											});
										}
									}
								});
								html+='</div>'
								+'<p class="txt">'+v.subcon+'</p>'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										html+='<a href="javascript:pd_out_ck(\''+v.price+'\',\''+v.pdid+'\',\''+v.opid+'\',\''+v.val3+'\');" id="'+v.opid+'" class="bg_green text-center btn_add">메뉴선택</a>'
									}
								});
								html+='</form>'
								+'</div>'
								$("#"+v.mpart+"").append(html);
							}else{
								html+='<li idx="'+k+'" style="cursor: pointer;">'
								+'<div class="inner">'
								+'<div class="product">'
								+'<div class="thumb"><div class="img" style="background-image:url('+v.filename1+');"></div></div>'
								+'<div class="description">'
								+'<strong class="name">'+v.title+'</strong>'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if(v.oplistnum == '1'){
											html+='<p class="f_orange font_space">세트'+numberWithCommas(v.price)+'원</p>'
										}else if(v.oplistnum == '2'){
											html+='<p class="f_orange font_space">단품'+numberWithCommas(v.price)+'원</p>'
										}else if(v.oplistnum == '3'){
											html+='<p class="f_orange font_space">국'+numberWithCommas(v.price)+'원</p>'
										}else{
											html+='<p class="f_orange font_space">'+numberWithCommas(v.price)+'원</p>'
										}
									}
								});
								html+='</div>'
								+'</div>'
								+'</div>'
								+'</li>'
								+'<div class="menu_dsc '+k+' menutype_02 hide" style="top: 299px;">'
								+'<form idx="'+k+'" id="'+v.seq+'">'
								+'<div class="category-nav">'
								+'<span class="radio_area">'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
											if(v.oplistnum == '1'){
												html+='<span class="radio_box on" onclick="amountChange(this);">'
												+'<input type="radio" name="item" id="item_1" checked="checked" value="'+v.opid+'" class="input_check">'
												+'<span class="fake"></span>'
												+'<label id="item_label_1" data-img="item01_1" for="item_1" class="check">세트 '+numberWithCommas(v.price)+'원</label>'
												+'</span>'
											}else if(v.oplistnum == '2'){
												html+='<span class="radio_box" onclick="amountChange(this);">'
												+'<input type="radio" name="item" id="item_2" value="'+v.opid+'" class="input_check">'
												+'<span class="fake"></span>'
												+'<label id="item_label_2" data-img="item01_2" for="item_2" class="check">단품 '+numberWithCommas(v.price)+'원</label>'
												+'</span>'
											}else if(v.oplistnum == '3'){
												html+='<span class="radio_box" onclick="amountChange(this);">'
												+'<input type="radio" name="item" id="item_3" value="'+v.opid+'" class="input_check">'
												+'<span class="fake"></span>'
												+'<label id="item_label_3" data-img="item01_3" for="item_3" class="check">국 '+numberWithCommas(v.price)+'원</label>'
												+'</span>'
											}
									}
								});
								html+='</span>'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if(v.oplistnum == '1'){
											if($.parseJSON(v.oppos1)[0].master_code != ""){
											html +='<select class="mt20 topping_select">'
											+'<option value="토핑선택">토핑선택</option>'
											}
										}
									}
								});
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if(v.oplistnum == '1'){
											$.each($.parseJSON(v.oppos1), function(k,v){
												if(v.master_code != ""){
													if(v.sale == 'y'){
														html +='<option value="'+k+'">'+v.topping_name+' +'+numberWithCommas(v.price)+'원</option>'
													}
												}
											});
										}
									}
								});
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if($.parseJSON(v.oppos1)[0].master_code != ""){
										html+='</select>'
										}
									}
								});
								+'<!-- 토핑 선택 하단 -->'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if(v.oplistnum == '1'){
											if($.parseJSON(v.oppos1)[0].master_code != ""){
												$.each($.parseJSON(v.oppos1), function(k,v){
													html +='<div class="count_box mt20 add_topping" id="type2_add_topping'+k+'" style="display: none;">'
													+'<span class="count_text title">'+v.topping_name+'</span>'
													+'<div class="item_count">'
													+'<a href="javascript:void(0);" class="btn_minus">―</a>'
													+'<span class="input_text"><input type="text" name="tp_cnt" value="1"></span>'
													+'<a href="javascript:void(0);" class="btn_plus">+</a>'
													+'</div>'
													+'<a href="javascript:void(0);" class="cancel_btn btn_del2">x</a>'
													+'</div>'
												});
											}
										}
									}
								});
								html+='</div>'
								+'<p class="txt">'+v.subcon+'</p>'
								$.each($.parseJSON(data1), function(k,v){
									if(seq == v.pdid){
										if(v.oplistnum == '1'){
											html+='<a href="javascript:pd_out_ck(\''+v.price+'\',\''+v.pdid+'\',\''+v.opid+'\',\''+v.val3+'\');" id="'+v.opid+'" class="bg_green text-center selecMenu btn_add">메뉴선택</a>'
										}else{
											html+='<a href="javascript:pd_out_ck(\''+v.price+'\',\''+v.pdid+'\',\''+v.opid+'\',\''+v.val3+'\');" id="'+v.opid+'" style="display:none;" class="bg_green text-center selecMenu btn_add">메뉴선택</a>'
										}
										if(v.oplistnum == '0'){
											html+='<a href="javascript:pd_out_ck(\''+v.price+'\',\''+v.pdid+'\',\''+v.opid+'\',\''+v.val3+'\');" id="'+v.opid+'" class="bg_green text-center selecMenu btn_add">메뉴선택</a>'
										}
									}
								});
								html+='</form>'
								+'</div>'
								$("#"+v.mpart+"").append(html);
							}
							//장바구니 주문하기 녹색바
							cartBar();
						});
					}
				});
			}
		}
	});
}

$(document).on("click",".menu_list > li",function(){
	//e.preventDefault();
	var objPos = $(this).position();
	var h = $(this).outerHeight();
	var th = $(this).outerHeight(true);
	var t = objPos.top;
	$('.menu_dsc').addClass('hide');
	$('.menu_dsc').css('top', (t + h + (th - h) -1) + 'px');
	var classidx = $(this).attr("idx");
	if($(this).hasClass('on')){
		$(".menu_list > li").removeClass("on");
	}else{
		$(".menu_list > li").removeClass("on");
		$(this).addClass("on");
		$("."+classidx+"").removeClass('hide');
	}
});

$(document).on("change",".topping_select",function(){
	var thisidx = $(this).parent().parent().attr("idx");
	var selectvalue = $('.'+thisidx+'').find(".topping_select option:selected").val();
	$('.'+thisidx+'').find('#type2_add_topping' + selectvalue).show();
	$('.'+thisidx+'').find(".topping_select").find("option:first").prop("selected","selected");
});

$(document).on("click","#plate_choice",function(e){
	e.preventDefault();
	$(".size_area").find("span").removeClass("on");
	var pack_name = ($(this).parent().find(".item_size").text());
	if(pack_name.indexOf("대") == 0){
		$("#size_big").parent().parent().find(".radio_box").addClass("on");
	}else if(pack_name.indexOf("중") == 0){
		$("#size_mid").parent().parent().find(".radio_box").addClass("on");
	}else if(pack_name.indexOf("소") == 0){
		$("#size_small").parent().parent().find(".radio_box").addClass("on");
	}
	$(".dimmed").show();
	$('.popup_area').show();
	var selectIdx = $(this).parent().find("input[name=idx]").val();
	$(".packing_choice").find("input[name=idx]").val(selectIdx);
});

function amountChange(e){
	var checkbox = $(e).is(":checked");
	$("input[name=category]").removeAttr("checked",false);
	console.log($(e).parent().parent().parent().html());
	var opid = $(e).find("input[name=item]").val();
	console.log("opid = "+opid);
	if(!checkbox){
		$(e).parent().parent().find(".radio_box").removeClass("on");
		$(e).addClass("on");
		//console.log($(e).parent().parent().parent().find(".item_more").find(".selecMenu").html())
		$(e).parent().parent().parent().find(".selecMenu").hide();
		$('#'+opid+'').show();
	}
}
function pd_out_ck(price,pdid,opid,posid){
	CNTApi.setStoreInfo();
	console.log($('#'+opid).parent().html());
	topping1 =$('#'+opid).parent().find("#type2_add_topping0:visible").find(".title").text();
	topping1_cnt = $('#'+opid).parent().find("#type2_add_topping0:visible").find("input[name=tp_cnt]").val();
	topping2 =$('#'+opid).parent().find("#type2_add_topping1:visible").find(".title").text();
	topping2_cnt = $('#'+opid).parent().find("#type2_add_topping1:visible").find("input[name=tp_cnt]").val();
	topping3 =$('#'+opid).parent().find("#type2_add_topping2:visible").find(".title").text();
	topping3_cnt = $('#'+opid).parent().find("#type2_add_topping2:visible").find("input[name=tp_cnt]").val();
	topping4 =$('#'+opid).parent().find("#type2_add_topping3:visible").find(".title").text();
	topping4_cnt = $('#'+opid).parent().find("#type2_add_topping3:visible").find("input[name=tp_cnt]").val();
	topping5 =$('#'+opid).parent().find("#type2_add_topping4:visible").find(".title").text();
	topping5_cnt = $('#'+opid).parent().find("#type2_add_topping4:visible").find("input[name=tp_cnt]").val();
	topping6 =$('#'+opid).parent().find("#type2_add_topping5:visible").find(".title").text();
	topping6_cnt = $('#'+opid).parent().find("#type2_add_topping5:visible").find("input[name=tp_cnt]").val();
	
	var pack = $('#'+opid).parent().find(".item_size").text();
	console.log("pack = "+pack);
	var packing_json = null;
	var topping_json = null;
	var topping_pd_code = [];
	//console.log(pack.indexOf("대"));
	
	if(pack.indexOf("대") == 0){
		packing_json = '[{"packing_name":"대","packing_code":"CT100001","packing_price":"0"}]';
	}else if(pack.indexOf("중") == 0){
		packing_json = '[{"packing_name":"중","packing_code":"CT100002","packing_price":"0"}]';
	}else if(pack.indexOf("소") == 0) {
		packing_json = '[{"packing_name":"소","packing_code":"CT100003","packing_price":"0"}]';
	}else{
		packing_json = null;
	}
	topping_json =[];
	
	topping_pd_code.push(posid);
	if(topping1 != ""){
		if(topping1.indexOf("치즈토핑") == 0){
			topping_json.push('{"topping_name":"치즈토핑","topping_code":"10005112","price":"1000","count":"'+topping1_cnt+'"}');
			topping_pd_code.push('10005112');
		}else if(topping1.indexOf("델리팸추가(1pc)") == 0){
			topping_json.push('{"topping_name":"델리팸추가(1pc)","topping_code":"10004493","price":"700","count":"'+topping1_cnt+'"}');
			topping_pd_code.push('10004493');
		}
	}
	if(topping2 != ""){
		if(topping2.indexOf("참치토핑") == 0){
			topping_json.push('{"topping_name":"참치토핑","topping_code":"BN100013","price":"2000","count":"'+topping2_cnt+'"}');
			topping_pd_code.push('BN100013');
		}else if(topping2.indexOf("특선반찬") == 0){
			topping_json.push('{"topping_name":"특선반찬","topping_code":"10004496","price":"1800","count":"'+topping2_cnt+'"}');
			topping_pd_code.push('10004496');
		}
	}
	if(topping3 != ""){
		if(topping3.indexOf("새알심토핑") == 0){
			topping_json.push('{"topping_name":"새알심토핑","topping_code":"BN100014","price":"1000","count":"'+topping3_cnt+'"}');
			topping_pd_code.push('BN100014');
		}else if(topping3.indexOf("쌈야채") == 0){
			topping_json.push('{"topping_name":"쌈야채","topping_code":"10004497","price":"2000","count":"'+topping3_cnt+'"}');
			topping_pd_code.push('10004497');
		}
	}
	if(topping4 != ""){
		if(topping4.indexOf("데미커리") == 0){
			topping_json.push('{"topping_name":"데미커리","topping_code":"10004587","price":"1500","count":"'+topping4_cnt+'"}');
			topping_pd_code.push('10004587');
		}
	}
	if(topping5 != ""){
		if(topping5.indexOf("핫윙 두조각") == 0){
			topping_json.push('{"topping_name":"핫윙 두조각","topping_code":"BN100029","price":"1500","count":"'+topping5_cnt+'"}');
			topping_pd_code.push('BN100029');
		}
	}
	if(topping6 != ""){
		if(topping6.indexOf("젓갈반찬") == 0){
			topping_json.push('{"topping_name":"젓갈반찬","topping_code":"BN100030","price":"3000","count":"'+topping6_cnt+'"}');
			topping_pd_code.push('BN100030');
		}
	}
	topping_json.join(',');
	topping_pd_code.join(',');
	//console.log(topping_json);
	//console.log(packing_json);
	var param = [];
	param.push("ex=Store");
	param.push("ac=getvposstorecmdtlocal");
	param.push("frc_cd="+StoreInfo.store_frc);
	param.push("brd_cd="+StoreInfo.store_brd);
	param.push("str_no="+StoreInfo.store_no);
	param.push("cmdt_cd="+topping_pd_code);
	CNTApi.log(CNTApi.getCartId());
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
			//console.log(data);
			if(data[0].scmdt_pause_mk == "Y"){
				alert("선택하신 메뉴는 현재 해당 매장에서 주문하실 수 없습니다.");
			} else {
				InsertBill(price,pdid,opid,posid,topping_json,packing_json);
				$('#'+opid).parent().find(".item_size").text("대");
				//console.log($('#'+opid).parent().parent().find(".price_area").find(".radio_box").removeClass("on"));
				$('#'+opid).parent().parent().find(".price_area").find(".radio_box").removeClass("on");
				for(var i=0; i< 6; i++){
					$('#'+opid).parent().find("#"+"type2_add_topping"+i).hide();
					$('#'+opid).parent().find("#"+"type2_add_topping"+i).find("input[name=tp_count]").val(1);
				}
				
				$('#'+opid).parent().parent().find(".radio_box").removeClass("on");
				$('#'+opid).parent().parent().find(".radio_box").first().addClass("on");
				$('#'+opid).parent().parent().find(".selecMenu").hide();
				$('#'+opid).parent().parent().find(".selecMenu:first").show();
				//console.log($('#'+opid).parent().parent().addClass("hide"));
				$(".menu_list").find("li").removeClass("on");
				$(".menu_list").find(".menu_dsc").addClass("hide");
				
				$('.pop_cart_info').show();
			    $('.pop_cart_info').fadeIn();
				$('.pop_cart_info').addClass('cartIn');
			    setTimeout(function(){ 
					$('.pop_cart_info').removeClass('cartIn');
					$('.pop_cart_info').hide();
				}, 1500);
			}
		}
	});
}

function InsertBill(price,pdid,opid,posid,topping_json,packing_json){
	if(CNTApi.getCartId() == 0){
		var param = [];
		param.push("ex=Cart");
		param.push("ac=getseq");
		param.push("cartid="+CNTApi.getCartId())
		//CNTApi.log(CNTApi.getCartId());
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
				if(data[0].result == 1){
					CNTApi.setCartId(data[0].msg);
					InsertTcart(price,pdid,opid,posid,topping_json,packing_json);
				} else {
					alert("주문표 입력 실패 다시 시도해 주십시오.");
				}
			}
		});
	}else{
		InsertTcart(price,pdid,opid,posid,topping_json,packing_json);
	}
}

function InsertTcart(price,pdid,opid,posid,topping_json,packing_json){
	var userSeq = $("input[name=userSeq]").val();
	//var adcd = $("input[name=adcd]").val();
	var ordertype = $("input[name=ordertype]").val();
	var topping_price = 0;
	//console.log(topping_json);
	//console.log(packing_json);
	var param = [];
	param.push("ex=Cart");
	param.push("ac=insertTcart");
	param.push("cartid="+CNTApi.getCartId());
	param.push("store_id="+CNTApi.getStoreId());
	param.push("reg_id="+CNTApi.getCartId()+"tmp_id");
	param.push("userSeq="+userSeq);
	param.push("price="+price);
	param.push("pdid="+pdid);
	param.push("opid="+opid);
	param.push("posid="+posid);
	//param.push("adcd="+adcd);
	param.push("route=M");
	if(ordertype == null || ordertype == "" ){
		param.push("ordertype=P");
	}else{
		param.push("ordertype="+ordertype);
	}
	if(topping_json != null && topping_json != ""){
		param.push("topping="+'['+topping_json.toString()+']');
	}
	if(packing_json != null && packing_json != ""){
		param.push("packing="+packing_json);
	}
	var self = this;
	$.ajax({
		type: 'post',
		url : "/api.do",
		data : param.join('&'),
		dataType : 'jsonp',
		async:false,
		error:function(){
			alert("주문표 입력 실패 다시 시도해 주십시오.");
		},
		success: function(data){
			if(data[0].result == 1){
				cartDetail();
			} else {
				alert("주문표 입력 실패 다시 시도해 주십시오.");
			}
		}
	});
}

function cartDetail(){
	//$(".content").empty();
	var param = [];
	param.push("ex=Cart");
	param.push("ac=selectCartDetail");
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
		},
		success: function(data){
			var html = "";
			if(data != null){
				if(data[0].cartid != null && data[0].cartid != ""){
					
					var itemCount = 0;
					
					for (var i=0; i<data.length; i++) {
						if (data[i].op1pos1 != 'BD100001') {
							itemCount++;
						}
					}
					
					$("#cart_count").text(itemCount);
				}else{
					$("#cart_count").text("0");
				}
			}else{
				$("#cart_count").text("0");
			}
		}
	});
}

function conminus(dtid){
	var pd_cnt =$('#cart_'+dtid).find("input[name=pd_cnt]:first").val(); 
	if(pd_cnt == 1){
		alert("더이상 줄일 수 없습니다.");
		return;
	}else{
		var param = [];
		param.push("ex=Cart");
		param.push("ac=updateCartDetail");
		param.push("cartid="+CNTApi.getCartId());
		param.push("dtid="+dtid);
		param.push("type=minus");
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
				cartDetail();
			}
		});
	}
}

function conplus(dtid){
	//var pd_cnt =$("input[name=pd_cnt]").val(); 
	//pd_cnt = Number(pd_cnt) + 1;
	var param = [];
	param.push("ex=Cart");
	param.push("ac=updateCartDetail");
	param.push("cartid="+CNTApi.getCartId());
	param.push("dtid="+dtid);
	param.push("type=plus");
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
			cartDetail();
		}
	});
}
	
function condel(dtid){
	var param = [];
	param.push("ex=Cart");
	param.push("ac=updateCartDetail");
	param.push("cartid="+CNTApi.getCartId());
	param.push("dtid="+dtid);
	param.push("delyn=Y");
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
			//$(".loginControll").hide();
			cartDetail();
		}
	});
}

function orderpass(){
	//console.log(CNTApi.getStoreId());
	if(CNTApi.getStoreId() == "0" || CNTApi.getStoreId() == null){
		alert("매장을 선택해주세요.");
		return;
	}else{
		location.href = "/order/packing/order";
	}
}

function loginOrder(){
	var result = confirm("로그인이 필요한 서비스입니다.\n로그인하시겠습니까?");
	if (result == true) {
		location.href= "/login";
	}
}

function brandChange(e){
    var result = confirm("다른 브랜드 선택 시 주문을 초기화 합니다.\n계속하시겠습니까?");
    if (result == true) {
		location.replace("/order/main");
    }else{
    	$("#my_select").empty();
    	selectBrand();
    }
}

function resetCart(){
	var param = [];
	param.push("ex=Cart");
	param.push("ac=updateCartDetail");
	param.push("cartid="+CNTApi.getCartId());
	param.push("delyn=Y");
	param.push("reset=R");
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
			cartDetail();
			$(".order_box").find("strong[name=tot_cnt]").text("0");
			//$(".loginControll").hide();
		}
	});
}

function selectOption(){
	var param = [];
	param.push("ex=Option");
	param.push("ac=getTopping");
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
			//console.log(data);
		}
	});
}

function getMenuTitle(){
	var part = $("input[name=part]").val();
	var param = [];
	param.push("ex=Menu");
	param.push("ac=menuTitle");
	param.push("part="+part);
	var html = "";
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
			for (var i = 0; i < data.length; i++){
				var ev = data[i];
				//alert(ev.menu_name);
				html +='<div class="header-line mt80"></div>'
			    +'<h2 class="subheader no-gap" id="m01">'+ev.menu_name+'</b></h2>'
				+'<div class="menu_wrap">'
				+'<ul class="menu_list mt15" id="'+ev.mpart+'">'
				+'</ul>'
				+'</div>'
			}
			$(".columns").append(html);
			selectMenu();
		}
	});
}

