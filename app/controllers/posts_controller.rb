class PostsController < ApplicationController
  
#  respond_to :json

  # GET /posts
  def index
    @posts = Post.find :all, :order => "posts.created_at DESC"
    render :json => @posts
  end

  # GET /posts/1
  # GET /posts/1.xml
  def show
    if !params[:permalink].nil?
      @post = Post.permalink params[:permalink]
    else
      @post = Post.find  params[:id]
    end
    render :json => @post
  end

  # GET /posts/new
  # GET /posts/new.xml
  def new
    @post = Post.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @post }
    end
  end

  # GET /posts/1/edit
  def edit
    @post = Post.find(params[:id])
    render :json => @post
  end

  # POST /posts
  # POST /posts.xml
  def create
    @post = Post.new(params[:post])

#    respond_to do |format|
#      if @post.save
#        format.html { redirect_to(@post, :notice => 'Post was successfully created.') }
#        format.xml  { render :xml => @post, :status => :created, :location => @post }
#      else
#        format.html { render :action => "new" }
#        format.xml  { render :xml => @post.errors, :status => :unprocessable_entity }
#      end
#    end
  end

  # PUT /posts/1
  # PUT /posts/1.xml
  def update
    @post = Post.find(params[:id])

    respond_to do |format|
      if @post.update_attributes(params[:post])
        format.html { redirect_to(@post, :notice => 'Post was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @post.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.xml
  def destroy
    @post = Post.find(params[:id])
    @post.destroy

    respond_to do |format|
      format.html { redirect_to(posts_url) }
      format.xml  { head :ok }
    end
  end
end
