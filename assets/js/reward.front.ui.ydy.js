/**
 * ========================================
 * [reward.front.ui.ydy.js]
 * 작업용 임시 모듈
 * - 통합 시 reward.front.ui.js로 이동 예정
 * - 네임스페이스: rewardPub.front.*
 * ========================================
 */

(function () {
    var _vh, _resizeVh, _resizeVw, _scrollTop;
    var _isIos, _isMac, _isAndroid;

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
                        if ($that.data('class') === 'dim-close') {
                                $('.ui-widget-overlay').on('click', function () {
                                    // 팝업 닫기
                                    //console.log('클릭클릭')
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

    window.rewardPub = window.rewardPub || {};
    rewardPub.front = rewardPub.front || {};

    rewardPub.front.setInputStatus = setInputStatus;
    rewardPub.front.setUIDialog = setUIDialog;
    rewardPub.front.dialogOnOff = dialogOnOff;
    rewardPub.front.getBodyHeight =  getBodyHeight;

    $(document).ready(function () {
        $_floatingWrapper = $('.floating-wrapper');
        $_headerWrapper = $('.header-wrapper');
        $_container = $('.container-wrapper');
        $_wrapper = $('.wrapper');

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

    });

    $(function () {
        rewardPub.front.setInputStatus();
        rewardPub.front.setUIDialog();
    });
})();
