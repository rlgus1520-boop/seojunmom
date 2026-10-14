/* 시트 읽기 기능 시험. 실행: node tests/sheet-test.js
   일부러 잘못된 데이터를 넣어서, 사이트가 깨지지 않고 안전한 값으로 바꾸는지 확인합니다. */
require('../js/sheet.js');
const S = globalThis.SheetData;
let fail = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log((ok ? '통과' : '실패') + '  ' + name + (ok ? '' : '\n      결과: ' + JSON.stringify(got) + '\n      기대: ' + JSON.stringify(want)));
}

// 1. 가격: 쉼표·원 글자·빈칸·글자
check('가격 "44,500"', S.toPrice('44,500'), 44500);
check('가격 "29500원"', S.toPrice('29500원'), 29500);
check('가격 빈칸', S.toPrice(''), null);
check('가격 "만원"', S.toPrice('만원'), null);
check('가격 0', S.toPrice('0'), null);

// 2. 날짜 여러 모양
check('날짜 2026-10-31', S.toDate('2026-10-31'), '2026-10-31');
check('날짜 2026. 10. 5', S.toDate('2026. 10. 5'), '2026-10-05');
check('날짜 엉터리', S.toDate('다음주'), null);

// 3. 링크·이미지 안전 검사
check('링크 정상', S.toLink('https://smartstore.naver.com/seojunmom'), 'https://smartstore.naver.com/seojunmom');
check('링크 javascript: 차단', S.toLink('javascript:alert(1)'), null);
check('링크 http 없음', S.toLink('smartstore.naver.com'), null);
check('이미지 https', S.toImage('https://shop-phinf.pstatic.net/a.jpg'), 'https://shop-phinf.pstatic.net/a.jpg');
check('이미지 사이트 안 경로', S.toImage('assets/products/kimchi.jpg'), 'assets/products/kimchi.jpg');
check('이미지 http(보안 안 됨) 차단', S.toImage('http://example.com/a.jpg'), null);
check('이미지 상위 폴더 차단', S.toImage('assets/../index.html'), null);

// 4. 시트 전체: 따옴표 안 쉼표, 상품명 빠진 줄, 빈 줄, 잘못된 링크, 가격 없음
const csv = [
  '노출,순서,상품명,설명,카테고리,정가,할인가,할인 시작일,할인 종료일,이미지 주소,구매 링크,할인 상태,입력 확인',
  'TRUE,1,갈비탕,"맛있는, 갈비탕",국·탕,"44,500","29,500",,,assets/products/galbitang.jpg,https://smartstore.naver.com/seojunmom/products/12924699024,,',
  'TRUE,2,,설명만 있음,,,,,,,,,',
  'FALSE,,,,,,,,,,,,',
  'TRUE,3,김치,,김치류,,,,,,링크아님,,'
].join('\n');
const r = S.parseSheet(csv, 'products');
check('상품 수 (상품명 없는 줄·빈 줄 제외)', r.list.length, 2);
check('따옴표 안 쉼표', r.list[0].note, '맛있는, 갈비탕');
check('정가·할인가', [r.list[0].listPrice, r.list[0].salePrice], [44500, 29500]);
check('잘못된 링크는 null (화면에선 스토어 메인으로)', r.list[1].url, null);
check('가격 없음은 null (화면에선 "스토어에서 가격 확인")', [r.list[1].listPrice, r.list[1].salePrice], [null, null]);
check('문제 줄 알림 개수', r.issues.length, 3);

// 5. 제목줄을 누가 바꿔 버린 경우 → 오류를 내서 비상용 데이터로 넘어가게
let threw = false;
try { S.parseSheet('노출,이름\nTRUE,갈비탕', 'products'); } catch (e) { threw = true; }
check('제목줄에 "상품명"이 없으면 오류', threw, true);

// 6. 빈 시트
let threw2 = false;
try { S.parseSheet('', 'products'); } catch (e) { threw2 = true; }
check('빈 시트면 오류', threw2, true);

