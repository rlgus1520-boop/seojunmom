/**
 * 서준엄마네 웹사이트 클릭 기록기 (구글 앱스 스크립트)
 * ---------------------------------------------------------
 * 사이트에서 상품·카테고리 등을 누르면, 이 스크립트가 받아서
 * 구글 시트 "서준엄마네 웹사이트"의 '클릭 기록' 탭에 한 줄씩 적습니다.
 *
 * 저장하는 것: 시간, 종류(상품/카테고리/...), 이름, 이동한 주소
 * 저장하지 않는 것: 손님의 IP, 휴대폰 정보, 이름 등 개인정보 (아예 받지 않습니다)
 *
 * 설치 방법은 저장소 README 의 "클릭 기록기 설치" 를 보세요.
 * 이 코드를 고친 뒤에는 [배포 > 배포 관리 > 수정 > 새 버전] 으로 다시 배포해야 반영됩니다.
 */

var SHEET_NAME = '클릭 기록';
var ALLOWED_TYPES = ['상품', '카테고리', '전체상품', '상단스토어', '고객센터'];

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) || '{}';
    var d = JSON.parse(body);

    var type = clean(d.type, 20);
    if (ALLOWED_TYPES.indexOf(type) < 0) return reply('ignored'); // 정해진 종류가 아니면 무시

    var name = clean(d.name, 120);
    var url = clean(d.url, 400);

    // 동시에 여러 클릭이 와도 줄이 섞이지 않게 잠깐 줄을 세웁니다.
    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(SHEET_NAME)
        .appendRow([new Date(), type, name, url]);
    } finally {
      lock.releaseLock();
    }
    return reply('ok');
  } catch (err) {
    return reply('error');
  }
}

// 브라우저 주소창으로 열었을 때 "작동 중" 확인용
function doGet() {
  return reply('서준엄마네 클릭 기록기가 작동 중입니다.');
}

// 글자 수 제한 + 수식으로 바뀌는 것 막기(= + - @ 로 시작하면 앞에 ' 를 붙임)
function clean(v, max) {
  var s = String(v == null ? '' : v).replace(/[\r\n\t]/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}
