/* =========================================================
   클릭 기록 + 네이버 유입 표시
   ---------------------------------------------------------
   1. 클릭 기록: data-track 이 붙은 링크를 누르면, data.js 의 clickLog 주소(구글 앱스 스크립트)로
      "시간·종류·이름·주소"만 보냅니다. 개인정보는 보내지 않습니다.
      clickLog 가 비어 있으면 아무것도 보내지 않습니다.
      주소 끝에 ?nolog 를 붙이면 기록하지 않습니다(직원 시험용).
   2. 네이버 유입 표시: 스마트스토어로 가는 링크에 nt_source 등을 붙여서,
      스마트스토어 통계에서 "이 페이지에서 온 방문·주문"을 따로 볼 수 있게 합니다.
      data.js 의 naverChannel 에서 켜고 끕니다.
   기록이 실패해도 링크 이동은 절대 막지 않습니다.
   ========================================================= */
(function (root) {
  'use strict';

  // 스마트스토어 주소에만 유입 표시를 붙입니다. 이미 붙어 있으면 그대로 둡니다.
  function addNaverChannel(url, cfg, detail) {
    if (!cfg || !cfg.source || !url) return url;
    var u;
    try { u = new URL(url); } catch (e) { return url; }
    if (!/(^|\.)smartstore\.naver\.com$/i.test(u.hostname)) return url;
    if (u.searchParams.has('nt_source')) return url;
    u.searchParams.set('nt_source', cfg.source);
    if (cfg.medium) u.searchParams.set('nt_medium', cfg.medium);
    if (detail) u.searchParams.set('nt_detail', String(detail).slice(0, 60));
    return u.toString();
  }

  function send(endpoint, data) {
    var body = JSON.stringify(data);
    try {
      // sendBeacon: 페이지를 떠나도 끝까지 보내 주는 브라우저 기능
      if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain;charset=utf-8' }))) return;
    } catch (e) {}
    try {
      fetch(endpoint, { method: 'POST', mode: 'no-cors', keepalive: true, body: body,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' } }).catch(function () {});
    } catch (e) {}
  }

  // 페이지 전체에서 data-track 링크 클릭을 한 번에 지켜봅니다.
  function start(S) {
    var endpoint = (S && S.clickLog) || '';
    if (!endpoint || new URLSearchParams(location.search).has('nolog')) return;
    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[data-track]') : null;
      if (!a) return;
      send(endpoint, {
        type: a.getAttribute('data-track'),
        name: a.getAttribute('data-name') || '',
        url: a.getAttribute('href') || ''
      });
    }, true);
  }

  root.Track = { start: start, addNaverChannel: addNaverChannel };
})(typeof window !== 'undefined' ? window : globalThis);
