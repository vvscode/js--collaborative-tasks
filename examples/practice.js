/* eslint-disable */

/**
 * TODO: modify router.js to support
 * 1. unsubscribe function.
 *    Hint: inside router.js function return unsubscribe function,
 *          which will remove listener by id
 * 2. onLeave callback
 *    Hint: Add 3rd 'onLeave' parameter to Router.on + save in listener object
 *          Check in Router.handleListener if previousPath matches listener
 */

// IMPLEMENTATION
function Router() {
  let listeners = [];
  let currentPath = location.pathname;
  let previousPath = null;

  const isMatch = (match, path) =>
    (match instanceof RegExp && match.test(path)) ||
    (typeof match === "function" && match(path)) ||
    (typeof match === "string" && match === path);

  const handleListener = ({ match, onEnter }) => {
    const args = { currentPath, previousPath, state: history.state };

    isMatch(match, currentPath) && onEnter(args);
  };

  const handleAllListeners = () => listeners.forEach(handleListener);

  const generateId = () => {
    const getRandomNumber = () =>
      Math.floor(Math.random() * listeners.length * 1000);
    const doesExist = (id) => listeners.find((listener) => listener.id === id);

    let id = getRandomNumber();
    while (doesExist(id)) {
      id = getRandomNumber();
    }
    return id;
  };

  const on = (match, onEnter) => {
    const id = generateId();

    const listener = { id, match, onEnter };
    listeners.push(listener);
    handleListener(listener);
  };

  const go = (url, state) => {
    previousPath = currentPath;
    history.pushState(state, url, url);
    currentPath = location.pathname;

    handleAllListeners();
  };

  window.addEventListener("popstate", handleAllListeners);

  return { on, go };
}

// USAGE
const createRender = (content) => (...args) => {
  console.info(`${content} args=${JSON.stringify(args)}`);
  document.getElementById("root").innerHTML = `<h2>${content}</h2>`;
};

const createLogger = () => (...args) => {
  console.info(`[lleaving] args=${JSON.stringify(args)}`);
};

const router = Router();

router.on(/.*/, createRender("/.*"));
router.on((path) => path === "/contacts", createRender("/contacts"));
router.on("/about", createRender("/about"), createLogger("[leaving] /about"));
router.on("/about/us", createRender("/about/us"));

document.body.addEventListener("click", (event) => {
  if (!event.target.matches("a")) {
    return;
  }
  event.preventDefault();
  let url = event.target.getAttribute("href");
  router.go(url);
});
