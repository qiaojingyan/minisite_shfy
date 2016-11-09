define(['wbase', './dao', './director', 'wxbridge'], function(W, DAO, Director, wxbridge) {
    var App = W.WObject.extend({
        initialize: function() {
            this.dao = new DAO();
        },
        run: function() {
            var _this = this;
            _.bind(this.dao.initData, this.dao)().then(function() {
                _.bind(_this._run, _this)();
            }).fail(function(reason) {
                _.bind(_this._run, _this)();
            }).progress(function(res, max) {});
        },
        _run: function() {
            this.director = new Director({
                dao: this.dao
            });
            this.initWX();
            this.director.start();
            this.initConfig();
            return;
        },
        initWX: function() {
            wxbridge.init();
            var self = this;
            var share_suc = function() {};
            $('.sharesucc').on('click', function() {
                share_suc();
            })

            var url = window.location.href.split('?')[0];
            wxbridge.onShareObject.link = url;
            wxbridge.onShareObject4TimeLine.link = url;
            wxbridge.onShareObject.success = share_suc;
            wxbridge.onShareObject4TimeLine.success = share_suc;
        },
        initConfig: function() {
            var self = this;
            $('.content').on('touchmove', function(evt) {
                evt.preventDefault();
            });

            $('.goupiao_btn').on('touchstart', function() {
                location.href =
                    self.dao.goupiaoUrl[Math.floor(Math.random() * self.dao.goupiaoUrl.length)];
            });
            $('.replay_btn').on('touchstart', function() {
                $('.goupiao').hide();
                self.director.go2scene('map');
            });
        },
        getArgWithOutUniqueKey: function(str) {
            var ret = '';
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                var paramName = strs[i].split("=")[0];
                var paramValue = strs[i].split("=")[1];
                if (paramName != 'uniqueKey') {
                    ret += paramName + "=" + paramValue + "&";
                }

            }
            if (ret.substring(ret.length - 1) == '&') {
                ret = ret.substring(0, ret.length - 1);
            }
            return ret;
        },
    });
    return App;
});
