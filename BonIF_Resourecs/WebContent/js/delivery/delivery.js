var protocol = "http";
var url = "59.10.203.212";
var port = "8080";
var jusotitle = "road";
var addr_bunji = null;
var point_x = null;
var point_y = null;
var roadname = null;
var roadcode = null;
var bdname = null;
var bdnum = null;

//상점 타입
var _DELIVERY_STORE_TYPE = $("input[name=part]").val();

var _DELIVERY_STORE_LIST = {};

var _DELIVERY_MAP_OBJECT = null;

function initializationDeliveryStoreList() {
	_DELIVERY_STORE_LIST = {};
}

function initializationMapObject() {
	_DELIVERY_MAP_OBJECT = null;
}

$(document).ready(function() {
	var part = $("input[name=part]").val();

	delivery();
	jusotitle = "road"

	sidolist();
});
function packing() {
	$(".packing_wraper").show();
	$(".delivery_wraper").hide();
	$("input[name=ordertype]").val("P");
}

function delivery() {
	$(".delivery_wraper").show();
	$(".packing_wraper").hide();
	$("input[name=ordertype]").val("R");
	roadAddrPut();
}

function roadAddrPut() {
	var x, y, seq;
	$("#tab01").html(null);
	var userSeq = $("input[name=userSeq]").val();
	var param = [];
	param.push("id=Address");
	param.push("ac=getuseraddrlist");
	param.push("userseq=" + userSeq);
	$
			.ajax({
				url : "/api.do",
				method : "post",
				data : param.join('&'),
				dataType : 'jsonp',
				success : function(data) {
					var html = "";
					// console.log(data);
					if (data[0].seq != "") {
						$
								.each(
										data,
										function(k, v) {
											html += '<table>'
													+ '<colgroup>'
													+ '<col style="width:4rem">'
													+ '<col>'
													+ '<col>'
													+ '</colgroup>'
													+ '<tbody class="addr_list">'
													+ '<tr idx="'
													+ k
													+ '">'
													+ '<td rowspan="4" class="gray_th text_center">'
											if (v.default_flag == "Y") {
												html += '<span class="radio_box on" style="left:0.3rem">'
											} else {
												html += '<span class="radio_box" style="left:0.3rem">'
											}
											html += '<input type="radio" name="category" id="cate'
													+ k
													+ '" value="'
													+ v.seq
													+ '" checked="checked" class="input_check">'
													+ '<span class="fake"></span>'
													+ '<label for="cate1" class="check"></label>'
													+ '</span>'
													+ '</td>'
													+ '<td>배송지명</td>'
											if (v.default_flag == "Y") {
												html += '<td colspan="3" class="text_right">(기본)'
														+ v.d_title + '</td>'
											} else {
												html += '<td colspan="3" class="text_right">'
														+ v.d_title + '</td>'
											}
											html += '</td>'
													+ '</tr>'
													+ '<tr>'
													+ '<td>받는사람</td>'
													+ '<td colspan="3"class="text_right">'
													+ v.username
													+ '</td>'
													+ '</tr>'
													+ '<tr>'
													+ '<td >연락처</td>'
													+ '<td colspan="3" class="font_space text_right">'
													+ v.phone_region
													+ '-'
													+ v.ph1
													+ '-'
													+ v.ph2
													+ '</td>'
													+ '</tr>'
													+ '<tr>'
													+ '<td colspan="4">'
													+ v.addr_append
													+ ' '
													+ v.addr_desc
													+ '</td>'
													+ '</tr>'
													+ '</tbody>'
													+ '</table>'
											if (v.default_flag == "Y") {
												x = v.point_x;
												y = v.point_y;
												seq = v.seq;
											}
										});
						
					} else {}
					
					html += '<div class="btn_foot">'
						+ '<a href="javascript:delAddr();"><span class="text-center bg_gray">삭제</span></a>'
						+ '<a href="javascript:seldefault();"><span class="text-center bg_green">선택</span></a>'
						+ '</div>';
					
					$("#tab01").html(null);
					$("#tab01").append(html);
					if (typeof seq !== "undefined") {
						findStore(x, y, seq);
					}
				}
			});
}


function findStore(x, y, adcd) {
	findStoreVroong(adcd);
}

function nonStore() {
	alert("배달 가능 매장이 없습니다.");
}

