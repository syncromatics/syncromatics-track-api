import Page from './Page';

class PagedContext {
  constructor(client, params = {}) {
    this.client = client;
    this.params = {
      page: 1,
      perPage: 10,
      ...params,
    };
  }

  withPage(page) {
    this.params.page = page;
    return this;
  }

  withPerPage(perPage) {
    this.params.perPage = perPage;
    return this;
  }

  page(Type, uri, params = {}) {
    const fromObject = o => new Type(this.client, o);
    return new Page(this.client, fromObject, uri, { ...this.params, ...params }).fetch();
  }
}

export default PagedContext;
