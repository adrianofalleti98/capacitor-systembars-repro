const COLORS = {
  orange: "#e05402",
  blue: "#1565C0"
};

const NAMES = {
  orange: "orange",
  blue: "blue"
};

const {SystemBars} = Capacitor.Plugins;


function readEnvTop() {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;visibility:hidden;padding-top:env(safe-area-inset-top, 0px);";
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).paddingTop;
  probe.remove();
  return value;
}

function debugInfo() {
  const fill = document.getElementById("status-fill");
  const root = getComputedStyle(document.documentElement);

  const injected = document.documentElement.style.getPropertyValue("--safe-area-inset-top").trim();
  const envTop = readEnvTop();
  const used = root.getPropertyValue("--sat").trim();

  const android = (navigator.userAgent.match(/Android ([\d.]+)/) || [])[1] || "?";
  const webview = (navigator.userAgent.match(/Chrome\/(\d+)/) || [])[1] || "?";

  const lines = [
    "STATUS BAR (TOP INSET)",
    "env() from WebView    : " + envTop,
    "Used by page (--sat)  : " + used,
    "#status-fill height   : " + getComputedStyle(fill).height,
    "",
    "Android " + android + " · WebView " + webview,
  ];

  document.getElementById("debug").textContent = lines.join("\n");
}

function setStatusBarColor(name) {
  document.documentElement.style.setProperty("--bar-color", COLORS[name]);
  document.getElementById("current").textContent =
    "Actual color: " + NAMES[name];
}

document
  .getElementById("btn-orange")
  .addEventListener("click", async () => {
  await SystemBars.setStyle({
      style: "LIGHT",
      bar: "StatusBar"
    });
  setStatusBarColor("orange");
  });

document.getElementById('btn-blue').addEventListener('click', async () => {
  await SystemBars.setStyle({
    style: "DARK",
    bar: "StatusBar"
  });
  setStatusBarColor("blue")
});

window.addEventListener("load", () => {
  debugInfo();

  // Re-read every time native writes --safe-area-inset-* on <html>
  new MutationObserver(debugInfo).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });

  // Rotation / resize also change the insets
  window.addEventListener("resize", debugInfo);
});