define(["public"],function(public){
	var goods = function(){
		//商品详情页面
		//动态加载
		
		loadDetail();
		function loadDetail(){
			$(".content").css("display","none");
			$.ajax({
				url:"../data/detail-data.json",
				method:"get",
				success:function(data){
					var crumbsHtml = '<a class="ml0" href="index.html">'+data[0].class[0]+'</a>&gt;<a href="#">'+data[0].class[1]+'</a>&gt;<a href="#">'+data[0].class[2]+'</a>&gt;'+data[0].title;
					$(".crumbs").html(crumbsHtml);

					var b_box_all ='<img src="'+ data[0].img[0]+'" ><img src="'+ data[0].img[1] +'" ><img src="'+data[0].img[2]+'" >';
					$("#b_box_all").html(b_box_all);

					var s_box = '<div class="mark_box"></div><div class=position_box></div>'
							+'<img src="'+data[0].img[0]+'" class="visible" style="z-index: 10">'
							+'<img src="'+data[0].img[1]+'" style="z-index: 5">'
							+'<img src="'+data[0].img[2]+'" >';
					$("#s_box").html(s_box);

					var picListHtml = "";
					for(var i = 0; i<data[0].img.length; i++){
						picListHtml += '<li><img src="'+data[0].img[i]+'" width="85" height="85"></li>';
					}
					$(".picList ul").html(picListHtml);

					var iconHtml = '<img src="'+ data[0].icon +'" width="46" height="46">';
					$(".pic-icon").html(iconHtml);

					var nameHtml = '<h1>'+data[0].title +'</h1><p>'+data[0].desc+'</p>';
					$(".summary-name").html(nameHtml);

					var priceHtml = '<span>价格：</span><span><em>¥</em><strong>'+data[0].price+'</strong></span>';
		              $(".pro-price div").html(priceHtml);

		            var viewHtml = '<p>总体满意度</p><p><b>'+data[0].evaluate+'</b> 分</p><p><a href="#comment" id="pllabel"><span>(评论数604)</span></a></p>' 
		             $(".pro-review").html(viewHtml);

		             var likeHtml = '';
		             for(var j = 0; j< data[0].like.length; j++){
		             	likeHtml += '<div class="like">'
								+'<div class="img"><img src="'+data[0].like[j].img+'" width="68" height="68"></div>'
								+'<div class="text">'
									+'<a href="#">'
										+'<strong>'+data[0].like[j].title+'</strong>'
                       					+'<span>¥<b>'+data[0].like[j].price+'</b></span>'
									+'</a>'
								+'</div><a  class="add">加入购物车</a></div>'
								
		             } 
		             $('.left-box .bd').html(likeHtml);

		             var hotHtml ='';
		             for(var k = 0; k<data[0].hotsale.length; k++){
		             	hotHtml += 
				                   '<li> <div class="p-img"><a href="#">'
				                            +'<img src="'+data[0].hotsale[k].img +'" width="135" height="135"></a>'        
				                    +'</div>'
				                    +'<div class="p-name"><a href="#">'+data[0].hotsale[k].title+'</a></div>'
				                    +'<div class="p-price">'
				                        +'<strong>'+data[0].hotsale[k].price+'</strong>'
				                            +'<del>'+data[0].hotsale[k].dprice+'</del>'     
				                    +'</div></li>'
				                
		             }
		             $(".hot-sale .bd ul").html(hotHtml);

		             var picHtml = '<div id="ProductAttribute"><table class="detail-table"><tr><th>商品状态</th><td>冷藏</td></tr></table></div>';
		             for(var l = 0; l < data[0].detailImg.length; l++){
		             	picHtml += '<p><img class="lazy" src="'+data[0].detailImg[l]+'"><br/></p>';
		             }				
		             $(".detail-item").html(picHtml);				    
		            $(".content").css("display","block");


		            public.cartCount();

		            $(".picList").delegate("li","mouseover",function(){
						$(".pic-big").find("img").css("opacity",0).removeClass("visible");
						$(".pic-big").find("img").eq($(this).index()).stop()
						.animate({opacity:1},500,"linear").addClass("visible");

						$(this).siblings().css("border-color","#bcbcbc");
						$(this).css("border-color","#008842");

						$("#b_box_all").find("img").css("opacity",0);
						$("#b_box_all").find("img").eq($(this).index()).css("opacity",1);
					})

					magnify();

					// 猜你喜欢-加入购物车
					$(".like").delegate(".add",'click',function(){
						var n = $(this).parent().index();
						var cookieStr = $.cookie("goods");
						var count = 1;
						var value = '';
						if(cookieStr == null){
							value = "name:"+ $(".text a strong").eq(n).html() + ",price:" + 
							$(".text a span b").eq(n).html()+",img:"+ $(".img img").eq(n).attr("src") 
							+",count:" + 1 +"&";
							$.cookie("goods",value ,{expires:7,raw:true});
						}else{
							
							var cookieArr = cookieStr.split("&");

							//判断是否有该商品
							var isHave = false
							for(var j = 0; j < cookieArr.length; j++){
								cookieArr[j] = cookieArr[j].split(",");
								for(var k = 0; k < cookieArr[j].length; k++){
									if(cookieArr[j][k] == "name:"+$(".text a strong").eq(n).html()){
										cookieArr[j][k + 3] = 'count:'+ (parseInt(public.getvalue(cookieArr[j][3],"count",""))+count);
										isHave = true;	
									}
								}
							}
							if(isHave){
								$.cookie("goods",cookieArr.join("&"),{expires:7,raw:true});
							
							}else{
								value = "name:"+ $(".text a strong").eq(n).html() + ",price:" + 
								$(".text a span b").eq(n).html()+",img:"+ $(".img img").eq(n).attr("src")+",count:" + count +"&";
								$.cookie("goods",cookieStr+value,{expires:7,raw:true});
							}
						}
						public.cartCount();

						var oDiv = $(this).parent().find("img").clone();
						oDiv.css("position","absolute").css("z-index",'10');
						oDiv.prependTo($(this).parent()).addClass("movecart").css("border","1px solid #dfdfdf");
						oDiv.stop().animate({width:30,height:30},1000,function(){
							parabola(1040,-800);				
						});

						return false;
					});

					$(".decrease").click(function(){
						var valnum = parseInt($("#p_number").val()) - 1;
						if(valnum >= 1){				
							$("#p_number").val(valnum);
						}
					});
					$(".increase").click(function(){
						var valnum = parseInt($("#p_number").val())+ 1;
						$("#p_number").val(valnum);		
					});

					//加入购物车
		
					$(".addcart").click(function(){
						//cookie
						
						var cookieStr = $.cookie("goods");
						var count = parseInt($("#p_number").val());
						var value = '';

						if(cookieStr == null){
							value = "name:"+ $(".summary-name h1").html() + ",price:" + 
							$(".pro-price").find("strong").html()+",img:"+ $(".pic-big img").eq(0).attr("src") +",count:"+count +"&";
							
							$.cookie("goods",value,{expires:7,raw:true});
							public.createCartPopup();
						}else{
							
							var cookieArr = cookieStr.split("&");

							//判断是否有该商品
				
							var isHave = false;
							for(var j = 0; j < cookieArr.length; j++){
								cookieArr[j] = cookieArr[j].split(",");
								for(var k = 0; k < cookieArr[j].length; k++){
									if(cookieArr[j][k] == "name:"+$(".summary-name h1").html()){
										cookieArr[j][k + 3] = 'count:'+ (parseInt(public.getvalue(cookieArr[j][3],"count",""))+count);	
										isHave = true;
										break;
									}
								}
							}
							if (isHave) {
								$.cookie("goods",cookieArr.join("&"),{expires:7,raw:true});
							}else{
								value = "name:"+ $(".summary-name h1").html() + ",price:" + $(".pro-price").find("strong").html()+",img:"+ $(".pic-big img").eq(0).attr("src") +",count:"+count + "&";
								$.cookie("goods",cookieStr +value ,{expires:7,raw:true});
							}

							public.createCartPopup();
						}

						public.cartCount();
						
						
						var oDiv = $(".pic-big").find(".visible").clone();
						oDiv.appendTo($(".pic-big")).addClass("movecart").css("border","3px solid #fff");
						oDiv.stop().animate({width:40,height:40},1000,function(){
							parabola(1040,-140,);
										
						});
						
					});
					
				}

			});

		}
		
 

		function magnify(){
			$(".mark_box").mouseover(function(){
				$('.position_box').css('display','block');
				$('#b_box').css('display','block');

			})
			$(".mark_box").mouseout(function(){
				$('.position_box').css("display",'none');
				$('#b_box').css("display",'none');
			})

			$(".mark_box").mousemove(function(ev){
				
				// alert(ev.offsetX);
				var left=ev.offsetX-$('.position_box').width()/2;

				if(left<0){
					left=0;
				}else if(left>$('#s_box').width()-$('.position_box').width()){
					left=$('#s_box').width()-$('.position_box').width();
				}
				
				$('.position_box').css('left',left);

				var top=ev.offsetY-$('.position_box').height()/2;
				if(top<0){
					top=0;
				}else if(top>$('#s_box').height()-$('.position_box').height()){
					top=$('#s_box').height()-$('.position_box').height()
				}
				$('.position_box').css('top',top);

				//移动的比例  把X值和Y值换算成比例;

				var proportionX=left/($('#s_box').width()-$('.position_box').width());
				var proportionY=top/($('#s_box').height()-$('.position_box').height());

				// console.log(proportionX+':'+proportionY)

				//利用比例去算出大小不同的元素的偏移距离；

				$('#b_box_all').css('left',-proportionX*($('#b_box_all').width()-$('#b_box').width()));

				$('#b_box_all').css('top',-proportionY*($('#b_box_all').height()-$('#b_box').height()));

			});
		}
		//计数
		// function public.cartCount(){
		// 	var allCount = 0;
		// 	var sum = 0;
			
		// 	if($.cookie("goods")){
		// 		var cookieArr = $.cookie("goods").split("&");
		// 		for(var i in cookieArr){
		// 			cookieArr[i] = cookieArr[i].split(",")
		// 		}
		// 		for(var m = 0; m < cookieArr.length - 1; m++){
		// 			 allCount = allCount +(parseInt(public.getvalue(cookieArr[m][3],"count","")));
					
		// 			 sum = ((sum*100 + parseInt(public.getvalue(cookieArr[m][3],"count",""))*(parseFloat(public.getvalue(cookieArr[m][1],"price",""))*100)))/100;
					
		// 		}

		// 	}

		// 	$(".shopping-cart i").html(allCount);
		// 	$(".m-cart i").html(allCount);
		// 	if(sum == 0){
		// 		$(".totlePrice").html("0.0");	
		// 	}else{
		// 		$(".totlePrice").html("￥" + sum);
		// 	}

		// 	$(".fs14").find('span').html(sum);
			
		// }


		// function public.getvalue(str,key,end){
		// 	if(str == null){
		// 		return 0;
		// 	}else{
		// 		var N_start = str.indexOf(key);
		// 		var N_end = 0;
		// 		if(end){
		// 			N_end = str.indexOf(end,N_start);
		// 			return  str.substring(N_start + key.length+1,N_end);
		// 		}else{
		// 			return  str.substring(N_start + key.length+1);
		// 		}
		// 	}	
		// }

		//抛物线
		function parabola(x,y){
			var bool = new Parabola({
				el: ".movecart",
				targetEl: null,
				offset: [x,y],
				curvature: 0.00001,
				duration: 500,
				callback: function(){
					$(".movecart").remove()
				}
				
			})

			bool.start();

		}
	}
	return {
		goods:goods
	}
})