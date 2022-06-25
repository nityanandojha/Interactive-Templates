/*******************************************************/
$(document).ready(function () {

	var setting;
	var arrAllDraggableitem = null;
	var staticImagePath="images/";
	const isMobile = detectMob(); 
	/* detect mobile device start*/
	function detectMob() {
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
		];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
		/* detect mobile device ends */
	}

	$("#tempDiv").load("data/data.xml", function (response, status, xhr) {
		if (status != "error") {

			$("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
				if (status != "error") {
					/*Hiding the loading image*/
					$("#loadingImg").hide();
					/*End*/
					displayStaticContent();
					//$('.container').focus();
					//alert('ok');



					specifyForMobile();




				}
			});
		}
	});

	/*Showing the loading image*/
	$("#loadingImg").show();



	// function specifyForMobile() {
	// 	if (isMobile) {
	// 		$(".dragableItemContainer").addClass("mobile-device");
	// 		var top = 0;
	// 		var left = 0;
	// 		var drawCounter = 0;

	// 		$(".container").find(".mobile-device").find(".draggableitemWraper").each(function (index, el) {
	// 			drawCounter = drawCounter + .3;
	// 			top = top + drawCounter;
	// 			left = left + drawCounter;
	// 			$(el).css({
	// 				"position": "absolute",
	// 				"top": top + "px",
	// 				"left": left + "px"
	// 			});
	// 		})

	// 		//$(".container .draggableitem").prop('disabled', true);
	// 		$(".container .draggableitem").last().removeAttr('disabled');
	// 	} else {
	// 		$(".dragableItemContainer").removeClass("mobile-device");
	// 	}
	// 	// $(el).find(".draggableitem").prop('disabled',true);

	// }

	function displayStaticContent() {
		function isMacintosh() {
			return navigator.platform.indexOf('Mac') > -1
		}
		var isMac = isMacintosh();
		if (isMac) {
			$('.content').addClass('contentMac');
		}

		var xmlDoc = $.parseXML($("#tempDiv").html());
		var xml = $(xmlDoc);
		//console.log(xml.find("content"));
		pageLength = xml.find("content").length;
		//objAccessibility=new Accessibility(pageLength); // call Accessibility funcion from accessibilityJs
		var settingDoc = $.parseXML($("#tempSetting").html());
		setting = $(settingDoc);

		//focus setting
		var focusColor = setting.find("focuscolor").attr('color');
		$('body').append('<style>input[type=button]:focus{outline: 1px solid ' + focusColor + '; border: 0px solid transparent;} button:focus{outline: 1px solid ' + focusColor + '; border: 0px solid transparent;}</style>');

		// title style from from setting.xml
		var fontfamily = setting.find("title").attr('fontfamily');
		var color = setting.find("title").attr('color');
		var backgroundcolor = setting.find("title").attr('backgroundcolor');

		// category title
		var categorytitleFontfamily = setting.find("categorytitle").attr('fontfamily');
		var categorytitleColor = setting.find("categorytitle").attr('color');
		var categorytitleBackgroundcolor = setting.find("categorytitle").attr('backgroundcolor');

		var arrSettingStyleItem = setting.find("styleitem")
		// category title
		var draggableitemFontfamily = setting.find("draggableitem").attr('fontfamily');
		var draggableitemColor = setting.find("draggableitem").attr('color');
		var draggableitemBackgroundcolor = setting.find("draggableitem").attr('backgroundcolor');




		// title style from from setting.xml
		var instNormFontFamily = setting.find("instructionnorm").attr('fontfamily');
		var instNormColor = setting.find("instructionnorm").attr('color');
		var instNormBackgroundcolor = setting.find("instructionnorm").attr('backgroundcolor');

		console.log('fontfamily=', fontfamily);

		var title = xml.find("title").text();
		var instructionNorm = xml.find("instruction").find("instructionnorm").html();
		//console.log("dgdfgdfgfd=", title, instructionNorm);

		var arrAllCategory = xml.find("category").find("categorytitle");
		arrAllDraggableitem = xml.find("draggableitem").find("item");


		$("#title").text(title).css({
			"font-family": fontfamily,
			"color": color,
			"backgroundColor": backgroundcolor
		});
		$("#instructionnorm").html(instructionNorm).css({
			"font-family": instNormFontFamily,
			"color": instNormColor,
			"backgroundColor": instNormBackgroundcolor
		});

		/* generating category view */
		arrAllCategory.each(function (index, el) {
			$(".categoryContainer").append('<div class="category category-' + arrAllCategory.length + '"><div class="categoryTitleCnt categoryTitleCnt_' + index + '"><button cat=' + $(el).attr("cat") + ' class="categoryTitle categoryTitle_' + index + '">' + $(el).html() + '</button></div><div class="categoryDroppableCnt categoryDroppableCnt_' + index + '"></div></div><hr class="catHr"/>');
		});

		$('.categoryTitle').css({
			"font-family": categorytitleFontfamily,
			"color": categorytitleColor,
			"backgroundColor": categorytitleBackgroundcolor
		}).off().on("click", selectCategory);

		/* generating draggable items view */
		arrAllDraggableitem.each(function (index, el) {
			console.log('index=', index);
			$(".dragableItemContainer").append('<div class="draggableitemWraper draggableitemWraper_' + index + '"><div class="draggableitemCnt draggableitemCnt_' + index + '"><button cat=' + $(el).attr("cat") + ' id="draggableitem_' + index + '" class="draggableitem draggableitem_' + index + '">' + $(el).html() + '</button></div></div>');
		});

		$('.draggableitem').css({
			"font-family": draggableitemFontfamily,
			"color": draggableitemColor,
			"backgroundColor": draggableitemBackgroundcolor
		}).off().on("click", selectDraggable);

		console.log("------------------------");
		//$(".settinToolsContainer").append('<div class="toolsCnt"></div>');
		//$(".settinToolsContainer").append('<button tabindex="2" class="close"></button>');

		arrSettingStyleItem.each(function(ind,el){

			if(ind==0)
			{
			$(".settinToolsContainer .toolsCnt").append('<div class="toolContainer_'+ind+'"><button bg="'+$(el).attr("background")+'" fg="'+$(el).attr("foreground")+'" class="tool tool_'+ind+'">button</button><p l lang="en" class="toolTxt toolTxt_'+ind+'">'+$(el).attr("txt")+'</p></div>');
			}else
			{
				$(".settinToolsContainer .toolsCnt").append('<button role="settings tool" class="toolContainer toolContainer_'+ind+'" colors="'+$(el).attr("colors")+'"><img src="'+staticImagePath+$(el).attr("picname")+'" class="tool tool_'+ind+'"/><span l lang="en" class="toolTxt toolTxt_'+ind+'">'+$(el).attr("txt")+'</span></button>');
			}

			if(ind==1)
			{
				var colors=$(el).attr("colors");
				color1=colors.split(",")[0];
				color2=colors.split(",")[1];
				color3=colors.split(",")[2];
				$('.settinToolsContainer').css({backgroundColor:color3});
			}

		});


		$('.settinToolsContainer .toolContainer_0').find('.toolTxt').css({"font-family":$(arrSettingStyleItem[0]).attr('fontfamily'),"color":$(arrSettingStyleItem[0]).attr('color')});

		$('.settinToolsContainer .toolContainer').each(function(index,el){
			var arr = $(arrSettingStyleItem[index]).attr('fontfamily');
			console.log("raj=",arr);
			$(el).find('.toolTxt').css({"font-family":$(arrSettingStyleItem[index+1]).attr('fontfamily'),"color":$(arrSettingStyleItem[index+1]).attr('tooltextcolor')});
		});



		//displayDynContent(counter);

		$('.settinToolsContainer .toolContainer').off().on("click", changeBgFgOfTemplate);

		function changeBgFgOfTemplate() {
			//alert("ok");
			color1=$(this).attr('colors').split(",")[0];
			color2=$(this).attr('colors').split(",")[1];
			color3=$(this).attr('colors').split(",")[2];
			// $('.content').css({
			// 	backgroundColor: color2
			// });
			$('#title').css({
				color: color1
			});
			$('#instructionnorm').css({
				color: color2
			});

			$('.leftContentTitle').css({
				color: color2
			});
			$('.leftSubContainer').css({
				color: color2
			});

			$('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);
			$('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);
			$('.categoryTitle').css({
					backgroundColor: color1
				});
			
				$('.settinToolsContainer').css({backgroundColor:color3});
				$('.setting').find("path").attr('fill',color1);

		}

	}

	function selectDraggable() {
		var curId = $(this).attr("id");
		var gid = $(".dragableItemContainer").attr("curitem");
		if(curId == gid){
			$(this).blur();
			$(".dragableItemContainer").attr("curitem", null);
			return;
		}
		$(".dragableItemContainer").attr("curitem", curId);
	}

	function selectCategory() {
		var id = $(".dragableItemContainer").attr("curitem");
		if (id) {
			var index = id.split("_")[1];
			var categoryDroppableCnt = $(this).parents(".category").find(".categoryDroppableCnt");
			isMobile && $(".draggableitemCnt_" + index).find(".draggableitem").removeAttr('disabled');
			
			$(".draggableitemCnt_" + index).appendTo(categoryDroppableCnt);
			$(".dragableItemContainer").removeAttr("curitem");
			
			isMobile && $(".container .draggableitem").last().removeAttr('disabled');
			
			//alert("ok");
			var totalDropedItem = 0;
			$('.category').each(function (index, el) {
				var dropedItemLenth = $(el).find(".categoryDroppableCnt").children().length;
				totalDropedItem = totalDropedItem + dropedItemLenth
				//console.log('dropedItemLenth=', dropedItemLenth);

				var catTitle = $(el).find(".categoryTitle").attr("cat");
				$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
					if ($(ell).find(".draggableitem").attr("cat") == catTitle) {
						$(ell).find(".draggableitem").addClass("correct");
					} else {
						$(ell).find(".draggableitem").addClass("incorrect");
					}
				});

			})
			console.log('totalDropedItem=', totalDropedItem);
			if (totalDropedItem == arrAllDraggableitem.length) {
				//$('.nav-container').show()
				$('.submit_btn').removeClass("invisible").focus().off().on("click", submitListener);
			}
		}
		//$(this).parent().parent().append(curItem);
	}

	function submitListener() {
		var correctCounter = 0;
		$('.category').each(function (index, el) {
			var catTitle = $(el).find(".categoryTitle").attr("cat");
			// totalDropedItem=totalDropedItem+dropedItemLenth
			//console.log('catTitle=',catTitle);
			$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
				if ($(ell).find(".draggableitem").hasClass("correct")) {
					$(ell).find(".draggableitem").css("border", "2px solid #63a524");
					correctCounter++;
				} else {
					$(ell).find(".draggableitem").css("border", "2px solid #c22032");
				}
			});
		});
		//console.log('correctCounter=',correctCounter);
		$(this).addClass("invisible");
		$('.categoryContainer').addClass("submited");
		//$('.nav-container').removeClass("invisible");
		if (correctCounter == arrAllDraggableitem.length) { 			
			$('.reset_btn').removeClass("invisible").focus().off().on("click", resetCategory);
		} else {
			$('.tryagain_btn').removeClass("invisible").focus().off().on("click", resetCategory);
		}
	}

	function resetCategory() {
		arrAllDraggableitem.each(function (index, el) {
			$(".categoryContainer").find(".draggableitemCnt_" + index).appendTo(".draggableitemWraper_" + index);
		});
		$('.categoryContainer').removeClass("submited");
		$(".draggableitem").css("border", "0px solid green").removeClass("correct incorrect");
		if (isMobile) {
			//$(".container .draggableitem").prop('disabled', true);
			$(".container .draggableitem").last().removeAttr('disabled');
		}
		$('.reset_btn').addClass("invisible");
		$('.tryagain_btn').addClass("invisible");
		$('.submit_btn').removeClass("invisible").attr("disabled","");
	}


	$('.setting').off().on('click', settingListener);

	function settingListener() {
		$(".settinToolsContainer").css("zIndex","3");
		$(".settingContainer").css("zIndex","2");
		$('.settinToolsContainer').addClass('showhide');
		$('.settinToolsContainer .close').off().on('click', closeSetting);

	}

	function closeSetting() {
		$('.settinToolsContainer').removeClass('showhide');
		$(".settinToolsContainer").css("zIndex","unset");
	}

});

$(document).ready(function(){
  $(".showText").click(function(){
    $(".help-popup").show();
	$(".settinToolsContainer").css("zIndex","2");
	$(".settingContainer").css("zIndex","3");
  });
  $(".popup-close").click(function(){
    $(".help-popup").hide();
	$(".settingContainer").css("zIndex","unset");
  });
});