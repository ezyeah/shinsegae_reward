/*
 * name : glim.js
 * desc : 퍼블리싱 현황판
 * writer : glim han
 * date : 2020/02/13
 * update : //230320 update by han
 *
*/

$(document).ready(function(){
    ia.init();
});


function funcIAMenuDropdown (){
    $('.ia-header-guide-mobile').toggleClass('is-visible');
}

var _lastdate;
var ia = {
    init : function(){
        var _this = this;
        var _color = $('body').data('theme-color');
        $('.ia-header-wrapper').css('background-color', _color);
        $('.ia-header-wrapper > .ia-section').append('<ul class="js-cate-group"></ul>');


        $('[data-label="URL"]').each(function(){ // kimkee추가
            $(this).find(">a").each(function(){
                if (!$(this).hasClass('window-popup')) {
                    $(this).text($(this).attr("href"));
                }
            })
        });

        $('.ia-section-list').each(function(i){
            var file = $(this).data('file');
            var color = $(this).data('color');


            // $(this).attr('id', 'gIA'+i);
            // $('.ia_graph .graph').append(graphHtml);

            //_this.cal('#gIA'+i, i);
            $(this).attr('id', 'gIA'+i);

            var graphHtml =
                '<li>'
                +'	<a href="#gIA'+i+'">'
                +'		<span class="tit"><!-- 자동입력 --></span>'
                +'		<span class="bar" data-color="'+_color+'"><span class="active"></span></span>'
                +'		<span class="pages"><em class="graphComplete"></em>/<em class="graphTotal"></em></span>'
                +'	</a>'
                +'</li>';
            // _this.cal('#gIA'+i, i);
            $('.ia-graph .graph').append(graphHtml);

            _this.cal('#gIA'+i, i);
            var newLen = $('#gIA'+i).find('.row-done-new').length;
            var updateLen = $('#gIA'+i).find('.row-done-update').length;
            var checkLen = $('#gIA'+i).find('.row-confirm').length;//230320 update by han
            var cate_group_txt = (newLen == 0 ) ? "" : '<span class="ico-new">N('+newLen+')</span>';
            cate_group_txt = (updateLen == 0 ) ? cate_group_txt : cate_group_txt +'<span class="ico-update">U('+updateLen+')</span>';
            cate_group_txt = (checkLen == 0 ) ? cate_group_txt : cate_group_txt +'<span class="ico-check">C('+checkLen+')</span>';//230320 update by han

            var cateHtml =
                '<li>'
                +'	<a href="#gIA'+i+'">'+ $(this).find('.ia-h2 > a').html() + cate_group_txt
                +'	</a>'
                +'</li>';

            $('.js-cate-group').append(cateHtml);

            $('.ia-content-body').css('padding-top', $('.ia-header-wrapper').outerHeight());
            $('.ia-content-body .ia-section-list').css('padding-top', $('.ia-header-wrapper').outerHeight());


        }).promise().done(function () {

            //console.log ( 'len',  $('.ia-tbl-wrap').find('.row-done-new').length );
            $(".ia-total-legend .c-total .value").text ($('.ia-tbl-wrap').find('tbody > tr > .col-num').length - $('.ia-tbl-wrap').find('.row-del').length);
            $(".ia-total-legend .c-done .value").text ($('.ia-tbl-wrap').find('.row-done').length + $('.ia-tbl-wrap').find('.row-done-new').length + $('.ia-tbl-wrap').find('.row-done-update').length );
            $(".ia-total-legend .c-done-new .value").text ($('.ia-tbl-wrap').find('.row-done-new').length);
            $(".ia-total-legend .c-done-update .value").text ($('.ia-tbl-wrap').find('.row-done-update').length);

            $('.ia-section-header').on('click', function(){
                $(this).parents('.ia-section').toggleClass('is-hide');
            })


            //리스트 전체 toggle
            $('.btn-list-all-toggle').on('click', function(){
                //$(this).parents('.ia-section').toggleClass('is-hide');

                if ( $('.ia-section-list').hasClass('is-hide') ){
                    $('.ia-section').removeClass('is-hide');
                    $(this).find('.text').text('닫기');
                }else{
                    $('.ia-section-list').addClass('is-hide');
                    $(this).find('.text').text('열기');
                }
            });

            //리스트 전체 toggle
            $('.btn-comment-all-toggle').on('click', function(){
                if ( $('.btn-comment-all-toggle').hasClass('hide') ){
                    $('.col-memo').removeClass('active');
                    $(this).removeClass('hide');
                    $(this).find('.text').text('닫기');
                }else{
                    $('.col-memo').addClass('active');
                    $(this).addClass('hide');
                    $(this).find('.text').text('열기');
                }
            });


            //리스트 전체 toggle
            $('.btn-comment-hidden').on('click', function(){
                //$(this).parents('.ia-section').toggleClass('is-hide');

                if ( $('.btn-comment-hidden').hasClass('is-hide') ){
                    $('.ia-tbl-wrap').removeClass('is-hide');
                    $(this).removeClass('is-hide');
                    $(this).find('.text').text('열기');
                }else{
                    $('.ia-tbl-wrap').addClass('is-hide');
                    $(this).addClass('is-hide');
                    $(this).find('.text').text('숨기기');
                }
            });



            //ia-tbl-wrap


        });


    },
    historyCopy : function (tg){

        var resultddd = _lastdate.split('-')[0] + numReturnToZero(_lastdate.split('-')[1])+ numReturnToZero(_lastdate.split('-')[2]);
        var getHistoryHtml;

        if ( $(tg).find('.data-history li[data-update="'+resultddd+'"]').length > 0 ){
            getHistoryHtml = $(tg).find('.data-history li[data-update="'+resultddd+'"]').clone().html();

            var appendHtml = "<ul class='data-history'><li>"
                +"<div class='date-history-tit-red'>["+resultddd+" update]</div>"
                +getHistoryHtml
                +"</li></ul>";
            $(tg).find('.col-url').append( appendHtml );
        }
    },
    cal : function(obj, idx){
        var _this = this;

        var lastUpdateDate = String(findLastUpdateDate(obj));//날짜중 최종완료날짜 찾아옴
        //console.log(lastUpdateDate);
        var today = lastUpdateDate.substr(0, 2) + '-' + lastUpdateDate.substr(2,2)+ '-' + lastUpdateDate.substr(4,2);

        $(obj).find('td.col-complete').each(function(n){

            var text = $(this).text();
            var completedd = $(this).siblings('.col-date').text().toString();
            //완료,수정날짜있는경우 마지막날짜로 체크
            _lastdate = (completedd.indexOf('/')==-1) ? completedd.trim():completedd.toString().split('/')[1].trim();
            //console.log(_lastdate, today);
            if ( text == "검토필요"){
                $(this).parent("tr").addClass('row-confirm');//검토필요 red 계열
                return;
            }
            if ( (completedd.indexOf('/') == -1) && text == "완료" && _lastdate == today.toString()){
                $(this).parent("tr").addClass('row-done-new');//노란색
                _this.historyCopy($(this).parent("tr"));
            }else if ( (completedd.indexOf('/') != -1) && _lastdate == today.toString()){
                $(this).parent("tr").addClass('row-done-update');//초록색
                $(this).text('수정');
                _this.historyCopy($(this).parent("tr"));
            }else if ( text == "완료" ){
                $(this).parent("tr").addClass('row-done');//하늘색
            }else if ( text == "삭제" || text == "미사용" ){
                $(this).parent("tr").addClass('row-del');//
                $(this).parent("tr").find('.col-memo').empty();
            }else if ( text == "사용안함" ){
                $(this).parent("tr").addClass('row-del');//
            }
        })

        //console.log(lastUpdateDate, today);

        //계산
        var calTotal = $(obj).find('.ia-tbl-wrap tbody > tr > .col-num').length;//총페이지갯수
        var calComplete = $(obj).find('.row-done , .row-done-update, .row-done-new, .row-del').length;//완료페이지
        var calProcess = (Math.round((calComplete/calTotal)*100))>100? 100:(Math.round((calComplete/calTotal)*100));

        var checkLen = $(obj).find('.row-confirm').length;//230320 update by han
        var newLen = $(obj).find('.row-done-new').length;
        var updateLen = $(obj).find('.row-done-update').length;
        var calTotalTxt = (newLen == 0 ) ? calTotal : calTotal +'<span class="ico-new">New('+newLen+')</span>';
        calTotalTxt = (updateLen == 0 ) ? calTotalTxt : calTotalTxt +'<span class="ico-update">Update('+updateLen+')</span>';
        calTotalTxt = (checkLen == 0 ) ? calTotalTxt : calTotalTxt +'<span class="ico-check">Check('+checkLen+')</span>';//230320 update by han


        //그래프
        var graph = $('.ia-graph a[href="'+obj+'"]');
        var graphTit = $(graph).find('.tit');
        var graphTotal = $(graph).find('.graphTotal');
        var graphComplete = $(graph).find('.graphComplete');
        var graphProcess = $(graph).find('.bar');
        var graphActive = $(graph).find('.bar .active');
        graphTotal.html(calTotalTxt);
        graphComplete.html(calComplete);
        graphProcess.attr('data-process', calProcess+'%');
        graphActive.css({backgroundColor:graphProcess.data('color'), width:calProcess+'%'});

        //범례
        var legendTotal = $(obj).find('.legend-total');
        var legendComplete = $(obj).find('.legend-complete');
        var legendProcess = $(obj).find('.legend-process');
        legendTotal.text(calTotal);
        legendComplete.text(calComplete);
        if (calComplete > 0){legendProcess.text(calProcess+'%')}
        else {legendProcess.text('0%')}

        //리스트
        var ia_num = $(obj).find('.col-num');
        graphTit.html(ia_tit);

        //넘버링
        for (var i=0;i < calTotal;i++){
            ia_num.eq(i).text(i+1);
        }

        /*20190516 update*/
        //리스트
        var ia_tit = $(obj).find('.ia-h2 > a').text();
        $(obj).find('.ia-h2 > a').text('# ' + idx + " " + ia_tit);
        graphTit.html('#' + idx + " " + ia_tit);

        $(".ia-total-legend .c-last-date .value").text (lastUpdateDate);

        $(obj).find(".col-memo").each(function() {
            /*if ( $(this).closest("tr").hasClass("row-done-new") || $(this).closest("tr").hasClass("row-done-update") ){
                $(this).closest("tr").find(".col-memo").toggleClass("active");
            }*/

            //날짜삽입
            var history = $(this).find(".data-history > li");
            $(history).each(function() {
                //console.log( $(this).data('update'))
                $(this).prepend('<div class="date-history-tit">['+$(this).data('update')+']</div>')
            });

            $(this).find("button.btn-memo").click(function() {
                $(this).closest("tr").find(".col-memo").toggleClass("active");
                return false;
            });
        });

        /*$(obj).find("button.btn-memo").each(function() {
            if ( $(this).closest("tr").hasClass("row-done-new") || $(this).closest("tr").hasClass("row-done-update") ){
                $(this).closest("tr").find(".col-memo").toggleClass("active");
            }

            //날짜삽입
            var history = $(this).closest("tr").find(".data-history > li");
            $(history).each(function() {
                console.log( $(this).data('update'))
                $(this).prepend('<div class="date-history-tit">['+$(this).data('update')+']</div>')
            });
            
            $(this).click(function() {
                $(this).closest("tr").find(".col-memo").toggleClass("active");
                return false;
            });
        });*/

        $(obj).find('.btn-memo-all').click(function() {
            if ( $(this).parents('table').find(".col-memo.active").length > 0 ){
                $(this).parents('table').find(".col-memo").removeClass("active");
            }else{
                $(this).parents('table').find(".col-memo").addClass("active");
            }
        });
    }
};


