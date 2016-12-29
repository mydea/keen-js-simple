/**
 * This library allows sending data to Keen.IO.
 *
 * @class Keen
 * @public
 */
const Keen = function() {

  /**
   * Set global options.
   * Only set options will be set, so you can safely set only single options like this:
   *
   * ´´´js
   * keen.setOptions({ queueTime: 4000 });
   * ```
   *
   * @method setOptions
   * @param {Object} newOptions The new options to set
   * @return {Object} The full options object
   * @public
   */
  let setOptions = function(newOptions) {
    if (typeof newOptions !== 'object') {
      return;
    }

    if (newOptions.hasOwnProperty('projectId')) {
      options.projectId = newOptions.projectId;
    }

    if (newOptions.hasOwnProperty('writeKey')) {
      options.writeKey = newOptions.writeKey;
    }

    if (newOptions.hasOwnProperty('post')) {
      if (typeof newOptions.post !== 'function') {
        throw new Error('post needs to be a function!');
      }
      options.post = newOptions.post;
    }

    if (newOptions.hasOwnProperty('baseURL')) {
      options.baseURL = newOptions.baseURL;
    }

    if (newOptions.hasOwnProperty('queueTime')) {
      if (typeof newOptions.queueTime !== 'number') {
        throw new Error('queueTime needs to be a number, representing the ms to wait for other events!');
      }
      options.queueTime = newOptions.queueTime;
    }

    if (newOptions.hasOwnProperty('mergeData')) {
      if (typeof newOptions.mergeData !== 'function') {
        throw new Error('mergeData needs to be a function!');
      }
      options.mergeData = newOptions.mergeData;
    }

    return options;
  };

  /**
   * Send an event to Keen.
   * This will be debounced for the number of ms defined in queueTime.
   *
   * @method sendEvent
   * @param {String} event The name of the event to send
   * @param {Object} plainData The data to attach to the event.
   * @public
   */
  let sendEvent = function(event, plainData) {
    if (!plainData) {
      plainData = {};
    }
    if (typeof plainData !== 'object') {
      throw new Error('data must be an object');
    }

    let data = _prepareEventData(plainData);

    let queue = _eventQueue;
    if (queue.hasOwnProperty(event)) {
      queue[event].push(data);
    } else {
      queue[event] = [data];
    }

    _debounceTimer();
  };

  /**
   * Get the queued events.
   *
   * @method getQueue
   * @return {Object}
   * @public
   */
  let getQueue = function() {
    return _eventQueue;
  };

  /**
   * Clear all queued events.
   *
   * @method clearQueu
   * @public
   */
  let clearQueue = function() {
    _eventQueue = {};
  };

  /**
   * Create a new keen instance.
   *
   * @method createInstance
   * @return {Keen}
   * @public
   */
  let createInstance = function() {
    return new Keen();
  };

  /**
   * The default post function uses jQuery's $.post to send data.
   *
   * @method _post
   * @param {Object} data The full data to send
   * @param {Object} options The options are passed and can be used to build the ajax request
   * @return {jQuery.post}
   * @private
   */
  let _post = function(data, options) {
    let baseUrl = options.baseURL;
    let projectId = options.projectId;
    let writeKey = options.writeKey;

    // Check if all dependencies are loaded && all properties are set
    if (typeof $ === 'undefined') {
      throw new Error('The default post method of keen requires jQuery. You need to either include jQuery, or provide a custom post method.');
    }

    if (!baseUrl) {
      throw new Error('The baseURL of keen is not set correctly.');
    }

    if (!projectId) {
      throw new Error('The projectId of keen is not set correctly.');
    }

    if (!writeKey) {
      throw new Error('The writeKey of keen is not set correctly.');
    }

    let url = baseUrl + '/' + projectId + '/events?api_key=' + writeKey;

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
  };

  /**
   * This function merges the data from mergeData() into event data.
   *
   * @method _prepareEventData
   * @param {Object} data The object to merge data into. This will be mutated!
   * @return {Object} The object with the data merged into it
   * @private
   */
  let _prepareEventData = function(data) {
    let mergeData = options.mergeData();

    for (let i in mergeData) {
      if (mergeData.hasOwnProperty(i)) {
        data[i] = mergeData[i];
      }
    }

    return data;
  };

  /**
   * Debounce the timer to process the queue.
   * This will wait for queueTime ms to actually run the queue.
   * If the function is called again before that time, it will be reset.
   * This means that the queue runs only if no data has been added for the specified time.
   *
   * @method _debounceTimer
   * @private
   */
  let _debounceTimer = function() {
    let queueTime = options.queueTime;
    let timer = _queueTimer;

    if (timer) {
      window.clearTimeout(timer);
    }

    _queueTimer = window.setTimeout(_processQueue, queueTime);
  };

  /**
   * Actually process the queue and send the data.
   *
   * @method _processQueu
   * @private
   */
  let _processQueue = function() {
    let data = _eventQueue;
    options.post(data, options);
    _eventQueue = {};
  };

  /**
   * The keen options.
   * These can be set via keen.setOptions().
   *
   * @property options
   * @type {Object}
   * @protected
   */
  let options = {
    projectId: null,
    writeKey: null,
    queueTime: 5000,
    baseURL: 'https://api.keen.io/3.0/projects',
    post: _post,
    mergeData: function() {
      return {
        keen: {
          timestamp: new Date()
        }
      };
    }
  };

  /**
   * This hols the queued events, keyed by event name.
   *
   * @property _eventQueue
   * @type {Object}
   * @private
   */
  let _eventQueue = {};

  /**
   * This is the reference to the queue timer, which is used so it can be canceled.
   *
   * @property _queueTimer
   * @type {null|Timeout}
   * @private
   */
  let _queueTimer = null;

  return {
    setOptions,
    options,
    sendEvent,
    getQueue,
    clearQueue,
    createInstance
  };
};

const keen = new Keen();

export default keen;
