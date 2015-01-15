describe('Backbone.Model', function() {
  var Person;

  beforeEach(function() {
    var Person = Backbone.Model.extend({
      computed: {
        fullName: ['firstname', 'lastname'],
        family: function(change) {
          this.on('change:firstname', change);
          this.listenTo(this.children, 'add', change);
        },
        firstBang: 'firstname',
        species: false,
        unimplemented: 'firstname'
      },

      initialize: function() {
        this.children = new Backbone.Collection(this.get('children'))
      },

      fullName: function() {
        return this.get('firstname') + ' ' + this.get('lastname')
      },

      family: function() {
        return this.get('firstname') + ', ' + this.children.pluck('firstname').join(', ')
      },

      firstBang: function() {
        return this.get('firstname') + '!'
      },

      species: function() {
        return 'homo-sapien';
      }

      // unimplemented is unimplemented
    });

    var Child = Backbone.Model.extend();

    ben = new Person({
      firstname: 'Ben',
      lastname: 'Sheldon',
      children: [
        {
          firstname: 'Felipe'
        },
        {
          firstname: 'Raul'
        }
      ]
    });
  });

  it('accessor method should work', function() {
    expect(ben.fullName()).to.equal('Ben Sheldon');
  });

  it('maps get() to the accessor method', function() {
    expect(ben.get('fullName')).to.equal('Ben Sheldon');
  });

  it('triggers a change event when a list of dependent property changes', function() {
    var spy = sinon.spy();
    ben.on('change:fullName', spy);
    ben.set({ firstname: 'Stephen' });
    expect(spy.callCount).to.equal(1);
  });

  it('triggers a change event when a single dependent property changes', function() {
    var spy = sinon.spy();
    ben.on('change:firstBang', spy);
    ben.set({ firstname: 'Stephen' });
    expect(spy.callCount).to.equal(1);
  }),

  it('complex accessor method works correctly', function() {
    ben.set({ firstname: 'Stephen' });
    expect(ben.get('family')).to.equal('Stephen, Felipe, Raul');
  });

  it('triggers a change event when a callback function is called', function() {
    var spy = sinon.spy();
    ben.on('change:family', spy);
    ben.children.add({ firstname: 'Sean' });
    expect(spy.callCount).to.equal(1);
    expect(ben.get('family')).to.equal('Ben, Felipe, Raul, Sean');
  });

  it('overrides get() for non-listening accessors', function() {
    expect(ben.get('species')).to.equal("homo-sapien")
  });

  it('returns undefined for unimplemented accessors', function() {
    expect(ben.get('unimplemented')).to.equal(undefined);
    expect(ben.has('unimplemented')).to.equal(false);
  });

  it('overrides has() too', function() {
    expect(ben.has('family')).to.equal(true);
  })
});
