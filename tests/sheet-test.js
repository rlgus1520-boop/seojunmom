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

console.log(fail ? `\n실패 ${fail}개` : '\n모두 통과');
process.exit(fail ? 1 : 0);
