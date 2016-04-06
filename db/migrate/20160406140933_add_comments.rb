class AddComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :event_id, :null => false
      t.string :name, :null => false
      t.text :text, :null => false
      t.timestamps
    end
  end
end
