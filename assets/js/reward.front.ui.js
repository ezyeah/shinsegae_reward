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
        slideLabelMessage: '{{slidesLength}} / {{index}}',
      },
      freeMode: false,
      speed: 300,
    };

    // auto type
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

    // fraction type
    const fractionOpt = {
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
        renderFraction: function (currentClass, totalClass) {
          return '<span class="' + currentClass + '"></span>' + ' / ' +
              '<span class="' + totalClass + '"></span>';
        },
        formatFractionCurrent: function (number) {
          return number < 10 ? '0' + number : number;
        },
        formatFractionTotal: function (number) {
          return number < 10 ? '0' + number : number;
        },
      },
    };

    // option - loop
    if ($(selector).hasClass('is-loop')) commOpt.loop = true;

    Object.assign(autoOpt, commOpt);
    Object.assign(dotOpt, commOpt);
    Object.assign(fractionOpt, commOpt);

    if (document.querySelectorAll(selector).length === 0) return false;

    document.querySelectorAll(selector).forEach(function (element, i) {
      const isBulletTypeNum = element.querySelector('.swiper-pagination')?.classList.contains('type-num');

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
        fractionInitOpt = {};

        Object.assign(commInitOpt, commOpt, customOpt);
        Object.assign(autoInitOpt, autoOpt, customOpt);
        Object.assign(dotInitOpt, dotOpt, customOpt);
        Object.assign(fractionInitOpt, fractionOpt, customOpt);

        if ( element.swiper === undefined ) {
          var className = element.classList.value;

          if (className.indexOf('swiper-auto-wrap') !== -1) {
            commSwiper[i] = new Swiper(element, autoInitOpt);
            commSwiper[i].init();
          }
          else if(className.indexOf('swiper-dot-wrap') !== -1) {
            if (element.querySelector('.swiper-pagination').classList.contains('type-num')) {
              if (isBulletTypeNum) { // type bullet - number case
                dotInitOpt.pagination = {
                  el: '.swiper-pagination',
                  clickable: true,
                  renderBullet: function (index, className) {
                    return '<span class="' + className + '"><span class="num">' + (index + 1) + '</span></span>';
                  },
                }
                commSwiper[i] = new Swiper(element, dotInitOpt);
                commSwiper[i].init();
              }
            }
            else {
              commSwiper[i] = new Swiper(element, dotInitOpt);
              commSwiper[i].init();
            }
          }
          else if(className.indexOf('swiper-fraction-wrap') !== -1) {
            commSwiper[i] = new Swiper(element, fractionInitOpt);
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

  function getBodyHeight() {
    var myHeight = 0;
    if (typeof (window.innerHeight) == 'number') myHeight = window.innerHeight;
    else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) myHeight = document.documentElement.clientHeight;
    else if (document.body && (document.body.clientWidth || document.body.clientHeight)) myHeight = document.body.clientHeight;
    return myHeight;
  }

  function setPropertyVh() {
    document.documentElement.style.setProperty('--vh', _vh + 'px');
    document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
  }

  /*
  * date : 20259999
  * last : 20259999
  * name : setInputStatus()
  * pram :
  * desc : input 상태 변경(jQuery)
  */
  // input 상태 제어 (입력값/삭제버튼 표시)
  function setInputStatus() {
    let selector = '.ui-input';
    if ($(selector).length === 0) return false;

    $(selector).each(function () {
      const inputEl = $(this);
      const inputBox = inputEl.closest('.input-box, .input-search-box');
      const btnDelete = inputBox.find('.btn-input-del');

      // 상태 업데이트 함수
      function updateStatus() {
        const hasValue = inputEl.val().length > 0;
        const isFocused = inputEl.is(':focus');
        const isDisabled = inputEl.is(':disabled') || inputEl.prop('readonly');

        inputBox.toggleClass('has-value', hasValue);

        if (hasValue && isFocused && !isDisabled) {
          btnDelete.show();
        } else {
          btnDelete.hide();
        }
      }

      // focusin: 포커스 시 상태 업데이트
      inputEl.on('focusin', function () {
        updateStatus();
      });

      // input: 입력 중에도 버튼 보이도록 상태 업데이트
      inputEl.on('input', function () {
        updateStatus();
      });

      // focusout: 다음 루프에서 포커스 없으면 버튼 숨김 (setTimeout)
      inputEl.on('focusout', function () {
        setTimeout(() => {
          if (!inputEl.is(':focus')) {
            btnDelete.hide();
          }
        }, 0);
      });

      // 삭제 버튼 클릭 시: 값 삭제, input 이벤트 발생, 포커스 유지
      btnDelete.on('mousedown', function (e) {
        e.preventDefault();
        inputEl.val('').trigger('input').focus();
      });

      // 초기 상태 설정
      updateStatus();
    });
  }

  /*
  * date : 20259999
  * last : 20259999
  * name : setUIDialog()
  * pram : selector {string} 레이어 팝업으로 생성할 컨테이너 셀렉터 (default: .ui-dialog-contents)
  * desc : jQuery UI dialog 팝업 설정
  */
  let _dialogCount = 0;
  function setUIDialog(selector) {
    selector = selector || '[data-role=dialog]';

    if($(selector).length > 0) {
      $(selector).each(function () {
        if ($(this).parents('.ui-dialog').length > 0) return;

        const containerId = 'body';
        const dialogClass = $(this).data('class') || '';
        const dialogId = 'dialogContainer' + _dialogCount++;

        $(containerId).append(`<div id="${dialogId}" class="ui-dialog-container"></div>`);

        $(this).dialog({
          appendTo: containerId + ' #' + dialogId, // resize 시, popup 가운데 정렬 css 제어를 위해 container append
          autoOpen: false,
          minHeight: 'none',
          height: 'auto',
          closeText: '닫기',
          modal: true,
          resizable: false,
          draggable: false,
          position: null,
          classes: {
            'ui-dialog': dialogClass // popup case multi class 추가
          },
          open: function () {
            // 팝업 열었을 때 화면 스크롤 막기
            $('body').addClass('dialog-open');

            const $that = $(this);
            const $dialog = $that.closest('.ui-dialog');
            const $container = $dialog.closest('.ui-dialog-container');

            // ui-dialog-content 기본 style 제거
            $dialog.find('.ui-dialog-content').removeAttr('style');

            // 팝업 2개 이상 노출 시 z-index 지정 (현재 열려있는 팝업 개수만큼 z-index 증가)
            $container.addClass('open').css('z-index', 111 + $('.ui-dialog-container:visible').length);

            // dim 영역 클릭시 팝업 닫기
            if ($that.data('class') && $that.data('class').includes('dim-close')) {
              $('.ui-widget-overlay').on('click', function () {
                // 팝업 닫기
                // console.log('클릭클릭')
                $that.dialog('close');
              });
            }
          },
          close: function () {
            $('body').removeClass('dialog-open');
            const $that = $(this);
            const $dialog = $that.closest('.ui-dialog');
            const $container = $dialog.closest('.ui-dialog-container');

            // ui-dialog-content 기본 style 제거
            $dialog.find('.ui-dialog-content').removeAttr('style');

            // z-index style 삭제
            $container.removeClass('open').removeAttr('style');
          },
          create: function () {
            $(`#${dialogId} .ui-dialog-titlebar`).remove();
          }
        });
      });
    }
  }

  // jQuery UI dialog open/close 제어
  function dialogOnOff() {
    return {
      /*
       * 레이어팝업 open
       * @param tgId {string} 팝업 타겟 id
       * @param callback {string} 팝업 open 후 callback 함수
       */
      popOpen: function (tgId, callback, arg) {
        $(tgId).dialog('open');
        if (typeof callback === 'function') callback(tgId, arg);
      },
      /*
       * 레이어팝업 close
       * @param tgId {string} 팝업 타겟 id
       */
      popClose: function (tgId, callback, arg) {
        $(tgId).dialog('close');
        if (typeof callback === 'function') callback(tgId, arg);
      }
    };
  }

  /*
  * date : 20259999
  * last : 20259999
  * name : setTooltipOnOff()
  * pram :
  * desc :
  */
  function setTooltipOnOff(selector) {
    selector = selector || '.tooltip-wrap';


    if ($(selector).length > 0) {
      $(selector).each(function () {
        const that = $(this);

        that.find('.btn-tooltip').on('click', function () {
          const isActive = that.hasClass('active');

          if(isActive){
            //active 상태일 때 닫기
            $('.tooltip-wrap.active').removeClass('active').addClass('hide').find('.offscreen').text('툴팁 열기');
          }else{
            //다들 tooltip 모두 닫기
            $('.tooltip-wrap.active').removeClass('active').addClass('hide').find('.offscreen').text('툴팁 열기');

            //선택한 tooltip 만 열기
            that.removeClass('hide').addClass('active');
            that.find('.offscreen').text('툴팁 닫기');
          }
        });
      });

      $(window).on('resize, scroll', function () {
        $('.tooltip-wrap.active').removeClass('active');
      })
    }
  }

  /*
  * date : 20259999
  * last : 20259999
  * name : calcScrollWidth()
  * pram :
  * desc : 스크롤 width 계산
  */
  let _bodyWidth = 0;
  let saveScrollWidth = 0;
  function calcScrollWidth() {
    bodyResizeObserver.unobserve(document.getElementsByTagName('body')[0]);
    bodyResizeObserver.observe(document.getElementsByTagName('body')[0]);
    if( saveScrollWidth !== window.innerWidth - _bodyWidth  ) {
      document.documentElement.style.setProperty('--scrollVWidth', window.innerWidth - _bodyWidth + 'px');
      saveScrollWidth = window.innerWidth - _bodyWidth;
    }
  }
  let visualViewportWidth;
  let bodyResizeObserver = new ResizeObserver(function (entries) {
    visualViewportWidth = window.visualViewport.width;

    if( _bodyWidth !== visualViewportWidth && (_bodyWidth > 0 || window.innerWidth > 0) ) {
      _bodyWidth = visualViewportWidth;
      calcScrollWidth();
    }
  });

  _front.setContainerBottomGap = setContainerBottomGap;
  _front.setTabs = setTabs;
  _front.setFoldBox = setFoldBox;
  _front.setCommSwiper = setCommSwiper;
  _front.setInputStatus = setInputStatus;
  _front.setUIDialog = setUIDialog;
  _front.dialogOnOff = dialogOnOff;
  _front.getBodyHeight =  getBodyHeight;
  _front.setTooltipOnOff =  setTooltipOnOff;

  $(document).ready(function () {
    $_wrapper = $('.wrapper');
    $_container = $('.container-wrapper');
    $_docker = $('.docker-wrapper');

    /* 맥 OS 또는 iOS / android 디바이스 체크 */
    _isIos = /(iPhone|iPod|iPad)/i.test(navigator.platform);
    _isMac = /(Mac)/i.test(navigator.platform);
    _isAndroid = /Android/i.test(navigator.userAgent);
    _scrollTop = $(window).scrollTop();

    _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;
    _bodyWidth = document.getElementsByTagName('body')[0].clientWidth;

    document.documentElement.style.setProperty('--scrollVWidth', window.innerWidth - _bodyWidth + 'px');

    if (_isIos) {
      _vh = getBodyHeight * 0.01;
      _resizeVh = getBodyHeight * 0.01;
      setPropertyVh();
      $('body').addClass('ios');
    }
    if (_isMac) {
      _vh = getBodyHeight * 0.01;
      _resizeVh = getBodyHeight * 0.01;
      setPropertyVh();
      $('body').addClass('mac');
    }
    if (_isAndroid) {
      _vh = window.outerHeight;
      _resizeVh = window.outerHeight;
      setPropertyVh();
      $('body').addClass('android');
    } else {
      _vh = window.innerHeight;
      _resizeVh = window.innerHeight;
      setPropertyVh();
    }

    // 회전변경 이벤트 발생 시 : 100vh 스타일 지정
    $(window).on('resize orientationchange observerUpdate', function () {
      _resizeVh = window.outerHeight;
      _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;
      _scrollTop = $(window).scrollTop();

      if (_isIos && _isMac) {
        _resizeVh = window.innerHeight * 0.01;
        setPropertyVh();
      }
      if (_isAndroid) {
        _resizeVh = window.outerHeight;
        setPropertyVh();
      } else {
        _resizeVh = window.innerHeight;
        setPropertyVh();
      }
      if( parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) > 0 ) alert('???');
    });

    setContainerBottomGap();
    setTabs();
    setFoldBox();
    setCommSwiper();
    setInputStatus();
    setUIDialog();
    setTooltipOnOff();
  });

  return _front;
})();