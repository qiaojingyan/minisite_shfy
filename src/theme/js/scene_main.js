define(['backbone', 'underscore', 'text!../tpls/main.tpl.html'],
    function(Backbone, _, tpl) {
        var SceneMain = Backbone.View.extend({
            initialize: function(options) {
                this.director = options.director;
                this.dao = options.director.dao;
            },
            template: _.template(tpl),
            enterScene: function(event, from, to) {
                this.$el.html(this.template({}));
            },
            leaveScene: function(event, from, to) {},
        });
        return SceneMain;
    });
