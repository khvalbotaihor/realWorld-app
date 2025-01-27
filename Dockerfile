FROM cypress/base
RUN mkdir /app
WORKDIR /app

COPY . /app
RUN npm install
RUN npx cypress install
RUN npx cypress verify
RUN ["npm", "run", "cy:open_qa"]