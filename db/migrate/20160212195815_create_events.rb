class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.integer :cost
      t.text :description
      t.json :geolocation
      t.text :category, :null => false, :default => 'location'
      t.json :venue
      t.json :weather
      t.timestamps
    end
  end
end
