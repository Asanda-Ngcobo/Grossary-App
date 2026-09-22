const MIN_REQUEST_INTERVAL_MS =
  13000;

let lastRequestTime = 0;


/*
 * ------------------------------------------------
 * Wait until another Parse request is allowed
 * ------------------------------------------------
 */

async function waitForParseSlot() {

  const now =
    Date.now();

  const elapsed =
    now -
    lastRequestTime;

  const waitTime =
    Math.max(
      0,
      MIN_REQUEST_INTERVAL_MS -
        elapsed
    );


  if (waitTime > 0) {

    console.log(
      `Parse rate limiter: waiting ${(
        waitTime / 1000
      ).toFixed(1)}s...`
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          waitTime
        )
    );

  }


  lastRequestTime =
    Date.now();
}


module.exports = {
  waitForParseSlot,
};