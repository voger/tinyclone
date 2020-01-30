# This changes to the app name
ARG APP_NAME=tinyclone

FROM elixir:1.9 AS elixir
ARG APP_NAME

# This doesn't change
ENV MIX_ENV prod
ENV LC_ALL C.UTF-8
# we are creating from within the application source
COPY config /source/config
COPY lib /source/lib
COPY priv /source/priv
COPY mix.exs /source/
COPY mix.lock /source/

WORKDIR /source

# Install hex and rebar
RUN mix do local.hex --force, local.rebar --force 

# We need only the production dependencies
RUN mix deps.get --only prod 
ENV APP_NAME $APP_NAME

RUN mix phx.digest
# mix release can export the relase to a custom folder
# no need to keep it burried inside the _build folder
RUN mix release --path /$APP_NAME

# Final image
FROM debian:buster
ARG APP_NAME

ENV APP_NAME $APP_NAME
ENV LC_ALL C.UTF-8

RUN set -xe \
      && apt-get update \
      && apt-get install -y --no-install-recommends \
      openssl \
      postgresql-client \
      && rm -rf /var/lib/apt/lists/* \
      && useradd --no-log-init -u 1001 -G users user

COPY --chown=user:users --from=elixir /$APP_NAME ./$APP_NAME/
COPY --chown=user:users entrypoint.sh .

RUN chmod +x entrypoint.sh

USER user

CMD ["./entrypoint.sh"]



