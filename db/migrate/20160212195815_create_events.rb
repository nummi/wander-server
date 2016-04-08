class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.boolean :publish, :null => false, :default => true
      t.integer :cost
      t.string :photo
      t.text :description
      t.json :geolocation
      t.text :category, :null => false, :default => 'location'
      t.json :venue
      t.json :weather
      t.json :reactions
      t.timestamps
    end
  end
end