function sidolist() {
	// console.log("sidolist");
	var param = [];
	param.push("ex=Gis");
	param.push("protocol=" + protocol);
	param.push("url=" + url);
	param.push("port=" + port);
	param.push("ac=sido");
	param.push("method=API/sigungu_ch_db.do");
	// console.log(param);
	// console.log(jusotitle);
	$.ajax({
		type : 'GET',
		url : "/api.do",
		data : param.join("&"),
		dataType : 'jsonp',
		async : false,
		contentType : 'application/json; charset=utf-8',
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		},
		success : function(data) {
			console.log(data);
			if (data != null) {
				for (var i = 0; i < data.length; i++) {
					html = "";
					html += '<option value="' + data[i].acode + '">'
							+ data[i].name + '</option>';
					// $(".sido_road").append(html);
					if (jusotitle.indexOf("road") != -1) {
						$(".sido_road").append(html);
						/*
						 * $(".sido_road").change(function(data){
						 * console.log(data);
						 * gugunlist(data[i].name,data[i].acode,this); });
						 */
					} else {
						$(".sido_jibun").append(html);
					}
				}
			}
		}
	});
}

$(".sido_road").change(function(e) {
	var name = $(".sido_road option:selected").text();
	var acode = $(".sido_road option:selected").val();
	gugunlist(name, acode, e);
});

$(".sido_jibun").change(function(e) {
	var name = $(".sido_jibun option:selected").text();
	var acode = $(".sido_jibun option:selected").val();
	gugunlist(name, acode, e);
});

function gugunlist(name, acode, e) {
	if (jusotitle.indexOf("road") != -1) {
		$(".gungu_road").html("");
		$(".sido_road").find("li").attr("class", "");
		$(".gunguselect").text("시/군/구");
	} else {
		$(".gungu_jibun").html("");
		$(".sido_jibun").find("li").attr("class", "");
		$(".gunguselect").text("시/군/구");
	}
	$(e).attr("class", "on");
	$(".sidoselect").text(name);

	var param = [];
	param.push("ex=Gis");
	param.push("protocol=" + protocol);
	param.push("url=" + url);
	param.push("port=" + port);
	param.push("ac=gugun");
	param.push("method=API/sigungu_ch_db.do");
	param.push("code=" + acode);
	$.ajax({
		type : 'GET',
		url : "/api.do",
		data : param.join("&"),
		dataType : 'jsonp',
		async : false,
		contentType : 'application/json; charset=utf-8',
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		},
		success : function(data) {
			if (data != null) {
				for (var i = 0; i < data.length; i++) {
					html = "";
					html += '<option value="' + data[i].acode + '">'
							+ data[i].name + '</option>';
					if (jusotitle.indexOf("road") != -1) {
						$(".gungu_road").append(html);
					} else {
						$(".gungu_jibun").append(html);
					}
				}
			}
		}
	});
}

$(".gungu_jibun").change(function(e) {
	var name = $(".gungu_jibun option:selected").text();
	var acode = $(".gungu_jibun option:selected").val();
	donglist(name, acode, e);
});

function roadsearch() {
	$("#search_list").html("<li><a>검색결과가 없습니다.</a></li>");
	var roadname = $("#road_search").val();
	if (roadname == "" || roadname == null) {
		alert("도로명 을 입력해주세요.");
		return;
	}

	var sido = $(".sido_road option:selected").text();
	var gungu = $(".gungu_road option:selected").text();
	var param = [];
	param.push("ex=Gis");
	param.push("protocol=" + protocol);
	param.push("url=" + url);
	param.push("port=" + port);
	param.push("ac=roadsearch");
	param.push("method=API/getRoadname2_db.do");
	param.push("name=" + roadname);

	$
			.ajax({
				type : 'GET',
				url : "/api.do",
				data : param.join("&"),
				dataType : 'jsonp',
				async : false,
				contentType : 'application/json; charset=utf-8',
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				},
				success : function(data) {
					if (data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (data[i].sido == sido && data[i].gugun == gungu) {
								html = "";
								html += "<li idx='"
										+ i
										+ "'><a href='javascript:void(0);' onclick='roadSelect(\""
										+ data[i].roadcode + "\",\""
										+ data[i].roadaddr + "\",\""
										+ data[i].roadname + "\");'>"
										+ data[i].roadaddr + "</a></li>";
								$("#search_list").append(html);
							}
						}
					} else {
						$("#search_list").html("<li><a>검색결과가 없습니다.</a></li>");
						alert("검색값이 없습니다. 다시 입력해 주세요.");
						return;
					}
				}
			});
}

