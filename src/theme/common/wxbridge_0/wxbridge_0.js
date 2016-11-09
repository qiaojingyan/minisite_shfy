define(['jweixin', 'underscore', 'jquery'], function(wx, _, $) {
    var onShareObject = {};
    var onShareObject4TimeLine = {};

    var share_suc = function() {
        $(window).trigger('on_track_wxshare_success');
    }

    var sigsuc = function(data) {
        console.log(data);
        var jdata = {};
        try {
            jdata = JSON.parse(data);
        } catch (e) {
            jdata = data;
        }
        if (jdata.status != "200" && jdata.status != 200)
            return;

        jdata = jdata.data;
        wx.config({
            debug: false,
            appId: jdata.appId,
            timestamp: jdata.timestamp,
            nonceStr: jdata.nonceStr,
            signature: jdata.signature,
            jsApiList: ['checkJsApi', 'onMenuShareTimeline',
                'onMenuShareAppMessage', 'onMenuShareQQ',
                'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems',
                'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
                'translateVoice', 'startRecord', 'stopRecord',
                'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice',
                'uploadVoice', 'downloadVoice', 'chooseImage',
                'previewImage', 'uploadImage', 'downloadImage',
                'getNetworkType', 'openLocation', 'getLocation',
                'hideOptionMenu', 'showOptionMenu', 'closeWindow',
                'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
                'addCard', 'chooseCard', 'openCard'
            ]
        });
        wx.ready(function() {
            console.log("wxsignready");
            // wx.hideOptionMenu();
            wx.onMenuShareAppMessage(onShareObject);
            wx.onMenuShareTimeline(onShareObject4TimeLine);
            wx.onMenuShareQQ(onShareObject);
            wx.onMenuShareWeibo(onShareObject);
        });
        // wx.hideOptionMenu();
    };
    var http_relative2absolute = function(rpath) {
        var i;
        if (_.isUndefined(rpath))
            return window.location.href;
        i = rpath.indexOf('http://');
        if (i >= 0)
            return rpath;

        var href = window.location.href;
        i = href.indexOf('?');
        if (i >= 0) {
            href = href.substr(0, i);
        }
        i = href.lastIndexOf('/');
        if (i >= 0) {
            href = href.substr(0, i);
        }
        href = href + '/' + rpath;
        return href;
    };
    var init = function() {
        if (!wx) {
            console.log('wexin bridge not found');
            return;
        }
        var title = $('#hidden_project_title').val();
        var desc = $('#hidden_project_desc').val();
        var img = $('#hidden_project_img').val();
        var imgurl = http_relative2absolute(img);
        imgurl = imgurl.replace(/\/\.\//, '\/');
        onShareObject.title = title;
        onShareObject.desc = desc;
        onShareObject.imgUrl = imgurl;
        var url = window.location.href.split('?')[0];
        console.log(url);
        onShareObject.link = url;
        onShareObject4TimeLine.title = $('#hidden_project_timeline_title')
            .val();;
        onShareObject4TimeLine.desc = $('#hidden_project_timeline_desc').val();;
        onShareObject4TimeLine.imgUrl = imgurl;
        onShareObject4TimeLine.link = url;
        onShareObject.success = share_suc;
        onShareObject4TimeLine.success = share_suc;
        wx.error(function(res) {});
        var url = 'http://s2.tech.iwasai.com/api/thirdserver/wxsign/fansup' + '?url=' + encodeURIComponent(window.location.href.split('#')[0]);
        $.ajax({
            type: 'get',
            url: url,
            success: sigsuc,
        });
    };

    return {
        init: init,
        onShareObject: onShareObject,
        onShareObject4TimeLine: onShareObject4TimeLine,
    };
});
