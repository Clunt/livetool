function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {.
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}


function startLive() {
  var script = 'alert(1)';
  chrome.tabs.executeScript({
    code: script
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var live = document.getElementById('live');

    live.addEventListener('click', () => {
      startLive();
    });
  });
});