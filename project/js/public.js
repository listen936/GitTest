define(function(){
	var public = function(){
		//头部hover	
		function headHover(node){
			node.hover(function(){
				node.children().eq(0).css("display","block");
				$(this).find(".li-bg").addClass("pass");
				$(this).find("b").addClass("b-rotate");
			},function(){
				node.children().eq(0).css("display","none");
				$(this).find(".li-bg").removeClass("pass");
				$(this).find("b").removeClass("b-rotate");
			});
		}
		headHover($(".my"));
		headHover($(".phone"));

		// 搜索框
		$(".search-text").on("focus",function(){
			$(this).attr("placeholder","").css("background","#fff");
		})
		$(".search-text").on("blur",function(){
			$(this).attr("placeholder","输入商品名／编号／拼音").css("background","none");
		})


		//搜索框关键字
		function searchKey(){
			$.ajax({
				url:"../data/search-key.json",
				method:"get",
				success:function(data){
					var aHtml = '';
					for(var i =0; i< data.length; i++){
						aHtml += '<a href="'+ data[i].url+'#">'+ data[i].name +'</a>'
					}
					$(".search-keywords").html(aHtml);

				}
			})
		}
		searchKey();

		//滚动头部
		var cookieStr = $.cookie("goods");
		
		$(window).on("scroll",function(){
			if($(window).scrollTop() > 60){
				$("#move-top").css("display","block");
					
			}else{
				$("#move-top").css("display","none");
			}
		});


//滚动购物车弹出窗口
	$(".m-cart").hover(function(){
		var cookieStr = $.cookie("goods");
		$(".move-list").show();
		if(cookieStr == ''|| cookieStr == null){
			$(".m-nogoods").css("display","block");
		}else{
			$(".m-nogoods").css("display","none")
			$(".goods").css("display","block");
			createCartPopup();
		}
	},function(){

		setTimeout(function(){
			$(".move-list").hide()
		},1500)

	})


	//购物车弹出窗口
		
		$(".shopping-cart").hover(function(){
			var cookieStr = $.cookie("goods");
			$(".shopping-list").show();

				if(cookieStr == ''|| cookieStr == null){
					
					$(".nogoods").css("display","block");
					$(".goods").css("display","none")
				}else{
					$(".nogoods").css("display","none");
					$(".goods").css("display","block");
					createCartPopup();
				}

			},function(){
			
				setTimeout(function(){
					$(".shopping-list").hide();
				},1500);

			})

		function createCartPopup(){	
			var cookieStr = $.cookie("goods");
			var cookieArr = cookieStr.split('&');
			var html = "";

			for(var j in cookieArr){
				cookieArr[j] = cookieArr[j].split(",")
			}	
			for(var i = 0; i < cookieArr.length - 1;i++){
				html +='<li>'+
						'<div class="l">'+
							'<img src="'+getvalue(cookieArr[i][2],"img","")+'" width="42" height="42">'
						+'</div>'
						+'<div class="c">'
							+'<a href="#">'+getvalue(cookieArr[i][0],"name","")+'</a>'
						+'</div>'
						+'<div class="r">'
							+'<b>￥'+getvalue(cookieArr[i][1],"price","")+'</b><em> *'+ getvalue(cookieArr[i][3],"count","")+'</em>'
							+'<a href="#" class="delect">删除</a>'
						+'</div>'
					+'</li>';

			}

			
			$(".goods ul").html(html);

			$('.goods ul li').delegate(".delect",'click',function(){

				var cookieStr = $.cookie("goods");
				var cookieArr = cookieStr.split("&")
				var n =$(this).parent().parent().index();

				var name = $(".goods ul li").eq(n).find(".c a").html();
				for(var j = 0; j < cookieArr.length; j++){
					cookieArr[j] = cookieArr[j].split(",");
					for(var k = 0; k < cookieArr[j].length; k++){
						if(cookieArr[j][k] == "name:"+ name){
							cookieArr.splice(j,1);
							break;
						}
					}
				}
				$.cookie("goods",cookieArr.join("&"),{expires:7,raw:true});
				$(".goods ul li").eq(n).remove();
				location.reload();
			})
		}


		//商品分类菜单
			var flag = true;
			catalogsList();
			$(".catalogs").click(function(){
				
				if(flag){
					$(".catalogs-list").show();
					$(".catalogs-list").delegate(".catalogs-sub","mouseout",function(){
						$(".catalogs-sub").hide();
					})
				}else{
					$(".catalogs-list").hide();

				}
				flag = !flag;
			})
			$(".catalogs").hover(function(){
				if(flag){
					$(".catalogs-list").show();
				}
			},function(){
				if(flag){
					$(".catalogs-list").hide();
				}
			});

			$(".catalogs-list").delegate(".item","mouseover",function(){
				$(".catalogs-sub").show();
				$(this).children("p").show();
				$(this).children("a").addClass("current");
				$(this).children("p").find("s").show();
				subList($(this).index());

			})
			$(".catalogs-list").delegate(".item","mouseout",function(){
				$(this).children("a").removeClass("current");
				$(this).children("p").hide();
				$(this).children("p").find("s").hide();


			})

			function catalogsList(){
				$.ajax({
					url:"../data/goodslist.json",
					method:"get",
					success:function(data){
						var html = "";
						for(var i = 0; i < data.length; i ++){
							html += '<div class="item"><p><s>></s></p><a href="#"><i style="background-position:'+
							-24*i +'px 0;"></i>'+ data[i].title +'</a></div>';
						}
						var subHtml = '<div class ="catalogs-sub"></div>';
						html = subHtml + html;
						$(".catalogs-list").html(html);									
														
					}

				})
			}
			function subList(n){
				var index = n;
				$.ajax({
					url:"../data/goodslist.json",
					method:"get",
					success:function(data){
						var sublistHtml = "";
						sublistHtml = '<h4><a href="#">' + data[index].title
						+'</a></h4><div class="sub-list"></div><div class="sub-img"><a href="#"><img src="'
						 +data[index].src +'"/></a></div>'			
						$(".catalogs-sub").html(sublistHtml);
						var html = "";
						for(var i = 0 ; i < data[index].content.length;i++){
							html += '<a href = "#">'+ data[index].content[i] +'</a>'
						}
						$(".sub-list").html(html);												
					}

				})
			}

			//侧边栏
	
	
			$(".side-left").delegate("a","click",function(){
				var numTop = $(this).index() * 518 + 950;
				$("html,body").stop().animate({scrollTop:numTop},520,"linear");
				sideChange($(this).index());
			})
			$(document).on("scroll",function(){
				var num =parseInt((($(window).scrollTop() - 750)) / 520);
				if(num >= 9){
					num = 9;
				}
				if($(window).scrollTop() > 550){
					$(".calltool").css("top","0");
				}else{
					$(".calltool").css("top","53px");
				}
				if($(window).scrollTop() < 750){
					$(".side-left").hide();
				}else{
					$(".side-left").show();
					
					sideChange(num);

				}



			})
			$("#topback").click(function(){
				$("html,body").stop().animate({scrollTop:0},520,"linear");		
			});

			function sideChange(num){
				$(".side-left a").find("em").removeClass("emHover");
				$(".side-left a").find("b").removeClass("bHover");
				
				$(".side-left a").find("b").eq(num).addClass("bHover");
				$(".side-left a").find("em").eq(num).addClass("emHover");
			}


	//登录界面单例
		
		$(".login").add($("#cart-login")).click(function(){
			singleton_login();
			var codeVal = createCode($(".code"));
			$("#login").css("display","block");

			$("#goregister").click(function(){
				signinFunc();
				
			})

			$("#close").click(function(){
				$("#login").css("display",'none');
			});

			$("#changeCode").click(function(){
				codeVal = createCode($("#login .code"));
			})

			//登录验证
			$("#btnLogin").click(function(){
				if($("#VerifyCode").val() != codeVal){
					$("#msg-error").show().html("请输入正确的验证码");
					
				}else if(!$("#UserName").val()){
					$("#msg-error").show().html("登录名不能为空");
					
				}else if(!$("#Pwd").val()){
					$("#msg-error").show().html("密码不能为空");
					
				}else{
					$.ajax({
						url:"http://datainfo.duapp.com/shopdata/userinfo.php",
						type:"get",
						data:{
							status:"login",
							userID:$("#UserName").val(),
							password:$("#Pwd").val()
						},
						
						success:function(data){

							if(data == 0){
								$("#msg-error").show().html("用户名不存在");
							}else if(data == 1){
								$("#msg-error").show().html("用户名密码不符");
							}else{
								alert("登录成功");
								$("#VerifyCode").add($("#UserName")).add($("#Pwd")).val("");
								$("#login").css("display","none");
							}
						}
					})
				}
			})
				
		})

		//随机颜色
		function randomColor(){
			return "rgba(" + parseInt(Math.random() * 255) + ", " + 
			parseInt(Math.random() * 255) + ", " + parseInt(Math.random() * 255) + ", 1)";
		}
		function createCode(node){
			var b = "";
			var num = parseInt(Math.random() * 9999);
			for(var i = 0; i < 4;i++){
				var a = num % 10;
				b += a;
				node.find("b").eq(i).html(a+" ").css("color",randomColor());
				num = parseInt(num/10);
			}
			return b;
		}

		var singleton_login = (function(){
			var oDiv = null;
			var createloginDiv = function(){
				if(!oDiv){
					oDiv = document.createElement('div');
					oDiv.id = "login";
					oDiv.innerHTML =  '<form>'+
						'<div id="close">×</div>'
						+'<p>'
							+'<strong>欢迎登录</strong>'
							+'<span>还没有账号？<a href="#" class="green " id="goregister" >立即注册</a></span>'
						+'</p>'
						+'<div id="msg-error"></div>'
						+'<p>'
							+'<input  id="UserName" type="text" placeholder="邮箱/账号/已验证手机" name = "userID" class="input input-phone">'
						+'</p>'
						+'<p>'
							+'<input  id="Pwd" type="text" placeholder="密码" name = "password" class="input input-key">'
						+'</p>'
						+'<p>'
							+'<input class="input input-key" id="VerifyCode" name="VerifyCode" placeholder="验证码" style="width:100px" value="" type="text">'
							+'<b class="code"><b></b><b></b><b></b><b></b></b> <a href="#" id="changeCode">换一张</a>'
						+'</p>'
						+'<p>'
							+'<label>'
								+'<input data-val="true"  id="UserNameRemeber" name="UserNameRemeber" value="true" type="checkbox">'
								+'<input name="UserNameRemeber" value="false" type="hidden"> 自动登录'
								+'</label>'
							+'<span> <a class="gray" href="#">忘记登录密码？</a>  </span>'
						+'</p>'
						+'<p>'
							+'<a id="btnLogin" href="#" class="btn-green-l">登 &nbsp; 录</a>'
						+'</p>'
						+'<p>第三方登录</p>'
						+'<div id="p-code-btn">'
							+'<a href="#" class="qq"><i></i></a>'
							+'<a href="#" class="sina"><i></i></a>'
							+'<a href="#" class="ay"><i></i></a>'
						+'</div>'
					+'</form>';
					document.body.appendChild(oDiv);
					oDiv.style.display = "none";
				}
			}
			return createloginDiv;
		})();
	
	//注册单例
	
	 
		$(".signin").click(function(){
			signinFunc();
		});
		function signinFunc(){
			$("#login").css("display","none");
			 singleton_register();
			 createCode($(".code"));
			 $(".register").css("display","block");
			 $(".register").find("input").attr("isYes","false");

			 //手机号验证
			 $("#Phone_Mobile").on("blur",function(){
			 	var phone = $("#Phone_Mobile").val();
			 	 if( /^1[3|4|5|7|8][0-9]{9}$/ig.test(phone)){
			 		$("#Phone_Mobile").next().html("手机号正确").attr("class","pass-succ");
			 		$("#Phone_Mobile").attr("isYes","true");		
			 	}else{
			 		$("#Phone_Mobile").next().html("请输入正确的手机号").attr("class","pass-error");
			 		
			 	}
			 })

			 //手机验证码
			 $("#Phone_VerifyCode").on("blur",function(){
			 	if($("#Phone_VerifyCode").val() == ""){
			 		$("#Phone_VerifyCode").next().next().html("验证码不能为空").attr("class","pass-error");
			 	}else{
			 		$("#Phone_VerifyCode").attr("isYes","true");
			 		$("#Phone_VerifyCode").next().next().html("验证码正确").attr("class","pass-succ");
			 	}
			 })

			 //密码验证
			 $("#Phone_Password").on("blur",function(){
			 	var pass = $("#Phone_Password").val();
			 	if( pass.length < 5 || pass.length > 16){
			 		$("#Phone_Password").next().html("密码长度应为5-16位").attr("class","pass-error");
			 	}else if(/^[a-zA-Z|[_]]{1}([a-zA-Z0-9]|[_]){4,15}$/ig.test(pass)){
			 		$("#Phone_Password").attr("isYes","true");
			 		$("#Phone_Password").next().html("密码正确").attr("class","pass-succ");
			 	}else{
			 		$("#Phone_Password").next().html("密码应由字母或_开头").attr("class","pass-error");
			 	}
			 })


			 //密码确认
			 $("#Phone_ConfimPassword").on("blur",function(){
			 	if($("#Phone_Password").val() == ""){
			 		$("#Phone_ConfimPassword").next().html("请设置密码").attr("class","pass-error");
			 	}else if($("#Phone_Password").val() == $("#Phone_ConfimPassword").val()){
			 		$("#Phone_ConfimPassword").attr("isYes","true");
			 		$("#Phone_ConfimPassword").next().html("密码确认正确").attr("class","pass-succ");
			 	}else{
			 		$("#Phone_ConfimPassword").next().html("密码确认不正确").attr("class","pass-error");
			 	}
			 })

			//提交
			$("#PhoneReg").click(function(){
				if($("#verficode_tab1").attr("isYes") == "false"){

					$("#code-tip").html("请输入正确的验证码").attr("class","pass-error");
				}else if($("#Phone_Mobile").attr("isYes") == "false"){
					
					$("#Phone_Mobile").next().html("请输入正确手机号").attr("class","pass-error");
				
				}else if($("#Phone_VerifyCode").attr("isYes") == "false"){
					$("#Phone_VerifyCode").next().next().html("验证码不能为空").attr("class","pass-error");
				
				}else if($("#Phone_Password").attr("isYes") == "false"){
					$("#Phone_ConfimPassword").next().html("请设置密码").attr("class","pass-error");
				
				}else if($("#Phone_ConfimPassword").attr("isYes") == "false"){
					$("#Phone_ConfimPassword").next().html("密码确认不正确").attr("class","pass-error");
				
				}else{
					alert("注册成功");
					$(".register").css("display","none");
					$(".pass-error").add($(".pass-succ")).html("");
					$(".register").find("input").val('');
				}
			})

			//关闭
			$(".turnoff").click(function(){
				$(".register").css("display","none");
				$(".pass-error").add($(".pass-succ")).html("");
				$(".register").find("input").val('');
			})

			var num = createCode($(".register .code"));
			$(".register").find(".gray").click(function(){
				 num = createCode($(".register .code"));
			})

			//验证码
			$("#verficode_tab1").on("blur",function(){
				
				if($("#verficode_tab1").val() == num){
					
					$("#code-tip").html("验证码正确").attr("class","pass-succ")	
					$("#verficode_tab1").attr("isYes","true");
				}else{
					
					$("#code-tip").html("请输入正确的验证码").attr("class","pass-error");
					
				}
			})
		}
		var singleton_register = (function(){
			var regDiv = null;
			var createRegDiv = function(){
				if(!regDiv){
					regDiv = document.createElement("div");
					regDiv.className = "register";
					regDiv.innerHTML = 
						'<form >'
							+'<p class="turnoff">x</p>'
						    +'<p>'
						       + '<span class="field-name">图形验证码</span>'
						       + '<input id="verficode_tab1" placeholder="图形验证码" class="input input-yzm" type="text" >'
						        +'<b class="code"><b></b><b></b><b></b><b></b></b><a href="#" class="gray">换一张</a>'
						        +'<span id="code-tip"></span>'
						    +'</p>'
						    +'<p>'
						        +'<span class="field-name">手机号</span>'
						        +'<input class="input input-phone" id="Phone_Mobile" name="Phone_Mobile" placeholder="请输入您的手机号" value="" type="text">'
						        +'<span></span>'
						    +'</p>'
						    +'<p>'
						        +'<span class="field-name">手机验证码</span>'
						        +'<input class="input input-yzm" id="Phone_VerifyCode" name="Phone_VerifyCode" placeholder="手机验证码" value="" type="text">'
						        +'<a href="#" class="btn-yzm" id="Phone_SendCode">获取验证码</a>'
						        +'<span></span>'
						    +'</p>'
						    +'<p>'
						        +'<span class="field-name">设置密码</span>'
						        +'<input class="input input-key" id="Phone_Password" name="Phone_Password" placeholder="5-16位字母、符号或数字" type="password">'
						        +'<span></span>'
						    +'</p>'
						    +'<p>'
						       + '<span class="field-name">确认密码</span>'
						        +'<input class="input input-key" id="Phone_ConfimPassword" name="Phone_ConfimPassword" placeholder="再次输入密码" type="password">'
						        +'<span "></span>'
						   + '</p>'
						    +'<p>'
						        +'<span class="field-name">邀请码</span>'
						        +'<input class="input input-key" id="Phone_AtCode" name="Phone_AtCode" placeholder="邀请码" value="" type="text">'
						       + '<span></span>'
						   + '</p>'
						    +'<p>'
						       + '<span class="field-name"></span><label><input id="tab1chk" checked="checked" type="checkbox">我已阅读并同意<a href="#" class="green btn-protocol">《易果服务协议》</a><span></span></label>'
						        +'<input id="DeviceId" name="DeviceId" value="" type="hidden">'
						    +'</p>'
						    +'<span></span>'
						    +'<p><span class="field-name"></span><a href="#" class="btn-green-l" id="PhoneReg" >立即注册</a></p>'
						+'</form>'
						document.body.appendChild(regDiv);
				}

			}
			return createRegDiv;

		})();


	}

	//计数
	var	cartCount = function(){
				var allCount = 0;
				var sum = 0;
				
				if($.cookie("goods")){
					var cookieArr = $.cookie("goods").split("&");
					for(var i in cookieArr){
						cookieArr[i] = cookieArr[i].split(",")
					}
					for(var m = 0; m < cookieArr.length - 1; m++){
						 allCount = allCount +(parseInt(getvalue(cookieArr[m][3],"count","")));
						
						 sum = ((sum*100 + parseInt(getvalue(cookieArr[m][3],"count",""))*(parseFloat(getvalue(cookieArr[m][1],"price",""))*100)))/100;
						
					}

				}

				$(".shopping-cart i").html(allCount);
				$(".m-cart i").html(allCount);
				if(sum == 0){
					$(".totlePrice").html("0.0");	
				}else{
					$(".totlePrice").html("￥" + sum);
				}

				$(".fs14").find('span').html(sum);
				
		}


	var  getvalue = function(str,key,end){
				if(str == null){
					return 0;
				}else{
					var N_start = str.indexOf(key);
					var N_end = 0;
					if(end){
						N_end = str.indexOf(end,N_start);
						return  str.substring(N_start + key.length+1,N_end);
					}else{
						return  str.substring(N_start + key.length+1);
					}
				}	
		}
	var	 createCartPopup = function(){	
			var cookieStr = $.cookie("goods");
			var cookieArr = cookieStr.split('&');
			var html = "";

			for(var j in cookieArr){
				cookieArr[j] = cookieArr[j].split(",")
			}	
			for(var i = 0; i < cookieArr.length - 1;i++){
				html +='<li>'+
						'<div class="l">'+
							'<img src="'+getvalue(cookieArr[i][2],"img","")+'" width="42" height="42">'
						+'</div>'
						+'<div class="c">'
							+'<a href="#">'+getvalue(cookieArr[i][0],"name","")+'</a>'
						+'</div>'
						+'<div class="r">'
							+'<b>￥'+getvalue(cookieArr[i][1],"price","")+'</b><em> *'+ getvalue(cookieArr[i][3],"count","")+'</em>'
							+'<a href="#" class="delect">删除</a>'
						+'</div>'
					+'</li>';

			}

			
			$(".goods ul").html(html);

			$('.goods ul li').delegate(".delect",'click',function(){

				var cookieStr = $.cookie("goods");
				var cookieArr = cookieStr.split("&")
				var n =$(this).parent().parent().index();

				var name = $(".goods ul li").eq(n).find(".c a").html();
				for(var j = 0; j < cookieArr.length; j++){
					cookieArr[j] = cookieArr[j].split(",");
					for(var k = 0; k < cookieArr[j].length; k++){
						if(cookieArr[j][k] == "name:"+ name){
							cookieArr.splice(j,1);
							break;
						}
					}
				}
				$.cookie("goods",cookieArr.join("&"),{expires:7,raw:true});
				$(".goods ul li").eq(n).remove();
				location.reload();
				// createCartPopup();
			})
		}
	return{
		public:public,
		cartCount:cartCount,
		getvalue:getvalue,
		createCartPopup:createCartPopup
	}
})