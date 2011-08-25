// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
jQuery(function($){

  //Backbone Model

  var Post = Backbone.Model.extend({
    url: function(){
      return (this.id)?"/posts/"+this.id : "/posts"
    },
    defaults:{
      post: {
        name: "Default Name",
        title: "Default Title"
      }
    },
    initialize: function(){
      console.log("Post Model initialized")
    }
  })

  //Backbone Collection

  App.Collections.Posts = Backbone.Collection.extend({
      model:Post,
      url:"/posts"
  })
//
//  var posts = new Posts
//  postData = posts.fetch();
//  postData.get(1);
//  console.log(postData.get(1));


//  Backbone View Index

  App.Views.Index = Backbone.View.extend({
    el: $("#container"),
    render : function() {
      console.log("post view render");
      $(this.el).html("<h3><a href='#new'>New post</a></h3><ul id='list_posts'></ul>");
      if(this.posts.length > 0){
        $.template("posts_list","<li><a href='#posts/${id}'>${title}</a></li>");
        $.tmpl("posts_list",this.posts).appendTo("#list_posts");
      }else{
        $("#list_posts").append("<li> Sorry No posts was found</li>");
      }
    },
    initialize:function(args){
      console.log("Initialized Post view")
      this.posts = this.options.posts
      this.render()
    }
  });


  App.Views.Edit = Backbone.View.extend({
    el: $("#container"),
    events:{
      "submit form":"save"
    },
    initialize:function(args){
      this.post = this.options.post
      this.render();
    },
    render:function(){
      $(this.el).html("<form>\n\
          <ul style='list-style:none'>\n\
            <li>Title</li>\n\
            <li><input type='text' name='post[\"title\"]'/></li>\n\
            <li>Content</li>\n\
            <li><textarea name='post[\"content\"]'></textarea></li>\n\
            <li><button>Post</button></li>\n\
           </ul></form>");
      if(this.post){
        $("input","#container").val(this.post.title)
        $("textarea","#container").val(this.post.content)
      }
    },
    save:function(){
      this.post.save()
    }
  });

  //Aplication View

//  var app_view = Backbone.View.extend({
//    el: $("#container"),
//    events:{
//      "submit form#new_post":"createPost"
//    }
//  })

  //  Posts.trigger("change");

  App.Controllers.Posts = Backbone.Router.extend({
      routes:{
          "": "index",
          "new": "newPost",
          "posts/:id": "edit"
      },
      newPost:function(){
        new App.Views.Edit({model: new Post()})
      },
      index:function(){
        var posts = new App.Collections.Posts
        posts.fetch({
          success:function(xhr,response){
            posts_data = response
            if(posts_data){
              new App.Views.Index({posts:posts_data})
            }else{
              new Error({message:"Error Locading posts"})
            }
          }
        })
      },
      edit:function(id){
        console.log("In edit")
        var post = new Post({id:id})
        post.fetch({
          success:function(model,response){
            new App.Views.Edit({post:response})
          },
          error:function(){
            new Error({message:"Cound not find the document"})
            window.location.hash = '#'
          }
        })
      }
      
  })
});


var App = {
  Views : {},
  Controllers: {},
  Collections: {},
  init:function(){
    new App.Controllers.Posts();
    Backbone.history.start();
  }
}