FROM node:8-alpine

LABEL MAITAINER="Rodrigo Fernandes <rodrigo@codacy.com>"

COPY . /build

ENV NODE_PATH /build/node_modules
ENV PATH /build/node_modules/.bin:$PATH

RUN \
    cd /build && \
    yarn && \
    yarn link && \
    chmod +x /build/build/main/index.js 

RUN adduser -u 2004 -D docker

USER docker

WORKDIR /src

ENTRYPOINT ["codacy-remark-lint"]
CMD []
