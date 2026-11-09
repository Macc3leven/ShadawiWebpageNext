// The Specimen Archive's single Unity instance: started once per visit, paused while nobody is
// watching, and shut down when the visitor leaves the page. Components read its state with
// useUnityViewer (see components/SpecimenViewer) and never talk to Unity directly.
//
// Unity reports everything through window events named "shadawi:<name>"
// (Assets/Plugins/WebGL/ShadawiDisplay.jslib in the Unity project), so its "ready" event, not the
// promise from createUnityInstance, is what says it can take commands.

const BUILD_URL = process.env.NEXT_PUBLIC_UNITY_BUILD_URL || "/unity";
const BUILD_NAME = process.env.NEXT_PUBLIC_UNITY_BUILD_NAME || "WebGL-dev";
// A release build's files end in .gz or .unityweb; a development build's have no extra ending
const BUILD_EXT = process.env.NEXT_PUBLIC_UNITY_BUILD_EXT || "";

// The GameObject that holds SpecimenDisplayWebBridge
const BRIDGE = "DisplayRuntime";

const INITIAL_STATE = Object.freeze({
  status: "idle", // idle | loading | ready | error
  progress: 0, // 0 to 1, while status is "loading"
  error: null,
  specimen: Object.freeze({ address: null, status: "none" }), // none | loading | loaded | failed
  actions: Object.freeze([]), // [{ id, type, looping, allowed }]
  playingId: null,
  map: Object.freeze({ address: "", status: "loaded" }), // address "" is the base stage
});

let state = INITIAL_STATE;
let instance = null;
let canvas = null;
let canvasCount = 0;
let unityReady = false; // the "ready" event arrived
let visible = false; // the viewer is on screen
let wantedSpecimen = null; // the address the visitor last asked for
let bottomInset = 0;
let stopListening = null;
const subscribers = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  subscribers.forEach((notify) => notify());
}

function send(method, value) {
  if (!instance) return;
  if (value === undefined) instance.SendMessage(BRIDGE, method);
  else instance.SendMessage(BRIDGE, method, value);
}

// Rendering a hidden scene would waste the visitor's battery, so Unity only runs while it's
// on screen or still loading something.
function updatePause() {
  const loop = instance?.Module;
  if (!loop) return;
  const busy = state.status !== "ready" || state.specimen.status === "loading" || state.map.status === "loading";
  if (visible || busy) loop.resumeMainLoop?.();
  else loop.pauseMainLoop?.();
}

function loadWantedSpecimen() {
  if (state.status !== "ready" || !wantedSpecimen || state.specimen.status === "loading") return;
  if (state.specimen.address === wantedSpecimen && state.specimen.status !== "none") return; // loaded, or failed until a retry
  instance.Module?.resumeMainLoop?.();
  setState({ specimen: { address: wantedSpecimen, status: "loading" }, actions: [], playingId: null });
  send("LoadSpecimen", wantedSpecimen);
}

function markReadyIfBothDone() {
  if (!instance || !unityReady) return;
  setState({ status: "ready", progress: 1 });
  send("SetScreenLayout", JSON.stringify({ mode: "auto", bottomInset }));
  loadWantedSpecimen();
  updatePause();
}

const EVENT_HANDLERS = {
  ready() {
    unityReady = true;
    markReadyIfBothDone();
  },
  specimenLoaded({ address, actions = [] }) {
    // A new specimen starts in its Idle action without reporting it, so show that as playing
    const idle = actions.find((action) => action.type === "idle");
    setState({ specimen: { address, status: "loaded" }, actions, playingId: idle?.id ?? null });
    loadWantedSpecimen(); // the visitor may have picked another one while this was loading
    updatePause();
  },
  specimenFailed({ address, reason }) {
    console.warn(`[viewer] Specimen ${address} failed: ${reason}`);
    setState({ specimen: { address, status: "failed" }, actions: [], playingId: null });
    updatePause();
  },
  specimenActions({ actions = [] }) {
    setState({ actions });
  },
  environmentLoaded({ address }) {
    setState({ map: { address, status: "loaded" } });
    updatePause();
  },
  environmentFailed({ address, reason }) {
    // The previous map was already unloaded, so the base stage is what's showing
    console.warn(`[viewer] Map ${address} failed: ${reason}`);
    setState({ map: { address: "", status: "loaded" } });
    updatePause();
  },
  actionStarted({ id }) {
    setState({ playingId: id });
  },
};

function listenToUnity() {
  const removers = Object.entries(EVENT_HANDLERS).map(([name, handler]) => {
    const listener = (event) => handler(event.detail ?? {});
    window.addEventListener(`shadawi:${name}`, listener);
    return () => window.removeEventListener(`shadawi:${name}`, listener);
  });
  return () => removers.forEach((remove) => remove());
}

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Couldn't load ${src}`));
    document.body.appendChild(script);
  });
}

