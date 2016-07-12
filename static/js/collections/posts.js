var app = app || {};

app.PostCollection = Backbone.Collection.extend({
  model: app.PostModel,
  url: 'http://127.0.0.1:8000/blog/api/posts/'
});
