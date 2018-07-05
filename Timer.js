/// Generates an event after a set interval, with an option to generate recurring events.
function Timer(interval) {
    var _timer = this;

    var _core = {
        id: null,
        autoReset: true,
        enabled: false,
        interval: 100,

        elapsed: null,

        onElapsed: function (e) {
            if (!_core.enabled) // can only get in here if the stop is called, afterwhich the id will be <null>.
                return;

            if (_core.elapsed) _core.elapsed(e); // raise the event

            if (_core.autoReset)
                _core.start();
            else
                _core.id = null;
        },
        start: function () {
            _core.id = window.setTimeout(_core.onElapsed, _core.interval);
        }
    };

    // set the start value for the interval if passed in.
    if (interval !== undefined)
    {
        if (typeof interval !== 'number')
            throw "interval must be a number";

        if (interval <= 0 || interval >= 2147483647)
            throw "The value of the interval parameter is less than or equal to zero, or greater than 2,147,483,647.";

        _core.interval = interval;
    }

    // Gets or sets a Boolean indicating whether the Timer should raise the Elapsed event only once(false) or repeatedly(true).
    this.autoReset = _core.autoReset;

    Object.defineProperty(this, "autoReset", {
        get: function () {
            return _core.autoReset;
        },
        set: function (v) {
            if (typeof v !== 'boolean')
                throw "autoReset must be a boolean";

            _core.autoReset = v;
        }
    });

    // Gets or sets a value indicating whether the Timer should raise the Elapsed event.
    this.enabled = false;

    Object.defineProperty(this, "enabled", {
        get: function () {
            return _core.id !== null;
        },
        set: function (v) {
            if (typeof v !== 'boolean')
                throw "enabled must be a boolean";

            // Setting Enabled to true is the same as calling Start, while setting Enabled to false is the same as calling Stop.
            _timer[v ? "start" : "stop"]();
        }
    });

    // Gets or sets the interval, expressed in milliseconds, at which to raise the Elapsed event.
    this.interval = _core.interval;

    Object.defineProperty(this, "interval", {
        get: function () {
            return _core.interval;
        },
        set: function (v) {
            if (typeof v !== 'number')
                throw "interval must be a number";

            if (v <= 0 || v >= 2147483647)
                throw "The value of the interval parameter is less than or equal to zero, or greater than 2,147,483,647.";

            _core.interval = v;
        }
    });

    // Occurs when the interval elapses.
    this.elapsed = null;

    Object.defineProperty(this, "elapsed", {
        get: function () {
            return _core.elapsed;
        },
        set: function (v) {
            if (typeof v !== 'function')
                throw "elapsed must be a function";

            _core.elapsed = v;
        }
    });

    // Starts raising the Elapsed event by setting Enabled to true.
    this.start = function () {
        // A call to the Start method when the timer is enabled has no effect.
        if (_core.id !== null)
            return;

        _core.enabled = true;

        _core.start();
    };

    // Stops raising the Elapsed event by setting Enabled to false.
    this.stop = function () {
        // A call to the Stop method when the timer is disabled has no effect.
        if (_core.id === null)
            return;

        _core.enabled = false;

        window.clearTimeout(_core.id);

        _core.id = null;
    };
}
