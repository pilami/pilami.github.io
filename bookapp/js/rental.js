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

  // Create the post
  
  




  // The Application
  // ---------------
  // The main view that lets a user manage their todo items
  var ManageRentalView = Parse.View.extend({

    // Our template for the line of statistics at the bottom of the app.
    //--statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
       "keypress #new-search":  "createOnEnter",
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


      _.bindAll(this,  'createOnEnter');

      // Main todo management template
      this.$el.html(_.template($("#manage-rental-template").html()));
      
      this.input = this.$("#new-search");
      //this.allCheckbox = this.$("#toggle-all")[0];

      // Create our collection of Todos
      
      // this.todos = new TodoList;

      // // Setup the query for the collection to look for todos from the current user
      // this.todos.query = new Parse.Query(Todo);
      // this.todos.query.equalTo("user", Parse.User.current());
        
      // this.todos.bind('add',     this.addOne);
      // this.todos.bind('reset',   this.addAll);
      // this.todos.bind('all',     this.render);

      // // Fetch all the todo items for this user
      // this.todos.fetch();

      // state.on("change", this.filter, this);
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
      // var done = this.todos.done().length;
      // var remaining = this.todos.remaining().length;

      // this.$('#todo-stats').html(this.statsTemplate({
      //   total:      this.todos.length,
      //   done:       done,
      //   remaining:  remaining
      // }));

      this.delegateEvents();

      // this.allCheckbox.checked = !remaining;
    },

    // Filters the list based on which type of filter is selected
    selectFilter: function(e) {
      var el = $(e.target);
      var filterValue = el.attr("id");
      state.set({filter: filterValue});
      Parse.history.navigate(filterValue);
    },

    filter: function() {
      // var filterValue = state.get("filter");
      // this.$("ul#filters a").removeClass("selected");
      // this.$("ul#filters a#" + filterValue).addClass("selected");
      // if (filterValue === "all") {
      //   this.addAll();
      // } else if (filterValue === "completed") {
      //   this.addSome(function(item) { return item.get('done') });
      // } else {
      //   this.addSome(function(item) { return !item.get('done') });
      // }
    },

    // Resets the filters to display all todos
    resetFilters: function() {
      // this.$("ul#filters a").removeClass("selected");
      // this.$("ul#filters a#all").addClass("selected");
      // this.addAll();
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      // var view = new TodoView({model: todo});
      // this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the Todos collection at once.
    addAll: function(collection, filter) {
      // this.$("#todo-list").html("");
      // this.todos.each(this.addOne);
    },

    // Only adds some todos, based on a filtering function that is passed in
    addSome: function(filter) {
      // var self = this;
      // this.$("#todo-list").html("");
      // this.todos.chain().filter(filter).each(function(item) { self.addOne(item) });
    },

    // If you hit return in the main input field, create new Todo model
    createOnEnter: function(e) {
      // var self = this;
       if (e.keyCode != 13) return;
      console.log("You entered: "+ this.input.val());
      // this.todos.create({
      //   content: this.input.val(),
      //   order:   this.todos.nextOrder(),
      //   done:    false,
      //   user:    Parse.User.current(),
      //   ACL:     new Parse.ACL(Parse.User.current())
      // });

      // this.input.val('');
      // this.resetFilters();

      var book = Parse.Object.extend("Book");
      var query = new Parse.Query(book);
      query.exists("Title");
      query.get( {
        success: function(book) {
      // The object was retrieved successfully.
        console.log("Retrieved something!"+book.Title );
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
            console.log("Error with something");
        }
      });


    },

    
    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(this.todos.done(), function(todo){ todo.destroy(); });
      return false;
    },

    toggleAllComplete: function () {
      // var done = this.allCheckbox.checked;
      // this.todos.each(function (todo) { todo.save({'done': done}); });
    }
  });



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

  // Create the post
   var BookList = Parse.Collection.extend({

    // Reference to this collection's model.
    model: Book,

  });
  




  // The Application
  // ---------------
  // The main view that lets a user manage their todo items
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


      _.bindAll(this, 'searchOnEnter');

      // Main todo management template
      this.$el.html(_.template($("#manage-rental-template").html()));
      
      this.input = this.$("#new-search");
      //this.allCheckbox = this.$("#toggle-all")[0];

      // Create our collection of Todos
      
       this.books = new BookList;

      // // Setup the query for the collection to look for todos from the current user
       this.books.query = new Parse.Query(Book);
      // this.todos.query.equalTo("user", Parse.User.current());
        
      
      // // Fetch all the todo items for this user
      this.books.fetch();
      console.log("im trying to get all books");

      
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
      // var done = this.todos.done().length;
      // var remaining = this.todos.remaining().length;

      // this.$('#todo-stats').html(this.statsTemplate({
      //   total:      this.todos.length,
      //   done:       done,
      //   remaining:  remaining
      // }));

      this.delegateEvents();

      // this.allCheckbox.checked = !remaining;
    },

    // Filters the list based on which type of filter is selected
    selectFilter: function(e) {
      var el = $(e.target);
      var filterValue = el.attr("id");
      state.set({filter: filterValue});
      Parse.history.navigate(filterValue);
    },

    filter: function() {
      // var filterValue = state.get("filter");
      // this.$("ul#filters a").removeClass("selected");
      // this.$("ul#filters a#" + filterValue).addClass("selected");
      // if (filterValue === "all") {
      //   this.addAll();
      // } else if (filterValue === "completed") {
      //   this.addSome(function(item) { return item.get('done') });
      // } else {
      //   this.addSome(function(item) { return !item.get('done') });
      // }
    },

    // Resets the filters to display all todos
  

    // If you hit return in the main input field, create new Todo model
    SearchOnEnter: function(e) {
      // var self = this;
      // if (e.keyCode != 13) return;

      // this.todos.create({
         this.input.val();
      //   order:   this.todos.nextOrder(),
      //   done:    false,
      //   user:    Parse.User.current(),
      //   ACL:     new Parse.ACL(Parse.User.current())
      // });

      this.books.fetch(title);
      console.log("Trying to fetch all books");
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(this.todos.done(), function(todo){ todo.destroy(); });
      return false;
    },

    toggleAllComplete: function () {
      // var done = this.allCheckbox.checked;
      // this.todos.each(function (todo) { todo.save({'done': done}); });
    }
  });



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
        new ManageRentalView();e
      } else {
        console.log("User already signed in!");
        new LogInView();
      }
    }
  });

  new AppView;


  //Parse.history.start();



});



});