import ga from '../measurement-protocol';

describe('@haensl/google-analytics/measurement-protocol', () => {
  it('exposes an init function', () => {
    expect(typeof ga.init)
      .toEqual('function');
  });

  it('exposes an event function', () => {
    expect(typeof ga.event)
      .toEqual('function');
  });
});
