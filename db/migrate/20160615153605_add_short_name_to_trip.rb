class AddShortNameToTrip < ActiveRecord::Migration
  def change
    add_column :trips, :short_name, :string
    add_index :trips, :short_name, unique: true
  end
end
