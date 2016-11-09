require.config({
    baseUrl: './',
    urlArgs: "v=20161108",
    paths: {
        jquery: 'theme/common/lib/jquery.min',
        wresloader: 'theme/common/wlib2/w_resloader',
        wuserbridge: 'theme/common/wlib2/w_userbridge',
        URI: 'theme/common/wlib2/w_url',
        backbone: 'theme/common/lib/backbone',
        state_machine: 'theme/common/lib/state-machine.min',
        jweixin: 'theme/common/lib/jweixin-1.0.0',
        wxbridge: 'theme/common/wxbridge_0/wxbridge_0',
        text: 'theme/common/lib/require-text',
        underscore: 'theme/common/lib/underscore-1.8.3.min',
        wbase: 'theme/common/wlib2/w_base',

    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'wbase': {
            deps: ['underscore'],
            exports: 'W',
        },
        'state_machine': {
            exports: 'StateMachine',
        }
    }
});

require(['jquery', 'theme/js/index'], function($, Index) {
    $(window).ready(function() {
        new Index().run();
    });
});
