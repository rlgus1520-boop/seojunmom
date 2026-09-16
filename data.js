/* =========================================================
   서준엄마네 모바일 허브 페이지 — 운영자 수정 파일
   ---------------------------------------------------------
   이 파일 하나만 고치면 페이지의 문구 / 상품 / 가격 / 링크 / 카테고리가
   모두 바뀝니다. index.html 은 건드리지 않아도 됩니다.

   수정 규칙
   - 따옴표(" ") 안의 글자만 바꾸세요. 따옴표와 쉼표는 지우지 마세요.
   - 가격은 숫자만 씁니다. (예: 19900)  → 화면에는 19,900원 으로 표시됩니다.
   - 링크는 https:// 부터 전체 주소를 붙여 넣으세요.
   - 상품을 추가하려면 { ... }, 블록 하나를 통째로 복사해서 아래에 붙이세요.
   - 상품 사진은 assets/products/ 폴더에 넣고 파일명을 image 에 적으세요.
     (정사각형 사진, 900px 정도면 충분합니다)

   ※ 아래 상품·가격·링크는 예시입니다. 실제 스마트스토어 정보로 바꿔 주세요.
   ========================================================= */

window.SITE = {

  /* ---------- 스마트스토어 기본 주소 ---------- */
  store: {
    main: "https://smartstore.naver.com/seojunmom",            // 스토어 메인 (전체보기 버튼)
    all:  "https://smartstore.naver.com/seojunmom/category/ALL" // 전체 상품 목록
  },

  /* ---------- 하단 연락처 ---------- */
  contact: {
    instagram: "https://www.instagram.com/seojunmom_store",
    phone: "1588-0000",                 // 고객센터 번호
    hours: "평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)",
    company: "큐이디 코퍼레이션 (QED)",
    business: "사업자등록번호 000-00-00000",
    address: "경남 김해시"
  },

  /* ---------- 메인 배너 ---------- */
  hero: {
    image: "assets/products/eomuktang.jpg",
    imageAlt: "김이 오르는 어묵탕 한 국자",
    headline: "우리는 싸서 판매하지 않습니다.\n검증해서 판매합니다.",
    sub: "가족들이 먹는다는 마음으로\n꼼꼼하게 검증한 제품만 선정합니다."
  },

  /* ---------- 검증 프로세스 (순서대로) ---------- */
  process: [
    { title: "제조사 비교",     desc: "같은 품목을 만드는 여러 제조사를 놓고 설비·위생·이력을 비교합니다." },
    { title: "원재료 확인",     desc: "원산지와 원재료 배합비를 서류로 받고, 현장에서 다시 확인합니다." },
    { title: "직접 조리",       desc: "샘플을 받아 서준엄마네 테스트실에서 실제로 끓이고 구워 봅니다." },
    { title: "맛·가성비 평가",  desc: "맛, 양, 가격을 시중 제품과 나란히 놓고 점수를 매깁니다." },
    { title: "판매",            desc: "여기까지 통과한 제품만 서준엄마네 이름으로 판매합니다." }
  ],

  /* ---------- 실제 검증 현장 사진 ---------- */
  gallery: [
    { image: "assets/photos/visit-kimchi.jpg",   caption: "김치 제조사 생산 라인 방문" },
    { image: "assets/photos/visit-eomuk.jpg",    caption: "어묵 공장 제조 공정 확인" },
    { image: "assets/photos/test-galbitang.jpg", caption: "갈비탕 직접 조리 테스트" },
    { image: "assets/photos/warehouse.jpg",      caption: "김해 물류창고 냉동 보관" }
  ],

  /* ---------- 추천 상품 ---------- */
  products: [
    {
      name: "뼈없는 갈비탕 600g × 5팩",
      note: "HACCP 인증 · 1~2인분",
      price: 29900,
      category: "국·탕",
      image: "assets/products/galbitang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000001"
    },
    {
      name: "부산어묵 따끈 어묵탕 4개입",
      note: "국물 소스 포함",
      price: 15900,
      category: "국·탕",
      image: "assets/products/eomuktang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000002"
    },
    {
      name: "양념 LA갈비 1kg",
      note: "아샤스마일 · 냉동",
      price: 32900,
      category: "메인반찬",
      image: "assets/products/lagalbi.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000003"
    },
    {
      name: "수제 떡갈비",
      note: "SK푸드 · 에어프라이어 조리",
      price: 18900,
      category: "메인반찬",
      image: "assets/products/tteokgalbi.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000004"
    },
    {
      name: "태백 포기김치 3kg",
      note: "종가 · 국산 배추",
      price: 27900,
      category: "메인반찬",
      image: "assets/products/kimchi.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000005"
    },
    {
      name: "부산 어묵바 오리지널",
      note: "간식·도시락 반찬",
      price: 9900,
      category: "분식·간식",
      image: "assets/products/eomukbar.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000006"
    },
    {
      name: "한입 아삭 김치전",
      note: "사옹원 · 전자레인지 3분",
      price: 12900,
      category: "분식·간식",
      image: "assets/products/kimchijeon.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000007"
    },
    {
      name: "해남 꿀고구마 3kg",
      note: "농산물 · 산지 직송",
      price: 16900,
      category: "농산물",
      image: "assets/products/goguma.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000008"
    }
  ],

  /* ---------- 카테고리 (스마트스토어 카테고리 주소로 연결) ---------- */
  categories: [
    { name: "국·탕",     desc: "갈비탕 · 어묵탕 · 감자탕", url: "https://smartstore.naver.com/seojunmom/category/00000001" },
    { name: "메인반찬",  desc: "갈비 · 떡갈비 · 김치",      url: "https://smartstore.naver.com/seojunmom/category/00000002" },
    { name: "분식·간식", desc: "어묵바 · 김치전 · 순대",    url: "https://smartstore.naver.com/seojunmom/category/00000003" },
    { name: "수산물",    desc: "관자 · 갈치 · 오징어젓갈",  url: "https://smartstore.naver.com/seojunmom/category/00000004" },
    { name: "농산물",    desc: "고구마 · 감자 · 단호박",    url: "https://smartstore.naver.com/seojunmom/category/00000005" }
  ]
};
