function createSerialQueue() {
  let serialId = 0;
  let serialQueue = [];
  let serialDestroyed = false;

  const pushSerialQueue = async function(asyncFunction) {
    if (serialDestroyed) {
      return;
    }

    serialId = serialId + 1;
    const currentSerialId = serialId;
    const currentSerialQueue = [].concat(serialQueue);
    const generatorPromise = generatorFunction(currentSerialQueue, () => {
      return currentSerialId === serialId;
    });

    serialQueue.push({
      id: currentSerialId,
      task: generatorPromise,
    });

    return generatorPromise;
    async function generatorFunction(previousQueue, isLastSerial) {
      await Promise.all(previousQueue.map(item => catchPromiseError(item.task)));
      try {
        return await asyncFunction({ isLastSerial });
      } catch (error) {
        throw error;
      } finally {
        serialQueue = serialQueue.filter(item => item.id !== currentSerialId);
      }
    }
  };

  const destroySerialQueue = async function() {
    const currentSerialQueue = [].concat(serialQueue);

    serialId = -1;
    serialQueue = [];
    serialDestroyed = true;

    return Promise.all(currentSerialQueue.map(item => catchPromiseError(item.task)));
  };

  function catchPromiseError(promiseInstance) {
    return promiseInstance.catch(error => {});
  }

  return {
    push: pushSerialQueue,
    destroy: destroySerialQueue,
  };
}
