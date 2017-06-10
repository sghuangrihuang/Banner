;(function($){
	var Banner = (function(){
		//定义Banner的构造函数
		function Banner( element , options ){

			this.settings = $.extend({},$.fn.Banner.defaults, options || {});
			this.element = element;
			this.init();
		}

		//定义Banner的方法
		Banner.prototype = {
			
			/**
			 * 初始化
			 * @return {[type]} [description]
			 */
			init:function(){
				var me = this;
				me.outBanner = me.element;//banner
				me.divElem = me.outBanner.find(".item-container");
				me.ulElem = me.divElem.find(".item-box");
				me.liElem = me.ulElem.find(".item");
				me.current = 0;//当前索引值
				me.timer;//定时器
				me.playFlag = true;//播放标志
				me.liLength = me.liElem.length;//li的长度
				me.nextBtn = $(me.settings.nextButton) ;  //下一个按钮
				me.prevBtn = $(me.settings.prevButton) ;//上一个按钮
				
				// 初始化参数
				me.vilidate( );

				// 下个按钮绑定事件
				me.nextBtn.on("click", function () {
					if(me.playFlag){
						me.playFlag = false;
						me.isCarousel(true);
					}
				});
				
				// 上个按钮绑定事件
				me.prevBtn.on("click", function () {
					if(me.playFlag){
						me.playFlag = false;
						me.isCarousel(false);
					}
				});

				// 是否开启分页
				if( me.settings.pagination){
					me.Pagination();
				};


				// 是否开启自动播放
				if( me.settings.autoPlay && typeof me.settings.autoPlay == "boolean" ){
					me.autoPlay();
					me.outBanner.hover(function(){
						window.clearInterval(me.timer);
					},function(){
						me.autoPlay();
					});
				};
			},
			/**
			 * 验证参数
			 * @return {[type]} [description]                                             
			 */
			vilidate: function ( ) {
				var me = this;
				me.settings.spaceBetween =  me.settings.spaceBetween < 0 ? 1 : me.settings.spaceBetween;
				me.settings.group =  me.settings.group < 0 ? 1 : me.settings.group;
				me.settings.view =  me.settings.view < 0 ? 1 : me.settings.view;
				me.settings.delay = me.settings.delay < 0 ? 3000 : me.settings.delay;

				if( me.settings.group > me.settings.view  ){
					console.warn("group > view") ;
					me.settings.group = me.settings.view;
				}

				me.liElem.css({
					"width" : ( me.divElem.width() - me.settings.spaceBetween * ( me.settings.view -1 )  ) / me.settings.view ,
				});

				me.divElem.css({
					"height" : me.liElem.find('img').height() || me.liElem.height()
				});

				// 设置外边距
				if( me.settings.spaceBetween ){
					me.liElem.css({
						"marginRight": me.settings.spaceBetween,
					});
				}

				// 获取焦点按钮的个数
				me.btnlength = parseInt(  ( me.liLength - me.settings.view ) / me.settings.group + 1  ) ;
        
				// ( btn-1 ) * group + view = Length 
				if( me.btnlength == 0 ) {
					console.error("Item number is not enough to re add the number");
					return;
				}
			},
			/**
			 * 播放
			 * @param  {string}  method 播放类型 prev next
			 */
			isCarousel:function( method ) {
				var me = this;
				me.current = method 
				? (me.current+1+me.btnlength) % me.btnlength 
				: (me.current-1+me.btnlength) % me.btnlength;
				me.Carousel( me.current );
			},
			/**
			 * 自动播放
			 * @return {[type]} [description]
			 */
			autoPlay:function () {
				var me = this ;

				me.timer = window.setInterval(function(){

					me.isCarousel(true);

				}, me.settings.delay);
			},
			/**
			 * 定义轮播函数（方法）
			 * @param  {int} current li的索引值
			 */
			Carousel:function( current ) {
				var me = this;
				me.outBanner = me.element;
				me.ulElem = me.outBanner.find(".item-box");
				me.liElem = me.ulElem.find(".item");
				var wid = me.liElem.outerWidth(true) * me.settings.group;
				me.ulElem.animate({
					left: -current*wid
				}, me.settings.speed, function(){
					me.playFlag = true;
				});

				if ( me.settings.pagination ) {
					me.btnElem = me.btnBoxElem.find(".item-btn");
					me.btnElem.removeClass("active").eq(current).addClass("active");
				}
			},

			/**
			 * 分页函数
			 */
			Pagination:function(){
				var me = this;
				me.outBanner = me.element;
				me.btnBoxElem  = $( me.settings.pagination );
				var ol = $("<ol class='item-btnBox' />");
				ol.appendTo(me.btnBoxElem);
				for(var i=0;i<me.btnlength;i++){
					$("<li class='item-btn'/>").attr("data-index",i).on('click',function(){
						if( me.playFlag ){
							me.playFlag = false;
							me.current = $(this).attr("data-index");
							me.Carousel( me.current );
						}
					}).appendTo(ol);
				}
				ol.find("li").eq(0).addClass("active");
				me.btnBoxElem.appendTo(me.outBanner);
			}
		}
		return Banner;
	})();

	$.fn.Banner = function ( options ){
		// 单例模式
		var me = $(this);
		var instance = me.data("banner");
		if(!instance){
			instance = new Banner(me, options );
			me.data("banner", instance);
		}
		return instance;
	}

	$.fn.Banner.defaults={

		"speed":600,			//动画时长	默认600ms
		"autoPlay":false,		//自动轮播	默认不开启
		"delay":3000,			//轮播时长	默认3000ms
		"pagination":false,		//分页 		默认为不开启
		"nextButton":"",		//下一个按钮 
		"prevButton":"",		//上一个按钮
		"view":1,				//显示幻灯片的个数	默认为1
		"spaceBetween":0,		//轮播之间距离（右边距）  默认为0px
		"group":1,				//每次轮播个数	默认为1

	}


})(jQuery);