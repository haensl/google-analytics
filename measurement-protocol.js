import { stringify } from 'querystring';
import http from '@haensl/http';

const config = {
  fetch: undefined,
  measurementId: undefined,
  measurementSecret: undefined,
  measurementUrl: 'https://www.google-analytics.com/mp/collect'
};

const getUrl = () => new URL(`${config.measurementUrl}?${stringify({
  measurement_id: config.measurementId,
  api_secret: config.measurementSecret
})}`);

/**
 * Tries to parse Google Analytics client id from
 * the cookies object.
 * Generates one from timestamps if no cookie.
 */
export const clientId = (cookies = {}) => {
  const gaCookie = cookies._ga;

  if (gaCookie) {
    const clientIdTest = /\d+\.\d+/.exec(gaCookie);
    if (Array.isArray(clientIdTest) && clientIdTest.length > 0) {
      return clientIdTest[0];
    }
  }

  const pre = Math.round(new Date().getTime() / 1000);
  const post = Math.round(new Date().getTime() / 1000);
  return `${pre}.${post}`;
};

/**
 * Initialize the service with measurement ID and secret.
 */
export const init = ({
  fetch,
  measurementId,
  measurementSecret,
  measurementUrl
}) => {
  config.measurementId = measurementId;
  config.measurementSecret = measurementSecret;
  config.measurementUrl = measurementUrl;
  config.fetch = fetch;
};

/**
 * Tracks an analytics event via measurement protocol,
 * i.e. via API.
 *
 * @param name the event name.
 *
 * @param params the event parameters.
 *
 * @param clientId the clientId for this event. Generated if not supplied.
 */
export const event = ({
  name,
  params,
  clientId = clientId()
}) => {
  const url = getUrl();

  return config.fetch(url, {
    method: http.methods.post,
    body: JSON.stringify({
      client_id: clientId,
      events: [
        {
          name,
          params
        }
      ]
    })
  });
};

export const setUserProperty = ({
  name,
  value,
  clientId = clientId()
}) => {
  const url = getUrl();

  return config.fetch(url, {
    method: http.methods.post,
    body: JSON.stringify({
      client_id: clientId,
      user_properties: {
        [name]: value
      }
    })
  });
};

export const setUserId = ({
  id,
  clientId = clientId()
}) => {
  const url = getUrl();

  return config.fetch(url, {
    method: http.methods.post,
    body: JSON.stringify({
      user_id: id
    })
  });
};

export const exception = ({
  description,
  fatal,
  clientId = clientId()
}) => {
  return event({
    name: 'exception',
    params: {
      description,
      fatal
    },
    clientId
  });
};

export const pageView = ({
  location,
  title,
  clientId = clientId()
}) => {
  return event({
    name: 'page_view',
    params: {
      page_title: title,
      page_location: location
    },
    clientId
  });
};

export default {
  init,
  clientId,
  event,
  exception,
  pageView,
  setUserId,
  setUserProperty
};
