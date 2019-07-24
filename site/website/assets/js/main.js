$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
	    loop:true,
	    lazyLoad: true,
	    items: 1,
	    //margin:10,
	    nav:true,
	    navSpeed: 1000,
	    dots:false,
	    animateOut: 'rollOut',
	    mouseDrag: false,
	    //animateOut: 'rotateOutUpLeft',
    	animateIn: 'rollIn',
    	//stagePadding:30,
    	smartSpeed:1000,
	    //responsiveRefreshRate: 100,
	    //animateIn: true,
	    /*responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:3
	        },
	        1000:{
	            items:5
	        }
	    }*/
	});

   $(window).on('scroll', function () {
        if ($(window).scrollTop() > 70) {
            $('.header-section').addClass('header-fixed');
        } else {
            $('.header-section').removeClass('header-fixed');
        }
    });

   $(function () {
      var selectedClass = "";
      $(".filter").click(function () {
        selectedClass = $(this).attr("data-rel");
        $("#gallery").fadeTo(100, 0.1);
        $("#gallery div").not("." + selectedClass).fadeOut().removeClass('animation');
        setTimeout(function () {
          $("." + selectedClass).fadeIn().addClass('animation');
          $("#gallery").fadeTo(300, 1);
        }, 300);
      });
    });

	/*function inViewport($el) {
	    var H = $(window).height(),
	        r = $el[0].getBoundingClientRect(), t=r.top, b=r.bottom;
	    return Math.max(0, t>0? H-t : (b<H?b:H));  
	}

	$(window).on("scroll", function(){
	  var window_offset = inViewport($('.owl-carousel')); 
	  $(".overlay").height(window_offset);
	  //$(".caption").css("bottom", (window_offset / 4) );
	});*/
});
