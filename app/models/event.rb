ICON_BASE = '/images/weather-icons/'

class Event < ActiveRecord::Base
  before_create :set_default_reactions

  # belongs_to :trip
  has_many :comments

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

  def set_default_reactions
    codes = [
      {
        code: '1F60A',
        description: 'smiling face',
        count: 0
      },
      {
        code: '1F632',
        description: 'astonished face',
        count: 0
      },
      {
        code: '1F44D',
        description: 'thumbs up',
        count: 0
      },
      {
        code: '1F4A9',
        description: 'pile of poo',
        count: 0
      },
      {
        code: '1F60D',
        description: 'smiling face with heart-shaped eyes',
        count: 0
      },
      {
        code: '1F61F',
        description: 'worried face',
        count: 0
      }
    ]

    self.reactions = {}
    self.reactions['codes'] = codes
  end
end
