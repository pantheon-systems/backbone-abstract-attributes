backbone-abstract-attributes
============================

This Backbone plugin provides an easy way for declaring Model methods as computed properties, enabling them to be called using the standard `get('methodName')` (and `has('methodName')`), as well as flexible ways to declare dependent properties which will trigger `change:methodName` events.

Why is this different than other computed attribute plugins?
------------------------------------------------------------

This plugin tries to have:
 - Simple configuration
 - Allows for of re-use existing accessor methods
 - Flexibility in dependent attributes (and related models, etc) to trigger change events
 - Doesn't dirty the Model's attributes by `set`ing values. All methods are dynamically `get`ed

Installation
------------

Copy the `backbone-abstract-attributes.js` file from the src directory and include it on your page.

```
<script src="backbone-abstract-attributes.js"></script>
```

Or install through Bower

```
bower install backbone-abstract-attributes
```

Examples
-------


```javascript
var Person = Backbone.Model.extend({
  // Add a computed hash to your model
  computed: {
    // methodName -> dependent properties
    capitalizedName: 'firstname'
  },

  // Name methods the same as the computed hash key
  capitalizedName: function() {
    // Add dependent keys as computed hash values
    this.get('firstname').toUpperCase()
  }
});

var person = new Person({
  firstname: 'Ben'
});

person.has('capitalizedName'); // true
person.get('capitalizedName'); // 'BEN'
person.set('firstname', 'jonathan'); // => triggers 'change:capitalizedName'
```

The computed hash has a lot of flexibility in what it will accept

```javascript
Backbone.Model.extend({
  computed: {
    // Provide a list of dependent properties
    fullName: ['firstname', 'lastname'],
    // No dependents, but still `get`-able
    staticMethod: false,
    // Declare a method that will invoke a callback to trigger the change event
    listOfSomething: function (changeCallback) {
      // For example, listen to a child collection
      this.listenTo(this.someCollection, 'add', changeCallback);
      // or manually bind to a custom event
      this.on('customEvent', changeCallback);
    }
  }
});

```

Development and Tests
----------

```bash
npm install
./node_modules/.bin/bower install
npm test
```

For development/file-watcher, run

```bash
npm start
```