function roadSelect(roadcode, addr, road) {
	roadname = road;
	roadcode = roadcode;
	$("#road_search").val(addr);
	$("#roadCode").val(roadcode);
	$("#roadlist").html(null);
}

function bdSearch() {
	var bdnum = $("#bdnum").val();
	var roadcode = $("#roadCode").val();

	if (roadcode == "" || roadcode == null) {
		alert("검색된 도로명 선택하세요");
		return;
	}
	if (bdnum == "" || bdnum == null) {
		alert("건물번호를 입력해주세요.");
		return;
	}
	$("#search_list").html("");
	var param = [];
	param.push("ex=Gis");
	param.push("protocol=" + protocol);
	param.push("url=" + url);
	param.push("port=" + port);
	param.push("ac=bdnumsearch");
	param.push("method=API/getRoadaddrSearchList2_db.do");
	param.push("roadnum=" + bdnum);
	param.push("code=" + roadcode);

	$
			.ajax({
				type : 'GET',
				url : "/api.do",
				data : param.join("&"),
				dataType : 'jsonp',
				async : false,
				contentType : 'application/json; charset=utf-8',
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				},
				success : function(data) {
					// console.log(data);
					if (data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							html = "";
							if (data[i].bdname != null && data[i].bdname != "") {
								html += "<li idx='"
										+ i
										+ "'><a href='javascript:void(0);' class='btn gray' onclick='roadaddr(\""
										+ data[i].roadcode + "\",\""
										+ data[i].bdname + "\",\""
										+ data[i].point_x + "\",\""
										+ data[i].point_y + "\");'>"
										+ data[i].bdname + "</a></li>";
							} else if (data[i].sn != "0") {
								html += "<li idx='"
										+ i
										+ "'><a href='javascript:void(0);' class='btn gray' onclick='roadaddr(\""
										+ data[i].roadcode + "\",\""
										+ data[i].mn + "-" + data[i].sn
										+ "\",\"" + data[i].point_x + "\",\""
										+ data[i].point_y + "\");'>"
										+ data[i].mn + "-" + data[i].sn
										+ "</a></li>";
							} else {
								html += "<li idx='"
										+ i
										+ "'><a href='javascript:void(0);' class='btn gray' onclick='roadaddr(\""
										+ data[i].roadcode + "\",\""
										+ data[i].mn + "\",\""
										+ data[i].point_x + "\",\""
										+ data[i].point_y + "\");'>"
										+ data[i].mn + "</a></li>";
							}
							$("#search_list").append(html);
						}
					} else {
						$("#search_list").html("<li><a>검색결과가 없습니다.</a></li>");
						alert("검색값이 없습니다. 다시 입력해 주세요.");
						return;
					}
				}
			});
}

function roadaddr(roadcode, roadname, x, y) {
	var road_name = $("#road_search").val();
	if (road_name == "" || road_name == null) {
		alert("검색된 도로명을 선택해주세요");
	}
	var bdnum = $("#bdnum").val();
	// console.log(roadname.indexOf(bdnum));
	if (roadname.indexOf(bdnum) != -1) {
		$("#search_addr").val(road_name + " " + roadname);
	} else {
		$("#search_addr").val(road_name + " " + bdnum + " " + roadname);
	}

	point_x = x;
	point_y = y;
	bdname = roadname;
	roadnum = bdnum;
}

function donglist(name, acode, e) {
	console.log(name);
	console.log(acode);
	$(".dodong").html("");
	$(".gungu").find("li").attr("class", "");
	$(e).attr("class", "on");
	$(".gunguselect").text(name);
	console.log(jusotitle);
	if (jusotitle == "jibun") {
		console.log("in");
		var param = [];
		param.push("ex=Gis");
		param.push("protocol=" + protocol);
		param.push("url=" + url);
		param.push("port=" + port);
		param.push("code=" + acode);
		param.push("ac=dong");
		param.push("method=API/sigungu_ch_db.do");
		// console.log(param);

		$.ajax({
			type : 'GET',
			url : "/api.do",
			data : param.join("&"),
			dataType : 'jsonp',
			async : false,
			contentType : 'application/json; charset=utf-8',
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			},
			success : function(data) {
				console.log(data);
				if (data != null) {
					for (var i = 0; i < data.length; i++) {
						html = "";
						html += '<option value="' + data[i].bcode + '">'
								+ data[i].name + '</option>';
						$(".dodong").append(html);
					}
				}
			}
		});
	}
}

