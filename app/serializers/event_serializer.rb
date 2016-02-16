class EventSerializer < ActiveModel::Serializer
  attributes :id, :description, :cost, :geolocation, :venue, :weather, :created_at
end
