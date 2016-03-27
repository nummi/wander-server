if ENV.has_key? 'AWS_ACCESS_KEY_ID'
  CarrierWave.configure do |config|
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: 'AKIAJWFZXPPFUY6JPC7Q', # ENV['AWS_ACCESS_KEY_ID'],
      aws_secret_access_key: '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', # ENV['AWS_SECRET_ACCESS_KEY'],
      region: 'us-east-1' # ENV['AWS_REGION']
    }

    config.cache_dir      = "#{Rails.root}/tmp/uploads" 
    config.fog_attributes = {'Cache-Control'=>'max-age=315576000'}
    config.fog_directory  = 'wander-free' # ENV['S3_BUCKET']
  end
else
  Rails.logger.warn "AWS_ACCESS_KEY_ID not found in ENV; CarrierWave is disabled."
end
