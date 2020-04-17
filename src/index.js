import React, { useState, useEffect, useContext } from 'react';

const pushServerPublicKey = process.env.VAPID_PUBLIC
  ? process.env.VAPID_PUBLIC
  : console.error('No environment variable set for VAPID_PUBLIC');

/**
 * checks if service workers are supported by your browser
 */
const isSwSupported = () => !!window.navigator.serviceWorker;

/**
 * checks if Push notification and service workers are supported by your browser
 */
const isPushSupported = () => isSwSupported() && 'PushManager' in window;

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
const requestPermission = async () => {
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return false;
  }
};

/**
 * Register service worker
 */
const registerServiceWorker = async () =>
  await navigator.serviceWorker.register('sw.js');

/**
 * using the registered service worker creates a push notification subscription and returns it
 */
const newSubscription = async () => {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: pushServerPublicKey
  });
};

/**
 * returns the subscription if present or nothing
 */
const getSubscription = async () => {
  //wait for service worker to be ready
  const serviceWorker = await navigator.serviceWorker.ready;
  //Get the current push manager subscription
  return await serviceWorker.pushManager.getSubscription();
};

/**
 * Unsubscribes from the current subscription
 */
const unsubscribe = async () => {
  // Get the current subscription
  const subscription = await getSubscription();
  // Terminate the subscription and return the status
  return await subscription
    .unsubscribe()
    .then(success => success)
    .catch(() => false);
};

//Check browser compatability
const swSupported = isSwSupported();
const pushSupported = isPushSupported();

export const PwaContext = React.createContext();
export const usePWA = () => useContext(PwaContext);
export const PwaProvider = ({ children }) => {
  const [pushConsent, setPushConsent] = useState(
    pushSupported && Notification.permission
  );
  const [userPushSubscription, setUserPushSubscription] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(null);
  const [installEvent, setInstallEvent] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkCanInstall = () => {
    if (
      swSupported &&
      !window.matchMedia('(display-mode: standalone)').matches &&
      installEvent
    )
      return setCanInstall(true);
    return setCanInstall(false);
  };

  useEffect(() => {
    // Intercept install prompt event for later reference
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      setInstallEvent(e);
    });
    // Register service worker on app load
    registerServiceWorker().then(reg => {
      // Add an update found handler for later reference
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          )
            setHasUpdate(newWorker);
        });
      });
    });
  }, []);

  // Get user push subscription if push is supported
  useEffect(() => {
    if (pushSupported) {
      const getCurrentSubscription = async () => {
        const existingSubscription = await getSubscription();
        setUserPushSubscription(existingSubscription);
      };
      getCurrentSubscription();
    }
  }, [pushSupported]);

  // Update install eligibility when installEvent changes
  useEffect(() => {
    checkCanInstall();
  }, [installEvent]);

  /**
   * Request permissions for push notifications
   */
  const onAskPushPermission = async () => {
    setLoading(true);
    setError(false);
    // Prompt for consent to receive push notifications
    return await requestPermission().then(consent => {
      setPushConsent(consent);
      if (!pushSupported)
        setError({
          name: 'Not supported',
          message: 'Your device does not support push notifications'
        });
      if (consent !== 'granted')
        setError({
          name: 'Consent denied',
          message: 'You denied to receive notifications'
        });
      setLoading(false);
      return consent === 'granted';
    });
  };

  /**
   * Handle a new subscription to push notifications
   */
  const onSubscribePush = async () => {
    setLoading(true);
    setError(false);
    // Generate a new push manager subscription
    return await newSubscription()
      .then(subscription => {
        setUserPushSubscription(subscription);
        setLoading(false);
        return subscription;
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  /**
   * Handle unsubscribing to notifications from push manager
   */
  const onPushUnsubscribe = async () => {
    setLoading(true);
    setError(false);
    // Clear subscription from push manager
    return await unsubscribe()
      .then(success => {
        success && setUserPushSubscription(null);
        setLoading(false);
        return success;
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  /**
   * Handle installation of app to device
   */
  const onInstall = () => {
    installEvent.prompt();
    installEvent.userChoice.then(res => {
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
  const onUpdate = () => {
    let refreshing;
    // Post message to service worker to skip waiting to activate the new service worker
    hasUpdate.postMessage({ action: 'skipWaiting' });
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (refreshing) return;
      refreshing = true;
      // Refresh page to get updated content and update cache
      location.reload();
    });
  };

  return <PwaContext.Provider
      value={{
        swSupported,
        pushSupported,
        pushConsent,
        hasUpdate,
        canInstall,
        userPushSubscription,
        error,
        loading,
        onAskPushPermission,
        onSubscribePush,
        onPushUnsubscribe,
        onInstall,
        onUpdate
      }}
    >
      {children}
    </PwaContext.Provider>
};
