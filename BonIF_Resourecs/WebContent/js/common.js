/*********** [ 윈도우 리사이징 ] *************************************************/

function resize_window(){
	$(window).resize();
}

/*********** [ navigation 초기화 ] **********************************************/

function init_nav(){
	/* off-canvas : 닫기버튼 상태 변경 */
	$(".off-canvas").on("opened.zf.offcanvas", function(e) {
		if( $(this).hasClass('position-left') ){
			$('.close-button').css({ 'left' : '1.5rem', 'right' : 'initial' });
		}else{
			$('.close-button').css({ 'right' : '1.5rem', 'left' : 'initial' });
		}
		$('.close-button').removeClass('hide');
	});

	/* off-canvas : 닫기버튼 클릭 처리 */
	$(".close-button").click(function() {
		$('.off-canvas-wrapper-inner').removeClass('is-off-canvas-open');
		$('.off-canvas-wrapper-inner').removeClass('is-open-left');
		$('.off-canvas-wrapper-inner').removeClass('is-open-right');
		$('.off-canvas.position-left').removeClass('is-open');
		$('.off-canvas.position-right').removeClass('is-open');
		$('.close-button').addClass('hide');
		$('.js-off-canvas-exit').removeClass('is-visible');
	});
	
	/* off-canvas : 닫기버튼 클릭 처리 */
	$(".close-button-after").click(function() {
		$('.off-canvas-wrapper-inner').removeClass('is-off-canvas-open');
		$('.off-canvas-wrapper-inner').removeClass('is-open-left');
		$('.off-canvas-wrapper-inner').removeClass('is-open-right');
		$('.off-canvas.position-left').removeClass('is-open');
		$('.off-canvas.position-right').removeClass('is-open');
		$('.close-button').addClass('hide');
		$('.js-off-canvas-exit').removeClass('is-visible');
	});

	/* off-canvas : close 이벤트 발생시 닫기버튼 상태변경 */
	$(".off-canvas").on("closed.zf.offcanvas", function(e) {
		$('.close-button').addClass('hide');
	});
}

/*********** [ 콘텐츠 슬라이더 ] **************************************************/

// 아코디언 내 슬라이더 높이갑 보정
function resize_slider(){
	var slider_h = 0;
	$('.orbit .orbit-content').each(function() {
		if( $(this).height() > slider_h ){ slider_h = $(this).height(); }
	});
	$('.orbit-container').css({ 'height':'auto' });
	$('.orbit-container > li').css({
		'height':slider_h + 'px',
		'max-height':slider_h + 'px'
	});
}

/*********** [ 콘텐츠 영역 최소 높이값 설정 ] ***************************************/

function min_content_height(){
	var h_device = $(window).outerHeight(true);
	var h_header = $('#header').outerHeight(true);
	var h_banner = $('#shortcut-banner').outerHeight(true);
	var h_footer = $('#footer').outerHeight(true);
	var h_kv = 0;
	if($('#kv').length){ h_kv = $('#kv').outerHeight(true); }
	var h_obj = h_header + h_kv + h_banner + h_footer;
	var h_content_min = 0;
	if(h_device <= h_obj){
		h_content_min = 100;
	}else{
		h_content_min = h_device - h_obj;
	}
	$('.container').css('min-height', h_content_min + 'px');
}

/*********** [ toggle checkbox ] ************************************************/

function toggleChkbox($this){
	var input = $($this).find('input:checkbox');
	var el = $($this).find('span.checkbox');
  var chked = el.hasClass('checked');
  if(chked){
    el.removeClass('checked');
    input.attr('checked', false);
	if($(input).hasClass('.check-all')){
		$("input[type=checkbox]").attr("checked",true);
	}
  }else{
    el.addClass('checked');
    input.prop('checked', true);
	if($(input).hasClass('.check-all')){
		$("input[type=checkbox]").attr("checked",false);
	}
  }
}
/*********** [ 매장찾기 및 위치정보 ] **********************************************/

// 검색조건
function watch_dropdown(targetID){

	switch (targetID){

		// 매장찾기 드롭다운 선택
		case 'flagship-option-brand|flagship-option-region' :
			$('#' + targetID + ' a').click(function(e) {
				console.log('click!');
				//e.preventDefault();
				code = $(this).attr('rel');
				console.log('code : ' + code);
			});
			break;

		default :
			break;

	}

}

// 위치정보 수집
function get_geo_location() {
	if (!!navigator.geolocation){
		navigator.geolocation.getCurrentPosition(geo_success_callback,geo_error_callback);
	}else{
		alert("이 브라우저는 위치정보를 지원하지 않습니다");
	}
}

// 위치정보 수집 > 콜백 (error)
function geo_error_callback(error){
	alert(error.message);
}

