// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
jQuery(function($){
  var Post = Backbone.Model.extend({
    "title": "Post lists",
    "name": "Post name",
    "caption": "Post caption",
    url: "/posts"
  })

  var post = new Post({
    "title": "Post lists",
    "name": "Post name",
    "caption": "Post caption"
  })

 


//  post.save()

  var Posts = Backbone.Collection.extend({
      model:Post,
      url:"/posts"
  })

  var posts = new Posts
  postData = posts.fetch();
//  posts.get(1);
  
  PostView= Backbone.View.extend({
    tagName : "div",
    id: "container",
    render : function() {
      console.log("abc");
      $(this).html(this.model.fetch())
      return this;
    },
    initialize:function(args){
      _.bindAll(this,'changeName')
      this.model.bind("change:name",this.changeName)
    }
  });

  post_view = new PostView

  post.bind("change:post[title]",function(){
    alert("changed");
  })

//  Posts.trigger("change");
  var HashBangs = Backbone.Router.extend({
      routes:{
          "!/": "root",
          "!/posts": "posts"
      },
      posts:function(){
          console.log("postsView")
      }
  })

  var AppController = new HashBangs
  Backbone.history.start()
     post.set({title:"new title"});
//  var save = _.bind(item.save,item);
//  _.delay(save,5000, {title: "Changed Title"})
})