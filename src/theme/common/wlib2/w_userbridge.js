define(['underscore', 'jquery', 'URI'],
    function(_, $, URI) {
        var setCookie = function(c_name, value, expiredays) {
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie = c_name + "=" + escape(value) +
                ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ';path=/' + ';domain=.iwasai.com;')
        };

        var getCookie = function(cookie_name) {
            var allcookies = document.cookie;
            var cookie_pos = allcookies.indexOf(cookie_name); //索引的长度

            // 如果找到了索引，就代表cookie存在，
            // 反之，就说明不存在。
            if (cookie_pos != -1) {
                // 把cookie_pos放在值的开始，只要给值加1即可。
                cookie_pos += cookie_name.length + 1; //这里容易出问题，所以请大家参考的时候自己好好研究一下
                var cookie_end = allcookies.indexOf(";", cookie_pos);

                if (cookie_end == -1) {
                    cookie_end = allcookies.length;
                }

                var value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到你想要的cookie的值了。。。
            }
            return value;
        }


        var _UserBridge = {
            LOCAL_NAME: 'WOW_USER_INFO_FANSUP',
            URL_PARAM_NAME: 're_id',
            API_URL: 'http://s2.tech.iwasai.com/api/thirdserver/',
            callbackUrl: window.location.href,
            gotoWeixinUrl: function() {
                console.log("gotoWeixinUrl");
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0660927e3d93d894&redirect_uri=' +
                    encodeURIComponent('http://s2.tech.iwasai.com/api/thirdserver/auth/weixin/fansup?url=' +
                        this.callbackUrl) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
            },
            gotoWeiboUrl: function() {
                window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=4059665933&redirect_uri=http://api.iwasai.com/third/weibo/getUniqueKey?url=' +
                    encodeURIComponent(this.callbackUrl) + '&response_type=code';
            },
            isWeixin: function() {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    return true;
                } else {
                    return false;
                }
            },
            isWeibo: function() {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/WeiBo/i) == 'weibo') {
                    return true;
                } else {
                    return false;
                }
            },
            isAppClient: function() {

            },
            getUrlParam: function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            
        };
        var UserBridge = {
            RES_REDIRECT: 'res_redirect',
            RES_UNKNOWN_AGENT: 'res_unknown_agent',

            getUserInfo: function() {
                var defer = $.Deferred();
                var userInfo = decodeURI(getCookie('userInfo'));
                if(userInfo == 'undefined'){
                    userInfo == undefined;
                }else{
                    userInfo = JSON.parse(userInfo);
                }

                for (;;) {
                    if (!_.isUndefined(localStorage) && localStorage.getItem(_UserBridge.LOCAL_NAME) != null) {
                        var lsUser = JSON.parse(localStorage.getItem(_UserBridge.LOCAL_NAME));
                        defer.resolve(lsUser);
                        break;
                    }
                    if(!_.isUndefined(userInfo) && userInfo != "undefined"){
                        localStorage.setItem(_UserBridge.LOCAL_NAME, JSON.stringify(userInfo));
                        defer.resolve(userInfo);
                        break;
                    }
                    if (_UserBridge.isWeixin()) {
                        _UserBridge.gotoWeixinUrl();
                        defer.reject(this.RES_REDIRECT);
                        break;
                    }
                    if (_UserBridge.isWeibo()) {
                        _UserBridge.gotoWeiboUrl();
                        defer.reject(this.RES_REDIRECT);
                        break;
                    }
                    if (_UserBridge.isAppClient()) {
                        defer.reject();
                        break;
                    }
                    defer.reject(this.RES_UNKNOWN_AGENT);
                    break;
                }
                return defer.promise();
            },
        };
        return UserBridge;
    });
