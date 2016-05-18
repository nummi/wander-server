class Trip < ActiveRecord::Base
  has_many :events

  validates_presence_of :name
end
