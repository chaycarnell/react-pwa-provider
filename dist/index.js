"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PwaProvider = exports.usePWA = exports.PwaContext = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireWildcard(require("react"));

var pushServerPublicKey = process.env.VAPID_PUBLIC ? process.env.VAPID_PUBLIC : console.error('No environment variable set for VAPID_PUBLIC');
/**
 * checks if service workers are supported by your browser
 */

var isSwSupported = function isSwSupported() {
  return !!window.navigator.serviceWorker;
};
/**
 * checks if Push notification and service workers are supported by your browser
 */


var isPushSupported = function isPushSupported() {
  return isSwSupported() && 'PushManager' in window;
};
/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */


var requestPermission = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Notification.requestPermission();

          case 3:
            return _context.abrupt("return", _context.sent);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", false);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));

  return function requestPermission() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Register service worker
 */


var registerServiceWorker = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return navigator.serviceWorker.register('sw.js');

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function registerServiceWorker() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * using the registered service worker creates a push notification subscription and returns it
 */


var newSubscription = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var serviceWorker;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return navigator.serviceWorker.ready;

          case 2:
            serviceWorker = _context3.sent;
            _context3.next = 5;
            return serviceWorker.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: pushServerPublicKey
            });

          case 5:
            return _context3.abrupt("return", _context3.sent);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function newSubscription() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * returns the subscription if present or nothing
 */


var getSubscription = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var serviceWorker;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return navigator.serviceWorker.ready;

          case 2:
            serviceWorker = _context4.sent;
            _context4.next = 5;
            return serviceWorker.pushManager.getSubscription();

          case 5:
            return _context4.abrupt("return", _context4.sent);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getSubscription() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Unsubscribes from the current subscription
 */


var unsubscribe = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var subscription;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getSubscription();

          case 2:
            subscription = _context5.sent;
            _context5.next = 5;
            return subscription.unsubscribe().then(function (success) {
              return success;
            })["catch"](function () {
              return false;
            });

          case 5:
            return _context5.abrupt("return", _context5.sent);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function unsubscribe() {
    return _ref5.apply(this, arguments);
  };
}(); //Check browser compatability


var swSupported = isSwSupported();
var pushSupported = isPushSupported();

var PwaContext = _react["default"].createContext();

exports.PwaContext = PwaContext;

var usePWA = function usePWA() {
  return (0, _react.useContext)(PwaContext);
};

exports.usePWA = usePWA;

