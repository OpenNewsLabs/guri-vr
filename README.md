
# Guri VR

Code for [GuriVR.com](https://gurivr.com)

## Requirements

- Mongodb
- Node.js >= v4

## Installation

- `$ cp config.sample.json config.json`
- Adapt the configuration to your environment
- `$ npm install`
- `$ npm start`

## Frontend Development

- `$ cd client`
- `$ cp config.sample.json config.json`
- `$ npm install`
- `$ npm start`

### Asset manager on localhost

While developing on localhost, assets won't work on `localhost:port`, what I do in this case is adding an entry on `/etc/hosts` pointing `127.0.0.1       local.host`.

Then use `local.host` instead of `localhost` and it will (hopefully 🙉) work.

## License

MIT (see LICENSE.MD)
