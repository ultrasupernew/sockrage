FROM alexzhxin/sockrage
MAINTAINER Alexandre Nguyen
ADD . /code
ADD .docker/start.sh /usr/local/bin/run
RUN rm -rf /code/node_modules/*
RUN npm install --prefix /code/
CMD ["/bin/sh", "-e", "/usr/local/bin/run"]

