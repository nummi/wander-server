module Api
  module V1
    class CommentsController < ApplicationController
      def create
        comment = Comment.new(comment_params)
        comment.save
        respond_with comment, :location => api_comment_path(comment)
      end

      private

      def comment_params
        params.require(:comment).permit(
          :name,
          :text,
          :event_id
        )
      end
    end
  end
end