$(".dodong").change(function(e) {
	var name = $(".dodong option:selected").text();
	var bcode = $(".dodong option:selected").val();
	selectComplete(name, bcode, e);
});

function selectComplete(name, bcode, e) {
	$("#jusotext").focus();
	$("#acode").val(bcode);
}

function jusoSearch() {
	var acode = $("#acode").val();
	var jibun = $("#jusotext").val();
	var bunji_list = $("#search_list");

	var sido = $(".sido_jibun option:selected").text();
	var dong = $(".dodong option:selected").text();
	var gungu = $(".gungu_jibun option:selected").text();

	// alert(jibun);
	if (jibun == null || jibun == "") {
		alert("상세주소를 입력해 주세요");
		return;
	}
	var param = [];
	param.push("ex=Gis");
	param.push("protocol=" + protocol);
	param.push("url=" + url);
	param.push("port=" + port);
	param.push("ac=jibunsearch");
	param.push("method=API/getAddrJibun3_db.do");
	param.push("code=" + acode);
	param.push("bunji=" + encodeURIComponent($("#jusotext").val()));

	$
			.ajax({
				type : 'GET',
				url : "/api.do",
				data : param.join("&"),
				dataType : 'jsonp',
				contentType : 'application/json; charset=utf-8',
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				},
				success : function(data) {
					// console.log(data);
					if (data != null) {
						if (data.length != 0) {
							$("#search_list").html("");
							for (var i = 0; i < data.length; i++) {
								if (data[i].ho != '' && data[i].ho != "0") {
									if (data[i].san != '') {
										bunji_list
												.append("<li idx='"
														+ i
														+ "'><a class='text' onclick='inputjuso(this,"
														+ data[i].cx + ","
														+ data[i].cy + ",\""
														+ data[i].san
														+ data[i].bunji + "-"
														+ data[i].ho + "\");'>"
														+ sido + " " + gungu
														+ " " + dong + " "
														+ data[i].san
														+ data[i].bunji + "-"
														+ data[i].ho
														+ "</a></li>");
									} else {
										bunji_list
												.append("<li idx='"
														+ i
														+ "'><a class='text'  onclick='inputjuso(this,"
														+ data[i].cx + ","
														+ data[i].cy + ",\""
														+ data[i].bunji + "-"
														+ data[i].ho + "\");'>"
														+ sido + " " + gungu
														+ " " + dong + " "
														+ data[i].bunji + "-"
														+ data[i].ho
														+ "</a></li>");
									}
								} else {
									if (data[i].san != '') {
										bunji_list
												.append("<li idx='"
														+ i
														+ "'><a class='text' onclick='inputjuso(this,"
														+ data[i].cx + ","
														+ data[i].cy + ",\""
														+ data[i].san
														+ data[i].bunji
														+ "\");'>" + sido + " "
														+ gungu + " " + dong
														+ " " + data[i].san
														+ data[i].bunji
														+ "</a></li>");
									} else {
										bunji_list
												.append("<li idx='"
														+ i
														+ "'><a class='text' onclick='inputjuso(this,"
														+ data[i].cx + ","
														+ data[i].cy + ",\""
														+ data[i].bunji
														+ "\");'>" + sido + " "
														+ gungu + " " + dong
														+ " " + data[i].bunji
														+ "</a></li>");
									}
								}
							}
						} else {
							$("#search_list").html("");
							bunji_list.html("<li>검색값이 없습니다.</li>");
							alert("검색값이 없습니다. 다시 입력해 주세요.");
							return;
						}
					}
				}
			});
}

function inputjuso(e, x, y, bunji) {
	var search_addr = $(e).parent().find("a").text()
	$("#search_addr").val(search_addr);
	point_x = x;
	point_y = y;
	addr_bunji = bunji;
}

function checkAddrNum() {
	var userSeq = $("input[name=userSeq]").val();
	var part = $("input[name=part]").val();
	var param = [];
	param.push("id=Address");
	param.push("ac=getuseraddrlistCount");
	param.push("userseq=" + userSeq);
	$.ajax({
		url : "/api.do",
		method : "post",
		data : param.join('&'),
		success : function(data) {
			$.each($.parseJSON(data), function(k, v) {
				if (v.count >= 5) {
					alert("등록된 배달지가 5개 입니다.\n삭제 후 등록해주세요.");
				} else {
					location.href = "/order/addr?part=" + part;
				}
			});
		}
	});

}

