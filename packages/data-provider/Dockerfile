FROM node:16 AS BUILD_IMAGE
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /usr/app
COPY . /usr/app
EXPOSE 3000
RUN npm install && npm run build
# remove development dependencies
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:16-alpine
WORKDIR /usr/app
COPY --from=BUILD_IMAGE /usr/app/build ./build
COPY --from=BUILD_IMAGE /usr/app/node_modules ./node_modules
CMD [ "node", "./build/src/index.js" ]