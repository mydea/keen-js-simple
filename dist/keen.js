(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["keen"] = factory();
	else
		root["keen"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * This library allows sending data to Keen.IO.
	 *
	 * @class Keen
	 * @public
	 */
	var Keen = function Keen() {
	
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
	  var setOptions = function setOptions(newOptions) {
	    if ((typeof newOptions === 'undefined' ? 'undefined' : _typeof(newOptions)) !== 'object') {
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
	  var sendEvent = function sendEvent(event, plainData) {
	    if (!plainData) {
	      plainData = {};
	    }
	    if ((typeof plainData === 'undefined' ? 'undefined' : _typeof(plainData)) !== 'object') {
	      throw new Error('data must be an object');
	    }
	
	    var data = _prepareEventData(plainData);
	
	    var queue = _eventQueue;
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
	  var getQueue = function getQueue() {
	    return _eventQueue;
	  };
	
	  /**
	   * Clear all queued events.
	   *
	   * @method clearQueu
	   * @public
	   */
	  var clearQueue = function clearQueue() {
	    _eventQueue = {};
	  };
	
	  /**
	   * Create a new keen instance.
	   *
	   * @method createInstance
	   * @return {Keen}
	   * @public
	   */
	  var createInstance = function createInstance() {
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
	  var _post = function _post(data, options) {
	    var baseUrl = options.baseURL;
	    var projectId = options.projectId;
	    var writeKey = options.writeKey;
	
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
	  };
	
	  /**
	   * This function merges the data from mergeData() into event data.
	   *
	   * @method _prepareEventData
	   * @param {Object} data The object to merge data into. This will be mutated!
	   * @return {Object} The object with the data merged into it
	   * @private
	   */
	  var _prepareEventData = function _prepareEventData(data) {
	    var mergeData = options.mergeData();
	
	    for (var i in mergeData) {
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
	  var _debounceTimer = function _debounceTimer() {
	    var queueTime = options.queueTime;
	    var timer = _queueTimer;
	
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
	  var _processQueue = function _processQueue() {
	    var data = _eventQueue;
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
	  var options = {
	    projectId: null,
	    writeKey: null,
	    queueTime: 5000,
	    baseURL: 'https://api.keen.io/3.0/projects',
	    post: _post,
	    mergeData: function mergeData() {
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
	  var _eventQueue = {};
	
	  /**
	   * This is the reference to the queue timer, which is used so it can be canceled.
	   *
	   * @property _queueTimer
	   * @type {null|Timeout}
	   * @private
	   */
	  var _queueTimer = null;
	
	  return {
	    setOptions: setOptions,
	    options: options,
	    sendEvent: sendEvent,
	    getQueue: getQueue,
	    clearQueue: clearQueue,
	    createInstance: createInstance
	  };
	};
	
	var keen = new Keen();
	
	exports.default = keen;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=keen.js.map