function regAddr() {
	var userSeq = $("input[name=userSeq]").val();
	var part = $("input[name=part]").val();
	var userName = $("#username").val();
	var addr_append = $("#search_addr").val();
	var addr_desc = $("#input_addr").val();
	var phone_region = $("#phone_region option:selected").val();
	var ph1 = $("#ph1").val();
	var ph2 = $("#ph2").val();
	var d_title = $("#d_title").val();
	// var check_flag = $(".checkbox_box2").hasClass("on");
	var default_flag = "N";
	// var jusotitle = "road";
	/*
	 * if(check_flag){ default_flag = "Y"; }else{ default_flag = "N"; }
	 */
	// console.log(userSeq);
	// console.log(userName);
	// console.log(phone_region);
	// console.log(addr_append);
	// console.log(addr_desc);
	// console.log(ph1);
	// console.log(ph2);
	// console.log(d_title);
	if (userSeq == null || userSeq == "") {
		alert("회원정보가 없습니다. 다시로그인해주세요.");
		location.href = "/login";
		return;
	}

	if (d_title == "" || d_title == null) {
		alert("배송지 이름 을 입력해주세요.");
		$("#d_title").focus();
		return;
	}
	if (userName == "" || userName == null) {
		alert("받는 사람 을 입력해주세요.");
		$("#username").focus();
		return;
	}
	if (ph1 == "" || ph1 == null) {
		alert("중간 연락처 를 입력해주세요.");
		$("#ph1").focus();
		return;
	}
	if (ph2 == "" || ph2 == null) {
		alert("마지막 연락처 를 입력해주세요.");
		$("#ph2").focus();
		return;
	}
	if (addr_append == "" || addr_append == null) {
		alert("주소 찾기로 배송지 주소를 입력해주세요.");
		$("#search_addr").focus();
		return;
	}

	if (addr_desc == "" || addr_desc == null) {
		alert("상세 주소를 입력해주세요.");
		$("#input_addr").focus();
		return;
	}

	var param = [];
	param.push("id=Address");
	param.push("ac=insertcustaddr");
	param.push("userseq=" + userSeq);
	param.push("username=" + userName);
	param.push("jusotitle=" + jusotitle);
	param.push("phone_region=" + phone_region);
	param.push("ph1=" + ph1);
	param.push("ph2=" + ph2);
	param.push("d_title=" + d_title);
	param.push("default_flag=" + default_flag);
	if (jusotitle == "jibun") {
		// console.log(jusotitle);
		param.push("si=" + $("#jibunSearch").find(".sidoselect").text())
		param.push("gu=" + $("#jibunSearch").find(".gunguselect").text())
		param.push("dong=" + $("#jibunSearch").find(".dongselect").text())
		param.push("bunji=" + addr_bunji)
		param.push("building=null")
		param.push("addr_append=" + addr_append)
		param.push("addr_desc=" + addr_desc)
		param.push("addr_flag=N")
		param.push("point_x=" + point_x)
		param.push("point_y=" + point_y)
	} else {
		// console.log(jusotitle);
		param.push("si=" + $("#roadSearch").find(".sidoselect").text())
		param.push("gu=" + $("#roadSearch").find(".gunguselect").text())
		param.push("roadname=" + roadname)
		param.push("roadnum=" + roadnum)
		param.push("building=" + bdname)
		param.push("addr_append=" + addr_append)
		param.push("addr_desc=" + addr_desc)
		param.push("addr_flag=N")
		param.push("point_x=" + point_x)
		param.push("point_y=" + point_y)
	}

	// console.log(param);
	$.ajax({
		url : "/api.do",
		method : "post",
		data : param.join('&'),
		dataType : 'jsonp',
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			alert("주소등록 실패 다시 시도 해주세요.");
		},
		success : function(data) {
			if (data[0].result == 1) {
				alert("주소등록이 완료되었습니다.");
				location.href = "/order/orderType?part=" + part;
			} else {
				alert("주소등록 실패 다시 시도 해주세요.");
				location.reload(true);
			}
		}
	});
}

