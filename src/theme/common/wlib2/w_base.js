define(['underscore'], function(_) {
	var _extend = function(protoProps, staticProps) {
		var parent = this;
		var child;

		// The constructor function for the new subclass is either defined by
		// you
		// (the "constructor" property in your `extend` definition), or
		// defaulted
		// by us to simply call the parent constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() {
				return parent.apply(this, arguments);
			};
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent` constructor function.
		var Surrogate = function() {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps)
			_.extend(child.prototype, protoProps);

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	};

	var WObject = function() {
		this.initialize.apply(this, arguments);
	};
	WObject.prototype.initialize = function() {};
	WObject.extend = _extend;

	var isUndefined = function(obj) {
		return obj === void 0;
	};
	var isFunction = function(obj) {
		return typeof obj == 'function' || false;
	};

	var doCallback = function() {
		var args = Array.prototype.slice.call(arguments);
		var opt = args.shift();
		var method = args.shift();

		if (isUndefined(opt))
			return;
		if (!isFunction(opt[method]))
			return;
		return opt[method].apply(this, args);
	};

	var W = {
		WObject: WObject,
		_extend: _extend,
		isUndefined: isUndefined,
		isFunction: isFunction,
		doCallback: doCallback,
	};

	///-----------super


	W._extend = W.WObject.extend =
		function(protoProps, classProps) {
			var child = inherits(this, protoProps, classProps);
			child.extend = this.extend;
			return child;
		};
	var unImplementedSuper = function(method) {
		throw "Super does not implement this method: " + method;
	};

	var fnTest = /\b_super\b/;

	var makeWrapper = function(parentProto, name, fn) {
		var wrapper = function() {
			var tmp = this._super;

			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = parentProto[name] || unImplementedSuper(name);

			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret;
			try {
				ret = fn.apply(this, arguments);
			} finally {
				this._super = tmp;
			}
			return ret;
		};

		//we must move properties from old function to new
		for (var prop in fn) {
			wrapper[prop] = fn[prop];
			delete fn[prop];
		}

		return wrapper;
	};

	var ctor = function() {};
	var inherits = function(parent, protoProps, staticProps) {
		var child, parentProto = parent.prototype;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() {
				return parent.apply(this, arguments);
			};
		}

		// Inherit class (static) properties from parent.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		ctor.prototype = parentProto;
		child.prototype = new ctor();

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) {
			_.extend(child.prototype, protoProps);

			// Copy the properties over onto the new prototype
			for (var name in protoProps) {
				// Check if we're overwriting an existing function
				if (typeof protoProps[name] == "function" && fnTest.test(protoProps[name])) {
					child.prototype[name] = makeWrapper(parentProto, name, protoProps[name]);
				}
			}
		}

		// Add static properties to the constructor function, if supplied.
		if (staticProps) _.extend(child, staticProps);

		// Correctly set child's `prototype.constructor`.
		child.prototype.constructor = child;

		// Set a convenience property in case the parent's prototype is needed later.
		child.__super__ = parentProto;

		return child;
	};
	return W;
});