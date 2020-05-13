# wsf-data
This repository is exclusively reserved for the 4th year Data Project, carried out with a purely pedagogical aim.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
This project is based on the Vue.js and Hapi.js frameworks, and uses Apexcharts.js as a data visualization library.

Make sure that `Node.js` is installed on your local machine. Binaries, installers, and source tarballs are available at <https://nodejs.org/en/download/>. 

### Installing
Clone this repository into a folder of your choice:
```bash
$ git clone https://github.com/kvinchon/wsf-data.git && cd wsf-data/
```

To load server-side dependencies, run the following command: 
```bash
$ cd api/ && npm install
```

Create a `.env` file in the `api/` folder containing the database connection credentials:
```
DB_HOST=MY_DB_HOST
DB_USER=MY_DB_USER
DB_PASS=MY_DB_PASS
DB_NAME=MY_DB_NAME
```

Start the server by running the following command. By default, the server runs on port `3000`:
```bash
$ npm run start
```

In another terminal window, navigate to the `wsf-data/` folder. To load client-side dependencies, run the following command:
```bash
$ cd front/ && npm install
```

Start the client by running the following command. By default, the client runs on port `8080`:
```bash
$ npm run serve
```

## API Documentation
Documentation for the latest Current release is available at <http://localhost:3000/documentation>.

## Glitches and future improvements
The current version does not contain any major glitches, only at the level of the responsive which has not been managed on all components. 

For the next version, the implementation of a calculation model to measure the reliability of maintenance forecasts is planned, as well as the management of connected users with rights management according to user profile. In addition, it is planned to implement a chat as an exchange platform between consultants, maintenance and customers. Finally, the addition of filters on the columns of the tables as well as a page dedicated to the settings is also to be expected in a future version.

## Static data

All data is managed dynamically, with the exception of the logged-in user (advisor). The data comes either from the original tables or from added tables such as users, interventions or notifications.

## Authors
* **Kevin Vinchon** - *Initial work* - [kvinchon](https://github.com/kvinchon)
