class Post < ActiveRecord::Base

  slug :title ,:column => :permalink
  scope :permalink, lambda { |permalink| {:conditions => ['permalink LIKE ?',permalink]} }
  
end
