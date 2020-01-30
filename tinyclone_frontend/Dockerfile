FROM node:13-buster AS node
USER node

ARG API_SERVER
ARG REDIRECT_SERVER

ENV API_SERVER      $API_SERVER
ENV REDIRECT_SERVER $REDIRECT_SERVER

ENV LC_ALL C.UTF-8
ENV NPM_CONFIG_PREFIX /home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install -g --quiet --no-progress \
      npx \
      @qooxdoo/framework@6.0.0-beta-20200124-1325 \
      @qooxdoo/compiler@1.0.0-beta.20200111-0015

COPY --chown=node:node compile.json \
     Manifest.json     \
     package-lock.json \
     package.json      \
     qx-lock.json      \
     webpack.config.js /source/
COPY --chown=node:node source /source/source

WORKDIR /source

RUN npm install --quiet --no-progress
RUN npx webpack-cli
RUN set -xe && npx qx compile \
      --target build \
      --minify mangle \
      --verbose true \
      --clean true \
      --download true \
      --set-env tinyclone.apiServer="$API_SERVER" \
      --set-env tinyclone.redirectServer="$REDIRECT_SERVER"

# Clean unneded files
WORKDIR /source/compiled/build/
RUN rm -rf db.json resource-db.json transpiled/

FROM nginx:1.17-alpine 


ENV LC_ALL C.UTF-8

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=node /source/compiled/build /usr/share/nginx/html

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf

CMD ["-g", "daemon off;"]
ENTRYPOINT ["nginx"]
