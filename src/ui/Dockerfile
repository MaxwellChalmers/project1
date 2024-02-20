from node:ltd
ARG GID=20
ARG UID=501
COPY . /app
WORKDIR /app
RUN getent group ${GID} || groupadd -g ${GID} dev
RUN getent passwd ${UID} || useradd -m -u ${UID} -g ${GID} -s /bin/bash dev
CMD ["npm", "run", "watch"]
