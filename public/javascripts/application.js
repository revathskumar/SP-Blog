// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
jQuery(function($){

  //Backbone Model

  var Post = Backbone.Model.extend({
    url: function(){
      return (this.id)?"/posts/"+this.id : (this.permalink ? "/"+ this.permalink : "/posts")
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


//  Backbone View Index

  App.Views.Index = Backbone.View.extend({
    el: $("#container"),
    render : function() {
      console.log("post view render");
      $(this.el).html("<ul id='list_posts'></ul>");
      if(this.posts.length > 0){
        $.template("posts_list",$("#post_list"));
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
      console.log("Initialized Edit view for posts")
      this.post = this.options.post
      this.render();
    },
    render:function(){
      $(this.el).html("<form>\n\
          <ul style='list-style:none'>\n\
            <li>Title</li>\n\
            <li><input type='text' name='post[\"title\"]'/></li>\n\
            <li>Content</li>\n\
            <li><textarea name='post[\"content\"]' cols='40' rows='20'></textarea></li>\n\
            <li><button>Post</button></li>\n\
           </ul></form>");
      if(!this.post.isNew()){
        $("input","#container").val(this.post.get('title'))
        $("textarea","#container").val(this.post.get('content'))
        $("button","#container").text("Update")
      }
    },
    save:function(){
      this.post.save({post :{
          title:$("input").val(),content:$("textarea").val()
        }},{
          success:function(model,response){
            Backbone.history.navigate("/posts/" + model.id)
          }
      });
      return false;
    }
  });


  App.Views.Show = Backbone.View.extend({
    el:$("#container"),
    initialize:function(){
      this.post = this.options.post
      this.render();
    },
    render:function(){
      log("In show render");
      $(this.el).html('');
      $.template("posts_show","<h2>${title}</h2>\n\
        <div>${content}</div>\n\
        <div class='post-footer'>\n\
          <ul class='left'>\n\
            <li>Posted on <span>${created_at}</span></li>\n\
          </ul>\n\
          <ul class='right'><li><a href='#/posts/edit/${id}'>edit</a></li></ul>\n\
        </div>");
      $.tmpl("posts_show",this.post).appendTo("#container");
    }
  })

  App.Controllers.Posts = Backbone.Router.extend({
      routes:{
          "/": "index",
          "": "index",
          "/new": "newPost",
          "/posts/:id": "show",
          "/posts/edit/:id": "edit",
          "/:year/:month/:permalink":"show",
          "/:permalink":"show"
      },
      newPost:function(){
        new App.Views.Edit({post: new Post()})
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
            new App.Views.Edit({post:model})
          },
          error:function(){
            new Error({message:"Cound not find the document"})
            window.location.hash = '#'
          }
        })
      },
      show:function(id){
        var post = new Post({permalink:id})
        if(typeof(id) == "string") post.url = "/"+id
        if(arguments.length == 3 ) post.url = "/" + $.makeArray(arguments).join("/")
        
        post.fetch({
          success:function(xhr,response){
            new App.Views.Show({post:response})
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


var mode = "dev"
function log(msg){
  if(mode == "dev"){
    console.log(msg)
  }
}