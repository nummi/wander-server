module Api
  module V1
    class TripsController < ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :render_404

      def index
        respond_with(Trip.all, {
          each_serializer: TripSerializer
        })
      end

      def show
        respond_with Trip.find(params[:id])
      end

      def create
        trip = Trip.new(trip_params)
        trip.save
        respond_with trip, :location => api_trip_path(trip)
      end

      def update
        trip = Trip.find params[:id]
        trip.update_attributes(trip_params)
        respond_with trip
      end

      def destroy
        trip = Trip.find params[:id]
        trip.destroy
        head :no_content
      end

      private

      def trip_params
        params.require(:trip).permit(
          :comments_disabled,
          :created_at,
          :name,
          :short_name
        )
      end

    end
  end
end
