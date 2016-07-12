var app = app || {};

app.PostModel = Backbone.Model.extend({
  urlRoot: 'http://127.0.0.1:8000/blog/api/posts/',

  url : function() {
      if (this.isNew()) return this.urlRoot;
      var base = 'http://127.0.0.1:8000/blog/api/post/';
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    }
});
