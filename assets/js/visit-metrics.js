(function () {
  var totalViewsEl = document.getElementById("metric-total-views");
  var pageViewsEl = document.getElementById("metric-page-views");
  var uniqueVisitorsEl = document.getElementById("metric-unique-visitors");

  if (!totalViewsEl || !pageViewsEl || !uniqueVisitorsEl) {
    return;
  }

  var isPt = (document.documentElement.lang || "").toLowerCase().indexOf("pt") === 0;
  var unavailable = isPt ? "indisponivel" : "unavailable";

  var namespace = "biblia-creio-eu";
  var pathKey = window.location.pathname
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "home";

  var KEY_TOTAL_VIEWS = "site-total-views";
  var KEY_PAGE_VIEWS = "page-views-" + pathKey;
  var KEY_UNIQUE_VISITORS = "site-unique-visitors";
  var DEVICE_FLAG = "visit-counted-site-unique-v1";

  function formatNumber(value) {
    return new Intl.NumberFormat(isPt ? "pt-BR" : "en-US").format(value);
  }

  async function fetchJson(url) {
    var controller = new AbortController();
    var timeout = setTimeout(function () {
      controller.abort();
    }, 8000);

    try {
      var response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  async function hitCounter(key) {
    var data = await fetchJson("https://api.countapi.xyz/hit/" + namespace + "/" + key);
    return data && typeof data.value === "number" ? data.value : null;
  }

  async function getCounter(key) {
    var data = await fetchJson("https://api.countapi.xyz/get/" + namespace + "/" + key);
    return data && typeof data.value === "number" ? data.value : 0;
  }

  Promise.all([
    hitCounter(KEY_TOTAL_VIEWS),
    hitCounter(KEY_PAGE_VIEWS)
  ])
    .then(function (values) {
      var total = values[0];
      var page = values[1];
      totalViewsEl.textContent = total === null ? unavailable : formatNumber(total);
      pageViewsEl.textContent = page === null ? unavailable : formatNumber(page);
    })
    .catch(function () {
      totalViewsEl.textContent = unavailable;
      pageViewsEl.textContent = unavailable;
    });

  (async function () {
    try {
      if (!localStorage.getItem(DEVICE_FLAG)) {
        await hitCounter(KEY_UNIQUE_VISITORS);
        localStorage.setItem(DEVICE_FLAG, "1");
      }

      var uniqueValue = await getCounter(KEY_UNIQUE_VISITORS);
      uniqueVisitorsEl.textContent = formatNumber(uniqueValue);
    } catch (error) {
      uniqueVisitorsEl.textContent = unavailable;
    }
  })();
})();
