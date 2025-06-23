/**
 * ========================================
 * [reward.front.ui.ydy.js]
 * 개발자 작업용 임시 모듈
 * - 통합 시 reward.front.ui.js로 이동 예정
 * - 네임스페이스: rewardPub.front.*
 * ========================================
 */

(function () {
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
                    modal: true,
                    resizable: false,
                    draggable: false,
                    classes: {
                        'ui-dialog': dialogClass
                    },
                    open: function () {
                        $('body').addClass('dialog-open');

                        const $dialog = $(this).closest('.ui-dialog');
                        const $container = $dialog.closest('.ui-dialog-container');

                        // top/left
                        $dialog.removeAttr('style');
                        $dialog.find('.ui-dialog-content').removeAttr('style');
                        $container.addClass('open').css('z-index', 111 + $('.ui-dialog-container:visible').length);
                    },

                    close: function () {
                        $('body').removeClass('dialog-open');

                        const $dialog = $(this).closest('.ui-dialog');
                        const $container = $dialog.closest('.ui-dialog-container');

                        $dialog.removeAttr('style');
                        $dialog.find('.ui-dialog-content').removeAttr('style');
                        $container.removeClass('open').removeAttr('style');
                    },
                    create: function () {
                        $(`#${dialogId} .ui-dialog-titlebar`).remove();
                    }
                });
            });
        }
    }

    //jQuery UI dialog open/close 제어
    function dialogOnOff() {
        return {
            popOpen: function (tgId, callback, arg) {
                $(tgId).dialog('open');
                if (typeof callback === 'function') callback(tgId, arg);
            },
            popClose: function (tgId, callback, arg) {
                $(tgId).dialog('close');
                if (typeof callback === 'function') callback(tgId, arg);
            }
        };
    }

    window.rewardPub = window.rewardPub || {};
    rewardPub.front = rewardPub.front || {};

    rewardPub.front.setInputStatus = setInputStatus;
    rewardPub.front.setUIDialog = setUIDialog;
    rewardPub.front.dialogOnOff = dialogOnOff;


    $(function () {
        rewardPub.front.setInputStatus();
        rewardPub.front.setUIDialog();
    });
})();
