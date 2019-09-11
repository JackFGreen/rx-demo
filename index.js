const Rx = require('rxjs/Rx');
const $ = require('jquery');

const client_id = 'a0ed489355558ebacb08';
const client_secret = '2a5ea8386d75f46b5b932c8ed4348aa88ffb14c3';
const USER_LIST_API = `https://api.github.com/users`;

const refreshEl = $('.refresh');
const refreshClickStream = Rx.Observable.fromEvent(refreshEl, 'click');

const closeEl = $('.close');
const closeClickStream = Rx.Observable.fromEvent(closeEl, 'click');

const requestStream = refreshClickStream.startWith('').map(res => {
  // '' || event
  console.log(res ? '<<<req-clickEvent' : '<<<req-startWith');
  const randomOffset = Math.floor(Math.random() * 500);
  const reqUrl = USER_LIST_API + '?since=' + randomOffset;
  return reqUrl;
});

const responseStream = requestStream.flatMap(reqUrl =>
  Rx.Observable.fromPromise($.getJSON(reqUrl))
);

const userEl = $('.user');
function renderUser(data) {
  console.log('===renderUser', data)
  userEl.text(data);
}
const firstTimer = Rx.Observable.timer(0, 3000);

const s1Stream = closeClickStream
  .startWith('')
  .combineLatest(responseStream, firstTimer, (click, list, timer) => {
    return list[Math.floor(Math.random() * list.length)];
  })
  .filter(res => res.id);

const s1LoadingStream = refreshClickStream
  .map(() => 'loading')
  .startWith('loading');

s1Stream.subscribe(res => {
  console.log('>>>subscribe data');
  renderUser(res.id);
});

s1LoadingStream.subscribe(res => {
  console.log('>>>subscribe loading');
  renderUser(res);
});
