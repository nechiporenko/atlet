// Application Scripts:


// Кнопка скролла страницы
// Модальное окно
// Корзина в хидере
// Форма поиска в хидере
// Слайдер новинок в сайдбаре
// Лайтбокс & zoom в карточке товара
// Вкладки в карточке товара
// Вкладки на странице Корзины
// Если браузер не знает о плейсхолдерах в формах
// ie8

jQuery(document).ready(function ($) {
    //Кэшируем
    var $window = $(window),
        $html=$('html'),
        $body = $('body');

    $body.append('<div id="overlay" class="overlay"></div>');
    var $overlay = $('#overlay');//оверлей

    
    //
    // Кнопка скролла страницы
    //---------------------------------------------------------------------------------------
    var initPageScroller = (function () {
        var $scroller = $('<div class="scroll-up-btn"><i class="icon-up-open-big"></i></div>');
        $body.append($scroller);
        $window.on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $scroller.show();
            } else {
                $scroller.hide();
            }
        });
        $scroller.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    }());


    //
    // Модальное окно
    //---------------------------------------------------------------------------------------
    var showModal = (function (link) {
        var
        method = {},
        $modal,
        $close;

        $close = $('<a class="modal__close" href="#"><i class="icon-cancel"></i></a>'); //иконка закрыть


        $close.on('click', function (e) {
            e.preventDefault();
            method.close();
        });

        // центрируем окно
        method.center = function () {
            var top, left;

            top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
            left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;

            $modal.css({
                top: top + $window.scrollTop(),
                left: left + $window.scrollLeft()
            });
        };


        // открываем
        method.open = function (link) {
            $modal = $(link);
            $modal.append($close);
            method.center();
            $window.bind('resize.modal', method.center);
            $modal.show();
            $overlay.show().bind('click', method.close);
        };

        // закрываем
        method.close = function () {
            $modal.hide();
            $overlay.hide().unbind('click', method.close);
            $window.unbind('resize.modal');
        };

        return method;
    }());

    // клик по кнопке с атрибутом data-modal - открываем модальное окно
    $('[data-modal]').on('click', function (e) {//передаем айди модального окна
        e.preventDefault();
        var link = $(this).data('modal');
        if (link) { showModal.open(link); }
    });


    //
    // Корзина в хидере
    //---------------------------------------------------------------------------------------
    var headerCart = (function () {
        var method = {},
            $block = $('.js-hcart'),
            $cart = $block.find('.h-cart__inner'),
            $btn = $block.find('.js-hcart-toggle');

        method.close = function () {
            $btn.removeClass('active');
            $cart.slideUp();
            $body.unbind('click', method.close);
        }

        method.show = function () {
            $btn.addClass('active');
            $cart.slideDown();
            $block.mouseleave(function () {
                $body.bind('click', method.close);
            }).mouseenter(function () {
                $body.unbind('click', method.close);
            });
        }
        
        $block.on('click', '.js-hcart-toggle', function () {
            if ($(this).hasClass('active')) {
                method.close();
            } else {
                method.show();
            }
        });

        return method;
    })();

    //
    // Форма поиска в хидере
    //---------------------------------------------------------------------------------------
    var headerSearch = (function () {
        var method = {},
            $block = $('.js-search'),
            $form = $block.find('form'),
            $menu = $block.parents('.h-menu'),
            $btn = $block.find('.js-search-toggle');

        method.close = function () {
            $btn.removeClass('active');
            $form.removeClass('active');
            $menu.removeClass('compact');
            $body.unbind('click', method.close);
        }
        method.show = function () {
            $btn.addClass('active');
            $form.addClass('active');
            $menu.addClass('compact');
            $block.mouseleave(function () {
                $body.bind('click', method.close);
            }).mouseenter(function () {
                $body.unbind('click', method.close);
            });
        }

        $block.on('click', '.js-search-toggle', function () {
            if ($(this).hasClass('active')) {
                method.close();
            } else {
                method.show();
            }
        });
        return method;
    })();

    //
    // Слайдер новинок в сайдбаре
    //---------------------------------------------------------------------------------------
    function initSidebarSlider() {
        var $slider = $('.js-sidebar-slider');
        $slider.bxSlider({
            pager: false,
            nextSelector: '.b-latest__arrow--next',
            prevSelector: '.b-latest__arrow--prev',
            nextText: '<i class="icon-right-open-big"></i>',
            prevText: '<i class="icon-left-open-big"></i>'
        });
    }
    if ($('.js-sidebar-slider').length) { initSidebarSlider() }

    //
    // Слайдер на главной странице
    //---------------------------------------------------------------------------------------
    function initMainSlider() {
        var $slider = $('.js-slider');
        $slider.bxSlider({
            mode: 'fade',
            controls: false,
            auto: true,
            pause: 8000,
            autoHover:true
        });
    }
    if ($('.js-slider').length) { initMainSlider() }

    //
    // Лайтбокс & zoom в карточке товара
    //---------------------------------------------------------------------------------------
    function initZoom() {
        var $el = $('.js-zoom'),
            target = $el.attr('href');
        $el.zoom({
            url: target,
            callback: function () {
                $el.lightbox({
                    'blur': false
                });
            }
        })
    }
    if($('.js-zoom').length){initZoom()}

    //
    // Вкладки в карточке товара
    //---------------------------------------------------------------------------------------
    function initTabs() {
        //старт - спрячем лишние вкладки, оставим текущую (по умолчанию - первую)
        var $tabs = $('.js-tabs');
        $('.b-tabs__content').hide();
        $tabs.each(function () {
            var $current = $(this).find('a.current');
            if (!$current.length) { $(this).find('a:first').addClass('current'); }
            var target = $(this).find('a.current').attr('href');
            $(target).show();
        });

        //клик по вкладкам
        $tabs.on('click', 'a[href^="#"]', function (e) {
            e.preventDefault();
            var $btn = $(this).parents('ul').find('a');
            var tab_next = $(this).attr('href');
            var tab_current = $btn.filter('.current').attr('href');
            $(tab_current).hide();
            $btn.removeClass('current');
            $(this).addClass('current');
            $(tab_next).fadeIn();
            history.pushState(null, null, window.location.search + $(this).attr('href'));
            return false;
        });

        //Альтернативное открытие вкладки (кнопка с аттрибутом data-tab="id вкладки" в контенте)
        $('.page__main').on('click', '[data-tab]', function () {
            var target = $(this).data('tab'),
                $el = $tabs.find('a[href^=' + target + ']');
            $el.trigger('click');
        });

        //Откроем нужную вкладку по ссылке
        var wantedTag = window.location.hash;
        if (wantedTag != "") {
            try {
                var $allTabs = $tabs.find("a[href^=" + wantedTag + "]").parents('ul').find('a');
                var defaultTab = $allTabs.filter('.current').attr('href');
                $(defaultTab).hide();
                $allTabs.removeClass('current');
                $tabs.find("a[href^=" + wantedTag + "]").addClass('current');
                $("#" + wantedTag.replace('#', '')).show();
            } catch (e) {
                // 
            }
        }
    }
    if ($('.js-tabs').length) { initTabs() }

    //
    // Вкладки на странице Корзины
    //---------------------------------------------------------------------------------------
    function initCartTabs() {
        var $rtab = $('.b-cart__tab');
        $('.js-rtab').on('change', function () {
            var target = $(this).val();
            $rtab.hide();
            $(target).fadeIn();
        });
    }
    if($('.js-rtab').length){initCartTabs()}

    //
    // Если браузер не знает о плейсхолдерах в формах
    //---------------------------------------------------------------------------------------
    if (!("placeholder" in document.createElement("input"))) {
        $("input[placeholder], textarea[placeholder]").each(function () {
            var val = $(this).attr("placeholder");
            if (this.value == "") {
                this.value = val;
            }
            $(this).focus(function () {
                if (this.value == val) {
                    this.value = "";
                }
            }).blur(function () {
                if ($.trim(this.value) == "") {
                    this.value = val;
                }
            })
        });

        $('form').submit(function () {
            $(this).find("input[placeholder], textarea[placeholder]").each(function () {
                if (this.value == $(this).attr("placeholder")) {
                    this.value = "";
                }
            });
        });
    }

    //
    // ie8
    //---------------------------------------------------------------------------------------
    if ($html.hasClass('lt-ie9')) {
        $('.products-list__item:nth-child(3n+1)').css('clear', 'left');
        $('.products-list__item:nth-child(3n)').css('margin-right', 0);
        $('input[type="radio"]').removeClass('css-radio').next('label').removeClass('css-radio-label');
    }
    
});