async function start() {
  if (!canvas || state.status === "loading" || state.status === "ready") return;
  setState({ status: "loading", progress: 0, error: null });
  stopListening ??= listenToUnity(); // before Unity starts, so "ready" can't be missed

  try {
    // Addressables reads the password from here during startup (ShadawiContent.jslib)
    const res = await fetch("/api/viewer-config", { cache: "no-store" });
    if (!res.ok) throw new Error(`Viewer settings answered ${res.status}`);
    const { password } = await res.json();
    window.shadawiContent = { password };

    const build = `${BUILD_URL}/Build/${BUILD_NAME}`;
    await loadScript(`${build}.loader.js`);
    instance = await window.createUnityInstance(
      canvas,
      {
        dataUrl: `${build}.data${BUILD_EXT}`,
        frameworkUrl: `${build}.framework.js${BUILD_EXT}`,
        codeUrl: `${build}.wasm${BUILD_EXT}`,
        streamingAssetsUrl: `${BUILD_URL}/StreamingAssets`,
        companyName: "Shadawi",
        productName: "SpecimenDisplay",
        showBanner: (message, type) => (type === "error" ? console.error : console.warn)(`[unity] ${message}`),
      },
      (progress) => setState({ progress })
    );
    markReadyIfBothDone();
  } catch (err) {
    console.error("[viewer] Unity couldn't start:", err);
    setState({ status: "error", error: err?.message ?? String(err) });
  }
}

export const unityViewer = {
  subscribe(notify) {
    subscribers.add(notify);
    return () => subscribers.delete(notify);
  },
  getState: () => state,
  getServerState: () => INITIAL_STATE,

  /**
   * Creates the canvas Unity draws on. It's made here rather than by React because Unity needs it
   * in the page until it has finished quitting, which is after React has removed the viewer.
   */
  attach(host, className) {
    canvas = document.createElement("canvas");
    canvas.id = `unity-canvas-${++canvasCount}`; // a new visit can start while the last one is still quitting
    canvas.className = className;
    canvas.tabIndex = -1;
    host.appendChild(canvas);
  },

  /** Starts Unity if needed and loads a specimen in the background, ready for "View in 3D". */
  preload(address) {
    if (address) wantedSpecimen = address;
    start();
    loadWantedSpecimen();
  },

  show() {
    visible = true;
    start();
    updatePause();
  },

  hide() {
    visible = false;
    updatePause();
  },

  /** Tries again after Unity or a specimen failed to load. */
  retry() {
    if (state.status === "error") {
      start();
    } else if (state.specimen.status === "failed") {
      setState({ specimen: INITIAL_STATE.specimen });
      loadWantedSpecimen();
    }
  },

  /** Switches map; "" is the base stage. Unity moves the specimen to the new map's ActorSpawn. */
  setMap(address) {
    if (state.status !== "ready" || state.map.status === "loading" || state.map.address === address) return;
    if (address) {
      setState({ map: { address, status: "loading" } });
      send("LoadEnvironment", address);
    } else {
      setState({ map: { address: "", status: "loaded" } });
      send("UnloadEnvironment");
    }
  },

  playAction(id) {
    send("RequestAnimation", JSON.stringify({ actionId: id, speed: 1, blendDuration: 0.2 }));
  },

  /** Share of the screen height (0 to 0.5) covered by page UI; Unity frames the specimen above it. */
  setBottomInset(fraction) {
    const next = Math.min(0.5, Math.max(0, Number(fraction.toFixed(3))));
    if (next === bottomInset) return;
    bottomInset = next;
    if (state.status === "ready") send("SetScreenLayout", JSON.stringify({ mode: "auto", bottomInset }));
  },

  /** Ends Unity when the visitor leaves the page. A later visit starts a new instance. */
  shutdown() {
    stopListening?.();
    stopListening = null;
    const oldCanvas = canvas;
    if (instance) {
      document.body.appendChild(oldCanvas); // React has removed its parent by now
      oldCanvas.style.cssText = "position:fixed;width:1px;height:1px;visibility:hidden";
      instance.Module?.resumeMainLoop?.(); // Quit needs the loop running to finish
      instance.Quit()
        .catch((err) => console.warn("[viewer] Unity didn't quit cleanly:", err))
        .finally(() => oldCanvas.remove());
    } else {
      oldCanvas?.remove();
    }
    instance = null;
    canvas = null;
    unityReady = false;
    visible = false;
    wantedSpecimen = null;
    bottomInset = 0;
    state = INITIAL_STATE;
    subscribers.forEach((notify) => notify());
  },
};
