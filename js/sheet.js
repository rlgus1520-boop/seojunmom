/* =========================================================
   구글 시트에서 상품·카테고리를 읽어 오는 파일
   ---------------------------------------------------------
   하는 일
   1. data.js 의 sheet 주소(웹에 게시한 CSV)에서 상품·카테고리를 읽습니다.
   2. 칸 이름(제목줄)으로 값을 찾기 때문에, 시트에서 열 순서를 바꿔도 괜찮습니다.
   3. 값이 비었거나 이상하면 그 칸만 안전한 값으로 바꾸고, 상품명이 없는 줄은 건너뜁니다.
   4. 시트를 못 읽으면(인터넷 문제, 게시 해제, 제목줄 변경 등)
      마지막으로 성공한 데이터(이 휴대폰에 저장된 것)나 data.js 의 비상용 목록으로 화면을 그립니다.

   화면을 그리는 일은 index.html 이 합니다. 이 파일은 "데이터를 깨끗하게 만들어 넘기는 일"만 합니다.
   ========================================================= */
(function (root) {
  'use strict';

  var CACHE_KEY = 'sjm-sheet-v1';   // 휴대폰에 저장하는 이름
  var TIMEOUT_MS = 6000;            // 시트가 6초 안에 안 오면 비상용 데이터로 먼저 그림

  /* ---------- CSV(쉼표로 구분된 글) 읽기 ----------
     따옴표 안의 쉼표와 줄바꿈("44,500" 같은 값)도 올바르게 처리합니다. */
  function parseCSV(text) {
    var rows = [], row = [], cell = '', i = 0, inQuotes = false;
    text = String(text || '').replace(/^﻿/, '');
    while (i < text.length) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cell += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        cell += ch; i++; continue;
      }
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === ',') { row.push(cell); cell = ''; i++; continue; }
      if (ch === '\r') { i++; continue; }
      if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; i++; continue; }
      cell += ch; i++;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  /* 첫 줄(제목줄)을 이름표로 써서 { 상품명: '...', 정가: '...' } 모양으로 바꿉니다. */
  function toRecords(rows) {
    if (!rows.length) return { header: [], records: [] };
    var header = rows[0].map(function (h) { return String(h).trim(); });
    var records = rows.slice(1).map(function (r) {
      var o = {};
      header.forEach(function (h, i) { o[h] = String(r[i] == null ? '' : r[i]).trim(); });
      return o;
    });
    return { header: header, records: records };
  }

  /* ---------- 값 하나하나를 안전하게 바꾸는 함수들 ---------- */

  // "44,500" "44500원" → 44500. 숫자가 없거나 0 이하면 null
  function toPrice(v) {
    var digits = String(v || '').replace(/[^0-9]/g, '');
    var n = digits ? parseInt(digits, 10) : NaN;
    return n > 0 ? n : null;
  }

  // 순서 칸: 숫자가 아니면 null (null 은 맨 뒤로)
  function toOrder(v) {
    var n = parseFloat(String(v == null ? '' : v).replace(/,/g, '')); // 0 도 순서로 인정
    return isFinite(n) ? n : null;
  }

  // 체크박스는 TRUE / FALSE 로 옵니다. 직원이 Y, O, 1 을 적어도 보이는 것으로 봅니다.
  function toBool(v) {
    var s = String(v || '').trim().toUpperCase();
    return s === 'TRUE' || s === 'Y' || s === 'O' || s === '1' || s === '노출';
  }

  // "2026-10-31", "2026. 10. 31", "2026/10/31" → "2026-10-31". 아니면 null
  function toDate(v) {
    var m = String(v || '').match(/^\s*(\d{4})\s*[-./]\s*(\d{1,2})\s*[-./]\s*(\d{1,2})/);
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return y + '-' + (mo < 10 ? '0' : '') + mo + '-' + (d < 10 ? '0' : '') + d;
  }

  // 링크는 http:// 또는 https:// 로 시작하는 주소만 받습니다. 그 외(빈칸, 오타, javascript: 등)는 null
  function toLink(v) {
    var s = String(v || '').trim();
    return /^https?:\/\/[^\s"'<>]+$/i.test(s) ? s : null;
  }

  // 이미지는 https:// 주소 또는 사이트 안의 assets/ 경로만 받습니다.
  function toImage(v) {
    var s = String(v || '').trim();
    if (/^https:\/\/[^\s"'<>]+$/i.test(s)) return s;
    if (/^assets\/[A-Za-z0-9_\-./]+$/.test(s) && s.indexOf('..') < 0) return s;
    return null;
  }

  /* ---------- 한 줄을 상품 / 카테고리로 바꾸기 ---------- */

  function toProduct(o, rowNumber, issues) {
    var name = o['상품명'];
    if (!name) {
      // 아무것도 안 적힌 줄은 조용히 건너뛰고, 다른 칸은 적혔는데 상품명만 없으면 알려 줍니다.
      var hasOther = ['설명', '정가', '할인가', '이미지 주소', '구매 링크'].some(function (k) { return o[k]; });
      if (hasOther) issues.push({ row: rowNumber, msg: '상품명이 없어 이 줄을 건너뜀' });
      return null;
    }
    var p = {
      row: rowNumber,
      visible: toBool(o['노출']),
      order: toOrder(o['순서']),
      name: name,
      note: o['설명'] || '',
      category: o['카테고리'] || '',
      listPrice: toPrice(o['정가']),
      salePrice: toPrice(o['할인가']),
      saleStart: toDate(o['할인 시작일']),
      saleEnd: toDate(o['할인 종료일']),
      image: toImage(o['이미지 주소']),
      url: toLink(o['구매 링크'])
    };
    if (!p.url) issues.push({ row: rowNumber, msg: name + ': 구매 링크가 없거나 잘못돼 스토어 메인으로 연결' });
    if (!p.listPrice && !p.salePrice) issues.push({ row: rowNumber, msg: name + ': 가격이 없어 "스토어에서 가격 확인"으로 표시' });
    if (o['이미지 주소'] && !p.image) issues.push({ row: rowNumber, msg: name + ': 이미지 주소 형식이 맞지 않아 로고로 표시' });
    if (o['할인 시작일'] && !p.saleStart) issues.push({ row: rowNumber, msg: name + ': 할인 시작일 형식이 맞지 않음' });
    if (o['할인 종료일'] && !p.saleEnd) issues.push({ row: rowNumber, msg: name + ': 할인 종료일 형식이 맞지 않음' });
    return p;
  }

  function toCategory(o, rowNumber, issues) {
    var name = o['카테고리명'];
    if (!name) return null;
    var c = {
      row: rowNumber,
      visible: toBool(o['노출']),
      order: toOrder(o['순서']),
      name: name,
      icon: toImage(o['아이콘 주소']),
      url: toLink(o['링크'])
    };
    if (!c.url) issues.push({ row: rowNumber, msg: name + ': 링크가 없거나 잘못돼 전체 상품으로 연결' });
    return c;
  }

  // 시트 CSV 글 전체 → { list, issues }. 꼭 있어야 하는 제목이 없으면 오류를 냅니다.
  function parseSheet(text, kind) {
    var t = toRecords(parseCSV(text));
    var required = kind === 'products' ? '상품명' : '카테고리명';
    if (t.header.indexOf(required) < 0) {
      throw new Error((kind === 'products' ? '상품' : '카테고리') + ' 탭 제목줄에 "' + required + '" 칸이 없습니다');
    }
    var issues = [];
    var make = kind === 'products' ? toProduct : toCategory;
    var list = [];
    t.records.forEach(function (o, i) {
      var item = make(o, i + 2, issues); // 시트의 줄 번호 = 제목줄(1) 다음부터
      if (item) list.push(item);
    });
    return { list: list, issues: issues };
  }

  /* ---------- data.js 의 비상용 목록을 같은 모양으로 바꾸기 ---------- */
  function fromFallback(S) {
    var products = (S.products || []).map(function (p, i) {
      var hasSale = p.originalPrice && p.price && Number(p.originalPrice) > Number(p.price);
      return {
        row: null, visible: p.visible !== false, order: p.order != null ? toOrder(p.order) : i + 1,
        name: p.name || '', note: p.note || '', category: p.category || '',
        listPrice: toPrice(hasSale ? p.originalPrice : p.price),
        salePrice: hasSale ? toPrice(p.price) : null,
        saleStart: toDate(p.saleStart), saleEnd: toDate(p.saleEnd),
        image: toImage(p.image), url: toLink(p.url)
      };
    }).filter(function (p) { return p.name; });
    var categories = (S.categories || []).map(function (c, i) {
      return { row: null, visible: c.visible !== false, order: i + 1, name: c.name || '', icon: toImage(c.icon), url: toLink(c.url) };
    }).filter(function (c) { return c.name; });
    return { products: products, categories: categories, issues: [], source: 'fallback' };
  }

  /* ---------- 3단계: 노출 · 순서 · 할인 기간 ----------
     화면에 그리기 직전에 매번 계산합니다. 그래서 저장된 데이터를 쓸 때도
     "오늘 날짜" 기준으로 할인 표시가 다시 판단됩니다. */

  // 한국 시간 기준 오늘 날짜 "YYYY-MM-DD" (휴대폰 시간대가 달라도 한국 날짜로 계산)
  function todayKST(now) {
    var t = (now || new Date()).getTime() + 9 * 60 * 60 * 1000; // UTC+9
    return new Date(t).toISOString().slice(0, 10);
  }

  // 노출 체크된 것만 남기고, 순서 숫자대로 정렬. 순서가 같거나 비면 시트에 적힌 순서대로.
  function visibleSorted(list) {
    return list
      .map(function (x, i) { return { x: x, i: i }; })
      .filter(function (w) { return w.x.visible; })
      .sort(function (a, b) {
        var ao = a.x.order, bo = b.x.order;
        if (ao == null && bo == null) return a.i - b.i;
        if (ao == null) return 1;   // 순서 빈칸은 맨 뒤
        if (bo == null) return -1;
        return ao - bo || a.i - b.i;
      })
      .map(function (w) { return w.x; });
  }

  // 오늘이 할인 기간 안인지 (종료일 당일까지 포함). 'before' / 'after' / 'in'
  function period(p, today) {
    if (p.saleStart && today < p.saleStart) return 'before';
    if (p.saleEnd && today > p.saleEnd) return 'after';
    return 'in';
  }

  // 할인 중인지: 할인가 < 정가 이고, 오늘이 기간 안
  function saleState(p, today) {
    if (!p.salePrice || !p.listPrice || p.salePrice >= p.listPrice) return 'none';
    var w = period(p, today);
    return w === 'in' ? 'on' : w;
  }

  // 화면용 상품 목록: 숨김 제외, 정렬, 가격 표시 방법 결정
  function prepareProducts(list, today) {
    today = today || todayKST();
    return visibleSorted(list).map(function (p) {
      var state = saleState(p, today);
      var q = {};
      for (var k in p) q[k] = p[k];
      q.saleState = state;
      q.onSale = state === 'on';
      if (q.onSale) {
        q.showPrice = p.salePrice; q.wasPrice = p.listPrice;
      } else if (p.listPrice) {
        q.showPrice = p.listPrice; q.wasPrice = null;               // 할인 전이거나 끝남 → 정가만
      } else if (p.salePrice && period(p, today) === 'in') {
        q.showPrice = p.salePrice; q.wasPrice = null;               // 정가 없이 할인가만 적혔고 기간 안
      } else {
        q.showPrice = null; q.wasPrice = null;                      // 가격을 알 수 없음
      }
      return q;
    });
  }

  function prepareCategories(list) { return visibleSorted(list); }

  /* ---------- 휴대폰에 마지막 성공 데이터 저장 (다음 방문 때 바로 보여 주기) ---------- */
  function readCache() {
    try {
      var d = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (d && d.products && d.products.length) return d;
    } catch (e) {}
    return null;
  }
  function writeCache(d) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), products: d.products, categories: d.categories }));
    } catch (e) {}
  }

  function fetchText(url) {
    return fetch(url, { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error('시트 응답 오류 ' + r.status);
      return r.text();
    });
  }

  /* ---------- 시작: 화면 그리는 함수(render)를 1~2번 부릅니다 ----------
     - 저장된 데이터가 있으면 바로 한 번 그림
     - 시트를 읽으면 최신 데이터로 다시 그림
     - 시트를 못 읽고 그린 것도 없으면 비상용 데이터로 그림
     주소 끝에 ?fallback 을 붙이면 시트를 읽지 않고 비상용 데이터만 씁니다(시험용). */
  function start(S, render) {
    var params = new URLSearchParams(location.search);
    var fallback = fromFallback(S);
    var sheet = S.sheet || {};
    var drawn = false;
    function draw(d) { drawn = true; render(d); }

    if (params.has('fallback') || !sheet.products) { draw(fallback); return; }

    var cached = readCache();
    if (cached) draw({ products: cached.products, categories: cached.categories || fallback.categories, issues: [], source: 'cache' });

    var timer = setTimeout(function () { if (!drawn) draw(fallback); }, TIMEOUT_MS);

    Promise.all([
      fetchText(sheet.products),
      sheet.categories ? fetchText(sheet.categories) : Promise.resolve(null)
    ]).then(function (res) {
      var p = parseSheet(res[0], 'products');
      if (!p.list.length) throw new Error('상품 탭에 상품이 하나도 없습니다');
      var c = null;
      try { c = res[1] ? parseSheet(res[1], 'categories') : null; } catch (e) { console.warn('[시트] ' + e.message); }
      var data = {
        products: p.list,
        categories: c && c.list.length ? c.list : fallback.categories,
        issues: p.issues.concat(c ? c.issues : []),
        source: 'sheet'
      };
      clearTimeout(timer);
      writeCache(data);
      draw(data);
    }).catch(function (err) {
      clearTimeout(timer);
      console.warn('[시트] 읽기 실패, 저장된 데이터 또는 비상용 데이터를 씁니다: ' + err.message);
      if (!drawn) draw(fallback);
    });
  }

  root.SheetData = {
    start: start,
    prepareProducts: prepareProducts, prepareCategories: prepareCategories, todayKST: todayKST, saleState: saleState,
    // 아래는 시험(tests/sheet-test.js)용으로 밖에서 쓸 수 있게 열어 둔 것
    parseCSV: parseCSV, parseSheet: parseSheet, fromFallback: fromFallback,
    toPrice: toPrice, toOrder: toOrder, toDate: toDate, toLink: toLink, toImage: toImage, toBool: toBool
  };
})(typeof window !== 'undefined' ? window : globalThis);