// 위치정보 수집 > 콜백 (success)
function geo_success_callback(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	console.log('lat : ' + lat);	// [Note] 개발 진행하실때 삭제해 주세요!
	console.log('lng : ' + lng);	// [Note] 개발 진행하실때 삭제해 주세요!
	setPostion(position);
}

/*****************************************************************************/

$(document).foundation();

$(document).ready(function() {

	init_nav();								// navigation 초기화
	min_content_height();			// 콘텐츠 영역 최소 높이값 설정

  // toggle checkbox
  $('.custom-chkbox').unbind("click").bind("click", function(e){
	  e.preventDefault();
	  toggleChkbox($(this));
  });

  $("#form-saveid").trigger("change", true);
  
  // 체크 박스 전체 체크
	$("#check_all").click(function(){
		if($('#check_all > input').prop('checked')){
			$('.check_box > input').prop('checked', true);
			$('.check_box > .checkbox').addClass('checked');
		}else{
			$('.check_box > input').prop('checked', false);
			$('.check_box > .checkbox').removeClass('checked');
		}
	});

  // 위치정보 수집
  // 위치정보를 사용하는 페이지의 html 태그에 'geo' 클래스를 추가해 주세요
  // (예 : <html class="no-js geo">)
  if($('html').hasClass('geo')){
  	get_geo_location();
  }

  // 슬라이드
  if($(document).find('.content-slider')){
	  // 아코디언 클릭 이벤트 (아코디언 내부 슬라이더 넓이값 계산)
	  $('.accordion-item').click(function() {
	  	resize_slider();
	  });
  }

	// 라디오버튼 이벤트
	$(this).find(".radio_box").click(function(){
		$(this).addClass("on").siblings().removeClass("on");
	});

	// 팝업레이어 닫기 이벤트
	$(".popup_area .ly_close").click(function(){
		$(this).parents(".popup_area").hide();
		$(".dimmed").hide();
		$('body').removeClass('fixed')
	});

	// 카운트
	$(document).on('click','.item_count a',function(e){
		e.preventDefault();
		var cntArea = $(this).parent().find('input');
		var cnt = Number(cntArea.val());
		if( ($(this).hasClass('btn_minus')) && (cnt >= 2) ){
			cntArea.val(cnt-1);
		}
		if( $(this).hasClass('btn_plus') ){
			cntArea.val(cnt+1);
		}
	});

	// 주문정보 삭제
	/*$('.order .btn_del').click(function(e){
		e.preventDefault();
		$(this).parent().parent().parent().remove();
	});*/

	// select box goto url
	/*$('select').change(function(){
		alert("@@@@@2");
		if($(this).attr('data-link') == 'yes'){
			var url = $(this).val();
			if(url != ''){
					location.href = url;
			}
		}
	});*/
});

//main accordion ui : new
$('.ac-toggle').click(function(e) {
	e.preventDefault();
var $this = $(this);
	$('.ac-toggle').removeClass('active');
if ($this.next().hasClass('show')) {
  $this.next().removeClass('show');
  $this.next().slideUp(350);
} else {
	$this.addClass('active');
	$this.parent().parent().find('li .ac-inner').removeClass('show');
	$this.parent().parent().find('li .ac-inner').slideUp(350);
	$this.next().toggleClass('show');
	$this.next().slideToggle(350);
}
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*
 * CNT 공통 함수
 */
$(document).ready(function(){
	// 숫자만 입력
	$("input:text[numberOnly]").on("keyup paste", function(e) {
		var tmp_val = e.originalEvent.clipboardData ? e.originalEvent.clipboardData.getData("text/plain") : $(this).val();
		$(this).val(tmp_val.replace(/[^0-9]/gi,""));
    });
	
	//첫번째 팝업 오늘하루 보지않기
	var cookiedata = document.cookie;
	$('.pop_oreder').hide();
	$('.pop_oreder .check_box').click(function() {
		if (document.getElementById('todayPopChk_order').checked){
			setCookie( "todayPop_order", "done" , 1 );
			$('.pop_oreder').fadeOut();
		}else{
			setCookie( "todayPop_order", "done" , 0 );
		}
	});
	

	if (cookiedata.indexOf("todayPop_order=done") < 0 ) {
		$('.pop_oreder').show();
		return false
	}
	
});

// 특수문자 입력 방지
function fnCheckSpText(obj){
	var re = /[~!@\#$%^&*\()\-=+_']/gi; 
	var temp = obj.value;
	 
	if(re.test(temp)){ 
		//특수문자가 포함되면 삭제하여 값으로 다시셋팅
		$(obj).val(temp.replace(re,""));
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//쿠키 셋팅
function setCookie (name,value,expiredays){
  var exdate = new Date();
  exdate.setDate(exdate.getDate()+expiredays);
  var cookie = null;
  cookie = document.cookie;
  cookie = name+"="+escape(value)+ "; path=/" + ((expiredays==null)?"":";expires="+exdate.toGMTString());
  //cookie.Path = "/";
  document.cookie = cookie;
}

