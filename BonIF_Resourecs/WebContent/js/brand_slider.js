$(document).ready(function(){
	// 사용자 수정불가
	createSliderCounter();
	// sliderCounter 생성
	function createSliderCounter(){
		var getSliderLn = $(".brnad .brand_slide_area a").length - 1;
		var sliderCnt = "";
		for(var i = 0 ; i <= getSliderLn ; i++){
			sliderCnt += "<a href=#></a>";
		}
		$(".sliderCounter").empty().append(sliderCnt);
	}

	// 초기정보 (사용자 수정가능)
	var sliderController = $(".brand_slide_wrap"); //슬라이드컨트롤러
	var sliderCounterWrapper = $(".brand_slide_paging");	//슬라이드카운터 랩퍼
	var sliderCounter = $(".brand_slide_paging a");	// dot
	var sliderWrapper = $(".brand_slide_area");	//롤링 래퍼
	var sliderArr = $(".brand_slide_control > a");	//롤링 액션 화살표
	var sliderLeft = $(".btn_prev"); // 롤링 액션 왼쪽
	var sliderRight = $(".btn_next"); // 롤링 액션 왼쪽
	var sliderTarget = $(".slide_list a");	//롤링 타겟
	var sliderTargetImg = $(".slide_list a img");	//롤링 타겟이미지
	var sliderTargetLn = $(".slide_list a").length - 1;	//롤링 이미지 개수

	var sliderArrWd = 60;	// 화살표 넓이
	var sliderArrHt = 60; // 화살표높이
	var sliderArrLeft = 0; // 화살표의 좌우여백 (사용자 지정)
	var sliderArrTop = 30; // 화살표의 상하여백 (vertical - 50% 기준)

	var animateDelay = 300; // 롤링 스피드
	var imgWd = 770;	//이미지 넓이
	var imgHt = 240;	//이미지 높이
	var dotOffsetTop = 40; // 슬라이드 카운터 와의 타겟 영역과의 마진
	var dotOffsetLeft = 10; // 슬라이드 카운터사이의 여백
	var dotImgWd = 14; //슬라이드카운터 이미지 넓이
	var dotImgHt = 14; //슬라이드카운터 이미지 높이

	// 시스템 변수 (사용자 수정불가)
	var animateFlg = 0;

	// 초기화
	sliderInit();

	// 운전
	sliderAction();

	// initial
	function sliderInit(){
		initCss();
		initCounter();
		firstSetting();
		initSliderArr();
	}

	// css init
	function initCss(){
		/* 슬라이드 used css 초기화 */
		sliderController.css({
			"position" : "relative",
			"width" : imgWd,
			"overflow" : "hidden"
		});
		sliderTarget.css({
			"position" : "absolute",
			"left" : "0",
			"top" : "0"
		});
		sliderTarget.find(" > a").css({
			"display" : "block"
		});
		/* 타겟 내부 이미지 초기화 */
		sliderTarget.find("img").css({
			"width" : imgWd,
			"height" : imgHt,
			"vertical-align" : "top",
			"border" : 0
		});
		sliderWrapper.css({
			"position" : "relative",
			"height" : imgHt
		});
	}

	// counter init
	function initCounter(){
		sliderCounter.eq(0).css("margin-left", 0);
	}

	// sliderArrow Setting
	function initSliderArr(){
		sliderLeft.width(sliderArrWd).height(sliderArrHt);
		sliderRight.width(sliderArrWd).height(sliderArrHt);

		sliderLeft.css({
			"position" : "absolute",
			"left" : -sliderArrLeft,
			"top" : sliderArrTop + (imgHt / 2) - (sliderArrHt / 2),
			"text-indent" : -9999
		});
		sliderRight.css({
			"position" : "absolute",
			"left" : imgWd + sliderArrLeft - sliderArrWd,
			"top" : sliderArrTop + (imgHt / 2) - (sliderArrHt / 2),
			"text-indent" : -9999
		});
	}

	// Setting 'left' value of target list.
	function firstSetting(){
		sliderCounter.eq(0).addClass("on");
		for(var i = 0 ; i <= sliderTargetLn ; i++){
			sliderTarget.eq(i).css("left", i * imgWd);
		}
	}

	// action
	function sliderAction(){
		sliderCounter.on("click keypress", function(e){
			// type 처리는 나중에
			var getIdx = $(this).index();
			var calcNowIdx = animateFlg - getIdx;

			action(calcNowIdx, getIdx, imgWd, animateDelay);
			return false;
		});
		// click left button
		sliderLeft.on("click keypress", function(e){
			// type 처리는 나중에
			var arrIdx = animateFlg - 1;
			var calcNowIdx = animateFlg - arrIdx;

			if(arrIdx < 0) return false;

			action(calcNowIdx, arrIdx, imgWd, animateDelay);

			return false;
		});
		// click right button
		sliderRight.on("click keypress", function(e){
			// type 처리는 나중에
			var arrIdx = animateFlg + 1;
			var calcNowIdx = animateFlg - arrIdx;

			if(arrIdx > sliderTargetLn) return false;

			action(calcNowIdx, arrIdx, imgWd, animateDelay);

			return false;
		});
	}

	// slide
	function action(nowIndex, index, dist, animateDelay){
		if(sliderTarget.is(":animated")) return false;
		sliderTarget.animate({
			"left" : "+=" + (nowIndex * dist)
		}, {duration : animateDelay} , {queue:false});
		animateFlg = index;
		sliderCounterAction(animateFlg);
	}

	// sliderCounter class
	function sliderCounterAction(targetNumber){
		sliderCounter.removeClass("on");
		sliderCounter.eq(targetNumber).addClass("on");
	}

	// swipe
	// 만약 해당 target 위에 a태그가 있다면,
	var firstX = 0;
	var lastX = 0;

	sliderTargetImg.on("touchstart", function(e){
		e.preventDefault();
		if(e.originalEvent.targetTouches[0].pageX != "undefined" || e.originalEvent.targetTouches[0].pageX != null)
		firstX = lastX = e.originalEvent.targetTouches[0].pageX;
	});
	sliderTargetImg.on("touchmove", function(e){
		e.preventDefault();
		if(e.originalEvent.targetTouches[0].pageX != "undefined" || e.originalEvent.targetTouches[0].pageX != null)
		lastX = e.originalEvent.targetTouches[0].pageX;
	});
	sliderTargetImg.on("touchcancel", function(e){
		e.preventDefault();
	});
	sliderTargetImg.on("touchend", function(e){
		e.preventDefault();
		if(firstX < lastX) sliderLeft.click();
		if(firstX == lastX) locate($(this));
		else sliderRight.click();
	});

	// a링크 lcoation
	function locate($this){
		// 값이 없으면 리턴.
		if($this == "" || $this == "undefined") return false;

		// URL이 www. 형식이라면 강제로 http 태움
		var getThisLink = $this.parent().attr("href");
		if(getThisLink.substring(0, 3) == "www") getThisLink = "http://" + getThisLink;
		location.href = getThisLink;
	}
});