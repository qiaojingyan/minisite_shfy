define(['underscore', 'jquery', 'wbase', 'wresloader', 'wxbridge', 'wuserbridge', 'URI'],
    function(_, $, W, ResLoader, WXBridge, UserBridge, URI) {
        var DAO = W.WObject.extend({
            baseUrl: 'http://s2.tech.iwasai.com:3000',
            initData: function() {
                return $.when().then(_.bind(this.initParseParams, this));
            },
            initialize: function(opts) {
                this.resLoader = new ResLoader();
                _.extend(this, opts);
            },
            initCheckUser: function() {
                var defer = $.Deferred();
                if (!_.isUndefined(this.paramDebug) && this.paramDebug != null) {
                    this.user = {
                        unionid: "weixin_oMsa_jjPLohuPRQ0iVlJD1KEu3tM",
                        headimgurl: "http://wx.qlogo.cn/mmopen/hzVGicX27IG2cHWED5R5wlWHQoVHQibNb0SywMiaCNgmf0EQfgqLj3JPNv42t90nJibZ1zcgv7zBUl6VTwTIfXXWDt5VgQWsvHRH/0",
                        userId: 2,
                    };
                    this.paramTB = 'f4Bni1z2r+3rZ37tg9OatczoOp8rmXIQI5Wv4qKqgfk=';
                    defer.resolve(this.user);
                    this.initCjUser(this.user);
                } else {
                    console.log("not debug");
                    var self = this;
                    UserBridge.getUserInfo().then(function(user) {
                        self.user = user;
                        defer.resolve(user);
                        self.initCjUser(user);
                    });
                }
                return defer.promise();
            },
            initParseParams: function() {
                var defer = $.Deferred();
                var URIsource = new URI();
                var params = URIsource.search(true); //使用这个解析出来的参数有问题。比如参数中有+
                this.paramDebug = this.getUrlParam('debug');
                this.fromId = this.getUrlParam(this.PRODUCT_PARAM);
                if (this.fromId == undefined) {
                    this.fromId = this.products_first_id;
                }
                this.comefrom = this.getUrlParam('comefrom');
                console.log(this.fromId + "    " + this.paramDebug);
                defer.resolve();
                return defer.promise();
            },
            getUrlParam: function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
            },
            ajax: function(conf) {
                console.log(conf.data)
                $.ajax({
                    type: "post",
                    url: conf.url,
                    data: conf.data,
                    timeout: 1500
                }).done(function(data) {
                    conf.success(data);
                }).fail(function(data) {
                    conf.error(data);
                }).always(function() {

                });
            },
            isIOS: function() {
                var userAgentInfo = navigator.userAgent;
                if (userAgentInfo.indexOf("iPad") >= 0) {
                    return true;
                } else if (userAgentInfo.indexOf("iPod") >= 0) {
                    return true;
                } else if (userAgentInfo.indexOf("iPhone") >= 0) {
                    return true;
                } else
                    return false;
            },
            isAndroid: function() {
                var u = navigator.userAgent;
                if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        return DAO;

    });