function recentAddr() {
	$("#tab02").html("");
	var userSeq = $("input[name=userSeq]").val();
	var param = [];
	param.push("ex=Order");
	param.push("ac=getRecentDeliveryAddr");
	param.push("userseq=" + userSeq);
	$
			.ajax({
				url : "/api.do",
				method : "post",
				data : param.join('&'),
				success : function(data) {
					// console.log(data);
					var html = "";
					$
							.each(
									$.parseJSON(data),
									function(k, v) {
										html += '<table class="recent">'
												+ '<colgroup>'
												+ '<col style="width:4rem">'
												+ '<col>' + '<col>' + '<col>'
												+ '</colgroup>'
												+ '<tbody class="recent_list">'
												+ '<tr idx="'
												+ k
												+ '">'
												+ '<td rowspan="4" class="gray_th text_center">'
												+ '<span class="radio_box" style="left:0.3rem">'
												+ '<input type="radio" name="category" id="cate'
												+ k
												+ '" checked="checked" class="input_check">'
												+ '<input type="hidden" name="point_x" value="'
												+ v.point_x
												+ '"/>'
												+ '<input type="hidden" name="point_y" value="'
												+ v.point_y
												+ '"/>'
												+ '<input type="hidden" name="seq" value="'
												+ v.seq
												+ '"/>'
												+ '<span class="fake"></span>'
												+ '<label for="cate1" class="check"></label>'
												+ '</span>'
												+ '</td>'
												+ '<td>배송지명</td>'
												+ '<td colspan="3" class="text_right">'
												+ v.d_title
												+ '</td>'
												+ '</td>'
												+ '</tr>'
												+ '<tr>'
												+ '<td>받는사람</td>'
												+ '<td colspan="3" class="text_right">'
												+ v.username
												+ '</td>'
												+ '</tr>'
												+ '<tr>'
												+ '<td>연락처</td>'
												+ '<td colspan="3" class="font_space text_right">'
												+ v.phone_region
												+ '-'
												+ v.ph1
												+ '-'
												+ v.ph2
												+ '</td>'
												+ '</tr>'
												+ '<tr>'
												+ '<td colspan="4">'
												+ v.addr_append
												+ ' '
												+ v.addr_desc
												+ ' </td>'
												+ '</tr>'
												+ '</tbody>'
												+ '</table>'
									});
					html += '<div class="btn_area mt40">'
							+ '<a href="javascript:selrecent();" class="btn bg_green pd0">선택</a>'
							+ '</div>';
							
					$("#tab02").append(html);
				}
			});
}

function seldefault() {
	var userSeq = $("input[name=userSeq]").val();
	var seq = $("#tab01").find(".on").find("input[name=category]").val();
	var param = [];
	param.push("id=Address");
	param.push("ac=updateDefaultReset");
	param.push("mb_no=" + userSeq);
	$.ajax({
		url : "/api.do",
		method : "post",
		data : param.join('&'),
		dataType : 'jsonp',
		success : function(data) {
			// console.log(data);
			if (data[0].result > 1) {
				var param = [];
				param.push("id=Address");
				param.push("ac=updateDefaultDeliver");
				param.push("mb_no=" + userSeq);
				param.push("seq=" + seq);
				$.ajax({
					url : "/api.do",
					method : "post",
					data : param.join('&'),
					dataType : 'jsonp',
					success : function(data) {
						if (data[0].result == "1") {
							roadAddrPut();
						} else {
							alert("기본 배송지 설정 실패 하였습니다.\n 잠시 후 다시 시도해주세요");
							return;
						}
					}
				});
			} else {
				// console.log("기본 배송지 초기화 실패");
			}
		}
	});
}

function delAddr() {
	var userSeq = $("input[name=userSeq]").val();
	var seq = $(".addr_list").find(".on").find("input[name=category]").val();
	var param = [];
	param.push("id=Address");
	param.push("ac=deluseraddr");
	param.push("mb_no=" + userSeq);
	param.push("seq=" + seq);
	$.ajax({
		url : "/api.do",
		method : "post",
		data : param.join('&'),
		dataType : 'jsonp',
		success : function(data) {
			if (data[0].result == "1") {
				location.reload(true);
			} else {
				alert("삭제 중 오류가 발생하였습니다.\n 잠시 후 다시 시도해주세요");
				return;
			}
		}
	});
}

