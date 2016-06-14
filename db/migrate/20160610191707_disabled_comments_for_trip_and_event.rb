class DisabledCommentsForTripAndEvent < ActiveRecord::Migration
  def change
    change_table :events do |t|
      t.boolean :comments_disabled, default: false
    end

    change_table :trips do |t|
      t.boolean :comments_disabled, default: false
    end
  end
end