var PwaProvider = function PwaProvider(_ref6) {
  var children = _ref6.children;

  var _useState = (0, _react.useState)(pushSupported && Notification.permission),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      pushConsent = _useState2[0],
      setPushConsent = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      userPushSubscription = _useState4[0],
      setUserPushSubscription = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      hasUpdate = _useState6[0],
      setHasUpdate = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      installEvent = _useState8[0],
      setInstallEvent = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
      canInstall = _useState10[0],
      setCanInstall = _useState10[1];

  var _useState11 = (0, _react.useState)(null),
      _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
      error = _useState12[0],
      setError = _useState12[1];

  var _useState13 = (0, _react.useState)(false),
      _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
      loading = _useState14[0],
      setLoading = _useState14[1];

  var checkCanInstall = function checkCanInstall() {
    if (swSupported && !window.matchMedia('(display-mode: standalone)').matches && installEvent) return setCanInstall(true);
    return setCanInstall(false);
  };

  (0, _react.useEffect)(function () {
    // Intercept install prompt event for later reference
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      setInstallEvent(e);
    }); // Register service worker on app load

    registerServiceWorker().then(function (reg) {
      // Add an update found handler for later reference
      reg.addEventListener('updatefound', function () {
        var newWorker = reg.installing;
        newWorker.addEventListener('statechange', function () {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) setHasUpdate(newWorker);
        });
      });
    });
  }, []); // Get user push subscription if push is supported

  (0, _react.useEffect)(function () {
    if (pushSupported) {
      var getCurrentSubscription = /*#__PURE__*/function () {
        var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
          var existingSubscription;
          return _regenerator["default"].wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return getSubscription();

                case 2:
                  existingSubscription = _context6.sent;
                  setUserPushSubscription(existingSubscription);

                case 4:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function getCurrentSubscription() {
          return _ref7.apply(this, arguments);
        };
      }();

      getCurrentSubscription();
    }
  }, [pushSupported]); // Update install eligibility when installEvent changes

  (0, _react.useEffect)(function () {
    checkCanInstall();
  }, [installEvent]);
  /**
   * Request permissions for push notifications
   */

  var onAskPushPermission = /*#__PURE__*/function () {
    var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              setLoading(true);
              setError(false); // Prompt for consent to receive push notifications

              _context7.next = 4;
              return requestPermission().then(function (consent) {
                setPushConsent(consent);
                if (!pushSupported) setError({
                  name: 'Not supported',
                  message: 'Your device does not support push notifications'
                });
                if (consent !== 'granted') setError({
                  name: 'Consent denied',
                  message: 'You denied to receive notifications'
                });
                setLoading(false);
                return consent === 'granted';
              });

            case 4:
              return _context7.abrupt("return", _context7.sent);

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function onAskPushPermission() {
      return _ref8.apply(this, arguments);
    };
  }();
  /**
   * Handle a new subscription to push notifications
   */


  var onSubscribePush = /*#__PURE__*/function () {
    var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              setLoading(true);
              setError(false); // Generate a new push manager subscription

              _context8.next = 4;
              return newSubscription().then(function (subscription) {
                setUserPushSubscription(subscription);
                setLoading(false);
                return subscription;
              })["catch"](function (err) {
                setError(err);
                setLoading(false);
              });

            case 4:
              return _context8.abrupt("return", _context8.sent);

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function onSubscribePush() {
      return _ref9.apply(this, arguments);
    };
  }();
  /**
   * Handle unsubscribing to notifications from push manager
   */


  var onPushUnsubscribe = /*#__PURE__*/function () {
    var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              setLoading(true);
              setError(false); // Clear subscription from push manager

              _context9.next = 4;
              return unsubscribe().then(function (success) {
                success && setUserPushSubscription(null);
                setLoading(false);
                return success;
              })["catch"](function (err) {
                setError(err);
                setLoading(false);
              });

            case 4:
              return _context9.abrupt("return", _context9.sent);

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function onPushUnsubscribe() {
      return _ref10.apply(this, arguments);
    };
  }();
  /**
   * Handle installation of app to device
   */


  var onInstall = function onInstall() {
    installEvent.prompt();
    installEvent.userChoice.then(function (res) {
      // Reload if accepted to update install eligibility
      // This is due to an issue where 'beforeinstallprompt' is still fired
      // even when the app is already installed
      if (res.outcome === 'accepted') {
        setInstallEvent(null);
        checkCanInstall();
        location.reload();
      }
    });
  };
  /**
   * Handle user prompted update of application when service worker has been updated
   */


  var onUpdate = function onUpdate() {
    var refreshing; // Post message to service worker to skip waiting to activate the new service worker

    hasUpdate.postMessage({
      action: 'skipWaiting'
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      refreshing = true; // Refresh page to get updated content and update cache

      location.reload();
    });
  };

  return /*#__PURE__*/_react["default"].createElement(PwaContext.Provider, {
    value: {
      swSupported: swSupported,
      pushSupported: pushSupported,
      pushConsent: pushConsent,
      hasUpdate: hasUpdate,
      canInstall: canInstall,
      userPushSubscription: userPushSubscription,
      error: error,
      loading: loading,
      onAskPushPermission: onAskPushPermission,
      onSubscribePush: onSubscribePush,
      onPushUnsubscribe: onPushUnsubscribe,
      onInstall: onInstall,
      onUpdate: onUpdate
    }
  }, children);
};

exports.PwaProvider = PwaProvider;