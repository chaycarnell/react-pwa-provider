# React PWA provider

Creates an easy way of interacting with service-worker funtionality within a React based progressive web application. For example, subscribing to web push notifications, download to device prompting, and update availability prompting.

### Getting Started

Usage:

This package assumes a service worker is available with filename **sw.js**

Environment variable to support push notification subscriptions as public VAPID key expected with name:

```
VAPID_PUBLIC
```

A sample service worker is provided with the package.

First wrap your application with the PWA provider like so:

```javascript
import { PwaProvider } from ‘react-pwa-provider’;

...

const Render = () => {
  return (
    <PwaProvider>
      <App />
    </PwaProvider>
  );
};
```

Then for use within a component:

```javascript
import { usePWA } from ‘react-pwa-provider’;
...
const {
    swSupported,
    pushSupported,
    userPushSubscription,
    onAskPushPermission,
    onSubscribePush,
    onPushUnsubscribe,
    pushConsent,
    canInstall,
    onInstall,
    hasUpdate,
    onUpdate,
    error,
    loading,
  } = usePWA();
```

Basic examples of use:

```javascript
  const handleSubscribe = async () => {
    const subscription = await onSubscribePush();
    // ... Post notification subscription id to backend etc for later use..
  };

  const handleAskPermission = async () => {
    if (pushSupported) {
      // Request push notifications permission, returns a boolean
      const permission = await onAskPushPermission();
      permission && (await handleSubscribe());
    } else {
      // ... handle push unsupported here
    }
  };

  const handleUnsubscribe = async () => {
    const success = await onPushUnsubscribe();
    // ... handle clearing push subscription for user etc
  };

  const handleOnInstall = () => {
    // Prompt the user to install your app if eligible
    canInstall && onInstall()
  };

  const handleCheckUpdate = () => {
    // Check for an update, install if available
    hasUpdate && onUpdate()
  };
```

### Links

[NPM](https://www.npmjs.com/package/react-pwa-provider)

[GitHub](https://github.com/chaycarnell/react-pwa-provider)

### Contact

Any questions contact chaycarnell@gmail.com
