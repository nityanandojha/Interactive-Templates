var matching = (function() {
    var data = {};
    var curDiv = null;
    var curMatchbox = true;

    this.init = function(data) {
        this.loadXML();

        $(".note").off().on("click",function() {
            $(".notice-card").show();
            $(".notice-card").css("zIndex","3");
            $(".settings-container").css("zIndex","2");

            $(".close-bt").off().on("click", function(){
                $(".notice-card").hide();
            })
        })

        $(".setting-button").off().on("click",function() {
            $(".settings-container").show();
            $(".settings-container").css("zIndex","3");
            $(".notice-card").css("zIndex","2");

            $(".close-btn").off().on("click", function(){
                $(".settings-container").hide();
            })
        })
        
        $(".tryagain_btn").off().on("click", function() {
            tryAgain();
        })

        $(".reset_btn").off().on("click", function(){
            tryAgain();
        })
    }

    var tryAgain = function(){
        $(".activity-header").removeClass("h-48p");
        $(".activity-content").removeClass("p-48p");

        $(".clickedEvent").appendTo(".clickableBlock");
        $(".clickedEvent").removeAttr("data-placed");

        $(".matchedEvent").removeClass("placed");
        $(".matchedEvent").removeAttr("data-placed");
        $(".matchedEvent").off().on("click", matchHandler);

        $(".tryagain_btn").hide();
        $(".reset_btn").hide();
        $(".submit_btn").show();
        $(".submit_btn").addClass("disabled");

        $(".matching-element").removeClass("submitted").removeClass("correct-ans");
        $(".matching-element").removeClass("submitted").removeClass("wrong-ans");

        $("#r-feedback").hide();
        $("#w-feedback").hide();

        $(".activity-header").removeClass("pad0");
    }

    this.loadXML = function(){
        $("#tempDiv").load("data/data.xml", function (response, status, xhr) {
            if (status != "error") {
                $("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
                    if (status != "error") {
                        var settXml = $.parseXML($("#tempSetting").html());
                        var settingXML = $(settXml);

                        var xmlDoc = $.parseXML($("#tempDiv").html());
                        var xml = $(xmlDoc);
                        fetchData(xml);
                        createSettingBox(settingXML);
                    }
                });
            }
        });

    };

    var fetchData = function(xml){
        $(".activity-title").html(xml.find("title").text());
        $(".notice-card p").html(xml.find("instruction").text());

        var items = xml.find("items").find("item");
        //var matchItem = xml.find("items").find("matching").find("text");
        data["ques"] = [];
        items.each((index, el) => {
            var tempObj = {};
            tempObj["clickable"] = $(el).find("clickable text").html();
            tempObj["matching"] = $(el).find("matching text").html();

            data.ques.push(tempObj);

            $("#cloneItem_d").clone().appendTo(".clickableBlock");
            $("#cloneItem_d .clickable-item p").html(data.ques[index].clickable);
            $("#cloneItem_d").addClass("clickedEvent");
            $("#cloneItem_d").attr("id", "cloneItem_"+index);

            $("#matchBox_d").clone().appendTo(".matchingBlock");
            $("#matchBox_d .matching-item p").html(data.ques[index].matching);
            $("#matchBox_d").addClass("matchedEvent");
            $("#matchBox_d").attr("id", "matchBox_"+index);
        });

        $("#cloneItem_d").remove();
        $("#matchBox_d").remove();

        $("#r-feedback p").html(xml.find("rightfeedback").text());
        $("#w-feedback p").html(xml.find("wrongfeedback").text());
        
        $(".shuffle").shuffleChildren();
    }

    function createSettingBox(data){
        console.log("DATA: ", data.find("themes").find("theme").length);
        var themes = Array.from(data.find("themes").find("theme"));
        themes.forEach((element, index) => {
            // console.log("element", element.innerHTML);
            var btn = $("<button>",{
                "role": "settings tool",
                "data-color": $(element).find("color").html(),
                "data-background": $(element).find("background").html(),
                "data-selectioncolor": $(element).find("selectioncolor").html(),
                "class": "toolContainer toolContainer_" + (index+1),
                "aria-label": $(element).find("title").html(),
                "title": $(element).find("title").html(),
            }).appendTo($(".toolCnt"));

            $("<img>",{
                "alt": $(element).find("name").html(),
                "class": "tool tool_" + (index+1),
                "src": "images/" + $(element).find("images").html()
            }).appendTo($(btn));
            $("<span>",{
                "class": "toolTxt toolTxt_"+(index+1),                
            }).html($(element).find("title").html()).appendTo(btn);
            $(btn).on("click", function(e){
                console.log($(this).attr("data-color"));
                var r = document.querySelector(':root');
                r.style.setProperty('--color', $(this).attr("data-color"));
                r.style.setProperty('--background', $(this).attr("data-background"));
                r.style.setProperty('--selectioncolor', $(this).attr("data-selectioncolor"));
            })
        });
    }

    function matchHandler(e){
        if(!$(this).attr("data-placed")){
            $(this).find(".matching-element").prepend(curDiv);

            var prevMatched = $(curDiv).attr("data-placed");
            $("#"+prevMatched).removeAttr("data-placed");
            $("#"+prevMatched).removeClass("placed");
            console.log(" *-*-*-*-*-*-*-*-*-* ");
        }else{
            if($(curDiv).attr("data-placed")){
                if(curMatchbox == $(this).attr("id")){
                    return;
                }
                console.log(" 000000000000000000 ");
                var parent = $("#"+$(curDiv).attr("data-placed"));                
                var apend = $("#"+$(this).attr("data-placed"));
                parent.find(".matching-element").prepend(apend);

                apend.attr("data-placed", parent.attr("id"));
                parent.attr("data-placed", apend.attr("id"));
                parent.addClass("placed");
                
                $(this).find(".matching-element").prepend($(curDiv));
            }else{
                if($("#"+$(this).attr("data-placed"))){
                    if (curDiv) {
                        var placedEle = $("#"+$(this).attr("data-placed"));
                        $(".clickableBlock").append(placedEle);

                        placedEle.removeAttr("data-placed")
                        
                        $(this).find(".matching-element").prepend(curDiv);
                        console.log(" 11111111111111111 ");
                    }
                }else{
                    console.log(" 2222222222222222222222 ");
                }
            }
        }

        $(curDiv).attr("data-placed", $(this).attr("id"));
        $(this).attr("data-placed", $(curDiv).attr("id"));
        $(this).addClass("placed");

        $(curDiv).find(".clickable-item").removeClass("selected");
        curDiv = null;

        if($(".placed").length == data.ques.length){
            $(".submit_btn").removeClass("disabled");
            $(".submit_btn").removeClass("mobile-submit");
            $(".activity-header").addClass("pad0");
        }
    }

    $(".submit_btn").click(function(){
        
        var wCount = 0;
        var rCount = 0;
        
        $(".activity-header").addClass("h-48p");
        $(".activity-content").addClass("p-48p");
        for(var i=0; i<data.ques.length; i++){
            var clicksId = $("#cloneItem_"+i).attr("id").replace("cloneItem_", "");
            var machedId = $("#cloneItem_"+i).attr("data-placed").replace("matchBox_", "");

            if(clicksId == machedId){
                $("#matchBox_"+machedId).find(".matching-element").addClass("submitted").addClass("correct-ans");
                rCount++;
            }else{
                $("#matchBox_"+machedId).find(".matching-element").addClass("submitted").addClass("wrong-ans");
                wCount++;
            }
        }

        if(wCount == 0){
            $(".reset_btn").show();
            $(".tryagain_btn").hide();
            $(".submit_btn").hide();

            $("#r-feedback").show();
        }else{
            $(".tryagain_btn").show();
            $(".reset_btn").hide();
            $(".submit_btn").hide();

            $("#w-feedback").show();
        }
    })

    function bindEvents(){
        $(".clickedEvent").click(function clickableHandler(e){
            if(curDiv){
                $(curDiv).find(".clickable-item").removeClass("selected");
            }
            curDiv = this;
            $(curDiv).find(".clickable-item").addClass("selected");

            if($(this).attr("data-placed")){
                curMatchbox = $(this).attr("data-placed");
            }
            
            $(".matchedEvent").off().on("click", matchHandler);
        })

        $(".matchedEvent").off().on("click", matchHandler);

        $(".clickable-items").click(function() {
            //console.log($(curDiv).attr("data-placed"));

            if($(curDiv).parent().hasclass("clickedEvent")){
                $(".clickedEvent").appendTo($(this).find(".clickableBlock"));
                $(curDiv).removeAttr("data-placed");
            }

        })
    }

    $.fn.shuffleChildren = function() {
        $.each(this.get(), function(index, el) {
            var $el = $(el);
            var $find = $el.children();
        
            $find.sort(function() {
            return 0.5 - Math.random();
            });
        
            $el.empty();
            $find.appendTo($el);
        });

        bindEvents();
    };

    return this;
});
 
 $(document).ready(function() {
    let matchingObj = new matching();
    matchingObj.init();
 });
 
 //  sticky header  //
//  window.addEventListener("scroll", function(){
//      var header = document.querySelector("header");
//      header.classList.toggle("sticky", window.scrollY > 0);
//  })
   //  sticky header  //