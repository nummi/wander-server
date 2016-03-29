class EventsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def index
    events = params.has_key?(:publish) ? Event.where(publish: params[:publish]) : Event.all

    respond_with(events, {
      each_serializer: EventSerializer
    })
  end

  def show
    respond_with Event.find(params[:id])
  end

  def create
    logger.debug '----------------------------- CREATE ACTiON CALLED'
    unless params[:event][:photo].empty?
      params[:event][:photo] = convert_to_upload(params[:event][:photo])
    end

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
      :photo,
      :category,
      :description).tap do |whitelisted|
        whitelisted[:geolocation] = params[:event][:geolocation]
        whitelisted[:venue]       = params[:event][:venue]
        whitelisted[:weather]     = params[:event][:weather]
      end
  end

  def convert_to_upload(image)
    logger.debug '--------------- convert_to_upload called'
    image_data = split_base64(image[:data])

    temp_img_file = Tempfile.new("data_uri-upload")
    temp_img_file.binmode
    temp_img_file << Base64.decode64(image_data[:data])
    temp_img_file.rewind

    ActionDispatch::Http::UploadedFile.new({
      filename: image[:name],
      type: image[:type],
      tempfile: temp_img_file
    })
  end

  def split_base64(uri_str)
    if uri_str.match(%r{^data:(.*?);(.*?),(.*)$})
      uri = Hash.new
      uri[:type] = $1 # "image/gif"
      uri[:encoder] = $2 # "base64"
      uri[:data] = $3 # data string
      uri[:extension] = $1.split('/')[1] # "gif"
      return uri
    end
  end
end
