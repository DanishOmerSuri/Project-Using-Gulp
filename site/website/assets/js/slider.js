$(document).ready(function() {
    
    $('.slick-slider').slick({
        dots: true,
        fade: true,
        arrows: true,
        centerPadding: '0px',
        autoplay: true,
        autoplaySpeed: 7000,
        pauseOnHover: false,
        pauseOnFocus: false
    });

    $('.responsive-thing-to-do').slick({
      dots: false,
      arrows: true,
      infinite: false,
      speed: 300,
      slidesToShow: 5,
      slidesToScroll: 1,
      prevArrow: '<span class="slick-prev-custom"></span>',
      nextArrow: '<span class="slick-next-custom"></span>',
      // variableWidth: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            dots: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            infinite: false,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            infinite: false,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]

   //    onAfterChange: function(slide, index) {
   //     if(index == 0) {
   //         $('.slick-prev-custom').css({
   //          'display', 'none'
   //      });
   //     }
   //     else {
   //         $('.slick-prev-custom').css({
   //          'display', 'block'
   //      });
   //     }
   // }
    });

    // $('.responsive-thing-to-do').on('afterChange', function (event, slick, currentSlide) {

    //     // if(currentSlide === 2) {
    //     //     $('.slick-next').addClass('hidden');
    //     // }
    //     // else {
    //     //     $('.slick-next').removeClass('hidden');
    //     // }

    //     if(currentSlide === 0) {
    //         $('.slick-prev-custom').removeClass('slick-arrow');
    //     }
    //     else {
    //         $('.slick-prev-custom').addClass('slick-arrow');
    //     }  
    // })

});

/*

$(window).resize(function() {
    resizeItems();
});

$(window).load(function() {
    resizeItems();
});

function resizeItems() {
    cw = window.innerWidth;
    ch = window.innerHeight;

    $('.imgSlide').css({
        'height': ch + 'px',
        'width': cw + 'px'
    });

    if (cw <= 786) {

        $('#slick-slide00, #slick-slide01, #slick-slide02, #slick-slide03').html('&bull;');

    } else if (cw > 768) {

        $('#slick-slide00').html("Eight amazing cities for street art");
        $('#slick-slide01').html("Switzerland for nature lovers");
        $('#slick-slide02').html("Madagascar: an island unlike any other");
        $('#slick-slide03').html("Aesthatic designs");
    }
}*/
