class TripSerializer < ActiveModel::Serializer
  has_many :events,
           embed: :ids,
           include: false,
           serializer: EventSerializer

  attributes :id,
             :comments_disabled,
             :created_at,
             :name
end
