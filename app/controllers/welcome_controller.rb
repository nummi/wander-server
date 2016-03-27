class WelcomeController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def index
    @events = Event.published.order(created_at: :desc)
  end
end
