class Comment < ActiveRecord::Base
  belongs_to :event

  validates_presence_of :name, :text, :event_id

  default_scope { order(created_at: :asc) }
end
