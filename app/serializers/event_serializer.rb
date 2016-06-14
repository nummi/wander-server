class EventSerializer < ActiveModel::Serializer
  has_one :trip,
          embed: :ids,
          include: true

  attributes :id,
             :comments_disabled,
             :cost,
             :created_at,
             :description,
             :geolocation,
             :category,
             :venue,
             :weather,
             :photo,
             :publish
end
