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
function setInputStatus() {
  let selector = '.ui-input';

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

$(document).ready(function () {
  setInputStatus();
});