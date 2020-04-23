# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /var/www/frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /var/www/frontend/node_modules/.bin:$PATH

# CMD ['ls']


# install and cache app dependencies
ADD ./sites/frontend/package.json /var/www/frontend/package.json

RUN cat package.json
RUN npm install
RUN npm install @vue/cli -g

# start app
CMD ["npm", "run", "serve"]
