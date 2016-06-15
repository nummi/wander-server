class TripsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def latest
    redirect_to trip_path(Trip.last)
  end

  def index
    @trips = Trip.all
  end

  def show
    @trip = Trip.by_short_name(params[:id])
    @events = @trip.events.published.order(created_at: :desc)
  end
end
