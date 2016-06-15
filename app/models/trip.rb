class Trip < ActiveRecord::Base
  has_many :events, dependent: :destroy

  validates :name, presence: true
  validates :short_name, presence: true, format: /[^ \/]/

  def self.by_short_name(name)
    where(short_name: name).first
  end

  def to_param
    short_name
  end
end
