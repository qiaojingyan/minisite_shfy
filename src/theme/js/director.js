define(['wbase', 'theme/common/wlib2/w_base_director', './scene_main'],
    function(W, WBaseDirector, SceneMain) {
        var Director = WBaseDirector.extend({
            initialize: function(options) {
                var _this = this;
                this.dao = options.dao;
                this.sceneMain = new SceneMain({
                    el: '#content',
                    director: this,
                });

                _.extend(options, {
                    scenes: {
                        'main': {
                            frag: 'main',
                            scene: this.sceneMain,
                            to: [],
                        },
                        'default': {
                            scene: this.sceneMain,
                            to: [],
                        },
                    },
                });
                this._super(options);
            }
        });
        return Director;
    });
