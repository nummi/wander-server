ICON_BASE = '/images/weather-icons/'

class Event < ActiveRecord::Base
  # belongs_to :trip

  mount_uploader :photo, PhotoUploader

  validates :cost, numericality: { only_integer: true }
  validates_presence_of :category

  scope :published, -> { where(publish: true) }

  def display_text
    if venue && !(venue['name'].empty?)
      venue['name']
    else
      if category == 'message'
        'Message'
      elsif description
        description.truncate(30)
      else
        category.capitalize
      end
    end
  end

  def icon_path
    ICON_BASE + icon_file_name
  end

  def icon_file_name
    if weather['weatherIconUrl'].empty?
      'wsymbol_0999_unknown.svg'
    else
      full = weather['weatherIconUrl'][0]['value']
      full.gsub('.png', '.svg').split(/.*\/(.*?)$/)[1]
    end
  end
end
