class Api::PostsController < ApplicationController

  respond_to :json

  def index
    @posts = Post.all
    posts_hash = []
    @posts.each do | post |
      posts_hash << { :id => post.id, :title => post.title, :name => post.name, :content => post.content }
    end
    respond_with( posts_hash)
  end
	
end
