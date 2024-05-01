interface Filter {
    label: string;
    value: string;
    code: string | null;
    id: number | null;
}
export const FilterInfo: Filter[] = [
    { label: '학사', value: '학사', code: 'ACADEMY', id: 246 },
    { label: '학점교류', value: '학점교류', code: 'CREDIT_EXCHANGE', id: 247 },
    { label: '일반/행사/모집', value: '일반/행사/모집', code: 'GENERAL', id: 2611 },
    { label: '장학', value: '장학금', code: 'SCHOLARSHIP', id: 249 },
    { label: '등록금 납부', value: '등록금 납부', code: 'TUITION', id: 250 },
    { label: '교육시험', value: '교육시험', code: 'EDU_EXAM', id: 252 },
    { label: '봉사', value: '봉사', code: 'VOLUNTEER', id: 253 },
];
