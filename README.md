# keen-js-simple

A simple, super lightweight (3kb) & performance optimized library to track data with [Keen.IO](https://keen.io).

[![Travis build status](http://img.shields.io/travis/mydea/keen-js-simple.svg?style=flat)](https://travis-ci.org/mydea/keen-js-simple)

## Difference to keen-js

Keen.IO provides a full-featured JavaScript SDK, [keen-js](https://github.com/keen/keen-js), which can be used to track and query data from the Keen.IO API. However, this has two main disadvantages:

1. Because it is that full-featured, it is quite heavy weight (34kb minified for the tracking-only version).
2. It sends one request for every event that is tracked. This can lead to many simultaneous Ajax requests, which is bad for performance.

This small library provides a simple way to send events to Keen.IO, which will automatically be debounced and combined to reduce the number of HTTP requests. 

## Installation

You can install keen-js-simple via bower (or npm):

```bash
bower install keen-js-simple --save
```

Then, you can simply include it in your HTML:

```html
<script src="bower_components/keen-js-simple/dist/keen.min.js"></script>
```

Or, if you are using modules, you can include it:

```js
import keen from './../bower_components/keen-js-simple/dist/keen.min.js';
```

For Ember.js, see [ember-keen](https://github.com/mydea/ember-keen) on which this library is based.

## Usage

In the simplest form, you will need to include the script, and then do minimal configuration:

```html
<script>
  keen.setOptions({
    projectId: 'MY-PROJECT-ID',
    writeKey: 'MY-WRITE-KEY'
  });
</script>
```

Then, you'll be able to send events like this:

```js
keen.sendEvent('simple-event');
keen.sendEvent('event-name', {
  property1: 1
});
```

These two events will then be sent in one payload.
By default, it will wait for 5 seconds until sending data. This can be configured via `keen.setOptions({ queueTime: 4000 })`.

By default, this will try to send the data via jQuery's `$.post()` method. 
However, this can easily be overridden in the options (see below), removing the dependency on jQuery.

## Configuration

There are a few other configuration options. Note that you can set one or more options at the same time with `keen.setOptions()`.

```js
keen.setOptions({
  projectId: null,
  writeKey: null,
  queueTime: 5000, // Time in ms to wait before sending
  baseURL: 'https://api.keen.io/3.0/projects',
  
  post: function(data, options) {
    // Actually send the (combined) data to the API
    // By default, this uses $.post
  },
  
  mergeData: function(data, options) {
    // This should return an object which will be merged with the data to send
    // This can be used to add things like the user agent to all events
    // By default, we set the timestamp property to now, 
    // otherwise the timestamps will be set to the time of the API request
  
    return {
      keen: {
        timestamp: new Date()
      }
    };
  }
});
```

You can set the `post` option if you do not want to use jQuery to make the Ajax request. The default implementation is:

```js
keen.setOptions({
  post: function(data, options) {
    var baseUrl = options.baseURL;
    var projectId = options.projectId;
    var writeKey = options.writeKey;
     
    var url = baseUrl + '/' + projectId + '/events?api_key=' + writeKey;
     
    return $.ajax({
      type: 'POST',
      headers: {
       Authorization: writeKey
      },
      url: url,
      contentType: 'application/json',
      crossDomain: true,
      xhrFields: {
       withCredentials: false
      },
      data: JSON.stringify(data),
      dataType: 'json'
    });
  }
});
```

The `mergeData` function can be overridden to append global data to every event. For example, you might want to add user agent information to all events:

```js
keen.setOptions({
  mergeData: function(data, options) {
      return {
        keen: {
          timestamp: new Date()
        },
        userAgent: window.navigator.userAgent
      };
    }
})
```

It is recommended to always include the `keen.timestamp` portion, as otherwise the timestamps in keen will be from the time when the events are received by the API, not when they where triggered on the client.

## Methods

There are only a few methods available on the keen-class:

```js
keen.setOptions({}); // See configuration section
keen.sendEvent('event-name', {}); // Data is optional
keen.getQueue(); // Get all queued events
keen.clearQueue(); // Remove all queued events
```

## Changelog

For changes, see the [Changelog](CHANGELOG.md)

## Copyright
Copyright © 2017 Francesco Novy | MIT license
