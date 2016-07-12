var app = app || {};

app.AppView = Backbone.View.extend({
  el: '.blogapp',

  postsTemplate: _.template($('#list-template').html()),

  initialize: function() {
    console.log("App View initialized...");
    this.$list = $('.posts-wrap');

    this.listenTo(app.posts, 'add', this.addOne);
    this.listenTo(app.posts, 'reset', this.addAll);
    this.listenTo(app.posts, 'all', this.addAll);

    var mine = this;  

    app.posts = new app.PostCollection();
    app.posts.fetch({
      success: function() {
        console.log("Posts fetched...");
        console.log(app.posts);
        //new app.PostView({collection: posts});
        mine.addAll();
      },
      error: function(xrh) {
        console.log("Error fetching posts");
        console.log(xrh);
      },
      reset: true
    });

  },

  render: function() {

  },

  addOne: function(post) {
    var view = new app.PostView({model: post});
    this.$list.append(view.render().el);
  },

  addAll: function() {
    console.log("add all function called!");
    this.$list.html('');
    app.posts.each(this.addOne, this);
  },
});