// 7. 3단계: 할인 기간 (오늘을 2026-10-15 로 고정해서 시험)
const T = '2026-10-15';
const base = { visible: true, order: 1, name: 'x', listPrice: 30000, salePrice: 20000, saleStart: null, saleEnd: null };
const st = (o) => S.saleState(Object.assign({}, base, o), T);
check('날짜 없음 → 할인 중', st({}), 'on');
check('시작일이 내일 → 할인 예정', st({ saleStart: '2026-10-16' }), 'before');
check('시작일이 오늘 → 할인 중', st({ saleStart: '2026-10-15' }), 'on');
check('종료일이 오늘 → 오늘까지 할인 중', st({ saleEnd: '2026-10-15' }), 'on');
check('종료일이 어제 → 할인 끝남', st({ saleEnd: '2026-10-14' }), 'after');
check('할인가가 정가보다 높음 → 할인 아님', st({ salePrice: 40000 }), 'none');
check('정가 없음 → 할인 표시 안 함', st({ listPrice: null }), 'none');

const prep = S.prepareProducts([
  Object.assign({}, base, { name: '끝난할인', order: 2, saleEnd: '2026-10-01' }),
  Object.assign({}, base, { name: '숨김', order: 1, visible: false }),
  Object.assign({}, base, { name: '진행중', order: 1 }),
  Object.assign({}, base, { name: '순서없음', order: null }),
  Object.assign({}, base, { name: '정가없이끝남', order: 3, listPrice: null, saleEnd: '2026-10-01' })
], T);
check('숨김 제외 + 순서 정렬 (빈 순서는 맨 뒤)', prep.map(p => p.name), ['진행중', '끝난할인', '정가없이끝남', '순서없음']);
check('할인 중: 특별가 20000, 줄 그은 정가 30000', [prep[0].onSale, prep[0].showPrice, prep[0].wasPrice], [true, 20000, 30000]);
check('할인 끝남: 정가 30000 만 표시', [prep[1].onSale, prep[1].showPrice, prep[1].wasPrice], [false, 30000, null]);
check('정가 없이 할인만 적었는데 기간 끝남: 가격 숨김', prep[2].showPrice, null);

check('순서 0 은 숫자 0 (빈칸 아님)', S.toOrder(0), 0);
check('순서 "0" 은 숫자 0', S.toOrder('0'), 0);
check('순서 빈칸은 null', S.toOrder(''), null);
const prep0 = S.prepareProducts([Object.assign({}, base, { name: 'A', order: 1 }), Object.assign({}, base, { name: 'B', order: 0 })], T);
check('순서 0 이 1 보다 앞', prep0.map(p => p.name), ['B', 'A']);

// 8. 한국 날짜: UTC 2026-10-14 16:00 = 한국 2026-10-15 01:00
check('한국 시간 기준 날짜', S.todayKST(new Date(Date.UTC(2026, 9, 14, 16, 0))), '2026-10-15');
check('한국 시간 자정 직전', S.todayKST(new Date(Date.UTC(2026, 9, 14, 14, 59))), '2026-10-14');

// 9. 4단계: 네이버 유입 표시
require('../js/track.js');
const TR = globalThis.Track;
const nc = { source: 'seojunmom_web', medium: 'flyer_qr' };
check('스마트스토어 주소에 유입 표시 붙음',
  TR.addNaverChannel('https://smartstore.naver.com/seojunmom/products/12924699024', nc, '갈비탕'),
  'https://smartstore.naver.com/seojunmom/products/12924699024?nt_source=seojunmom_web&nt_medium=flyer_qr&nt_detail=%EA%B0%88%EB%B9%84%ED%83%95');
check('이미 물음표가 있는 주소는 & 로 이어 붙임',
  TR.addNaverChannel('https://smartstore.naver.com/seojunmom/category/ALL?cp=1', nc, ''),
  'https://smartstore.naver.com/seojunmom/category/ALL?cp=1&nt_source=seojunmom_web&nt_medium=flyer_qr');
check('네이버가 아닌 주소는 그대로', TR.addNaverChannel('https://example.com/a', nc, 'x'), 'https://example.com/a');
check('이미 nt_source 가 있으면 그대로', TR.addNaverChannel('https://smartstore.naver.com/a?nt_source=etc', nc, 'x'), 'https://smartstore.naver.com/a?nt_source=etc');
check('기능을 끄면(source 빈칸) 그대로', TR.addNaverChannel('https://smartstore.naver.com/a', { source: '' }, 'x'), 'https://smartstore.naver.com/a');
check('잘못된 주소도 오류 없이 그대로', TR.addNaverChannel('오타', nc, 'x'), '오타');

console.log(fail ? `\n실패 ${fail}개` : '\n모두 통과');
process.exit(fail ? 1 : 0);
