(function () {
  var totalViewsEl = document.getElementById("metric-total-views");

  if (!totalViewsEl) {
    return;
  }

  var isPt = (document.documentElement.lang || "").toLowerCase().indexOf("pt") === 0;
  var unavailable = isPt ? "indisponivel" : "unavailable";

  var namespace = "biblia-creio-eu";
  var KEY_TOTAL_VIEWS = "site-total-views";

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

  hitCounter(KEY_TOTAL_VIEWS)
    .then(function (total) {
      totalViewsEl.textContent = total === null ? unavailable : formatNumber(total);
    })
    .catch(function () {
      totalViewsEl.textContent = unavailable;
    });
})();
