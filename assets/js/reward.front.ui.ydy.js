
/*
* date : 20259999
* last : 20259999
* name : setInputStatus()
* pram :
* desc : input 상태 변경(jQuery)
*/
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

$(document).ready(function () {
    setInputStatus();
});


/*
* date : 20259999
* last : 20259999
* name : setTabs()
* pram : selector - dialog
* desc : set jQuery UI - dialog
*/