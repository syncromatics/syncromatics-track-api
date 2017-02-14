# Syncromatics Track API JavaScript Client

This is the JavaScript client for accessing the [Syncromatics Track API][track-api-docs]. 

## Installation

`npm install syncromatics-track-api`

## Quick start guide

```javascript
import Track from 'syncromatics-track-api';

const api = new Track({ apiKey: 'my API key' });

api.customer('SYNC').vehicles()
  .withQuery('01234')
  .getPage()
  .then(vehicles => /* work with vehicles */);
```

## Documentation

Documentation is available on the [project page][project-page]

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for our guide to contributing and code of conduct.


[project-page]: http://syncromatics.github.io/syncromatics-track-api
[track-api-docs]: http://docs.syncromaticstrackapi.apiary.io


