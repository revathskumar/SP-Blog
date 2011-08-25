class Api::PostsController < ApplicationController

  respond_to :json

  def index
    @posts = Post.all
    respond_with( @posts)
  end
	
end
