define(["public"],function(public){
	
	var cart = function(){
			var cookieStr = $.cookie("goods");
			if(cookieStr == null || cookieStr ==""){
				$(".cart-none").css("display","block");
				$(".cart-full").css("display",'none');
			}else{
				$(".cart-none").css("display",'none');
				$(".cart-full").css("display","block");
				var listHtml = "";
				var cookieArr = cookieStr.split("&");
				for(var i in cookieArr){
					cookieArr[i] = cookieArr[i].split(",")
				}
				
				for(var j = 0; j < cookieArr.length - 1;j++){
					listHtml +=	
						'<table class="cart-table">'
							 +'<tr>'
							 +'<td class="cart-t-check" style="width:20px;"><input checked="checked"  type="checkbox"></td>'
							 +'<td class="cart-t-img"><a href="#"><img src="'+public.getvalue(cookieArr[j][2],"img","")+'"></a></td>'
							 + '<td class="cart-t-info" style="width:195px;"><a href="#">'+public.getvalue(cookieArr[j][0],"name","") + '</a></td>'
							 +'<td class="cart-t-ub" style="width:75px;"></td>'
							 +'<td class="cart-t-price">￥'+public.getvalue(cookieArr[j][1],"price","")+'</td>'
							 + '<td class="cart-t-num" style="width:185px">'
								 + '<div class="quantity-form" >'
								    + '<a href="#" class="decrement" ></a>'
								     +' <input  class="itxt" oldnum="1" value="'+public.getvalue(cookieArr[j][3],"count","")+'" type="text">'
								      +'<a href="#" class="increment"></a>'
							       +'</div>'
							 + '</td>'
							 + '<td class="cart-t-total">￥<span>'+(parseFloat(public.getvalue(cookieArr[j][1],"price",""))*parseFloat(public.getvalue(cookieArr[j][3],"count","")))
							 +'</span></td>'
							 + '<td class="cart-t-spec">1kg/份</td>'
							 +'<td class="cart-t-opera">'
							      +'<a href="#">移入收藏</a>'
							      +'<br>'
							      +'<a href = "#" class="opera-delect">删除</a>'
							  +'</td>'
							 +'</tr>'	
					 		+'</table>';
				}
				$('#theInsulationCan').html(listHtml);

			//减
				
				$(".quantity-form").delegate(".decrement",'click',function(){
					var index = $(this).parent().parent().parent().parent().parent().index()+1;
					
					var num = parseInt($(this).next(".itxt").val()) - 1;
				 	
					var cookieStr = $.cookie("goods");
					var cookieArr = cookieStr.split("&")

					var name = $(".cart-table .cart-t-info").eq(index).find("a").html();
					// alert(name);
					for(var j = 0; j < cookieArr.length; j++){
						cookieArr[j] = cookieArr[j].split(",");
						for(var k = 0; k < cookieArr[j].length; k++){
							if(cookieArr[j][k] == "name:"+ name){
								if(num < 1){//删除
								 	cookieArr.splice(j,1);
								 	$(".cart-table").eq(index).remove();
								 	location.reload();
								}else{
								 	$(this).next(".itxt").val(num);
								 	var t_total = parseFloat(public.getvalue(cookieArr[j][1],"price",""))*100*(parseInt(public.getvalue(cookieArr[j][3],"count","") )-1)/100;
								 	cookieArr[j][k + 3] = 'count:'+ (parseInt(public.getvalue(cookieArr[j][3],"count",""))-1);
								}
								break;
							}
						}
					}
						
					$.cookie("goods",cookieArr.join("&"),{expires:7,raw:true});
					$(".cart-t-total").eq(index).find("span").html(t_total);
					 public.cartCount();


					 return false;
				})

			//加
				$(".quantity-form").delegate(".increment",'click',function(){
					var index = $(this).parent().parent().parent().parent().parent().index()+1;
					
					var num = parseInt($(this).prev(".itxt").val()) + 1;
					// alert(index);
					var cookieStr = $.cookie("goods");
					var cookieArr = cookieStr.split("&")

					var name = $(".cart-table .cart-t-info").eq(index).find("a").html();
					// alert(name);
					for(var j = 0; j < cookieArr.length; j++){
						cookieArr[j] = cookieArr[j].split(",");
						for(var k = 0; k < cookieArr[j].length; k++){
							if(cookieArr[j][k] == "name:"+ name){
								 $(this).next(".itxt").val(num);
								var t_total = parseFloat(public.getvalue(cookieArr[j][1],"price",""))*100*(parseInt(public.getvalue(cookieArr[j][3],"count",""))+1)/100;
								 cookieArr[j][k + 3] = 'count:'+ (parseInt(public.getvalue(cookieArr[j][3],"count",""))+1);
								break;
							}
						}
					}
					$(".cart-t-total").eq(index).find("span").html(t_total);
					$.cookie("goods",cookieArr.join("&"),{expires:7,raw:true});
					 public.cartCount();
					$(this).prev(".itxt").val(num);

					 return false;
				});
				
				//删除
				
				$(".cart-t-opera").delegate(".opera-delect",'click',function(){
					
					var index = $(this).parent().parent().parent().parent().index()+1;

					var cookieStr = $.cookie("goods");
					var cookieArr = cookieStr.split("&")

					var name = $(".cart-table .cart-t-info").eq(index).find("a").html();
					// alert(name);
					for(var j = 0; j < cookieArr.length; j++){
						cookieArr[j] = cookieArr[j].split(",");
						for(var k = 0; k < cookieArr[j].length; k++){
							if(cookieArr[j][k] == "name:"+ name){
								cookieArr.splice(j,1);
								$(".cart-table").eq(index).remove();
								location.reload();								
								break;
							}
						}
					}						
					$.cookie("goods",cookieArr.join("&"),{expires:7,raw:true});
					
					 public.cartCount();


					 return false;
				})
				//清空购物车
				$(".clearAll").click(function(){
					$.cookie("goods","",{expires:7,raw:true});
					location.reload();
				})
				//全选
				/*$(".cart-t-check label").click(function(){

					if($(this).find('input').attr('checked')=="checked"){
						alert(1);
					}else{
						alert(2);
					}
				})*/
				//删除选中的商品
				/*$(".clearCheck").click(function(){

				})*/
	
		}
	}
	return {
		cart:cart
	}
})