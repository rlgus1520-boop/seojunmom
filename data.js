/* =========================================================
   서준엄마네 모바일 허브 페이지 — 운영자 수정 파일
   ---------------------------------------------------------
   이 파일 하나만 고치면 페이지의 문구 / 상품 / 가격 / 링크 / 카테고리가
   모두 바뀝니다. index.html 은 건드리지 않아도 됩니다.

   수정 규칙
   - 따옴표(" ") 안의 글자만 바꾸세요. 따옴표와 쉼표는 지우지 마세요.
   - 가격은 숫자만 씁니다. (예: 15900)  → 화면에는 15,900원 으로 표시됩니다.
   - 링크는 https:// 부터 전체 주소를 붙여 넣으세요.
   - 상품을 추가하려면 { ... }, 블록 하나를 통째로 복사해서 아래에 붙이세요.
   - 상품 사진은 assets/products/ 폴더에 넣고 파일명을 image 에 적으세요.
     (정사각형 사진, 900px 정도면 충분합니다)
   - 추천 제품은 6개 기준으로 디자인되어 있습니다. 한 달 주기로 교체하세요.

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
    phone: "055-383-1848",                       // 고객센터 번호 (누르면 바로 전화 연결)
    hours: "평일 10:00 ~ 17:00 (점심시간 12:00 ~ 13:30)"
  },

  /* ---------- 메인 배너 ----------
     왼쪽 문구는 고정, 오른쪽 사진은 2초마다 순서대로 바뀝니다.
     사진은 가로로 긴 사진(약 1100 x 670)이 좋고, 왼쪽이 밝은 사진이면 글자가 잘 보입니다. */
  hero: {
    eyebrow:  "우리는 '싸게'만 팔지 않습니다.",
    headline: "검증해서\n판매합니다.",
    sub:      "가족이 먹는다는 마음으로\n꼼꼼하게 검증한 제품만 선정합니다.",
    interval: 2000,                              // 사진 바뀌는 간격 (밀리초, 2000 = 2초)
    images: [
      { src: "assets/banner/banner-1.jpg", alt: "뚝배기에 담긴 감자탕" },
      { src: "assets/banner/banner-2.jpg", alt: "놋그릇에 담긴 갈비탕" },
      { src: "assets/banner/banner-3.jpg", alt: "김이 오르는 어묵탕" }
    ]
  },

  /* ---------- 01 서준엄마네 검증 프로세스 (순서대로) ---------- */
  process: [
    { title: "제조사 비교",    desc: "동일 품목의 여러 제조사를 놓고 설비·위생·맛을 비교합니다." },
    { title: "원재료 확인",    desc: "원산지와 원재료 배합비를 서류로 받고, 현장에서 직접 확인합니다." },
    { title: "직접 조리",      desc: "샘플을 받아 서준엄마네 테스트실에서 실제 조리합니다." },
    { title: "맛·가성비 평가", desc: "맛·양·가격을 시중 제품과 나란히 놓고 종합 점수 평가를 진행합니다." },
    { title: "판매",           desc: "통과한 제품만 선별하여 서준엄마네 이름으로 판매합니다." }
  ],

  /* ---------- 02 실제 검증 현장 (옆으로 넘기는 사진) ----------
     사진 비율은 가로 1000 x 세로 800 기준입니다. */
  gallery: [
    { image: "assets/photos/visit-kimchi.jpg",   caption: "제조사 생산 라인 방문" },
    { image: "assets/photos/visit-eomuk.jpg",    caption: "제조 공정 확인" },
    { image: "assets/photos/test-galbitang.jpg", caption: "직접 조리 테스트" },
    { image: "assets/photos/warehouse.jpg",      caption: "대량구매·물류창고 보관" }
  ],

  /* ---------- 03 추천 제품 (6종, 한 달 주기 교체) ----------
     originalPrice = 할인 전 가격, price = 특별가.
     할인이 없으면 originalPrice 줄을 지우면 됩니다. */
  products: [
    {
      name: "뼈없는 갈비탕 5kg",
      note: "HACCP 인증 · 대용량",
      originalPrice: 39900,
      price: 32900,
      category: "국·탕",
      image: "assets/products/galbitang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000001"
    },
    {
      name: "감자탕 5kg",
      note: "우원 · 등뼈 듬뿍",
      originalPrice: 34900,
      price: 27900,
      category: "국·탕",
      image: "assets/products/gamjatang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000002"
    },
    {
      name: "따끈 어묵탕 4개입",
      note: "부산어묵 · 국물 소스 포함",
      originalPrice: 22900,
      price: 15900,
      category: "국·탕",
      image: "assets/products/eomuktang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000003"
    },
    {
      name: "수제 떡갈비",
      note: "SK푸드 · 에어프라이어 조리",
      originalPrice: 24900,
      price: 18900,
      category: "간편식",
      image: "assets/products/tteokgalbi.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000004"
    },
    {
      name: "태백 포기김치 3kg",
      note: "종가 · 국산 배추",
      originalPrice: 32900,
      price: 27900,
      category: "반찬",
      image: "assets/products/kimchi.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000005"
    },
    {
      name: "부산 어묵바 오리지널",
      note: "간식 · 도시락 반찬",
      originalPrice: 12900,
      price: 9900,
      category: "간편식",
      image: "assets/products/eomukbar.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000006"
    }
  ],

  /* ---------- 04 카테고리 (스마트스토어 카테고리 주소로 연결) ----------
     icon 에 이미지 파일을 적으면 그 이미지가 아이콘 자리에 들어갑니다. (assets/icons/ 폴더, 정사각형 PNG)
     비워 두면 기본 선 아이콘(meat / meal / cheese / bread / fish / leaf)이 표시됩니다. */
  categories: [
    { name: "육류",      icon: "", fallback: "meat",   url: "https://smartstore.naver.com/seojunmom/category/00000001" },
    { name: "간편식",    icon: "", fallback: "meal",   url: "https://smartstore.naver.com/seojunmom/category/00000002" },
    { name: "치즈·소스", icon: "", fallback: "cheese", url: "https://smartstore.naver.com/seojunmom/category/00000003" },
    { name: "베이커리",  icon: "", fallback: "bread",  url: "https://smartstore.naver.com/seojunmom/category/00000004" },
    { name: "수산물",    icon: "", fallback: "fish",   url: "https://smartstore.naver.com/seojunmom/category/00000005" },
    { name: "농산물",    icon: "", fallback: "leaf",   url: "https://smartstore.naver.com/seojunmom/category/00000006" }
  ]
};
