
//popup
function fnShowPop(sGetName){
	var $layer = $("#"+ sGetName);
	$layer.addClass("on");
};
function fnHidePop(sGetName){
	$("#"+ sGetName).removeClass("on");
};


$(document).ready(function(){

	//today
	var num = $("#boardlist li").length;
	var max = 14 * num;
	var move = 0;

	function rolling(){
		move = max + 17;
		$("#boardlist").animate({"top":-move},10000,"linear",function(){
				if ( move >= max ){
				$("#boardlist").css("top",70);
				move=0;
			};
		})
	};
	rollingOff = setInterval(rolling,500);


	//lnb
	$(".list > li").addClass("active");
	$('.list > li > a').click(function() {
	    if ( $(this).parent().hasClass('active') ) {
	        $(this).next('ul').stop().slideUp(200);
	        $(this).parent().removeClass('active');
	    }
	    else {
	        $(this).next('ul').stop().slideDown(200);
	        $(this).parent().addClass('active');
	    }
	});

	$('.list > li > ul > li > a').click(function() {
		$('.list > li > ul > li > a').parent("li").removeClass("active");
		$(this).parent("li").addClass("active");
	})

	//main1 gnb
	var $header = $('#header'),
        $gnb = $('ul.gnb'),
        $gnbLi = $gnb.find(' > li'),
        $gnb2Dep = $gnbLi.find('.depth2')

    $gnbLi.on({
      "mouseenter focusin" : function(){
         $gnb2Dep.addClass("on");
         $(this).addClass('on').find($gnb2Dep).stop().slideDown(200);
      },
      "mouseleave focusout" : function(){
         $gnb2Dep.removeClass("on");
         $(this).removeClass('on').find($gnb2Dep).stop().slideUp(200);
      }
    });

    //main3 gnb
    function chk(){
    if(cc == 1){
     	$(".sub").stop().slideDown(100);
     }else{
      	$(".sub").stop().slideUp(150);
      }
     };

    $(".depth1 li a, .sub ul li a, .sub").mouseover(function(){
    	setTimeout(chk, 100);
    	cc = 1;
    	$(this).addClass('active');
    });
    $(".depth1 li a, .sub ul li a, .sub").mouseout(function(){
    	setTimeout(chk, 400);
    	cc = 0;
    	$(this).removeClass('active');
    });
	$(".btnFullMenu").click(function(){
    	$(".sub").stop().slideToggle(100);
    });


    //tab
	$(".tabContainer").each(function(){
		var tab = $(this).children().children("ul");
		var tabBtn = tab.children("li").children("a");
		var content = $(this).children(".tabContent");

		tabBtn.click(function(){
			var activeTab = $(this).attr("rel");

			content.removeClass("active");
			tabBtn.parent("li").removeClass("active");
			if( $(this).parent().parent().parent().hasClass("mainTab")==true ){
				content.removeClass("active");
				tabBtn.parent("li").removeClass("active");
				$("#" + activeTab).find("li").removeClass("active");
				$("#" + activeTab).find(".subTab .tabContent").removeClass("active");
				$(this).parent("li").addClass("active");
				$("#" + activeTab).addClass("active");
				$("#" + activeTab).find("li:eq(0)").addClass("active");
				$("#" + activeTab).find(".subTab .tabContent").first().addClass("active");
			}else {
				content.removeClass("active");
				tabBtn.parent("li").removeClass("active");
		        $(this).parent("li").addClass("active");
				$("#" + activeTab).addClass("active");
			}
		});
	});


	$(".activityBox").each(function(){
		var actList = $(".activityList");
		var actBtn = actList.children("li").children("ul").children("li").children("a");
		actBtn.click(function(){
			var onAct = $(this).attr("rel");
			$(".activityList > li > ul > li").removeClass("active");
			$(this).parent("li").addClass("active");
			$(".actContent").hide();
			$(".actContent").removeClass("active");
			$("#" + onAct).show();
			$("#" + onAct).addClass("active");
		});
	});





});




