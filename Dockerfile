FROM node:8-alpine AS build

ENV NODE_PATH /usr/lib/node_modules

COPY . /workdir

WORKDIR /workdir

RUN \
    yarn && \
    yarn run build

FROM node:8-alpine

LABEL MAITAINER="Rodrigo Fernandes <rodrigo@codacy.com>"

ENV NODE_PATH /app/node_modules
ENV PATH /app/node_modules/.bin:$PATH

COPY --from=build /workdir/build/main /app/build/main
COPY --from=build /workdir/package.json /app/package.json
COPY --from=build /workdir/yarn.lock /app/yarn.lock
COPY --from=build /workdir/docs /docs

WORKDIR /app

RUN \
    yarn install --production --cache-folder /tmp/yarn-cache && \
    yarn link && \
    chmod +x /app/build/main/index.js && \
    rm -rf /tmp/yarn-cache /root/.yarn

RUN adduser -u 2004 -D docker

WORKDIR /src

USER docker

ENTRYPOINT ["codacy-remark-lint"]
CMD []  
