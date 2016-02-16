class Event < ActiveRecord::Base
  validates :cost, numericality: { only_integer: true }
end
