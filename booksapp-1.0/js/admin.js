$(function() {
	console.log("Connected to admin server!");
  Parse.$ = jQuery;

    // Replace this line with the one on your Quickstart Guide Page
  Parse.initialize("rPBJ1iZaE4jOnyvY9SvU6srf4JsYL3H0Ib3WPJUZ", "22oh9N3dDdWqixLxrF31Qa3dOxLd3jiS41sSYp7P");
 	


 var LoginView = Parse.View.extend({
  template: Handlebars.compile($('#login-tpl').html()),
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          console.log("Signed in  user: "+ username+" "+ password);
          

          var welcomeView = new WelcomeView({ model: user });
            welcomeView.render();
            $('.main-container').html(welcomeView.el);
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
          

           var welcomeView = new WelcomeView({ model: user });
            welcomeView.render();
            $('.main-container').html(welcomeView.el);
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
      this.$el.html(this.template());
      
    }
  });

//Class
  var Book = Parse.Object.extend("Book");
  
  //Class
  var Books = Parse.Collection.extend({
    model: Book
  });

  //instance
  

  var DetailView = Parse.View.extend({

        template: Handlebars.compile($('#books-tpl-detail').html()),

        

        render: function(){
            this.$el.html(this.template());
        },



      });

//New view for books!
var BooksView = Parse.View.extend({
  events:{
    "click .book-post-title": "gotopage",
    "click .back-button": "goBack",
  },
  template : Handlebars.compile( $('#books-tpl').html() ),
  render: function(){
    var collection = {book: this.collection.toJSON()};
    this.$el.html(this.template(collection));
  },

  gotopage: function(){
        
        var title = this.$(".book-post-title" ).attr("id");
        console.log("Need to show details of "+ title );
        var book = Parse.Object.extend("Book");
        var query = new Parse.Query(book);
        query.equalTo("Title", title);

        
        query.find({
          success: function(results) {
            
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) { 
              var object = results[i];
              alert(object.id + ' - ' + object.get('Title'));
            }
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });


        var detailView = new DetailView();
        //detailView.render();
       // $('.main-container').html(detailView.el);
       },
       goBack: function(){

            var user =  Parse.User.current();

             var welcomeView = new WelcomeView({ model: user });
            welcomeView.render();
            $('.main-container').html(welcomeView.el);

       }


});

  var WelcomeView = Parse.View.extend({

        template: Handlebars.compile($('#welcome-tpl').html()),

        events: {
          "click .log-out": "logOut",
          "click .list-all": "listAll",
          "keypress #searchinput":  "searchOnEnter",
        },

        render: function(){
            console.log("Welcome idiot!");
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
        },
        
        logOut: function(e) {
          Parse.User.logOut();
          var loginview = new LoginView();
          loginview.render();
          $('.main-container').html(loginview.el);
       },

       listAll: function(e) {
            console.log("Caleld the list all function!");
            var books = new Books();
            books.fetch({
              success: function(books) {
              console.log("Created books object!");
              var booksView = new BooksView({ collection: books });
              booksView.render();

              $('.main-container').html(booksView.el);
            },
            error: function(books, error){
              console.log("Error "+error+" fetching the "+books);
            }
          });

       },
    searchOnEnter: function(e) {
      // var self = this;
       if (e.keyCode != 13) return;
       var searchquery = this.$("#searchinput").val();
      console.log("You entered: "+ searchquery);
      // this.todos.create({
      //   content: this.input.val(),
      //   order:   this.todos.nextOrder(),
      //   done:    false,
      //   user:    Parse.User.current(),
      //   ACL:     new Parse.ACL(Parse.User.current())
      // });

      // this.input.val('');
      // this.resetFilters();
      this.$("#searchinput").val('');
      var book = Parse.Object.extend("Book");
      var query = new Parse.Query(book);
      //query.equalTo("Title", "searchquery");
      query.exists("Title");
      query.find({
        success: function(results) {
          var books = new Books();
          console.log("Successfully retrieved " + results.length + " boo!");
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) { 
            var object = results[i];
            console.log("checking match between: "+ object.get('Title') + " "+ searchquery);
            if(object.get('Title') == searchquery){
              console.log(object.id + ' - ' + object.get('Title'));


//              var file = object.get("thumbnail").url;
               //object.set("thumburl", "yeahright");
  //             console.log("This is the url : "+ file);
               //document.getElementById("booimage").innerHTML = file.url;



              books.add(object) ;
            }

          }
            //var books = new Books(results);
            
            var booksView = new BooksView({ collection: books });
             booksView.render();
              $('.main-container').html(booksView.el);

        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
        }
      });

    

    }


      });


var loginView = new LoginView();
loginView.render();
$('.main-container').html(loginView.el);

    
});