function cancelAddr() {
	var part = $("input[name=part]").val();
	location.href = "/order/orderType?part=" + part;
}

function selrecent() {
	if ($(".recent_list .radio_box").hasClass("on")) {
		var x = $(".recent_list .on").find("input[name=point_x]").val();
		var y = $(".recent_list .on").find("input[name=point_y]").val();
		var seq = $(".recent_list .on").find("input[name=seq]").val();
		findStore(x, y, seq);
	} else {
		alert("선택된 배송지가 없습니다.");
	}
}

function shopDetail(x, y) {
	console.log("shopDetail");
	var tab = ($('ul.tab_menu .on').attr("data-tab"));
	if (tab == "tab01") {
		$(".accordion-content").removeClass("hide");
		$(".accordion-content").addClass("active");
		var mapContainer = document.getElementById('map1') // 지도를 표시할 div
	} else {
		$(".accordion-content").removeClass("hide");
		$(".accordion-content").addClass("active");
		var mapContainer = document.getElementById('map2') // 지도를 표시할 div
	}
	// console.log(document.getElementById('map1'));
	mapOption = {
		center : new daum.maps.LatLng(x, y), // 지도의 중심좌표
		level : 7
	// 지도의 확대 레벨
	};

	var map = new daum.maps.Map(mapContainer, mapOption);
	// console.log(mapContainer);
	// 지도 축소 확대 아이콘
	var zoomControl = new daum.maps.ZoomControl();
	map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

	var coords = new daum.maps.LatLng(x, y);
	// ../img/map/ico_marker.png
	// 마커이미지
	var imageSrc = "../img/map/ico_marker.png" // 마커이미지의 주소입니다

	var imageSize = new daum.maps.Size(33, 50), // 마커이미지의 크기입니다
	imageOprion = {
		offset : new daum.maps.Point(16.5, 50)
	}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

	var marker = new daum.maps.Marker({
		map : map,
		position : coords,
		image : new daum.maps.MarkerImage(imageSrc, imageSize, imageOprion),

	});
}

function findStoreVroong(adcd) {
	CNTApi.setMyAddrSeq(adcd);
	
	var tab = ($('ul.tab_menu .on').attr("data-tab"));
	
	initializationDeliveryStoreList();
	
	$('input#selectDeliverySeq').val(adcd);
	// adcd -> 등록된 사용자 배달지 SEQ
	var param = {
			"ex" : "Delivery",
			"ac" : "getStoreList",
			"seq" : adcd,
			"part" : _DELIVERY_STORE_TYPE
	};
	
	$.ajax({
		url: "/api.do",
		method: "post",
		data : param,
		dataType : 'json',
		async: false,
		success: function(data) {
			
			var html = "";
			
			var storeList = data.store;
			var delivery = data.delivery;
			var length = storeList.length;
			
			if (length > 0) {
				
				_DELIVERY_STORE_LIST = storeList;
				
				var trueOrderIndex = 0;
				
				var storeIndex = 0;
				
				for (var i=0; i<length; i++) {
				
					storeIndex = i;
					
					var isOrder = storeList[i].status; 
					
					var storeInfo = storeList[i].storeInfo;
					
					// 상점 정보가 없을경우 회피
					if (typeof storeInfo == 'undefined' || storeInfo == null) {
						continue;
					}
					
					if (!isOrder) {
						continue;
					}
					
					var imageIndex = (i+1) < 10 ? "0"+(i+1) : (i+1);
					
					html += '<li class="accordion-item store-item-'+imageIndex+'" data-accordion-item="">';
					html += '<a href="javascript:accordionAction('+storeIndex+')" class="accordion-title" aria-controls="10fuss-accordion" role="tab" id="10fuss-accordion-label" aria-expanded="false" aria-selected="false">';
					html += storeInfo.chainname;
					html += '<span class="addr">'+storeInfo.addr1+' '+storeInfo.addr2+'</span>';
					html += '<span class="tel">'+storeInfo.tel1+'</span>';
					html += '</a>';
					html += '<div class="accordion-content" data-tab-content="" role="tabpanel" aria-labelledby="10fuss-accordion-label" aria-hidden="true" id="10fuss-accordion" style="display: none;">';
					html += '<div id="daumMap-'+storeIndex+'"  style="width: 100%; height: 25rem; margin-bottom: 1.9rem;"></div>'
					html += '<div class="store-info">';
					html += '<div class="btn_area mt40">';
					html += '<a href="javascript:goMenu('+storeIndex+');" class="btn bg_green pd0">매장선택</a>';
					html += '</div>';
					html += '</div>';					
					html += '</div>';
					html += '</li>';
				
				}
				
				$("#branch_list").html("");
				$("#branch_list").append(html);
				
				if ($("#branch_list li").length > 0) {
					accordionAction(0);
				}
				
			} else {
				html += '<li class="none"><p>배달 가능한 매장이 없습니다.</p></li>';
				
				$("#branch_list").html("");
				$("#branch_list").append(html);
			}
			
		}
	});
	
	
	//alert("부릉연계 합니다");
}

