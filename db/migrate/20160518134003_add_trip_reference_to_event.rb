class AddTripReferenceToEvent < ActiveRecord::Migration
  def change
    add_reference :events, :trip
  end
end
