const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://2cf2fdfa896bfe19f59ed949097fa06d@o4509346269691904.ingest.us.sentry.io/4509346272509952",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});

Sentry.startSpan({ name: "My Span" }, () => {
  // Optional profiling block
});
