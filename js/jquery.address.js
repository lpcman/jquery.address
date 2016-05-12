(function($) {

    var wrapper = "<div class='city-wrapper' />",
    	selectorWrapper = "<div class='city-select-warp' />",
     	cityHtml = [
	        '<div class="city-select-tab clearfix">',
	        	'<a class="" data-target="city-province">省</a>',
	        	'<a class="" data-target="city-city">市</a>',
	        	'<a class="" data-target="city-district">县/区</a>',
	        	'<a class="" data-target="city-street">街道</a>',
	        '</div>',
	        '<div class="city-select-content">',
	        	'<div class="city-select city-province"></div>',
	        	'<div class="city-select city-city"></div>',
	        	'<div class="city-select city-district"></div>',
	        	'<div class="city-select city-street"></div>',
	        '</div>',
	        '<div class="city-select-operation">',
	        	'<button class="btn btn-default done">确定</button>',
	        '</div>'
	    ];

    var defaultOpts = {
    	text: true,  // value use text, false use code
    	type: "city" 
    };

    $.fn.city = function(opts) {

        var ths = this,
        	option = $.extend({}, defaultOpts, opts),
            thsTop = ths.offset().top,
            thsLeft = ths.offset().left,
            thsWidth = this.outerWidth(),
            thsHeight = ths.outerHeight(),
            $cityWrapper = $(wrapper),
            $selectorWrapper = $(selectorWrapper),
            $maskInput = null,
            $cityTab = "",
            $citySelector = "",
            $province = "",
            $doneBtn = null,
            cityArr = {
                province: ds,
                city: [],
                district: [],
                street: [],
            },
            selectorResult = null,
            $cityHtml = $(cityHtml.join(""));

        //初始化
        var init = function() {
        		$cityHtml.find("a[data-target$='" + defaultOpts.type + "']").nextAll().remove();
        		$cityHtml.find(".city-" + defaultOpts.type).nextAll().remove();

                // 添加辅助html
                ths.wrap($cityWrapper.width(thsWidth));
                $cityWrapper = ths.parent();
                $maskInput = ths.clone()
                		.removeAttr("id")
                		.removeAttr("name")
                		.addClass("mask-input")
                		.appendTo($cityWrapper);
        		ths.addClass("input-invisible");
                $selectorWrapper = $selectorWrapper
                		.addClass("city-none")
                		.append($cityHtml)
                		.appendTo($cityWrapper);
                $cityTab = $selectorWrapper.find(".city-select-tab");
                $citySelector = $selectorWrapper.find(".city-select");
                $province = $selectorWrapper.find(".city-province");
                $doneBtn = $selectorWrapper.find(".done");

                // 动态设置tab宽度
                $cityTab.find("a").width((100 / $cityTab.find("a").length || 1) + "%");

                //绑定事件
                $maskInput.on("focus", cityShow);
                //tab事件绑定
                $cityTab.on("click", "a", cityTab);
                //select事件绑定
                $citySelector.on("click", "a", addData);
                $doneBtn.on("click", close);
            },
            cityShow = function() {
                $selectorWrapper.removeClass("city-none");
                //默认显示省份内容
                var $first = $cityTab.find("a").eq(0);
                $first.trigger("click");
                $citySelector.html("");

                //是否为第一次打开
                if ($citySelector.eq(0).find("a").size() == 0) {
                    firstAddData(ds, 0);
                }

            },
            addData = function() {
                var $ths = $(this),
                    thsID = $ths.data("id"),
                    thsTxt = $ths.text(),
                    $thsPa = $ths.parent(),
                    $activeTabA = $cityTab.find("a[class=active]");
                	n = $activeTabA.index(),
                    thsTarget = $activeTabA.data("target"),
                    nextTabA = $cityTab.find("a").eq(n + 1);

                //样式修改
                $thsPa.find(".selected").removeClass("selected");
                $ths.addClass("selected");
                $cityTab.find("a").eq(n + 1).trigger("click");

                //赋值
                var thsFor = thsTarget.split("-")[1];

                //清空之后的内容
                for (var j = n + 1; j < $citySelector.size() - 1; j++) {
                    $citySelector.eq(j).html("");
                }

                for (var i = 0; i < cityArr[thsFor].length; i++) {
                    if (thsID == cityArr[thsFor][i].id) {
                        if (cityArr[thsFor][i].children == "" || cityArr[thsFor][i].children == undefined || $cityTab.children().length === n + 1) {
                            close();
                        } else {
                            var nextFor = nextTabA.data("target").split("-")[1];
                            cityArr[nextFor] = cityArr[thsFor][i].children;
                            firstAddData(cityArr[nextFor], n + 1);
                        }
                    }
                }

                //更新所选城市的值
                selectorResult = {
                    province: {
                    	text: $citySelector.eq(0).find("a.selected").text(),
                    	value: $citySelector.eq(0).find("a.selected").data("id")
                    },
                    city: {
                    	text: $citySelector.eq(1).find("a.selected").text(),
                    	value: $citySelector.eq(1).find("a.selected").data("id")
                    },
                    district: {
                    	text: $citySelector.eq(2).find("a.selected").text(),
                    	value: $citySelector.eq(2).find("a.selected").data("id")
                    },
                    street: {
                    	text: $citySelector.eq(3).find("a.selected").text(),
                    	value: $citySelector.eq(3).find("a.selected").data("id")
                    }
                };

                var textVal = selectorResult.province.text +
                    (selectorResult.city.text ? "/" + selectorResult.city.text : "") +
                    (selectorResult.district.text ? "/" + selectorResult.district.text : "") +
                    (selectorResult.street.text ? "/" + selectorResult.street.text : "");

                var codeVal = selectorResult.province.value +
                    (selectorResult.city.value ? "/" + selectorResult.city.value : "") +
                    (selectorResult.district.value ? "/" + selectorResult.district.value : "") +
                    (selectorResult.street.value ? "/" + selectorResult.street.value : "");

                $maskInput.val(textVal);
                ths.val(option.text === false ? codeVal : textVal);
            },
            cityTab = function() {
                var $ths = $(this),
                    thsFor = $ths.data("target"),
                    $tabCon = $("." + thsFor);
                $cityTab.find("a").removeClass("active");
                $ths.addClass("active");
                $citySelector.hide();
                $tabCon.show();
            },
            firstAddData = function(arr, num) {
                $citySelector.eq(num).html("");
                var strArr = [];
                for (var i = 0; i < arr.length; i++) {
                    strArr.push('<a href="javascript:void(0);" data-id="' + arr[i].id + '">' + arr[i].name + '</a>');
                }
                $citySelector.eq(num).append(strArr.join(""));
            },
            close = function() {
                $selectorWrapper.addClass("city-none");
            };

        //点击屏幕其余部位消失
        $(document).on("click", function(event) {
            var eo = $(event.target);
            if (!eo.parents().is(".city-select-warp") && !eo.hasClass("mask-input")) {
                close();
            }
        });

        init();
    }


})(jQuery);
