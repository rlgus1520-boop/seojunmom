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
   - 검증된 제품은 6개 기준으로 디자인되어 있습니다. 한 달 주기로 교체하세요.

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
    phone: "055-383-1848",                       // 고객센터 번호 (누르면 바로 전화 연결)
    hours: "평일 10:00 ~ 17:00 (점심시간 12:00 ~ 13:30)"
  },

  /* ---------- 메인 배너 ----------
     왼쪽 문구는 고정, 사진은 2초마다 순서대로 바뀝니다.
     사진은 가로 780 x 세로 474 비율, 왼쪽이 밝게 처리된 사진을 씁니다. (배너 높이는 사진 비율을 따릅니다) */
  hero: {
    headline: "맛있게\n드시기만 하세요.\n검증은 저희가 하겠습니다.",
    sub:      "조리 전문가가 직접 찾아가고,\n직접 조리하고,\n자체 기준표로 검증합니다.",
    interval: 2000,                              // 사진 바뀌는 간격 (밀리초, 2000 = 2초)
    images: [
      { src: "assets/banner/banner-1.jpg", alt: "뚝배기에 담긴 감자탕" },
      { src: "assets/banner/banner-2.jpg", alt: "놋그릇에 담긴 갈비탕" },
      { src: "assets/banner/banner-3.jpg", alt: "김이 오르는 어묵탕" }
    ]
  },

  /* ---------- 02 실제 검증 현장 (옆으로 넘기는 사진) ----------
     사진 비율은 가로 1000 x 세로 800 기준입니다. */
  gallery: [
    { image: "assets/photos/visit-kimchi.jpg",   caption: "제조사 생산 라인 방문" },
    { image: "assets/photos/visit-eomuk.jpg",    caption: "제조 공정 확인" },
    { image: "assets/photos/test-galbitang.jpg", caption: "직접 조리 테스트" },
    { image: "assets/photos/warehouse.jpg",      caption: "대량구매·물류창고 보관" }
  ],

  /* ---------- 01 검증된 제품 보러가기 (6종, 한 달 주기 교체) ----------
     originalPrice = 할인 전 가격, price = 특별가.
     할인이 없으면 originalPrice 줄을 지우면 됩니다. */
  products: [
    {
      name: "[런칭특가] 서준엄마네 뼈없는 갈비탕 600g 4+1팩",
      note: "HACCP 인증 • 순 고기함량 무려 100g!",
      originalPrice: 44500,
      price: 29500,
      category: "국·탕",
      image: "assets/products/galbitang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000001"
    },
    {
      name: "[재구매율100%] 서준엄마네 감자탕 5kg",
      note: "HACCP 인증 • 푸짐한 등뼈 • 국산 시래기 • 대용량",
      originalPrice: 34900,
      price: 27900,
      category: "국·탕",
      image: "assets/products/gamjatang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000002"
    },
    {
      name: "[초간편] 따끈어묵탕 3+1봉",
      note: "진짜 부산어묵 • 소스 포함 • 5분 조리",
      originalPrice: 22900,
      price: 15900,
      category: "국·탕",
      image: "assets/products/eomuktang.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000003"
    },
    {
      name: "[100%국산] 수제 한우떡갈비 x10장(1kg)",
      note: "35년 경력 청담 서셰프 • 개별 소분 포장",
      originalPrice: 24900,
      price: 18900,
      category: "간편식",
      image: "assets/products/tteokgalbi.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000004"
    },
    {
      name: "[종가] 국산 백두 포기김치 5kg",
      note: "HACCP • 종가김치 • 대용량",
      originalPrice: 32900,
      price: 27900,
      category: "김치류",
      image: "assets/products/kimchi.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000005"
    },
    {
      name: "[부산어묵] 쫄깃 어묵바 5+1개 골라담기",
      note: "52년전통 • 아침대용 • 밀가루 없는 • 속편한",
      originalPrice: 12900,
      price: 9900,
      category: "분식·간식",
      image: "assets/products/eomukbar.jpg",
      url: "https://smartstore.naver.com/seojunmom/products/0000000006"
    }
  ],

  /* ---------- 03 카테고리 (스마트스토어 카테고리 주소로 연결) ----------
     icon 은 assets/icons/ 폴더의 정사각형 이미지입니다. */
  categories: [
    { name: "국·탕",     icon: "assets/icons/soup.png",   url: "https://smartstore.naver.com/seojunmom/category/00000001" },
    { name: "간편식",    icon: "assets/icons/meal.png",   url: "https://smartstore.naver.com/seojunmom/category/00000002" },
    { name: "분식·간식", icon: "assets/icons/snack.png",  url: "https://smartstore.naver.com/seojunmom/category/00000003" },
    { name: "농·수산물", icon: "assets/icons/fresh.png",  url: "https://smartstore.naver.com/seojunmom/category/00000004" },
    { name: "김치류",    icon: "assets/icons/kimchi.png", url: "https://smartstore.naver.com/seojunmom/category/00000005" },
    { name: "소스류",    icon: "assets/icons/sauce.png",  url: "https://smartstore.naver.com/seojunmom/category/00000006" }
  ]
};
