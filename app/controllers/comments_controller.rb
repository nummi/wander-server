class CommentsController < ApplicationController
  def create
    comment = Comment.new(comment_params)
    comment.save
    respond_with comment
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