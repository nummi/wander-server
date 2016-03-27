# class SignController < ApplicationController
#   def index
#     render json: { endpoint: ENV['S3_URL'], formData: signer.params }, status: :ok
#   end
#
#   private
#
#   def signer
#     AmazonS3Signer.new(file_name: params[:file_name],
#                        file_path: upload_path,
#                        content_type: params[:content_type])
#   end
#
#   def upload_path
#     "pending/#{params[:file_path]}#{SecureRandom.hex(10)}"
#   end
# end
#

class SignController < ApplicationController
  def index
    render json: {
      endpoint: upload_form.url,
      access_key_id: upload_form.access_key_id,
      acl: upload_form.acl,
      policy: upload_form.policy,
      signature: upload_form.signature,
      key: upload_form.key
    }
  end

  private

  def upload_form
    @upload_form ||= S3FormConfigurator.new(
      url: ENV['S3_URL'],
      bucket_name: ENV['S3_BUCKET'],
      aws_key: ENV['AWS_ACCESS_KEY_ID'],
      aws_secret: ENV['AWS_SECRET_ACCESS_KEY'],
      upload_path: "pending/#{params[:file_prefix]}",
      content_type: params[:content_type])
  end
end
