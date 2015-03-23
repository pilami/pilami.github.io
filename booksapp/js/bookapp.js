$(function() {
 
	console.log("Connected to bookapp server!");


  Parse.$ = jQuery;
 
    // Replace this line with the one on your Quickstart Guide Page
  Parse.initialize("rPBJ1iZaE4jOnyvY9SvU6srf4JsYL3H0Ib3WPJUZ", "22oh9N3dDdWqixLxrF31Qa3dOxLd3jiS41sSYp7P");
 	
  //Class
  var Book = Parse.Object.extend("Book");
  
  //Class
  var Books = Parse.Collection.extend({
  	model: Book
  });

  //instance
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

//New view for books!
var BooksView = Parse.View.extend({
	
	template : Handlebars.compile( $('#books-tpl').html() ),
	render: function(){
		var collection = {book: this.collection.toJSON()};
		this.$el.html(this.template(collection));
	}
});

var detailView = Parse.View.extend({


	template: Handlebars.compile($('#books-tpl-detail').html() ),
	render: function(){
		console.log("Trying for a detailView!");
		var book = {book: this.toJSON()};
		this.$el.html(this.template(book));
	}


});




    
});