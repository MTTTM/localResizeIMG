/**
 * Created by Administrator on 2015/9/21.
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
var PAGE = (function() {
    var fn = {
            listenOrientation: function() {
                var supportsOrientationChange = "onorientationchange" in window,
                    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
                $(window).bind(orientationEvent, function() {
                    var tips = $('#lateralTips');
                    if (window.orientation == 180 || window.orientation == 0) {
                        tips.fadeOut();
                    }
                    if (window.orientation == 90 || window.orientation == -90) {
                        $('html,body').scrollTop(0);
                        tips.fadeIn();
                    }
                }).trigger('orientationEvent');
            },
            PAGE_NAME: function() {
                if ($('html').attr('id')) {
                    return $('html').attr('id').replace(/^p\-/, '');
                } else {
                    return false;
                }
            },
            setSwiper: function() {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
            },
            setBbs: function() {
                var touchEvents = {
                    touchstart: "touchstart",
                    touchmove: "touchmove",
                    touchend: "touchend",
                    /**
                     * @desc:判断是否pc设备，若是pc，需要更改touch事件为鼠标事件，否则默认触摸事件
                     */
                    initTouchEvents: function() {
                        if (isPC()) {
                            this.touchstart = "mousedown";
                            this.touchmove = "mousemove";
                            this.touchend = "mouseup";
                        }
                    }
                };
                $('.change_post a').bind(touchEvents.touchstart, function(event) {
                    $(this).addClass('curr').siblings().removeClass('curr');
                });
                $('.post .close').bind(touchEvents.touchstart, function(event) {
                    $(this).parent().remove()
                });


                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    slidesPerView: 5,
                    paginationClickable: true,
                    onSlideChangeStart: function(swiper) {
                        console.log(swiper.slides.length + '     ' + swiper.activeIndex);
                        if (swiper.activeIndex >= swiper.slides.length - 5) {
                            $('.menu .left').hide();
                            $('.menu .right').show();
                        } else if (swiper.activeIndex < swiper.slides.length - 5 && swiper.activeIndex > 0) {
                            $('.menu .left').show();
                            $('.menu .right').show()
                        } else {
                            $('.menu .left').show();
                            $('.menu .right').hide();
                        }

                    }
                });

            },
            setTotop: function() {
                $(window).scroll(function() {
                    if ($(window).scrollTop() > 100) {
                        $('.totop').fadeIn(1500);
                    } else {
                        $('.totop').fadeOut(1500);
                    }
                });
                $('.totop').click(function() {
                    $('body,html').animate({ scrollTop: 0 }, 1000);
                    return false;
                });

            },
            setTiezi: function() {
                $(".sub_btn").click(function() {
                    var str = $("#saytext").val();
                    $("#show").html(replace_em(str));
                });
                /*上传图片*/
                var uploader = WebUploader.create({
                    // 自动上传。
                    auto: true,
                    // 文件接收服务端。
                    //            server: api.COMMON.uploadImage,
                    server: uploadImgUrl,

                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: {
                        id: '#picker',
                        multiple: false
                    },

                    fileNumLimit: 9,
                    fileSingleSizeLimit: 2 * 1024 * 1024,

                    // 只允许选择文件，可选。
                    accept: {
                        extensions: 'gif,jpg,png'
                    }
                });
                //新增一个上传按钮
                uploader.addButton({
                    id: '.j-addFile'
                });
                // 文件上传过程中创建进度条实时显示。
                uploader.on('uploadProgress', function(file, percentage) {
                    if ('success' === a.status) {
                        var li = '<div class="up_list" id="' + file.id + '">' +
                            '+<input type="hidden" name="filePath" value=' + a.data.url + '> ' +
                            '<span class="dele"></span>' +
                            '<span class="prepres j-prepres">' +
                            '<span></span>' +
                            '</span>' +
                            '<img src="' + a.data.url + '"/>' +
                            '</div>';
                        $("#picker").before(li);
                        li.find(".j-prepres").css("width", percentage * 100 + '%')
                    }
                });

                // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                uploader.on('uploadSuccess', function(file, a, b) {
                    $("#up_tip").hide();
                    $("#" + file.id).find(".j-dele").css("display", "block");
                    $("#" + file.id).find("img").attr("src", a.data.url)
                });

                // 文件上传失败，现实上传出错。
                uploader.on('uploadError', function(file) {
                    $("#up_tip").html("文件上传失败").show();
                });
                uploader.on('uploadComplete', function(file) {
                    $("#" + file.id).find(".j-prepres").css("width", 0);
                });


                uploader.on('error', function(handler) {
                    if (handler == 'Q_TYPE_DENIED') {
                        $("#up_tip").html("只能上传gif,jpg,png格式图片").show();
                    }
                    if (handler == "Q_EXCEED_NUM_LIMIT") {
                        $("#up_tip").html("上传数量不能多于9").show();
                    }
                    if (handler == "F_EXCEED_SIZE") {
                        $("#up_tip").html("上传图片不能大于2M").show();
                    }

                });

                //删除上传图片
                $("body").on('touchstart', '.j-dele', function() {
                    $(this).parent().remove();
                    var attr = $(this).parents("j-up_list").attr("id");;
                    uploader.removeFile(uploader.getFile(attr));
                    $(this).parents("j-up_list").remove();
                });
                //提交数据
                $(".j-submit").on("click", function() {
                        $.ajax({
                            url: ajaxUrl,
                            dataType: json,
                            data: { "msg": $("#saytext").val() },
                            success: function(data) {

                            },
                            error: function(xhr, type) {

                            }
                        })
                    })
                    //表情
                    // 绑定表情
                $('#face').SinaEmotion($('#saytext'));

                // 测试本地解析
                function out() {
                    var inputText = $('.emotion').val();
                    $('#out').html(AnalyticEmotion(inputText));
                }
            },
            setPlxq: function() {
                $("#loadData").click(function() {
                    $.ajax({
                        url: ajaxUrl,
                        success: function(data) {
                            var result = '';
                            for (var i = 0; i < 10; i++) {
                                result += '<li>' +
                                    '<img src="img/tx.png" alt="">' +
                                    '<div class="u_right">' +
                                    '<div>' +
                                    '<span class="u_name">笑墨小白</span>' +
                                    '<span class="u_sex u_male u_female"></span>' +
                                    '<span class="u_lv">LV.12</span>' +
                                    '<span class="u_ps">版主</span>' +
                                    '<span class="pl_f">2楼</span>' +
                                    '</div>' +
                                    '<p>' +
                                    '我操,我要参与我要' +
                                    '</p>' +
                                    '<div class="btm">' +
                                    '<span class="time">03-28 12:03:54</span>' +
                                    '<div class="btm_opt">' +
                                    '<i>' +
                                    '<span class="u_dz"></span> <span>81472</span>' +
                                    '</i>' +
                                    '<i>' +
                                    '<span class="u_pl"></span>' +
                                    '<span>92671</span>' +
                                    '</i>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>';
                            }
                            // 为了测试，延迟1秒加载
                            //setTimeout(function(){
                            $('#list').append(result);
                            // 每次数据加载完，必须重置
                            dropload.resetload();
                            //},1000);
                        },
                        error: function(xhr, type) {

                        }
                    })
                })
            },
            setdown: function() {

                var video = $('video').get(0);
                $('.alldec').toggle(
                    function() {
                        $(this).text('收起')
                        $('.contdec em').show();
                    },
                    function() {
                        $(this).text('全文')
                        $('.contdec em').hide();
                    }
                );

                $('.swiper-slide').eq(0).click(function() {
                    $('.pop').show();
                    video.play();
                })

                $('.pop').click(function() {
                    $(this).hide();
                    video.pause();

                })
                $('.pop video').click(function() {
                    return false;
                })

                var listUl = $('.list ul');
                var listLength = $('.list ul li').length
                var timeStep = 0;
                var time = setInterval(function() {
                    if (listLength == 1) {
                        return false;
                    }
                    if (timeStep >= listLength - 1) {
                        timeStep = -1
                    }
                    timeStep++;
                    listUl.css({ top: -(timeStep * 34) })

                }, 2000)


            },
            setshare: function(obj) {
                var mark = $('<div id="mask"><span></span></div>');
                mark.appendTo("body");
                $(obj).bind('click', function() {
                    $('#mask').show();
                })
                $('#mask').bind('click', function() {
                    $('#mask').hide();

                })
            },
            setAllFun: function() {}
        },
        init = function() {
            var arrOutTime = [];
            $('nav div a').eq(0).click(function() {
                $.cookie('redicon1', '1', { expires: arrOutTime[1] / 3600 / 24 });
            })
            $('nav div a').eq(2).click(function() {
                $.cookie('redicon2', '2', { expires: arrOutTime[2] / 3600 / 24 });
            })
            $('#menu li').eq(1).find('a').click(function() {
                $.cookie('redicon3', '3', { expires: arrOutTime[3] / 3600 / 24 });
            })
            $('#menu li').eq(3).find('a').click(function() {
                $.cookie('redicon4', '4', { expires: arrOutTime[4] / 3600 / 24 });
            })

            //福利详情
            $('#fulixuanxian li').eq(0).find('a').click(function() {
                $.cookie('redicon5', '5', { expires: arrOutTime[5] / 3600 / 24 });
            })
            $('#fulixuanxian li').eq(1).find('a').click(function() {
                $.cookie('redicon6', '6', { expires: arrOutTime[6] / 3600 / 24 });
            })
            $('#fulixuanxian li').eq(2).find('a').click(function() {
                $.cookie('redicon7', '7', { expires: arrOutTime[7] / 3600 / 24 });
            })

            $("<i></i>").appendTo("#menu li:eq(1) a");
            $("<i></i>").appendTo("#menu li:eq(3) a");

            $.ajax({
                url: '?ct=index&ac=ajax_red_icon',
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    $.each(data, function(key, val) {

                        if (key == 1) {
                            arrOutTime.push(data[key])
                            if ($.cookie("redicon1") == null) {
                                $('nav div i').eq(0).addClass('red');
                            }
                        }
                        if (key == 2) {
                            arrOutTime.push(data[key])
                            if ($.cookie("redicon2") == null) {
                                $('nav div i').eq(2).addClass('red');
                            }
                        }
                        if (key == 3) {
                            arrOutTime.push(data[key])
                            if ($.cookie("redicon3") == null) {
                                $('#menu li').eq(1).find('i').addClass('red');

                            }
                        }
                        if (key == 4) {
                            arrOutTime.push(data[key])
                            if ($.cookie("redicon4") == null) {
                                $('#menu li').eq(3).find('i').addClass('red');
                            }
                        }
                        //福利详情
                        if (key == 5) {
                            arrOutTime.push(data[key])
                            if ($.cookie("redicon5") == null) {
                                $('#fulixuanxian li').eq(0).find('i').addClass('block');
                            }
                        }
                        if (key == 6) {
                            arrOutTime.push(data[key])
                            if ($.cookie("redicon6") == null) {
                                $('#fulixuanxian li').eq(1).find('i').addClass('block');
                            }
                        }
                        if (key == 7) {
                            arrOutTime.push(data[key])
                            if ($.cookie("redicon7") == null) {
                                $('#fulixuanxian li').eq(2).find('i').addClass('block');
                            }
                        }

                    });

                }
            })
            if (fn.PAGE_NAME() == 'index') {
                fn.setSwiper();


            }
            if (fn.PAGE_NAME() == 'bbs') {
                fn.setBbs();
                fn.setTotop()
            }

            if (fn.PAGE_NAME() == 'pinglunxiangqing') {
                fn.setPlxq();
                fn.setTotop()
            }
            if (fn.PAGE_NAME() == 'down') {
                fn.setdown();
                fn.setshare('nav .share');
                var pinglunDZ = "http://3kw.com";
                commenApi.attention({ ajaxUrl: pinglunDZ });
            }
            fn.setAllFun();


        }
    return {
        fn: fn,
        init: init
    }
})()