function numReturnToZero (a){
    if (parseInt(a) < 10) {
        a = '0' + parseInt(a);
    }
    return a;
}
function findLastUpdateDate (obj){

    var maxdd = 0;
    var lastdate=0;
    $('td.col-date').each(function(n){
        var completedd = $(this).text().split('-').join("").trim();
        completedd = completedd.replace(/ /gi, "");
        lastdate = (completedd.indexOf('/')==-1) ? Number(completedd):Number(completedd.toString().split('/')[1]);
        lastdate = (lastdate.toString().length > 6) ? Number(lastdate.toString().substring(6,6)):lastdate;//20200313 case add
        maxdd = Math.max(lastdate, maxdd);
        //console.log ("---------------", lastdate, completedd, maxdd);
    });
    //console.log ( "--------------------recent----",  maxdd );
    return maxdd;

}

function trim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function showWindowPopup(url, customWidth, customHeight, left, top, scrollbars) {
    var popWidth, popHeight, options, left, top, scrollbars;
    popWidth = screen.availWidth - 10;
    popHeight = screen.availHeight - 60;
    left = left ? left : 0;
    top = top ? top : 0;
    scrollbars = scrollbars ? scrollbars : 'yes';
    if (customWidth !== undefined && customWidth !== null && !isNaN(customWidth) && customWidth > 0) {
        popWidth = customWidth;
    }
    if (customHeight !== undefined && customHeight !== null && !isNaN(customHeight) && customHeight > 0) {
        popHeight = customHeight;
    }
    options = 'resizable=yes,scrollbars=' + scrollbars + ',status=no,left=' + left + ',top=' + top + ',width=' + popWidth + ', height=' + popHeight;
    window.open(url, '', options);
}