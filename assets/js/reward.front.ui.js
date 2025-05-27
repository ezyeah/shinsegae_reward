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

  $(document).ready(function () {
    $_wrapper = $('.wrapper');
    $_container = $('.container-wrapper');
    $_docker = $('.docker-wrapper');

    setContainerBottomGap();
    setTabs();
  });

  return _front;
})();


  /*
  * date : 20259999
  * last : 20259999
  * name : setInputStatus()
  * pram :
  * desc : input 상태 변경(jQuery)
  */
function setInputStatus(parentSelector) {
  let selector = '.ui-input';
  if (parentSelector) {
    selector = `${parentSelector} ${selector}`;
  }

  $(selector).each(function () {
    const inputEl = $(this);
    const inputBox = inputEl.closest('.input-box, .input-search-box');
    const btnDelete = inputBox.find('.btn-input-del');

    function updateStatus() {
      const hasValue = inputEl.val().length > 0;

      if (hasValue) {
        inputBox.addClass('has-value');
      } else {
        inputBox.removeClass('has-value');
      }
    }

    // 입력 및 포커스 이벤트
    inputEl.off('input focusout').on('input focusout', function () {
      updateStatus();

      // 포커스 나가면 버튼 숨김
      setTimeout(() => {
        if (!inputEl.is(':focus')) {
          btnDelete.hide();
        }
      }, 150);
    });

    inputEl.on('focusin', function () {
      // 포커스 되면 버튼 다시 보임
      if (inputEl.val().length > 0 && !inputEl.is(':disabled') && !inputEl.prop('readonly')) {
        btnDelete.show();
      }
    });

    // 삭제 버튼 클릭 시 값 삭제
    btnDelete.off('mousedown').on('mousedown', function (e) {
      e.preventDefault();
      inputEl.val('').trigger('input').focus();
    });

    // 초기 상태
    updateStatus();
  });
}

$(document).ready(function () {
  setInputStatus();
});