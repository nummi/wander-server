# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160620144811) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.integer  "event_id",   null: false
    t.string   "name",       null: false
    t.text     "text",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", force: :cascade do |t|
    t.boolean  "publish",           default: true,       null: false
    t.integer  "cost"
    t.string   "photo"
    t.text     "description"
    t.json     "geolocation"
    t.text     "category",          default: "location", null: false
    t.json     "venue"
    t.json     "weather"
    t.json     "reactions"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "trip_id"
    t.boolean  "comments_disabled", default: false
  end

  create_table "trips", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "comments_disabled", default: false
    t.string   "short_name"
    t.date     "end_date"
    t.date     "start_date"
  end

  add_index "trips", ["short_name"], name: "index_trips_on_short_name", unique: true, using: :btree

end
