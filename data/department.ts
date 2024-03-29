interface Department {
    label: string;
    value: string;
    code: string | null;
    id: number | null;
}

export const INFO: Department[] = [
    { label: '학사', value: '학사', code: 'ACADEMY', id: 246 },
    { label: '학점교류', value: '학점교류', code: 'CREDIT_EXCHANGE', id: 247 },
    { label: '일반/행사/모집', value: '일반/행사/모집', code: 'GENERAL', id: 2611 },
    { label: '장학', value: '장학금', code: 'SCHOLARSHIP', id: 249 },
    { label: '등록금 납부', value: '등록금 납부', code: 'TUITION', id: 250 },
    { label: '교육시험', value: '교육시험', code: 'EDU_EXAM', id: 252 },
    { label: '봉사', value: '봉사', code: 'VOLUNTEER', id: 253 },
];

export const UNI: Department[] = [
    { label: 'Humanity', value: '인문대학', code: null, id: null },
    { label: 'NaturalScience', value: '자연과학대학', code: null, id: null },
    { label: 'SocialScience', value: '사회과학대학', code: null, id: null },
    { label: 'GlobalEconomics', value: '글로벌정경대학', code: null, id: null },
    { label: 'Engineering', value: '공과대학', code: null, id: null },
    { label: 'InformationTechnology', value: '정보기술대학', code: 'IT', id: 2608 },
    { label: 'Business', value: '경영대학', code: null, id: null },
    { label: 'ArtPhysical', value: '예술체육대학', code: null, id: null },
    { label: 'Education', value: '사범대학', code: null, id: null },
    { label: 'UrbanScience', value: '도시과학대학', code: null, id: null },
    { label: 'LifeScience', value: '생명과학기술대학', code: null, id: null },
    { label: 'NortheastAsia', value: '동북아국제통상학부', code: null, id: null },
    { label: 'Law', value: '법학부', code: null, id: null },
];

export const Humanity: Department[] = [
    { label: '국어국문학과', value: '국어국문학과', code: 'KOREAN', id: 286 },
    { label: '영어영문학과', value: '영어영문학과', code: 'UI', id: 642 },
    { label: '독어독문학과', value: '독어독문학과', code: 'GERMAN', id: 289 },
    { label: '불어불문학과', value: '불어불문학과', code: 'INUFRANCE', id: 292 },
    { label: '일본지역문화학과', value: '일본지역문화학과', code: 'UNJAPAN', id: 298 },
    { label: '중어중국학과', value: '중어중국학과', code: 'INUCHINA', id: 301 },
];

export const NaturalScience: Department[] = [
    { label: '수학과', value: '수학과', code: 'ISU', id: 307 },
    { label: '물리학과', value: '물리학과', code: 'PHYSICS', id: 304 },
    { label: '화학과', value: '화학과', code: 'CHEM', id: 316 },
    { label: '패션산업학과', value: '패션산업학과', code: 'UIFASHION', id: 1735 },
    { label: '해양학과', value: '해양학과', code: 'MARINE', id: 730 },
];

export const SocialScience: Department[] = [
    { label: '사회복지학과', value: '사회복지학과', code: 'DSW', id: 322 },
    { label: '미디어커뮤니케이션학과', value: '미디어커뮤니케이션학과', code: 'SHINBANG', id: 757 },
    { label: '문헌정보학과', value: '문헌정보학과', code: 'CLS', id: 319 },
    { label: '창의인재개발학과', value: '창의인재개발학과', code: 'HRD', id: 328 },
];

export const GlobalEconomics: Department[] = [
    { label: '행정학과', value: '행정학과', code: 'UIPA', id: 1707 },
    { label: '정치외교학과', value: '정치외교학과', code: 'POLITICS', id: 337 },
    { label: '경제학과', value: '경제학과', code: 'ECON', id: 331 },
    { label: '무역학부', value: '무역학부', code: 'TRADE', id: 334 },
    { label: '소비자학과', value: '소비자학과', code: 'CCS', id: 340 },
    { label: '글로벌무역물류학과', value: '글로벌무역물류학과', code: 'CONTRACT', id: 2790 },
];

export const Engineering: Department[] = [
    { label: '기계공학과', value: '기계공학과', code: 'ME', id: 814 },
    { label: '전기공학과', value: '전기공학과', code: 'ELEC', id: 364 },
    { label: '전자공학과', value: '전자공학과', code: 'ELECTRON', id: 367 },
    { label: '산업경영공학과', value: '산업경영공학과', code: 'IME', id: 826 },
    { label: '신소재공학과', value: '신소재공학과', code: 'MSE', id: 355 },
    { label: '안전공학과', value: '안전공학과', code: 'SAFETY', id: 358 },
    { label: '에너지화학공학과', value: '에너지화학공학과', code: 'ENERGY', id: 868 },
    { label: '바이오-로봇 시스템 공학과', value: '바이오-로봇 시스템 공학과', code: 'MECA', id: 349 },
];

