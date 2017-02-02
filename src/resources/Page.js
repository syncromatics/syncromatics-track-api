import parseLinkHeader from 'parse-link-header';

class Page {
  constructor(client, selector, uri, params) {
    this.list = [];
    this.links = {};
    this.client = client;
    this.selector = selector;
    this.uri = uri;
    this.params = {
      page: 1,
      perPage: 10,
      ...params,
    };
  }

  fetch() {
    return this.client.authenticated
      .then(() => this.client.get(this.uri, this.params))
      .then((response) => {
        this.links = parseLinkHeader(response.headers.get('Link'));
        return response.json();
      })
      .then((list) => {
        this.list = list.map(this.selector);
        return this;
      });
  }

  hasNext() {
    return !!this.links.next;
  }

  next() {
    if (!this.hasNext()) {
      return Promise.reject(new Error('No more pages available'));
    }

    this.uri = this.links.next.url;
    this.params = {
      ...this.params,
      ...{
        ...this.links.next,
        // Exclude rel and url
        rel: undefined,
        url: undefined,
      },
    };
    return this.fetch();
  }
}

export default Page;
