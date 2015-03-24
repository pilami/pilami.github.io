$(function(){

  Parse.$ = jQuery;
  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("rPBJ1iZaE4jOnyvY9SvU6srf4JsYL3H0Ib3WPJUZ", "22oh9N3dDdWqixLxrF31Qa3dOxLd3jiS41sSYp7P");


  var Book = Parse.Object.extend("Book", {
    // Default attributes: Title; ShortDesc;LongDesc;Serial;Owner.
    defaults: {
      ShortDesc: "Not Available",
      LongDesc: "Not Available",
      Title: "Not Available",
      Serial: "0000",
      Owner: "House"
    },
    // Ensure that each todo created has `content`.
    initialize: function() {
      console.log("Initializing!");
      if (!this.get("ShortDesc")) {
        this.set({"ShortDesc": this.defaults.ShortDesc});
      }
      if (!this.get("LongDesc")) {
        this.set({"LongDesc": this.defaults.LongDesc});
      }
      if (!this.get("Title")) {
        this.set({"Title": this.defaults.Title});
      }
      if (!this.get("Serial")) {
        this.set({"Serial": this.defaults.Serial});
      }
      if (!this.get("Owner")) {
        this.set({"Owner": this.defaults.Owner});
      }
    }

    
    
  });

//---------------- Book List ---------------

  var BookList = Parse.Collection.extend({

    // Reference to this collection's model.
    model: Book,

  });


  // -------------- Just list of books ------------------
  var BookView = Parse.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "keypress .edit"      : "searchOnEnter",
     },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a Todo and a TodoView in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      _.bindAll(this, 'render','close');
    },

    // Re-render the contents of the todo item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    searchOnEnter: function(e) {
      if (e.keyCode == 13) this.close();

    },
    close: function() {
      this.model.save({content: this.input.val()});      
    },

    
  });

  
  




  
  // --------------- Books list ------------------------------------
  
  var ManageRentalView = Parse.View.extend({

    // Our template for the line of statistics at the bottom of the app.
    //--statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
       "keypress #new-search":  "searchOnEnter",
      // "click #clear-completed": "clearCompleted",
      // "click #toggle-all": "toggleAllComplete",
       "click .log-out": "logOut",
      // "click ul#filters a": "selectFilter"
    },

    el: ".content",

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved to Parse.
    initialize: function() {
      var self = this;

      this.books = new BookList;
      _.bindAll(this,  'searchOnEnter');

      // Main todo management template
      this.$el.html(_.template($("#manage-rental-template").html()));
      
      this.input = this.$("#new-search");
      console.log("Is this somethign? "+this.$("#new-search")  );
    },

    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      

      this.delegateEvents();

      
    },
  
    // If you hit return in the main input field, create new Todo model
    searchOnEnter: function(e) {
      // var self = this;
       if (e.keyCode != 13) return;
      console.log("You entered: "+ this.input.val());
      var searchString = this.input.val();
    
      var book = Parse.Object.extend("Book");
      var query = new Parse.Query(Book);
      if(searchString){
        query.equalTo("Title", searchString);
      }
      else
      {
        query.exists("Title");  
      }
      
      //query.startsWith("Title", "First Book");
      
      query.find({
        success: function(results) {
          //console("Successfully retrieved " + results.length + " books.");
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) { 
            
            var object = results[i];
            console.log(object.id + ' - ' + object.get('Title'));


            var view = new BookView({model: Book});
            this.$("#book-list").append(view.render().el);




          }
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
        }
      });



    },

    
  });


//----------------------------------- Login view ------------------------------------------------------
 var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },
    el: ".content",
    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          console.log("Signed in  user: "+ username+" "+ password);
          new ManageRentalView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
      });
      this.$(".login-form button").attr("disabled", "disabled");
      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      
      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
          console.log("Signed up new user: "+ username+" "+ password);
          new ManageRentalView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(_.escape(error.message)).show();
          self.$(".signup-form button").removeAttr("disabled");
        }
      });

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });

	

  //--------------------------- App view -----------------------------------------
  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#rentalapp"),
    initialize: function() {
      this.render();
    },
    render: function() {
    console.log("Checking if user is signed in");
      if (Parse.User.current()) {
        console.log("Asking user to log in!");
        new ManageRentalView();
      } else {
      	console.log("User already signed in!");
        new LogInView();
      }
    }
  });

  new AppView;


  



});