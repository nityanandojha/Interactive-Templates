var matching = (function() {
    var data = {};
    var curDiv = null;
    var curMatchbox = true;

    this.init = function(data) {
        this.loadXML();

        $(".note").off().on("click",function() {
            $(".notice-card").show();
            $(".notice-card").css("zIndex","10");
            $(".settings-container").css("zIndex","10");

            $(".close-bt").off().on("click", function(){
                $(".notice-card").hide();
            })
        })

        $(".setting-button").off().on("click",function() {
            $(".settings-container").show();
            $(".settings-container").css("zIndex","11");
            $(".notice-card").css("zIndex","9");

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
        $(".clickedEvent").appendTo(".clickableBlock");
        $(".matchedEvent").removeClass("placed");
        $(".clickedEvent").removeAttr("data-placed");
        $(".matchedEvent").removeAttr("data-placed");
        $(".matchedEvent").off().on("click", matchHandler);
    }

    this.loadXML = function(){
        $("#tempDiv").load("data/data.xml", function (response, status, xhr) {
            if (status != "error") {
                /* $("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
                    if (status != "error") {
                        
                    }
                }); */

                var xmlDoc = $.parseXML($("#tempDiv").html());
                var xml = $(xmlDoc);
                fetchData(xml);
            }
        });

    };

    var fetchData = function(xml){
        $(".activity-title").html(xml.find("title").text());
        $(".notice-card p").html(xml.find("instruction").text());

        var items = xml.find("items").find("item")//.find("text");
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
        
        $(".shuffle").shuffleChildren();
    }

    function matchHandler(e){
        if(!$(this).attr("data-placed")){
            $(this).find(".matching-element").append(curDiv);
        }else{
            if($(curDiv).attr("data-placed")){
                if(curMatchbox == $(this).attr("id")){
                    return;
                }
                var parent = $("#"+$(curDiv).attr("data-placed"));                
                var apend = $("#"+$(this).attr("data-placed"));

                parent.find(".matching-element").append(apend);
                $(this).find(".matching-element").append($(curDiv));
            }else{
                if($("#"+$(this).attr("data-placed"))){
                    var placedEle = $("#"+$(this).attr("data-placed"));
                    $(".clickableBlock").append(placedEle);
                    console.log(" 11111111111111111 ");
                    $(this).find(".matching-element").append(curDiv);
                }else{
                    $(this).find(".matching-element").append(curDiv);
                    console.log(" 2222222222222222222222 ");
                }
            }
        }

        var prevMatched = $(curDiv).attr("data-placed");
        if(prevMatched != "" || prevMatched != undefined){
            $("#"+prevMatched).attr("data-placed", "");
            $("#"+prevMatched).removeClass("placed");
            $("#"+prevMatched).off().on("click", matchHandler);
        }
        
        if (curDiv) {
            $(curDiv).attr("data-placed", $(this).attr("id"));
            $(this).attr("data-placed", $(curDiv).attr("id"));
            $(this).addClass("placed");

            $(curDiv).find(".clickable-item").removeClass("selected");
            //$(".matchedEvent").off("click");
            curDiv = null; 
        }

        if($(".placed").length == data.ques.length){
            $(".submit_btn").removeClass("disabled");
        }
    }

    $(".submit_btn").click(function(){
        var wCount = 0;
        var rCount = 0;

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

        if(wCount > 0){
            $(".reset_btn").show();
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
 window.addEventListener("scroll", function(){
     var header = document.querySelector("header");
     header.classList.toggle("sticky", window.scrollY > 0);
 })
   //  sticky header  //