export const InformationTechnology: Department[] = [
    { label: '컴퓨터공학부', value: '컴퓨터공학부', code: 'ISIS', id: 376 },
    { label: '정보통신공학과', value: '정보통신공학과', code: 'ITE', id: 373 },
    { label: '임베디드시스템공학과', value: '임베디드시스템공학과', code: 'ESE', id: 370 },
];

export const Business: Department[] = [
    { label: '경영학부', value: '경영학부', code: 'BIZ', id: 379 },
    { label: '데이터과학과', value: '데이터과학과', code: 'DATASCIENCE', id: 1825 },
    { label: '세무회계학과', value: '세무회계학과', code: 'TAX', id: 384 },
    { label: '테크노경영학과', value: '테크노경영학과', code: 'CONTRACT', id: 2790 },
];

export const ArtPhysical: Department[] = [
    { label: '한국화전공(조형예술학부)', value: '한국화전공(조형예술학부)', code: 'FINEARTS', id: 409 },
    { label: '서양화전공(조형예술학부)', value: '서양화전공(조형예술학부)', code: 'FINEARTS', id: 409 },
    { label: '디자인학부', value: '디자인학부', code: 'DESIGN', id: 1842 },
    { label: '공연예술학과', value: '공연예술학과', code: 'UIPA10', id: 400 },
    { label: '스포츠과학부(체육학부)', value: '스포츠과학부(체육학부)', code: 'INUPE', id: 412 },
    { label: '운동건강학부', value: '운동건강학부', code: 'UIEX', id: 406 },
];

export const Education: Department[] = [
    { label: '국어교육과', value: '국어교육과', code: 'EDUKOREAN', id: 1074 },
    { label: '영어교육과', value: '영어교육과', code: 'EDUENGLISH', id: 1123 },
    { label: '일어교육과', value: '일어교육과', code: 'EDUJAPANESE', id: 1176 },
    { label: '수학교육과', value: '수학교육과', code: 'EDUMATH', id: 1088 },
    { label: '체육교육과', value: '체육교육과', code: 'EDUPHYSICAL', id: 1861 },
    { label: '유아교육과', value: '유아교육과', code: 'ECE', id: 1143 },
    { label: '역사교육과', value: '역사교육과', code: 'EDUHISTORY', id: 1104 },
    { label: '윤리교육과', value: '윤리교육과', code: 'EDUETHICS', id: 1161 },
];

export const UrbanScience: Department[] = [
    { label: '도시건설공학과(계약학과)', value: '도시건설공학과(계약학과)', code: 'CONTRACT', id: 2790 },
    { label: '도시행정학과', value: '도시행정학과', code: 'URBAN', id: 1213 },
    { label: '건설환경공학', value: '건설환경공학', code: 'CIVIL', id: 1237 },
    { label: '환경공학', value: '환경공학', code: 'ET', id: 1267 },
    { label: '도시공학과', value: '도시공학과', code: 'UCV', id: 1252 },
    { label: '건축공학', value: '건축공학', code: 'ARCHI', id: 1205 },
    { label: '도시건축학', value: '도시건축학', code: 'ARCHI', id: 1205 },
];

export const LifeScience: Department[] = [
    { label: '생명과학부(생명과학전공)', value: '생명과학부(생명과학전공)', code: 'LIFE', id: 1290 },
    { label: '생명과학부(분자의생명전공)', value: '생명과학부(분자의생명전공)', code: 'MOLBIO', id: 1883 },
    { label: '생명공학부(생명공학전공)', value: '생명공학부(생명공학전공)', code: 'ENGINEERINGLIFE', id: 1285 },
    { label: '생명공학부(나노바이오공학전공)', value: '생명공학부(나노바이오공학전공)', code: 'NANOBIO', id: 1279 },
];

export const NortheastAsia: Department[] = [
    { label: '동북아국제통상학부', value: '동북아국제통상학부', code: 'NAS', id: 1830 },
    { label: '동북아국제통상전공', value: '동북아국제통상전공', code: 'NAS', id: 1830 },
    { label: '스마트물류공학전공', value: '스마트물류공학전공', code: 'SLOG', id: 1832 },
    { label: 'IBE전공', value: 'IBE전공', code: 'IBE', id: 1840 },
];

export const Law: Department[] = [{ label: '법학부', value: '법학부', code: 'LAW', id: 1299 }];
