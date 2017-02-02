# Syncromatics Track API JavaScript Client

This is the JavaScript client for accessing the [Syncromatics Track API][track-api-docs]. 

## Installation

`npm install @syncromatics/track-api`

## Quick start guide

```javascript
import Track from '@syncromatics/track-api';

const client = new Track({ apiKey: 'my API key' });

client.customer('SYNC').routes()
  .withQuery('Blue line')
  .list()
  .then(routes => /* work with routes */);
```

## Documentation

Documentation is available on the [project page][project-page]

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for our guide to contributing and code of conduct.


[project-page]: http://tbd.example.com/docs
[track-api-docs]: http://docs.syncromaticstrackapi.apiary.io


