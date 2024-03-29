# Syncromatics Track API JavaScript Client

This is the JavaScript client for accessing the [Syncromatics Track API][track-api-docs].

![Build Status](https://github.com/syncromatics/syncromatics-track-api/workflows/Build%20and%20Publish%20CI/badge.svg?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Installation

`npm install syncromatics-track-api`

## Quick start guide

```javascript
import Track from 'syncromatics-track-api';

const api = new Track();
api.logIn({ apiKey: 'my API key' });

api.customer('SYNC').vehicles()
  .withQuery('012345')
  .getPage()
  .then(vehicles => /* work with vehicles */);
```

You can also log in with a username and password or a previously-generated JWT token.  See the
[logIn documentation][login-docs] for details.

## Documentation

Generated documentation is available on the [project page][project-page].  You can also find example
usages in the [src/examples directory][src-examples].

## Development

Versioning:  `npm version [0.0.xx-development]`
Publishing: `npm publish`

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for our guide to contributing and code of conduct.

[project-page]: http://syncromatics.github.io/syncromatics-track-api
[login-docs]: http://syncromatics.github.io/syncromatics-track-api#tracklogin
[track-api-docs]: http://docs.syncromaticstrackapi.apiary.io
[src-examples]: https://github.com/syncromatics/syncromatics-track-api/tree/master/src/examples
