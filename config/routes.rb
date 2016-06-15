require 'api_constraints'

Rails.application.routes.draw do
  root 'trips#latest'

  namespace :api, defaults: { format: 'json' } do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      resources :trips,    :defaults => { :format => 'json' }
      resources :events,   :defaults => { :format => 'json' }
      resources :comments, :defaults => { :format => 'json' }
    end
  end

  resources :trips
  post '/api/events/:id/react' => 'api/v1/events#react'

  get '/sign' => 'sign#index'
end
