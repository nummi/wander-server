class EventSerializer < ActiveModel::Serializer
  attributes :id,
             :cost,
             :created_at,
             :description,
             :geolocation,
             :category,
             :venue,
             :weather,
             :photo
end
