/*
 * name : reward.front.ui.js
 * desc : UI 공통 자바스크립트
 * writer : glim
 * date : 20259999
 * last : 20259999
*/

var $_wrapper,
    $_container,
    $_docker;

var rewardPub = rewardPub || {};

rewardPub.front = rewardPub.front || (function () {
  var _front;
  _front = {};


  /*
  * date : 20259999
  * last : 20259999
  * name : setContainerBottomGap()
  * pram :
  * desc : set container bottom gap
  */
  function setContainerBottomGap(selector) {
    selector = selector || $_docker;
    if ($(selector).length === 0) return false;

    var dockerHeight = $(selector).height();
    if ( dockerHeight !== 0 ) {
      $_container.css('padding-bottom', dockerHeight + 'px');
    }
  }


  /*
  * date : 20259999
  * last : 20259999
  * name : setCommSwiper()
  * pram : selector - 실행 대상 swiper element
           customOpt - swiper option custom
  * desc : set common swiper
  */
  function setCommSwiper(selector, customOpt) {
    selector = selector || '.swiper-auto-wrap, .swiper-dot-wrap, .swiper-fraction-wrap';
    customOpt = customOpt !== undefined ? customOpt : {};
    let commSwiper = [];

    // common option
    const commOpt = {
      resistanceRatio: 0.58,
      observer: true,
      observeParents: true,
      watchOverflow: true,
      spaceBetween: 0,
      touchStartForcePreventDefault: true,
      wrapperClass: 'swiper-list',
      slideClass: 'swiper-item',
      a11y: {
        enabled: true,
        prevSlideMessage: '이전 슬라이드',
        nextSlideMessage: '다음 슬라이드',
        slideLabelMessage: '총 {{slidesLength}}개 중 {{index}}번째 슬라이드',
      },
      freeMode: false,
    };

    // auto type ( default )
    const autoOpt = {
      init: false,
      speed: 150,
      slidesPerView: 'auto',
      freeMode: {
        enabled: true,
        momentumBounceRatio: 0.2,
      }
    };

    // dot type
    const dotOpt = {
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
      },
    };

    // loop option
    if ($(selector).hasClass('is-loop')) commOpt.loop = true;

    Object.assign(autoOpt, commOpt);
    Object.assign(dotOpt, commOpt);

    if (document.querySelectorAll(selector).length === 0) return false;

    document.querySelectorAll(selector).forEach(function (element, i) {
      if( $(element)[0].swiper !== undefined ) return;

      if (element.dataset.init === 'false') {
        element.removeAttribute('data-init');
        return false;
      }
      else {
        let commInitOpt, autoInitOpt, dotInitOpt, fractionInitOpt;
        commInitOpt = {};
        autoInitOpt = {};
        dotInitOpt = {};

        Object.assign(commInitOpt, commOpt, customOpt);
        Object.assign(autoInitOpt, autoOpt, customOpt);
        Object.assign(dotInitOpt, dotOpt, customOpt);

        if ( element.swiper === undefined ) {
          var className = element.classList.value;

          if (className.indexOf('swiper-auto-wrap') !== -1) {
            commSwiper[i] = new Swiper(element, autoInitOpt);
            commSwiper[i].init();
          }
          else if(className.indexOf('swiper-dot-wrap') !== -1) {
            commSwiper[i] = new Swiper(element, dotInitOpt);
            commSwiper[i].init();

            if ($(selector).hasClass('is-num-bullet')) {
              dotOpt.pagination = {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                  return '<span class="' + className + '">' + (index + 1) + '</span>';
                },
              }
            }
          }
        }
      }
    });
  }


  /*
  * date : 20259999
  * last : 20259999
  * name : setTabs()
  * pram : selector - Tab 생성 DOM 셀렉터
  * desc : set jQuery UI - Tab
  */
  function setTabs(selector) {
    selector = selector || '.tab-wrap';

    if ($(selector).length === 0) return false;
    $(selector).each(function () {
      var that = $(this);

      if (that.hasClass('link-tab')) return;

      var initTabItem = that.find('.tab-item.ui-tabs-active');

      that.tabs({
        beforeActivate: function (event, ui) {
          if ($(ui.newTab).find('a').attr('href').indexOf('#') !== 0) {
            var tg = $(ui.newTab).find('a').attr('target') === undefined ? '_self' : $(ui.newTab).find('a').attr('target');
            window.open($(ui.newTab).find('a').attr('href'), tg);
          }
        },
        create: function (event, ui) {
          that.tabs('option', 'active', initTabItem.index());
        },
      });
    });
  }


  /*
  * date : 20259999
  * last : 20259999
  * name : setFoldBox()
  * pram : selector - Fold wrap DOM 셀렉터
  * desc : set fold box
  */
  function setFoldBox(selector) {
    selector = selector || '.fold-wrap';
    if ($(selector).length === 0) return false;

    setFoldData(selector);

    $(selector).find('.btn-fold').off('click').on('click', function (event) {
      if ($(event.target).is('a')) return;

      var foldBox = $(this).closest('.fold-item, .fold-overflow-box'),
          isExpanded = foldBox.hasClass('expanded');

      if (isExpanded) foldOnOff().foldClose(foldBox);
      else foldOnOff().foldOpen(foldBox);

      var evtData = {
        index: $(event.currentTarget).closest('.fold-item, .fold-overflow-box').index(),
        isExpanded: $(event.currentTarget).closest('.fold-item, .fold-overflow-box').hasClass('expanded'),
      };

      var evt = new CustomEvent('headerClick', {'detail': evtData});
      $(event.currentTarget).closest('.fold-item, .fold-overflow-box')[0].dispatchEvent(evt);
    });

    $(window).off('resize observerUpdate orientationchange', setFoldData).on('resize observerUpdate orientationchange', setFoldData);
  }

  function setFoldData(selector) {
    selector = selector ? selector : '.fold-wrap';

    if ($(selector).length === 0) return false;
    $(selector).find('.fold-item .fold-header, .fold-overflow-box .fold-header').each(function () {
      var tgItem = $(this).closest('.fold-item, .fold-overflow-box');

      tgItem.css('height', 'auto');
      tgItem.css('height', tgItem.outerHeight());
    });
  }

  /*
  * date : 20259999
  * last : 20259999
  * name : foldOnOff()
  * pram : fold-item, fold-overflow-box
  * desc : fold On/Off
  */
  function foldOnOff() {
    return {
      foldOpen: function (selector) {
        if (!selector.hasClass('expanded')) {
          selector.addClass('expanded');
          foldTransition(selector);

          if ($(selector).hasClass('fold-overflow-box')) $('.text', selector).text('닫기');
          else $('.btn-fold', selector).find('.offscreen').text('컨텐츠 닫기');
        }
      },
      foldClose: function (selector) {
        if (selector.hasClass('expanded')) {
          selector.removeClass('expanded');
          foldTransition(selector);

          if ($(selector).hasClass('fold-overflow-box')) $('.text', selector).text('자세히 보기');
          else $('.btn-fold', selector).find('.offscreen').text('컨텐츠 열기');
        }
      },
    }
  }

  /*
  * date : 20259999
  * last : 20259999
  * name : foldOnOff()
  * pram : selector - fold-item, fold-overflow-box
  * desc : fold height open/close transition
  */
  function foldTransition(selector, isForce) {
    var curHeight,
      changeHeight = 0;
    isForce = isForce || false;

    curHeight = selector.outerHeight();
    selector.css('height', 'auto');
    changeHeight = selector.outerHeight();
    selector.css('height', curHeight).stop().queue('fx', []).animate({height: changeHeight}, (isForce ? 0 : 100), function () {
      var that = $(this);
      if (selector.hasClass('expanded') && that.closest('.fold-wrap').data('type') === 'single' && selector.offset().top < _scrollTop) {
        _noScroll = true;
        $('html, body').stop().queue('fx', []).animate({scrollTop: that.offset().top - 50}, 250, function () {
          setTimeout(function () {
            _noScroll = false;
          }, 250);
        });
      }
    });
  }

  function foldHeightChange(selector) {
    var changeHeight = 0;

    selector.css('height', 'auto');
    changeHeight = selector.outerHeight();
    selector.css('height', changeHeight);
  }

  _front.setContainerBottomGap = setContainerBottomGap;
  _front.setTabs = setTabs;
  _front.setFoldBox = setFoldBox;
  _front.setCommSwiper = setCommSwiper;

  $(document).ready(function () {
    $_wrapper = $('.wrapper');
    $_container = $('.container-wrapper');
    $_docker = $('.docker-wrapper');

    setContainerBottomGap();
    setTabs();
    setFoldBox();
    setCommSwiper();
  });

  return _front;
})();