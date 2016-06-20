class AddBeginAndEndDatesToTrip < ActiveRecord::Migration
  def change
    add_column :trips, :end_date,   :date
    add_column :trips, :start_date, :date
  end
end
