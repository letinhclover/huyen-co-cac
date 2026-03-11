// 18 Mục Đích Xem Ngày — expanded from 4 → 18
export interface MucDich {
  id: string;
  label: string;
  emoji: string;
  field: 'xayDung' | 'kinhDoanh' | 'cuoiHoi' | 'anTang';
  minRating: number; // minimum rating to be considered "good"
}

export const MUC_DICH_XEM_NGAY: MucDich[] = [
  { id:'khai_truong',   label:'Khai Trương',        emoji:'🏪', field:'kinhDoanh', minRating:4 },
  { id:'ky_hop_dong',   label:'Ký Hợp Đồng',        emoji:'📝', field:'kinhDoanh', minRating:3 },
  { id:'kinh_doanh',    label:'Kinh Doanh',          emoji:'💼', field:'kinhDoanh', minRating:3 },
  { id:'mua_nha_dat',   label:'Mua Nhà/Đất',         emoji:'🏠', field:'xayDung',   minRating:4 },
  { id:'dong_tho',      label:'Động Thổ/Xây Nhà',    emoji:'🏗️', field:'xayDung',   minRating:4 },
  { id:'nhap_trach',    label:'Nhập Trạch',          emoji:'🔑', field:'xayDung',   minRating:4 },
  { id:'tran_trach',    label:'Sửa Nhà/Trần Trạch',  emoji:'🔨', field:'xayDung',   minRating:3 },
  { id:'ket_hon',       label:'Cưới Hỏi',            emoji:'💍', field:'cuoiHoi',   minRating:4 },
  { id:'dinh_hon',      label:'Đính Hôn/Dạm Ngõ',   emoji:'💝', field:'cuoiHoi',   minRating:3 },
  { id:'sang_cat',      label:'Cải Táng/Sang Cát',   emoji:'⚱️', field:'anTang',    minRating:4 },
  { id:'doi_ban_tho',   label:'Đổi Bàn Thờ',         emoji:'🪔', field:'anTang',    minRating:3 },
  { id:'lap_ban_tho',   label:'Lập Bàn Thờ',         emoji:'🏛️', field:'anTang',    minRating:4 },
  { id:'xuat_hanh',     label:'Xuất Hành/Du Lịch',   emoji:'✈️', field:'kinhDoanh', minRating:3 },
  { id:'mua_xe',        label:'Mua Xe',              emoji:'🚗', field:'kinhDoanh', minRating:3 },
  { id:'nhan_viec',     label:'Nhận Việc Mới',       emoji:'👔', field:'kinhDoanh', minRating:3 },
  { id:'thi_cu',        label:'Thi Cử/Học Hành',     emoji:'📚', field:'kinhDoanh', minRating:3 },
  { id:'cau_an',        label:'Cầu An/Cúng Sao',     emoji:'🙏', field:'anTang',    minRating:3 },
  { id:'lam_giay_to',   label:'Làm Giấy Tờ/Pháp Lý',emoji:'📋', field:'kinhDoanh', minRating:3 },
];
