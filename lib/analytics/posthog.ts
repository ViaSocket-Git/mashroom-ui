// PostHog analytics utilities
import posthog from 'posthog-js'

export { posthog };

// Track page views
export const trackPageView = (path: string) => {
  if (posthog) {
    posthog.capture('$pageview', { $current_url: window.location.origin + path });
  }
};

// Track custom events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (posthog) {
    posthog.capture(eventName, properties);
  }
};

// Identify users
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (posthog) {
    posthog.identify(userId, properties);
  }
};

// Track user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (posthog) {
    posthog.people.set(properties);
  }
};

// Reset user data on logout
export const resetUser = () => {
  if (posthog) {
    posthog.reset();
  }
};
