class Event < ActiveRecord::Base
  validates :cost, numericality: { only_integer: true }
  validates_presence_of :category
end
