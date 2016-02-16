class EventsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def index
    respond_with(Event.all, {
      each_serializer: EventSerializer
    })
  end

  def show
    respond_with Event.find(params[:id])
  end

  def create
    event = Event.new(event_params)
    event.save
    respond_with event
  end

  def update
    event = Event.find params[:id]
    event.update_attributes(event_params)
    respond_with event
  end

  def destroy
    event = Event.find params[:id]
    event.destroy
    head :no_content
  end

  private

  def event_params
    params.require(:event).permit(
      :cost,
      :description).tap do |whitelisted|
        whitelisted[:geolocation] = params[:event][:geolocation]
        whitelisted[:venue]       = params[:event][:venue]
        whitelisted[:weather]     = params[:event][:weather]
      end
  end
end
