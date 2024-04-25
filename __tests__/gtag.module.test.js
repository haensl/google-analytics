import ga from '../';

describe('@haensl/google-analytics', () => {
  it('exposes an install function', () => {
    expect(typeof ga.install)
      .toEqual('function');
  });

  it('exposes an init function', () => {
    expect(typeof ga.init)
      .toEqual('function');
  });

  it('exposes an event function', () => {
    expect(typeof ga.event)
      .toEqual('function');
  });
});
