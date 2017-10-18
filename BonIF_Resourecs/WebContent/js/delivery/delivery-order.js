/**
 * 2017-08-03
 */

var DeliveryOrder = {}

DeliveryOrder.setDeliveryDirection = function() {
	
	if (CNTApi.getCartId() != 0) {
		var param = [];
		param.push('ex=Delivery');
		param.push('ac=selectDeliveryDirection');
		param.push('cartid=' + CNTApi.getCartId());

		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				
				if (data[0].ordertype == "R") {
					$('form#orderexefrm input[name="direction"]').val(data[0].direction);
				}
			}
		});
	}
	
};


DeliveryOrder.showDeliveryDirection = function() {
	
	if (CNTApi.getCartId() != 0) {
		var param = [];
		param.push('ex=Delivery');
		param.push('ac=selectDeliveryDirection');
		param.push('cartid=' + CNTApi.getCartId());

		var self = this;
		$.ajax({
			type : 'get',
			url : "/api.do",
			data : param.join('&'),
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			error : function() {
				// alert('에러:주문 데이터 송수신에 문제가 있습니다.');
			},
			success : function(data) {
				
				if (data[0].ordertype == "R") {
					$('#deliveryDirection').show();
					$('a.btn.gray').prop('href','/order/delivery-orderType?part='+data[0].store_part);
					
					if (data[0].direction != ""){
						
						var directionList = $('#selectDirection option');
						var isTyping = true;
						for (var i=0; i<directionList.length; i++) {
							var directionValue = directionList.eq(i).val();
							if (data[0].direction == directionValue) {
								$('#selectDirection').val(data[0].direction);
								isTyping = false;								
								break;
							}
						}
						
						if (isTyping) {
							$('#selectDirection').val('직접입력');
							$('#DIRECTION').show();
							$('#DIRECTION').attr('readonly', false);
						}
						
						
						$('#DIRECTION').val(data[0].direction);
					}
					
				} else {
					$('#deliveryDirection').hide();
				}
			}
		});
	}
	
};

DeliveryOrder.checkedMaxStringLength = function (textObj, showObj, limitLength) {
	
	var $input =  $(textObj);
	
	var update = function () {
		
		var before = limitLength;
		var now = limitLength - $input.val().length;
		
		if (now < 0) {
			var str = $input.val();
			$input.focus();
			var inputVal = str.substr(0, limitLength);
			alert(limitLength+"자를 초과하였습니다");
			now = 0;
			$input.val(inputVal);
		}
		
		if (before != now) {
			$(showObj).text(now);
		}
		
	}
	
	$input.bind('input keyup paste', function(){
		setTimeout(update,0);
	});
	update();
};