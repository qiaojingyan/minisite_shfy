define(['underscore', 'wbase', 'state_machine', 'backbone'], function(_, W, StateMachine, Backbone) {
	var WBaseDirector = {};
	var RouterMain = Backbone.Router.extend({
		initialize: function(opts) {
			this.director = opts.director;
		},
		routes: {
			"*actions": "do_default",
		},
		events: {},
		do_default: function(fragment) {
			fragment = fragment ? fragment : '';
			this.director.go2fragment(fragment);
		},
	});
	var _genEvent = function(events, from, to) {
		if (_.isUndefined(to)) {
			events.push({
				name: 'go_' + from + '_',
				from: from,
			});
		} else {
			events.push({
				name: 'go_' + from + '_' + to,
				from: from,
				to: to,
			});
		}
	};
	var _buildEvents = function(options) {
		var events = [];
		_.each(options.scenes, function(value, key, list) {
			var event;
			if (_.isUndefined(value.to)) {
				_genEvent(events, key);
			} else if (_.isArray(value.to)) {
				_.each(value.to, function(value2, key2, list2) {
					_genEvent(events, key, value2);
				});
			} else {
				_genEvent(events, key, value.to);
			}
			_genEvent(events, 'none', key);
		});
		options.events = events;
	};
	var _buildCallback = function(options) {
		var callbacks = {};
		callbacks.onenterstate = function(event, from, to) {
			if (_.isUndefined(options.scenes[to]))
				return;
			if (_.isUndefined(options.scenes[to].scene))
				return;
			if (!_.isFunction(options.scenes[to].scene.enterScene))
				return;
			options.scenes[to].scene.enterScene(event, from, to);
			if (_.isUndefined(options.scenes[to].frag))
				return;

			var replace=!(_.isUndefined(options.scenes[to].replace));
			console.log(replace);
			this.routerMain.navigate(options.scenes[to].frag,{replace:replace});
		};

		callbacks.onleavestate = function(event, from, to) {
			if (_.isUndefined(options.scenes[from]))
				return;
			if (_.isUndefined(options.scenes[from].scene))
				return;
			if (!_.isFunction(options.scenes[from].scene.leaveScene))
				return;
			options.scenes[from].scene.leaveScene(event, from, to);
		};
		options.callbacks = callbacks;
	};
	var WBaseDirector = W.WObject.extend({
		initialize: function(options) {
			this.options = options;
			_buildEvents(this.options);
			_buildCallback(this.options);
			this.fsm = StateMachine.create(this.options);
			this.routerMain = new RouterMain({
				director: this,
			});
			this.fsm.routerMain = this.routerMain;
		},
		go2scene: function(scene) {
			console.log(this.fsm) ;
			this.fsm['go_' + this.fsm.current + '_' + scene]();
		},
		go2fragment: function(fragment) {
			var _2scene = _.findKey(this.options.scenes, function(value, key, list) {
				if (_.isUndefined(value.frag))
					return;
				if (value.frag == fragment)
					return key;
			});
			if (_.isUndefined(_2scene)){
				_2scene = 'default';//缺省处理，没有的直接跳转到默认页面 2016.02.25
				// return;
			}
			this.go2scene(_2scene);
		},
		start: function() {
			Backbone.history.start();
		},
		ASYNC: StateMachine.ASYNC,
	});

	//	var oldextend = WBaseDirector.extend;
	//	WBaseDirector.extend = function(opts) {
	//		var ret = oldextend.apply(this, arguments);
	//		_.extend(opts, {
	//			target: ret.prototype
	//		});
	//		StateMachine.create(opts);
	//		return ret;
	//	};
	return WBaseDirector;
});