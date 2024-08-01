FROM mcr.microsoft.com/playwright:v1.45.1-jammy

# tzdata: for the TZ environment variables
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install tzdata

EXPOSE 3000
WORKDIR /work

COPY . .
RUN npm ci

CMD ["npm", "run", "start"]