var commenApi = {
    module: function() {
        $(".j-back").on("click", function() {
            window.history.back();
        })
        $(window).scroll(function() {
            if ($(window).scrollTop() > 100) {
                $('.j-totop').fadeIn(1500);
            } else {
                $('.j-totop').fadeOut(1500);
            }
        });
        $('.j-totop').on("click",function() {
            $('body,html').animate({ scrollTop: 0 }, 1000);
            return false;
        });
    },
    isMoblie: function() {
        return new RegExp("Mobile").test(navigator.userAgent);
    },
    /*点赞
        默认参数:
        点击dom的class:j-dz
        统计数据Dom的class:j-dzCount
        激活转态class:j-attention
    */
    attention: function(opt) {
        /*ajaxUrl, EventDom, CountDom, actionClass,cancel[是否可取消，默认false]*/
        var _This = null;

        var EventDom2 = opt.EventDom ? opt.EventDom : ".j-dz";
        var CountDom = opt.CountDom ? opt.CountDom : ".j-dzCount";
        var actionClass = opt.actionClass ? opt.actionClass : "j-attention";
        var dzId = null; //被点赞的id
        var cancel = opt.cancel ? opt.cancel : false;

        var event = this.isMoblie() ? "touchstart" : "click";
        /*事件*/
        $("body").on(event, EventDom2, function(e) {
            e.stopPropagation();
            //当前是否已经点赞过
            var attr = $(this).hasClass(actionClass);
            _This = $(this);
            var count = parseInt($.trim(_This.find(CountDom).html()));

            //已点赞
            if (attr && cancel) {
                //不允许取消点赞
                return false;
            }

            dzId = _This.find("input").val();
            var status = "";

            $.ajax({
                url: opt.ajaxUrl,
                dataType: "json",
                data: { id: dzId },
                success: function(data) {
                    var action = data.errcode;
                    switch (action) {
                        case 0:
                            if (data.flag > 0) {
                                _This.find(CountDom).html(count + 1);
                                /*在这里更具是否可以取消来决定是否添加已经点赞标识*/
                                _This.addClass(actionClass);
                            } else {
                                _This.find(CountDom).html(count - 1);
                                if (!cancel) _This.removeClass(actionClass);
                            }
                            commenApi.msgTip({
                                msg: data.msg
                            });
                            break;
                        case 100:
                            commenApi.alertTip({
                                tit: data.msg,
                                callback: function() {
                                    window.location = data.url;
                                }
                            });
                            break;
                        default:
                            commenApi.alertTip({
                                tit: data.msg,
                            });
                            break;
                    }
                },
                error: function(xhr, type) {
                    commenApi.alertTip({
                        tit: data.msg,
                    });
                    ajaxEnd = true;
                }
            });
        });
    },
    /*alter类型弹窗提示1
       msg:提示内容，
       fn:处理函数
    */
    alert: function(msg, fn) {
        if (fn === undefined) {
            alert(msg);
        } else {
            fn();
        }
    },
    /*
        平台弹窗
       opt:
       tit:提示标题
       cnt:提示内容
       status:默认error和"",成功提示可以随意输入非“0”字符串
       callback:确认回调fn
    */
    alertTip: function(opt) {
        var tit = opt.tit ? opt.tit : "提示",
            cnt = opt.cnt ? opt.cnt : "点击关闭",
            status = opt.status ? opt.status : "error",
            callback = opt.callback ? opt.callback : function() {};
        var event = this.isMoblie() ? "touchend" : "click";

        var imgSrc = status == ("error" || "" || 0) ? "../static/img/pt_error_tip.png" : "../static/img/pt_ok_tip.png";

        if ($(".j-common-alert").length) {
            $(".j-common-alert").find(".tit").html(tit);
            $(".j-common-alert").find(".cnt").html(cnt);
            $(".j-common-alert").find(".imgSrc").attr("src", imgSrc);
        } else {
            var dom = '<div class="j-common-alert common-mark"><div class="common-alert">' +
                '<div class="inner">' +
                '<img src="' + imgSrc + '" class="imgSrc">' +
                '<p class="tit">' + tit + '</p>' +
                '<p class="cnt">' + cnt + '</p>' +
                '</div>' +
                '</div></div>';
            $("body").append(dom);
        }


        this.alert("alert", function() {
            $(".j-common-alert").css({ "display": "block" });
            // $("#hasUpList").one("",function(e) {
            //      alert("上传");
            // })
            // $(".j-common-alert").one("touchend",function(e) {
            //      e.stopPropagation();

            //      $(".j-common-alert").css({ "display": "none" });
            // })
           $(".j-common-alert").one("touchend",function(e) {
                $(".j-common-alert").css({ "display": "none" })
                if (callback != undefined && callback != null & typeof callback === "function") {
                    callback();
                }
                return false;

            })
        })

    },
    msgTip: function(opt) {
        var msg = opt.msg;
        var timer = null;
        var callback = opt.callback ? opt.callback : function() {};
        clearTimeout(timer);
        if ($(".common-topTip").length) {
            $(".common-topTip").find("b").html(msg);
            $(".common-topTip").addClass("show");
            time = setTimeout(function() {
                $(".common-topTip").removeClass("show");
                if (callback != undefined && callback != null & typeof callback === "function") {
                    callback();
                }
            }, 1000)
        } else {
            var dom = ' <div class="common-topTip"><span></span><b>' + msg + '</b></div>';
            $(dom).appendTo("body");
            setTimeout(function() { $(".common-topTip").addClass("show"); }, 50)
            time = setTimeout(function() {
                $(".common-topTip").removeClass("show");
                if (callback != undefined && callback != null & typeof callback === "function") {
                    callback();
                }
            }, 1000)
        }
    },

    /*
         评论头像解析
         一次性加载： txjx（$('div') ）
         ajax加载：txjx（$('div[class!='j-parseEmotion']') ）
         这里的class是固定的
    */
    txjx: function(wrap) {
        var dom = $(".j-jxtx"); /*避免之之前的调用参数有效，去掉了传参的功能，默认 class为j-txjx*/
        for (var i = 0; i < dom.length; i++) {
            dom.html($(this).html()).parseEmotion().addClass("j-parseEmotion")
        }
    },
    /*
       下拉加载列表
         opt={
          url:"ajax链接",
          data:"要发送的数据",
          type:"ajax发送方式",
          callball:"ajax成功后回调函数"
          wrapDom:"最外层滚动层"
         }
    */
    listDropLoad: function(opt) {
        /*默认参数如果opt没有修改就使用默认*/
        var defaultOpt = {
            url: window.location,
            data: { page: 1 },
            type: "get",
            callback: {},
            wrapDom: $(".inner"),
            scrollArea: window,
        }
        var opts = $.extend({}, defaultOpt, opt);
        var flag = true; /*标记是否有数据*/

        // dropload
        var dropload = opts.wrapDom.dropload({
            scrollArea: opts.scrollArea,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">暂无数据</div>'
            },
            loadDownFn: function(me) {
                if (!flag) {
                    me.resetload();
                    return false;
                }
                $.ajax({
                    url: opts.url,
                    data: opts.data,
                    type: "get",
                    async: false,
                    success: function(data) {
                        var data = JSON.parse(data);
                        if (data.length <= 0) {
                            me.noData();
                            flag = false;
                        } else {
                            opts.callback(data);
                            opts.data.page++;
                        }
                        me.resetload();

                    },
                    error: function(xhr, type) {
                        me.resetload();
                    }
                });
            }
        });
    }
};

$(function() {
	$('#adv').hide();
    PAGE.init();
    //公共
    commenApi.module();
   
    if($.cookie("redicon8")==null){
    	    $.ajax({
    	url:'?ct=user&ac=ajax_wx_subscribe',
    	type:'post',
    	dataType:'json',
    	success:function(data){
    		if(data.errcode=='0'){
    			$('#adv a').text(data.data.btn_name);
    		$('#adv a').attr('href',data.data.url);
    		$('#adv img').attr('src',data.data.img_url)
    		$('.des p').eq(0).text(data.data.title);
    		$('.des p').eq(1).text(data.data.tip);
    		$('#adv').css({'display':'block'});
    		}
    		$('#adv span').click(function(){
    			$('#adv').css({'display':'none'});
    		  $.cookie('redicon8', '8', { expires: data.data.time_live / 3600 / 24 });
    		})
    	}
    })
    }

})
