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
    selector = selector || '.swiper-auto-wrap';
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

    Object.assign(autoOpt, commOpt);

    if (document.querySelectorAll(selector).length === 0) return false;

    document.querySelectorAll(selector).forEach(function (element, i) {
      if( $(element)[0].swiper !== undefined ) return;

      if (element.dataset.init === 'false') {
        element.removeAttribute('data-init');
        return false;
      }
      else {
        let commInitOpt, autoInitOpt;
        commInitOpt = {};
        autoInitOpt = {};
        Object.assign(commInitOpt, commOpt, customOpt);
        Object.assign(autoInitOpt, autoOpt, customOpt);

        if ( element.swiper === undefined ) {
          var className = element.classList.value;

          if (className.indexOf('swiper-auto-wrap') !== -1) {
            commSwiper[i] = new Swiper(element, autoInitOpt);
            commSwiper[i].init();
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

  _front.setContainerBottomGap = setContainerBottomGap;
  _front.setTabs = setTabs;
  _front.setCommSwiper = setCommSwiper;

  $(document).ready(function () {
    $_wrapper = $('.wrapper');
    $_container = $('.container-wrapper');
    $_docker = $('.docker-wrapper');

    setContainerBottomGap();
    setTabs();
    setCommSwiper();
  });

  return _front;
})();