function goMenu(storeIndex) {
	
	var storeInfo = getStoreInfo(storeIndex);
	
	if (typeof storeInfo == 'undefined' || storeInfo == null) {
		alert('매장을 선택해주세요.');
		return;
	}
	var storeCd = storeInfo.seq;
	
	if( CNTApi.getStoreInfo(storeCd) ){
		if(CNTApi.setStoreInfo()) {
			//console.log(part);
			if(StoreInfo.store_del_mk == "L"){
				var retmsg = CNTApi.checkPosStore();
				console.log("매장상태는:"+retmsg);
				if(retmsg == "1") {
					CNTApi.setStoreId(storeCd);
					location.href = "/order/menu?part="+_DELIVERY_STORE_TYPE+"&ordertype=R";
				} else {
					alert(retmsg);
				}
			}else{
				alert("본주문이 불가한 매장입니다.");
			}
		} else {
			alert("매장정보 설정 중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
		}
	} else {
		alert("매장정보 설정중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
	}
}

function getStoreInfo(storeIndex) {
	var store = _DELIVERY_STORE_LIST[storeIndex]; 
	return store.storeInfo;
}

// DaumMap

function showDaumMap(storeIndex) {
	
	initializationMapObject();
	
	var storeInfo = getStoreInfo(storeIndex)
	
	var lat = storeInfo.ch_lat;
	var lng = storeInfo.ch_lng;
	var imageSrc = "../img/map/ico_marker.png";
	//var imageSrc = getStoreMarkerImageSrc(storeIndex);
	
	var container = document.getElementById('daumMap-'+storeIndex);
	
	container.innerHTML="";
	
	var options = {
			center : getDaumMapLatLng(lat, lng),
			level : 3
	}
	
	_DELIVERY_MAP_OBJECT = new daum.maps.Map(container, options);
	
	showMapMaker(lat, lng, imageSrc);
	
	// 이동 막기
	_DELIVERY_MAP_OBJECT.setDraggable(false);
	// 축소/확대 막기
	_DELIVERY_MAP_OBJECT.setZoomable(false);
}

function getDaumMapLatLng(lat, lng){
	return new daum.maps.LatLng(lat, lng);
} 

function showMapMaker(lat, lng, imageSrc) {
	
	var imageSize = new daum.maps.Size(33, 50), // 마커이미지의 크기입니다
    imageOprion = {offset: new daum.maps.Point(16.5, 50)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
	
	var maker = new daum.maps.Marker({
		position : getDaumMapLatLng(lat, lng),
		image : new daum.maps.MarkerImage(imageSrc, imageSize, imageOprion)
	});
	
	maker.setMap(_DELIVERY_MAP_OBJECT);
}

function getStoreMarkerImageSrc(storeIndex) {
	var imageIndex = storeIndex+1;
	return "../img/map/map_spot"+(imageIndex < 10 ? "0"+imageIndex : imageIndex )+".png"; 
}

function accordionAction(storeIndex) {
	
	var accordionItems = $('ul#branch_list li.accordion-item');
	
	var accordionItem = accordionItems.eq(storeIndex);
	
	for (var i=0; i<accordionItems.length; i++) {
		if (i != storeIndex){
			accordionItems.eq(i).removeClass('is-active');
			accordionItems.eq(i).find('.accordion-content').hide();
		}
	}
	
	if (accordionItem.hasClass('is-active')) {
		accordionItem.removeClass('is-active');
		accordionItem.find('.accordion-content').hide();
		return;
	}
	
	if (accordionItem.length > 0) {
		accordionItem.addClass('is-active');
		accordionItem.find('.accordion-content').show();
	}
	
	showDaumMap(storeIndex);
}

