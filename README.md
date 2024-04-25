# @haensl/google-analytics

Google Analytics 4 JavaScript abstraction for [`ga4`](https://developers.google.com/analytics/devguides/collection/ga4) (gtag) and [`measurement protocol`](https://developers.google.com/analytics/devguides/collection/protocol/ga4) (API).

[![NPM](https://nodei.co/npm/@haensl%2Fgoogle-analytics.png?downloads=true)](https://nodei.co/npm/@haensl%2Fgoogle-analytics/)

[![npm version](https://badge.fury.io/js/@haensl%2Fgoogle-analytics.svg)](http://badge.fury.io/js/@haensl%2Fgoogle-analytics)

[![CircleCI](https://circleci.com/gh/haensl/google-analytics.svg?style=svg)](https://circleci.com/gh/haensl/google-analytics)

`@haensl/google-analytics` is build with different runtime platforms (browser vs. Node.js) in mind:


**On the client:**

Use [`window.gtag`](https://support.google.com/analytics/answer/9304153#add-tag) (default): `@haensl/google-analytics`

`import { init, event } from '@haensl/google-analytics'`;

**On the server:**

Use [measurement protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4): `@haensl/google-analytics/measurement-protocol`

`import { init, event } from '@haensl/google-analytics/measurement-protocol'`;

**Attention:** The measurement protocol abstraction requires a [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) implementation to work, e.g. [`node-fetch`](https://www.npmjs.com/package/node-fetch), [`cross-fetch`](https://www.npmjs.com/package/cross-fetch), or similar. See [`init(config)`](#measurement_protocol/init).


## Installation

### Via `npm`

```bash
$ npm install -S @haensl/google-analytics
```

### Via `yarn`

```bash
$ yarn add @haensl/google-analytics
```


## Usage

Client/tag and measurement protocol offer similar methods, but differ in initialization and dependencies.

* [gtag](#tag)
  * [`init(confg)`](#tag/init): Initialize the gtag module.
  * [`install`](#tag/install): Installs gtag stubs on `window`.
  * [`consent(granted)`](#tag/consent): Consent to tracking.
  * [`event(data)`](#tag/event): Track an event.
  * [`exception(data)`](#tag/exception): Track an exception.
  * [`pageView(data)`](#tag/pageview): Track a page view.
  * [`setUserId({ id })`](#tag/user_id): Set the user id.
  * [`setUserProperty({ name, value })`](#tag/user_property)

* [Measurement protocol](#measurement_protocol)
  * [`init(confg)`](#measurement_protocol/init): Initialize the measurement protocol module.
  * [`clientId(cookies)`](#measurement_protocol/clientid): Get a client id.
  * [`async event(data)`](#measurement_protocol/event): Track an event.
  * [`async exception(data)`](#measurement_protocol/exception): Track an exception.
  * [`async pageView(data)`](#measurement_protocol/pageview): Track a page view.
  * [`async setUserId({ id })`](#measurement_protocol/user_id): Set the user id.
  * [`async setUserProperty({ name, value })`](#measurement_protocol/user_property)

### gtag (client) <a name="tag"></a>

`@haensl/google-analytics`

**The tag implementation relies on the existence of `window.gtag`. Please ensure that your page [`loads the Google Analytics 4 tag`](https://support.google.com/analytics/answer/9304153#add-tag&zippy=%2Cweb), e.g. by including a `<script src="...">` to fetch `gtag.js` or via a component like [`@haensl/next-google-analytics`](https://github.com/haensl/next-google-analytics)**

#### `init(config)` <a name="tag/init"></a>

`import { init } from '@haensl/google-analytics'`

Initializes the tracking module. You only need to call this once, e.g. when your app boots. This also calls [`install()`](#tag/install).

Tracking consent is defaulted to `false` for EU region. See [`consent()`](#tag/consent).


```javascript
init({
  /**
   * Google measurement id.
   *
   * E.g. 'G-123ABC456D'
   */
  measurementId,

  /**
   * Run gtag in debug mode.
   */
  debug = false,

  /**
   * Anonymize IP setting.
   */
  anonymizeIp = true,

  /**
   * Automatically send page views.
   */
  sendPageViews = false,

  /**
   * Whether the user has given her consent to track.
   */
  trackingConsent = false
})
```

#### `install()` <a name="tag/install"></a>

`import { install } from '@haensl/google-analytics'`

Installs `window.dataLayer` and `window.gtag` stubs, i.e. [Google Docs](https://developers.google.com/tag-platform/tag-manager/datalayer#installation). Is called on [`init()`](#tag/init).

#### `consent(granted = false)` <a name="tag/consent"></a>

`import { consent } from '@haensl/google-analytics'`

Grant or deny tracking consent.

Granting/Denying tracking consent toggles:

* [Google signals](https://support.google.com/analytics/answer/9445345#zippy=%2Cin-this-article)
* [Ad personalization signals](https://support.google.com/google-ads/answer/7548399)
* [Restricted data processing](https://support.google.com/google-ads/answer/9606827?sjid=3120074697094987464-EU#zippy=%2Cedit-your-google-tag-to-disable-ad-personalization-signals%2Cedit-your-google-tag-to-enable-restricted-data-processing)
* [Ads data redaction](https://developers.google.com/tag-platform/devguides/consent#redact_ads_data)
* [Ad storage](https://developers.google.com/tag-platform/gtagjs/reference#consent)
* [Analytics storage](https://developers.google.com/tag-platform/gtagjs/reference#consent)

For more information on consent mode, see [Google's docs](https://developers.google.com/tag-platform/devguides/privacy).

```javascript
consent(granted = false)
```

Example: User grants consent:

```javascript
import { consent } from '@haensl/google-analytics';

// Consent button click handler.
const onConsentTap = () => {
  consent(true);
};

// Attach to consent button.
button.onClick = onConsentTap;
```

#### `event({ name, params })` <a name="tag/event"></a>

`import { event } from '@haensl/google-analytics'`

Track an event.

```javascript
event({
  /**
   * Event name. String.
   */
  name,

  /**
   * Event parameters.
   *
   * An object mapping names to strings or numbers.
   */
  params
})
```

Example: Sign up event

```
import { event } from '@haensl/google-analytics';

// track a sign up from the footer form.
event({
  name: 'sign_up',
  params: {
    form: 'footer'
  }
});
```

#### `exception({ description, fatal })` <a name="tag/exception"></a>

`import { exception } from '@haensl/google-analytics'`

Tracks an exception. Alias for [`event({ name: 'exception', ... })`](#tag/event).

```javascript
exception({
  /**
   * Error description. String.
   */
  description,

  /**
   * Whether or not the error is fatal. Boolean.
   */
  fatal = false
})
```

#### `pageView({ location, title })` <a name="tag/pageview"></a>

`import { pageView } from '@haensl/google-analytics'`

Tracks a page view. Alias for [`event({ name: 'page_view', ... })`](#tag/event).

```javascript
pageView({
  /**
   * Page title. String.
   */
  title,

  /**
   * Page location. String.
   */
  location
})
```

#### `setUserId({ id })` <a name="tag/user_id"></a>

`import { setUserId } from '@haensl/google-analytics'`

Set the [user id](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#user_id).

```javascript
setUserId({
  /**
   * A user id. String.
   */
  id
})
```


#### `setUserProperty({ name, value })` <a name="tag/user_property"></a>

`import { setUserProperty } from '@haensl/google-analytics'`

Set a [user property](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#user_properties) (formerly known as dimension).

```javascript
setUserProperty({
  /**
   * User property name. String.
   */
  name,

  /**
   * User property value. String or number.
   */
  value
})
```

Example: track the users color scheme:

```javascript
import { setUserProperty } from '@haensl/google-analytics';

setUserProperty({
 name: 'appearance',
 value: 'dark'
});
```


### Measurement protocol <a name="measurement_protocol"></a>

`@haensl/google-analytics/measurement-protocol`

The measurement protocol implementation requires an [API secret](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#api_secret)  as well as a [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) implementation at initialization.

#### `init(config)` <a name="measurement_protocol/init"></a>

`import { init } from '@haensl/google-analytics/measurement-protocol'`

Initialize the measurement protocol module.


```javascript
init({
  /**
   * Fetch implementation. Function.
   */
  fetch,

  /**
   * Google measurement id. String.
   *
   * E.g. 'G-123ABC456D'
   */
  measurementId,

  /**
   * Google measurement API secret. String.
   */
  measurementSecret,

  /**
   * Measurement API URL. String.
   */
  measurementUrl = 'https://www.google-analytics.com/mp/collect'
})
```

Example

```javascript
import fetch from 'node-fetch';
import { init } from '@haensl/google-analytics/measurement-protocol';

init({
  fetch,
  measurementId: 'G-123ABC456D',
  measurementSecret: 'super-secret'
});
```

#### `clientId(cookies)`<a name="measurement_protocol/clientid"></a>

`import { clientId } from '@haensl/google-analytics/measurement-protocol'`


Tries to parse the [Google Analytics client id](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#sending_events_2) from the given cookies object.

Generates a client id from timestamps if not found in cookies.

```javascript
clientId(cookies = {}) => String
```

Example: Usage with [`next-cookies`](https://www.npmjs.com/package/next-cookies)

```javascript
import { cookies } from 'next-cookies';
import { clientId, pageView } from '@haensl/google-analytics/measurement-protocol';


export const getServerSideProps = async (ctx) => {
  const requestCookies = cookies(ctx);
  const requestClientId = clientId(requestCookies);

  pageView({
    title: 'my serverside page',
    clientId: requestClientId,
    location: ctx.req.url
  });
};
```


#### `async event({ name, params, clientId })` <a name="measurement_protocol/event"></a>

`import { event } from '@haensl/google-analytics/measurement-protocol'`

Track an event.

```javascript
async event({
  /**
   * Event name. String.
   */
  name,

  /**
   * Event parameters.
   *
   * An object mapping names to strings or numbers.
   */
  params,

  /**
   * The client id. String.
   */
  clientId
}) => Promise
```

Example: Sign up event

```javascript
import { event, clientId } from '@haensl/google-analytics/measurement-protocol';

// track a sign up from the footer form.
await event({
  name: 'sign_up',
  params: {
    form: 'footer'
  },
  // Extract client id from context
  clientId: clientId(ctx.cookies)
});
```

#### `async exception({ description, fatal clientId })` <a name="measurement_protocol/exception"></a>

`import { exception } from '@haensl/google-analytics/measurement-protocol'`

Tracks an exception. Alias for [`event({ name: 'exception', ... })`](#tag/event).

```javascript
async exception({
  /**
   * Error description. String.
   */
  description,

  /**
   * Whether or not the error is fatal. Boolean.
   */
  fatal = false,

  /**
   * The client id. String.
   */
  clientId
}) => Promise
```

#### `async pageView({ location, title, clientId })` <a name="measurement_protocol/pageview"></a>

`import { pageView } from '@haensl/google-analytics/measurement-protocol'`

Tracks a page view. Alias for [`event({ name: 'page_view', ... })`](#tag/event).

```javascript
async pageView({
  /**
   * Page title. String.
   */
  title,

  /**
   * Page location. String.
   */
  location,

  /**
   * The client id. String.
   */
  clientId
}) => Promise
```

#### `async setUserId({ id, clientId })` <a name="measurement_protocol/user_id"></a>

`import { setUserId } from '@haensl/google-analytics/measurement-protocol'`

Set the [user id](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#user_id).

```javascript
async setUserId({
  /**
   * A user id. String.
   */
  id,

  /**
   * The client id. String.
   */
  clientId
}) => Promise
```

#### `async setUserProperty({ name, value, clientId })` <a name="measurement_protocol/user_property"></a>

`import { setUserProperty } from '@haensl/google-analytics/measurement-protocol'`

Set a [user property](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#user_properties).

```javascript
async setUserProperty({
  /**
   * User property name. String.
   */
  name,

  /**
   * User property value. String or number.
   */
  value,

  /**
   * The client id. String.
   */
  clientId
}) => Promsie
```

Example: track the users color scheme:

```javascript
import { clientId, setUserProperty } from '@haensl/google-analytics/measurement-protocol';

await setUserProperty({
 name: 'appearance',
 value: 'dark',
 // Extract client id from context.
 clientId: clientId(ctx.cookies)
});
```


## [Changelog](CHANGELOG.md)


## [License](LICENSE)


