define(["public"],function(public){
 var index = function(){
	

//轮播图
	function bannerSet(){
		$.ajax({
			url:"data/banner_data.json",
			method:"get",
			success:function(data){
				var html = "";
				var ulHtml="";
				for(var i = 0; i< data.length; i++){
					html += '<div><img src="'+data[i]+'"></div>';
					ulHtml += "<li></li>";
				}
				html = html +'<div class="prev"></div><div class="next"></div><div class="b-dot"><ul></ul></div>' 
				$(".banner").html(html);
				$(".banner").find("ul").html(ulHtml);
				$(".banner div img").eq(0).addClass("animate");	
				$(".banner-bg").hover(function(){
				$(".prev").add(".next").css("display","block");
				},function(){
					$(".prev").add(".next").css("display","none");
				});	
				var timer = null;
				var n = 0;
				var m = 0;
				var isYes = false;
				$(".b-dot").find("li").hover(function(){
					n = $(this).index();
					setTimer(n);
					isYes = true;
					m = n;
				},function(){
					isYes = false;		
				});
				$(".prev").click(function(){
					n--;
					if(n == -1){
						n = 7;
					}
					setTimer(n);
					m = n;
				})
				$(".next").click(function(){
					n++;
					if(n == 8){
						n = 0;
					}
					setTimer(n);
					m = n;
				});
				clearInterval(timer);
				timer = setInterval(function(){
					setTimer(m);
					if(isYes){

					}else{
						m++;
						if(m % 8 == 0){
							m = 0;
						}
					}
					
				},5200);				
			}
		});
	}		
	function setTimer(n){
		$(".banner div").has("img").css("zIndex",1)
		.find("img").removeClass("animate");
		$(".banner div").eq(n).css("zIndex",100)
		.find("img:eq(0)").addClass("animate");

		$(".banner div").eq(n).find("img:eq(1)").css("opacity",0);
		$(".banner div").eq(n).find("img:eq(1)").stop().animate({opacity:1},2000);

		$(".banner li").eq(n).css("background","#5aaa16");
		$(".banner li").eq(n).siblings().css("background","#b5b2a8");	
	}
	bannerSet();



//专区广告
	function adItemSet() {
		$.ajax({
			url:"../data/ad-item-data.json",
			method:"get",
			success:function(data){
				var listHtml = '';
				for(var i = 0; i < data.length; i++){
					listHtml += '<li><a href="#">'
									+'<img src="'+data[i].src+'" />'
									+'<p><b>'+ data[i].title +'</b>'+data[i].desc+'</p>'	
									+'</a></li>';							
				}
				$(".ad-item ul").html(listHtml);
			}
		})
	}
	adItemSet();

	floorAd();
	//楼层广告
	function floorAd(){
		$.ajax({
			url:"data/floordata.json",
			method:"get",
			success:function(data){
				var floorHtml = "";
				for(var i = 0; i < data.length; i++){
					 floorHtml += '<div class="floor"><div class="fl-wrap"></div><div class="fl-main"><div class="main-left"></div><div class="main-right"><ul></ul></div></div></div>';
					$(".side-left em").eq(i).html(data[i].title);
				}
				$(".ad-floor").html(floorHtml);
				 
				for(var j = 0; j < data.length; j ++){
					var	wrapHtml = '<h2><a href="#"><i>'+ data[j].floor +'</i>'+data[j].title +'</a></h2><span><a href="#">'+ data[j].keywords[0]+'</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">'+data[j].keywords[1]+'</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">'+ data[j].keywords[2]+'</a></span>';
					var leftHtml = '<a href="goods-details.html"><img src=" '+data[j].left + '" alt=""></a>';
					var rightHtml ='';
					if(j < 4){						
						for(var k = 0; k < data[j].right.length; k++){
							rightHtml += '<li><a href="goods-details.html"><img src="'+ data[j].right[k] +'" ></a></li>'
						}
					}else{
						var m = data[j].right.length - 1
						for(var k = 0; k < data[j].right.length; k++){
							if(k == 1){
								rightHtml += '<li style="float:right;"><a href="goods-details.html"><img src="'+ data[j].right[k] +'"></a></li>';
							}else if(k == m){
								var imgHtml = '';
								for(var l = 0;l < data[j].right[m].length; l++){
									imgHtml += '<img src="'+data[j].right[m][l] +'" />'
								}
								rightHtml += '<li class ="last-li"><a href="goods-details.html">'+ imgHtml +'</a></li>'
							}else{
								rightHtml += '<li><a href="#"><img src="'+ data[j].right[k] +'" ></a></li>';
							}
						}
					}
					$(".floor").eq(j).find(".fl-wrap").html(wrapHtml);
					$(".floor").eq(j).find(".main-left").html(leftHtml);
					$(".floor").eq(j).find(".main-right ul").html(rightHtml);
				}		 
			}
		})

	}

	public.cartCount();
}
	return{
		index:index
	}

})