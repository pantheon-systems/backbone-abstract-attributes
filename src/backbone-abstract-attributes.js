(function(Backbone) {
  var OriginalBackboneModel = Backbone.Model;
  var originalGet = OriginalBackboneModel.prototype.get
  var originalHas = OriginalBackboneModel.prototype.has

  Backbone.Model = OriginalBackboneModel.extend({
    constructor: function() {
      OriginalBackboneModel.apply(this, arguments);

      if (!_.isNull(this.computed)) {
        initializeAbstractAttributes.call(this);
      }
    },

    get: function(attr) {
      if (originalGet.apply(this, arguments) != null) {
        return originalGet.apply(this, arguments);
      }
      else if (this.computed != null) {
        if (_.isFunction(this.computed)) {
          return computed();
        }
        else {
          var computed = this.computed;

          if (!_.isNull(computed[attr]) && _.isFunction(this[attr])) {
            return this[attr].apply(this);
          } else {
            return undefined;
          }
        }
      } else {
        return undefined;
      }
    },

    has: function(attr) {
      var computed;

      if (originalHas.apply(this, arguments)) {
        return originalHas.apply(this, arguments);
      }
      else if (this.computed != null) {
        if (_.isFunction(this.computed)) {
          return computed = this.computed();
        }
        else {
          computed = this.computed;

          if (!_.isNull(computed[attr]) && _.isFunction(this[attr])) {
            return true;
          } else {
            return false;
          }
        }
      }
      else {
        return false;
      }
    }
  });

  function initializeAbstractAttributes() {
    if (_.isNull(this.computed)) {
      return;
    }

    var computed;

    if (_.isFunction(this.computed)) {
      computed = this.computed();
    }
    else {
      computed = this.computed;
    }

    _.each(computed, _.bind(function(listeners, computedName) {
      if (_.isFunction(listeners)) {
        _.bind(listeners, this)(function() {
          this.trigger("change:" + computedName);
        });
      }
      else {
        if (!_.isArray(listeners)) {
          listeners = [listeners];
        }

        _.each(listeners, _.bind(function(listener) {
          if (_.isString(listener)) {
            this.on("change:" + listener, function() {
              this.trigger("change:" + computedName);
            })
          }
        }, this));
      }
    }, this));
  }
})(Backbone);
