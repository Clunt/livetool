var PLATFORM = {};
document.addEventListener('DOMContentLoaded', () => {
  for (var platform in PLATFORM) {
    new PLATFORM[platform];
  }
});