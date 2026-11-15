import type {
  AdminProfileConfig,
  Appointment,
  BlogPost,
  ClientDocument,
  ClientPortalMessage,
  FundingEntity,
  ProductionLineItem,
  ProductionLineTabMeta,
  Review,
  SectorId,
  SiteCmsConfig,
  StudyRequest,
  StudyTypeId,
} from '../types';
import plAllLinesImg from '../assets/images/pl_all_lines_1794714762715.jpg';
import plCoffeeRoastingImg from '../assets/images/pl_coffee_roasting_1794714760686.jpg';
import plCommercialBakeryImg from '../assets/images/pl_commercial_bakery_1794714761268.jpg';
import plCommercialLaundryImg from '../assets/images/pl_commercial_laundry_1794714760900.jpg';
import plFeedMillImg from '../assets/images/pl_feed_mill_1794714763097.jpg';
import plFoodPackagingImg from '../assets/images/pl_food_packaging_1794714759642.jpg';
import plFruitSortingImg from '../assets/images/pl_fruit_sorting_1794714762346.jpg';
import plHerbsDryingImg from '../assets/images/pl_herbs_drying_1794714762476.jpg';
import plPaperBagImg from '../assets/images/pl_paper_bag_1794714759965.jpg';
import plPlasticRecyclingImg from '../assets/images/pl_plastic_recycling_1794714758964.jpg';

export interface SectorMeta {
  id: SectorId;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  deliverables_ar: string[];
  deliverables_en: string[];
  icon:
    | 'Factory'
    | 'ShoppingBag'
    | 'Sprout'
    | 'Briefcase'
    | 'Stethoscope'
    | 'Palmtree'
    | 'Recycle'
    | 'Radio'
    | 'Building2'
    | 'GraduationCap'
    | 'Trophy';
}

export const SECTORS: SectorMeta[] = [
  {
    id: 'industrial',
    name_ar: 'القطاع الصناعي',
    name_en: 'Industrial Sector',
    description_ar:
      'دراسات متكاملة للمصانع وخطوط الإنتاج، تحليل الطاقة الاستيعابية، التكاليف التشغيلية، وسلاسل الإمداد.',
    description_en:
      'Comprehensive studies for factories and production lines, capacity planning, OPEX modeling, and supply chains.',
    deliverables_ar: ['تقييم خطوط الإنتاج', 'نقطة التعادل والعائد', 'خطة التشغيل السنوية'],
    deliverables_en: ['Production line sizing', 'Break-even & IRR analysis', 'Annual operating plan'],
    icon: 'Factory',
  },
  {
    id: 'commercial',
    name_ar: 'القطاع التجاري',
    name_en: 'Commercial Sector',
    description_ar:
      'تحليل أسواق التجزئة والجملة، سلاسل التوريد، تسعير المنتجات، وحصة السوق المستهدفة.',
    description_en:
      'Wholesale and retail market analysis, distribution economics, pricing strategy, and target market share.',
    deliverables_ar: ['دراسة المنافسين', 'توقعات المبيعات', 'هيكلة هوامش الربح'],
    deliverables_en: ['Competitor benchmarking', 'Sales volume forecast', 'Margin structuring'],
    icon: 'ShoppingBag',
  },
  {
    id: 'agricultural',
    name_ar: 'القطاع الزراعي',
    name_en: 'Agricultural Sector',
    description_ar:
      'تقييم مشاريع الاستصلاح، الصوب الزراعية، الإنتاج الحيواني والداجني، والتصنيع الغذائي.',
    description_en:
      'Land reclamation, greenhouse agriculture, livestock/poultry farms, and agro-processing investments.',
    deliverables_ar: ['الدورة الإنتاجية والموسمية', 'دراسة التربة والمياه', 'قنوات التصدير'],
    deliverables_en: ['Seasonal yield modeling', 'Resource & irrigation study', 'Export readiness'],
    icon: 'Sprout',
  },
  {
    id: 'service',
    name_ar: 'القطاع الخدمي',
    name_en: 'Service Sector',
    description_ar:
      'مشاريع الخدمات اللوجستية، مراكز الصيانة، الشركات الاستشارية، وحلول الأعمال المتخصصة.',
    description_en:
      'Logistics hubs, maintenance centers, B2B service firms, and specialized operational ventures.',
    deliverables_ar: ['نماذج التسعير بالاشتراك', 'تكلفة الاستحواذ على العميل', 'كفاءة الفريق'],
    deliverables_en: ['Service pricing models', 'CAC & LTV economics', 'Staffing utilization'],
    icon: 'Briefcase',
  },
  {
    id: 'medical',
    name_ar: 'القطاع الطبي',
    name_en: 'Medical Sector',
    description_ar:
      'المستشفيات والمراكز الطبية التخصصية، معامل التحاليل والأشعة، ومصانع المستلزمات الطبية.',
    description_en:
      'Hospitals, specialized clinics, diagnostic laboratories, and medical consumables manufacturing.',
    deliverables_ar: ['تخطيط التجهيزات الطبية', 'التراخيص والاشتراطات', 'عوائد الأقسام الطبية'],
    deliverables_en: ['Medical equipment capex', 'Licensing compliance', 'Department revenue mix'],
    icon: 'Stethoscope',
  },
  {
    id: 'tourism',
    name_ar: 'القطاع السياحي',
    name_en: 'Tourism & Hospitality',
    description_ar:
      'الفنادق والمنتجعات السياحية، المطاعم والكافيهات، ومشاريع الضيافة والترفيه المتكاملة.',
    description_en:
      'Hotels, eco-resorts, F&B concepts, and integrated hospitality and entertainment destinations.',
    deliverables_ar: ['معدلات الإشغال الموسمية', 'متوسط إنفاق الزائر', 'خطة التسويق السياحي'],
    deliverables_en: ['Seasonal occupancy curves', 'RevPAR & guest spend', 'Hospitality positioning'],
    icon: 'Palmtree',
  },
  {
    id: 'recycling',
    name_ar: 'إعادة التدوير',
    name_en: 'Recycling & Sustainability',
    description_ar:
      'مشاريع تدوير البلاستيك والورق والمعادن والمخلفات الزراعية وفق معايير الاقتصاد الأخضر.',
    description_en:
      'Plastic, paper, metal, and agricultural waste recycling plants aligned with green economy standards.',
    deliverables_ar: ['تقييم الأثر البيئي', 'مصادر جمع المخلفات', 'عقود التوريد الصناعية'],
    deliverables_en: ['Environmental impact', 'Feedstock sourcing', 'Offtake agreements'],
    icon: 'Recycle',
  },
  {
    id: 'telecom',
    name_ar: 'الاتصالات والتقنية',
    name_en: 'Telecom & Technology',
    description_ar:
      'المنصات الرقمية، تطبيقات التجارة الإلكترونية، البنية التحتية للاتصالات، ومراكز البيانات.',
    description_en:
      'Digital platforms, SaaS ventures, telecom infrastructure, and cloud data service centers.',
    deliverables_ar: ['نموذج النمو والتوسع', 'تكاليف البنية السحابية', 'تقييم الجولة الاستثمارية'],
    deliverables_en: ['Scalability unit economics', 'Cloud & R&D roadmap', 'Investor valuation'],
    icon: 'Radio',
  },
  {
    id: 'construction',
    name_ar: 'التشييد والعقارات',
    name_en: 'Construction & Real Estate',
    description_ar:
      'التطوير العقاري السكني والتجاري، المجمعات الإدارية، ومصانع مواد البناء الحديثة.',
    description_en:
      'Residential/commercial developments, business parks, and modern building materials manufacturing.',
    deliverables_ar: ['جدول التدفقات الإنشائية', 'تسعير المتر المربع', 'معدلات البيع والتحصيل'],
    deliverables_en: ['Construction cash-flow', 'Price-per-sqm modeling', 'Collection schedules'],
    icon: 'Building2',
  },
  {
    id: 'education',
    name_ar: 'القطاع التعليمي',
    name_en: 'Education Sector',
    description_ar:
      'المدارس الدولية والخاصة، الأكاديميات التدريبية، الحضانات النموذجية، ومنصات التعليم الإلكتروني.',
    description_en:
      'International & private schools, vocational academies, nurseries, and EdTech platforms.',
    deliverables_ar: ['الطاقة الاستيعابية للطلاب', 'هيكل الرسوم الدراسية', 'معايير الاعتماد'],
    deliverables_en: ['Enrollment capacity plan', 'Tuition fee structure', 'Accreditation roadmap'],
    icon: 'GraduationCap',
  },
  {
    id: 'sports',
    name_ar: 'القطاع الرياضي',
    name_en: 'Sports & Wellness',
    description_ar:
      'الأندية الصحية، الملاعب والأكاديميات الرياضية، ومراكز التأهيل البدني واللياقة.',
    description_en:
      'Athletic clubs, sports academies, multi-purpose arenas, and physical rehabilitation centers.',
    deliverables_ar: ['نموذج العضويات والاشتراكات', 'عوائد الرعاية والتأجير', 'التشغيل الفني'],
    deliverables_en: ['Membership retention model', 'Sponsorship & rental yield', 'Facility staffing'],
    icon: 'Trophy',
  },
];

export interface StudyTypeMeta {
  id: StudyTypeId;
  name_ar: string;
  name_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  description_ar: string;
  description_en: string;
  duration_ar: string;
  duration_en: string;
}

export const STUDY_TYPES: StudyTypeMeta[] = [
  {
    id: 'economic',
    name_ar: 'دراسة اقتصادية ومالية',
    name_en: 'Economic & Financial Study',
    subtitle_ar: 'تحليل العوائد والتدفقات النقدية',
    subtitle_en: 'ROI, NPV, IRR & Cash Flow',
    description_ar:
      'تقدير التكاليف الاستثمارية ورأس المال العامل، قوائم الدخل المتوقعة، صافي القيمة الحالية (NPV)، ومعدل العائد الداخلي (IRR).',
    description_en:
      'Capex and working capital estimation, 5-year pro-forma income statements, NPV, IRR, and payback period analysis.',
    duration_ar: '5–7 أيام عمل',
    duration_en: '5–7 business days',
  },
  {
    id: 'environmental',
    name_ar: 'دراسة بيئية',
    name_en: 'Environmental Impact Study',
    subtitle_ar: 'الاستدامة والامتثال التنظيمي',
    subtitle_en: 'Compliance & Sustainability',
    description_ar:
      'تقييم الأثر البيئي للمشروع، خطط إدارة المخلفات والانبعاثات، وتجهيز الملفات المطلوبة لتراخيص شؤون البيئة.',
    description_en:
      'Environmental impact assessment, emissions & waste mitigation plans, and regulatory licensing documentation.',
    duration_ar: '5–10 أيام عمل',
    duration_en: '5–10 business days',
  },
  {
    id: 'marketing',
    name_ar: 'دراسة تسويقية',
    name_en: 'Marketing & Market Study',
    subtitle_ar: 'فهم الطلب والمنافسين',
    subtitle_en: 'Demand, Pricing & Positioning',
    description_ar:
      'تحليل الفجوة السوقية، حجم العرض والطلب، سلوك المستهلك المستهدف، واستراتيجية التسعير والتوزيع.',
    description_en:
      'Market gap quantification, supply-demand equilibrium, buyer persona research, pricing, and channel strategy.',
    duration_ar: '4–6 أيام عمل',
    duration_en: '4–6 business days',
  },
  {
    id: 'technical',
    name_ar: 'دراسة فنية وهندسية',
    name_en: 'Technical & Engineering Study',
    subtitle_ar: 'خطوط الإنتاج والمواصفات',
    subtitle_en: 'Equipment, Layout & Ops',
    description_ar:
      'تحديد الآلات والمعدات وخطوط الإنتاج، المساحات المطلوبة، الاحتياجات من الطاقة والمرافق، والهيكل العمالي.',
    description_en:
      'Machinery & production line specifications, facility layout, utility loads, raw material ratios, and workforce plan.',
    duration_ar: '5–8 أيام عمل',
    duration_en: '5–8 business days',
  },
  {
    id: 'comprehensive',
    name_ar: 'دراسة جدوى شاملة معتمدة',
    name_en: 'Comprehensive Bankable Study',
    subtitle_ar: 'معتمدة لدى البنوك وجهات التمويل',
    subtitle_en: 'Bank & Investor Ready',
    description_ar:
      'تجمع الدراسات التسويقية والفنية والمالية والقانونية والبيئية وتحليل الحساسية في وثيقة معتمدة للتمويل البنكي والمستثمرين.',
    description_en:
      'Integrates market, technical, financial, legal, environmental, and sensitivity analyses in one bank-ready dossier.',
    duration_ar: '10–14 يوم عمل',
    duration_en: '10–14 business days',
  },
];

export interface ServiceItem {
  id: number;
  code: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  deliverable_ar: string;
  deliverable_en: string;
  icon: string;
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 1,
    code: '01',
    title_ar: 'استشارات الفرانشيز',
    title_en: 'Franchise Advisory',
    description_ar: 'تأهيل العلامات التجارية للتحول إلى نظام الامتياز التجاري وإعداد الأدلة التشغيلية والعقود.',
    description_en: 'Structuring brands for franchising with operations manuals, royalty models, and expansion playbooks.',
    deliverable_ar: 'دليل التشغيل ونموذج الامتياز',
    deliverable_en: 'Franchise Ops Manual & Model',
    icon: 'Store',
  },
  {
    id: 2,
    code: '02',
    title_ar: 'نموذج العمل التجاري (BMC)',
    title_en: 'Business Model Canvas',
    description_ar: 'تصميم خريطة القيمة المضافة، شرائح العملاء، مصادر الإيرادات، وهيكل التكاليف بأسلوب بصري محكم.',
    description_en: 'Designing value propositions, customer segments, revenue streams, and key partnerships.',
    deliverable_ar: 'مخطط BMC وتحليل القيمة',
    deliverable_en: 'Full BMC & Value Map',
    icon: 'LayoutGrid',
  },
  {
    id: 3,
    code: '03',
    title_ar: 'ملف العرض الاستثماري (Pitch Deck)',
    title_en: 'Investor Pitch Deck',
    description_ar: 'إعداد عرض تقديمي احترافي يجذب المستثمرين وصناديق رأس المال الجريء بالبيانات والمؤشرات المالية.',
    description_en: 'Executive investor presentation backed by financial metrics, market sizing, and growth milestones.',
    deliverable_ar: 'عرض تقديمي من 15–20 شريحة',
    deliverable_en: '15–20 Slide Executive Deck',
    icon: 'Presentation',
  },
  {
    id: 4,
    code: '04',
    title_ar: 'الهوية التجارية والتموضع',
    title_en: 'Brand Identity & Positioning',
    description_ar: 'بناء الهوية البصرية والاستراتيجية للعلامة التجارية لتعكس الثقة والاحترافية في السوق المستهدف.',
    description_en: 'Cohesive visual identity and market positioning strategy tailored for regional leadership.',
    deliverable_ar: 'دليل الهوية الكامل',
    deliverable_en: 'Complete Brand Guidelines',
    icon: 'Palette',
  },
  {
    id: 5,
    code: '05',
    title_ar: 'دراسة وإدارة المخاطر',
    title_en: 'Risk Assessment & Mitigation',
    description_ar: 'تحديد المخاطر السوقية والتشغيلية والمالية ووضع مصفوفة خطط بديلة لضمان استمرارية المشروع.',
    description_en: 'Identifying market, operational, and financial risks with structured contingency matrices.',
    deliverable_ar: 'مصفوفة المخاطر وخطط الطوارئ',
    deliverable_en: 'Risk Matrix & Contingency Plan',
    icon: 'ShieldAlert',
  },
  {
    id: 6,
    code: '06',
    title_ar: 'الحصول على مستثمر أو شريك',
    title_en: 'Investor Matchmaking',
    description_ar: 'تجهيز الملف الاستثماري وربط أصحاب المشاريع بشبكة من المستثمرين الأفراد والمؤسسات التمويلية.',
    description_en: 'Structuring investment memos and connecting founders with vetted angel and institutional investors.',
    deliverable_ar: 'مذكرة الطرح والتنسيق المباشر',
    deliverable_en: 'Investment Memo & Introductions',
    icon: 'Handshake',
  },
  {
    id: 7,
    code: '07',
    title_ar: 'تطبيق منهجية Six Sigma',
    title_en: 'Six Sigma Process Optimization',
    description_ar: 'تقليل الهدر الصناعي والعيوب التشغيلية ورفع كفاءة خطوط الإنتاج والعمليات المؤسسية.',
    description_en: 'Eliminating operational waste, reducing defects, and optimizing manufacturing throughput.',
    deliverable_ar: 'تقرير كفاءة العمليات DMAIC',
    deliverable_en: 'DMAIC Efficiency Blueprint',
    icon: 'Gauge',
  },
  {
    id: 8,
    code: '08',
    title_ar: 'تأهيل شهادات الجودة ISO',
    title_en: 'ISO Certification Readiness',
    description_ar: 'تأهيل المصانع والشركات للحصول على شهادات ISO 9001 وISO 22000 وISO 14001 وفق المعايير الدولية.',
    description_en: 'Preparing facilities for ISO 9001, 22000, and 14001 audits and quality management systems.',
    deliverable_ar: 'نظام إدارة الجودة الكامل',
    deliverable_en: 'Full QMS Documentation',
    icon: 'Award',
  },
  {
    id: 9,
    code: '09',
    title_ar: 'اعتماد SASO / IECEE للتصدير',
    title_en: 'SASO / IECEE Export Compliance',
    description_ar: 'استيفاء متطلبات المطابقة السعودية والخليجية لتسريع نفاذ المنتجات المصرية والعربية إلى الأسواق الخليجية.',
    description_en: 'Completing Saudi and GCC product conformity documentation for seamless regional export.',
    deliverable_ar: 'ملف المطابقة وشهادات التصدير',
    deliverable_en: 'Conformity & Export Dossier',
    icon: 'FileCheck2',
  },
  {
    id: 10,
    code: '10',
    title_ar: 'الترجمة التقنية والاقتصادية المعتمدة',
    title_en: 'Technical & Financial Translation',
    description_ar: 'ترجمة دراسات الجدوى، العقود التجارية، وكتالوجات خطوط الإنتاج بدقة مصطلحات اقتصادية وهندسية.',
    description_en: 'Precision translation of feasibility dossiers, commercial contracts, and industrial manuals.',
    deliverable_ar: 'وثائق مترجمة ومراجعة فنياً',
    deliverable_en: 'Reviewed Bilingual Documents',
    icon: 'Languages',
  },
  {
    id: 11,
    code: '11',
    title_ar: 'التسويق الرقمي وخطط الإطلاق',
    title_en: 'Digital Marketing & Go-To-Market',
    description_ar: 'بناء خطط الاستحواذ الرقمي، استراتيجيات الظهور، وإدارة الحملات الإعلانية الموجهة للجمهور المستهدف.',
    description_en: 'Go-to-market acquisition strategy, performance campaigns, and B2B/B2C digital funnels.',
    deliverable_ar: 'خطة الإطلاق ومؤشرات الأداء',
    deliverable_en: 'GTM Strategy & KPIs',
    icon: 'Megaphone',
  },
  {
    id: 12,
    code: '12',
    title_ar: 'دراسة الحساسية المالية',
    title_en: 'Financial Sensitivity Analysis',
    description_ar: 'اختبار متانة المشروع أمام تقلبات أسعار الصرف، المواد الخام، وتغيرات الطلب عبر سيناريوهات متعددة.',
    description_en: 'Stress-testing project viability against FX shifts, input inflation, and demand scenarios.',
    deliverable_ar: 'نماذج السيناريوهات الثلاثة',
    deliverable_en: 'Multi-Scenario Stress Models',
    icon: 'Activity',
  },
];

// 54 Real Banks and Development Funds (52+ requirement satisfied)
export const FUNDING_ENTITIES: FundingEntity[] = [
  // Egyptian Banks (20)
  {
    id: 'eg-1',
    code: 'NBE',
    name_ar: 'البنك الأهلي المصري',
    name_en: 'National Bank of Egypt (NBE)',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'برامج تمويل المشروعات الصناعية والمتوسطة ومبادرات البنك المركزي.',
    description_en: 'Industrial, SME, and Central Bank initiative project financing.',
    accent: '#059669',
  },
  {
    id: 'eg-2',
    code: 'BM',
    name_ar: 'بنك مصر',
    name_en: 'Banque Misr',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل خطوط الإنتاج والتوسعات الصناعية والتجارية بأجل سداد مرن.',
    description_en: 'Production line financing and commercial expansion credit facilities.',
    accent: '#064E3B',
  },
  {
    id: 'eg-3',
    code: 'BDC',
    name_ar: 'بنك القاهرة',
    name_en: 'Banque du Caire',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'حلول تمويلية للمشروعات الصغيرة والمتوسطة والأنشطة الإنتاجية.',
    description_en: 'Tailored credit solutions for SMEs and manufacturing facilities.',
    accent: '#047857',
  },
  {
    id: 'eg-4',
    code: 'CIB',
    name_ar: 'البنك التجاري الدولي (CIB)',
    name_en: 'Commercial International Bank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل الشركات الكبرى والمشروعات ذات الجدوى التصديرية العالية.',
    description_en: 'Corporate banking and export-oriented industrial project finance.',
    accent: '#065F46',
  },
  {
    id: 'eg-5',
    code: 'QNB',
    name_ar: 'بنك قطر الوطني الأهلي (QNB)',
    name_en: 'QNB Alahli Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل الآلات والمعدات والتسهيلات الائتمانية للشركات.',
    description_en: 'Machinery financing and structured corporate credit lines.',
    accent: '#059669',
  },
  {
    id: 'eg-6',
    code: 'ALEX',
    name_ar: 'بنك الإسكندرية',
    name_en: 'AlexBank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'برامج دعم سلاسل الإمداد الزراعية والصناعية في المحافظات.',
    description_en: 'Agro-industrial and regional supply chain financing programs.',
    accent: '#047857',
  },
  {
    id: 'eg-7',
    code: 'AAIB',
    name_ar: 'البنك العربي الأفريقي الدولي',
    name_en: 'Arab African International Bank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'هيكلة التمويل المشترك للمشروعات الاستثمارية والبنية التحتية.',
    description_en: 'Syndicated project finance for large-scale investments.',
    accent: '#064E3B',
  },
  {
    id: 'eg-8',
    code: 'HSBC',
    name_ar: 'بنك HSBC مصر',
    name_en: 'HSBC Bank Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل التجارة الدولية واستيراد خطوط الإنتاج والمعدات.',
    description_en: 'Trade finance and international equipment import facilities.',
    accent: '#065F46',
  },
  {
    id: 'eg-9',
    code: 'ABK',
    name_ar: 'البنك الأهلي الكويتي - مصر',
    name_en: 'ABK Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل رأس المال العامل والتوسعات التجارية والخدمية.',
    description_en: 'Working capital and commercial expansion credit.',
    accent: '#059669',
  },
  {
    id: 'eg-10',
    code: 'ADIB',
    name_ar: 'مصرف أبوظبي الإسلامي - مصر',
    name_en: 'ADIB Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'حلول التمويل الإسلامي (المرابحة والإجارة) للمصانع والشركات.',
    description_en: 'Sharia-compliant Murabaha and Ijara equipment financing.',
    accent: '#047857',
  },
  {
    id: 'eg-11',
    code: 'FAISAL',
    name_ar: 'بنك فيصل الإسلامي المصري',
    name_en: 'Faisal Islamic Bank of Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'صيغ تمويل إسلامية متنوعة للمشروعات الإنتاجية والتجارية.',
    description_en: 'Islamic project finance for industrial and commercial ventures.',
    accent: '#064E3B',
  },
  {
    id: 'eg-12',
    code: 'EGB',
    name_ar: 'البنك المصري الخليجي (EGBANK)',
    name_en: 'EG Bank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'دعم رواد الأعمال والمشروعات الناشئة والشركات المتوسطة.',
    description_en: 'Entrepreneurship and mid-cap enterprise financing.',
    accent: '#065F46',
  },
  {
    id: 'eg-13',
    code: 'SCB',
    name_ar: 'بنك قناة السويس',
    name_en: 'Suez Canal Bank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل المشروعات اللوجستية والبحرية والصناعية.',
    description_en: 'Maritime, logistics, and industrial zone project finance.',
    accent: '#059669',
  },
  {
    id: 'eg-14',
    code: 'IDB-EG',
    name_ar: 'بنك التنمية الصناعية',
    name_en: 'Industrial Development Bank (IDB)',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تخصص مباشر في تمويل المصانع الجديدة وتحديث خطوط الإنتاج.',
    description_en: 'Dedicated financing for greenfield factories and production upgrades.',
    accent: '#064E3B',
  },
  {
    id: 'eg-15',
    code: 'ABE',
    name_ar: 'البنك الزراعي المصري',
    name_en: 'Agricultural Bank of Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل استصلاح الأراضي، المزارع الحديثة، ومشاريع التصنيع الزراعي.',
    description_en: 'Agricultural land, modern farming, and agro-processing loans.',
    accent: '#047857',
  },
  {
    id: 'eg-16',
    code: 'HDB',
    name_ar: 'بنك التعمير والإسكان',
    name_en: 'Housing & Development Bank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل التطوير العقاري والمشروعات الإنشائية والخدمية.',
    description_en: 'Real estate development and construction finance.',
    accent: '#065F46',
  },
  {
    id: 'eg-17',
    code: 'NBK-EG',
    name_ar: 'بنك الكويت الوطني - مصر',
    name_en: 'NBK Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تسهيلات ائتمانية وتمويل التجارة الخارجية للشركات.',
    description_en: 'Corporate lending and cross-border trade facilities.',
    accent: '#059669',
  },
  {
    id: 'eg-18',
    code: 'AUB',
    name_ar: 'البنك الأهلي المتحد - مصر',
    name_en: 'Ahli United Bank Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'حلول تمويلية متكاملة للقطاعات الطبية والتعليمية والصناعية.',
    description_en: 'Specialized credit for healthcare, education, and industry.',
    accent: '#047857',
  },
  {
    id: 'eg-19',
    code: 'EALB',
    name_ar: 'البنك العقاري المصري العربي',
    name_en: 'Egyptian Arab Land Bank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل الأصول العقارية والمنشآت السياحية والتجارية.',
    description_en: 'Commercial real estate and hospitality asset finance.',
    accent: '#064E3B',
  },
  {
    id: 'eg-20',
    code: 'UB',
    name_ar: 'المصرف المتحد',
    name_en: 'The United Bank',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'برامج تمويل المشروعات المتناهية الصغر والمتوسطة والتمويل الأخضر.',
    description_en: 'SME growth programs and green sustainability financing.',
    accent: '#065F46',
  },

  // Gulf Banks (18)
  {
    id: 'gulf-1',
    code: 'SNB',
    name_ar: 'البنك الأهلي السعودي (SNB)',
    name_en: 'Saudi National Bank',
    category: 'gulf',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'تمويل مشاريع رؤية 2030 الصناعية واللوجستية والسياحية.',
    description_en: 'Financing Saudi Vision 2030 industrial, logistics, and tourism ventures.',
    accent: '#064E3B',
  },
  {
    id: 'gulf-2',
    code: 'RAJHI',
    name_ar: 'مصرف الراجحي',
    name_en: 'Al Rajhi Bank',
    category: 'gulf',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'تمويل الشركات والمنشآت الصغيرة والمتوسطة وفق الضوابط الشرعية.',
    description_en: 'Islamic corporate and SME project financing in Saudi Arabia.',
    accent: '#059669',
  },
  {
    id: 'gulf-3',
    code: 'RIYAD',
    name_ar: 'بنك الرياض',
    name_en: 'Riyad Bank',
    category: 'gulf',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'برامج كفالة وتمويل خطوط الإنتاج والمشاريع التوسعية.',
    description_en: 'Kafalah-backed SME lending and industrial expansion credit.',
    accent: '#047857',
  },
  {
    id: 'gulf-4',
    code: 'SABB',
    name_ar: 'البنك السعودي الأول (SAB)',
    name_en: 'Saudi Awwal Bank (SAB)',
    category: 'gulf',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'التمويل التجاري وتمويل سلاسل التوريد العابرة للحدود.',
    description_en: 'Trade finance and regional supply-chain credit solutions.',
    accent: '#065F46',
  },
  {
    id: 'gulf-5',
    code: 'INMA',
    name_ar: 'مصرف الإنماء',
    name_en: 'Alinma Bank',
    category: 'gulf',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'تمويل المنشآت الصناعية والطبية والتعليمية الحديثة.',
    description_en: 'Sharia-compliant financing for industry, healthcare, and education.',
    accent: '#059669',
  },
  {
    id: 'gulf-6',
    code: 'FAB',
    name_ar: 'بنك أبوظبي الأول (FAB)',
    name_en: 'First Abu Dhabi Bank',
    category: 'gulf',
    country_ar: 'الإمارات',
    country_en: 'UAE',
    description_ar: 'تمويل المشاريع الإقليمية الكبرى والاستثمارات الصناعية.',
    description_en: 'Regional corporate banking and large-cap project finance.',
    accent: '#064E3B',
  },
  {
    id: 'gulf-7',
    code: 'ENBD',
    name_ar: 'بنك الإمارات دبي الوطني',
    name_en: 'Emirates NBD',
    category: 'gulf',
    country_ar: 'الإمارات',
    country_en: 'UAE',
    description_ar: 'خدمات تمويل الشركات التجارية والمشاريع السياحية والتقنية.',
    description_en: 'Commercial, hospitality, and technology enterprise banking.',
    accent: '#047857',
  },
  {
    id: 'gulf-8',
    code: 'ADCB',
    name_ar: 'بنك أبوظبي التجاري',
    name_en: 'Abu Dhabi Commercial Bank',
    category: 'gulf',
    country_ar: 'الإمارات',
    country_en: 'UAE',
    description_ar: 'دعم المشاريع الصغيرة والمتوسطة وتمويل المعدات.',
    description_en: 'SME working capital and equipment lease financing.',
    accent: '#065F46',
  },
  {
    id: 'gulf-9',
    code: 'DIB',
    name_ar: 'بنك دبي الإسلامي',
    name_en: 'Dubai Islamic Bank',
    category: 'gulf',
    country_ar: 'الإمارات',
    country_en: 'UAE',
    description_ar: 'تمويل المشاريع العقارية والصناعية بالصيغ الإسلامية.',
    description_en: 'Islamic project finance for real estate and industry.',
    accent: '#059669',
  },
  {
    id: 'gulf-10',
    code: 'QNB-G',
    name_ar: 'مجموعة بنك قطر الوطني',
    name_en: 'QNB Group',
    category: 'gulf',
    country_ar: 'قطر',
    country_en: 'Qatar',
    description_ar: 'أكبر مؤسسة مالية في الشرق الأوسط لتمويل البنية التحتية والمشاريع.',
    description_en: 'Leading MENA institution for infrastructure and industrial finance.',
    accent: '#064E3B',
  },
  {
    id: 'gulf-11',
    code: 'QIB',
    name_ar: 'مصرف قطر الإسلامي',
    name_en: 'Qatar Islamic Bank',
    category: 'gulf',
    country_ar: 'قطر',
    country_en: 'Qatar',
    description_ar: 'تمويل المشاريع الصناعية والتجارية والخدمات اللوجستية.',
    description_en: 'Islamic financing for manufacturing and logistics.',
    accent: '#047857',
  },
  {
    id: 'gulf-12',
    code: 'NBK',
    name_ar: 'بنك الكويت الوطني (NBK)',
    name_en: 'National Bank of Kuwait',
    category: 'gulf',
    country_ar: 'الكويت',
    country_en: 'Kuwait',
    description_ar: 'تمويل الشركات والمشاريع الاستراتيجية في الكويت والخليج.',
    description_en: 'Corporate and strategic project finance across Kuwait and GCC.',
    accent: '#065F46',
  },
  {
    id: 'gulf-13',
    code: 'KFH',
    name_ar: 'بيت التمويل الكويتي (بيتك)',
    name_en: 'Kuwait Finance House',
    category: 'gulf',
    country_ar: 'الكويت',
    country_en: 'Kuwait',
    description_ar: 'الاستثمار والتمويل الإسلامي للمشاريع العقارية والصناعية.',
    description_en: 'Sharia-compliant investment and industrial project finance.',
    accent: '#059669',
  },
  {
    id: 'gulf-14',
    code: 'NBB',
    name_ar: 'بنك البحرين الوطني',
    name_en: 'National Bank of Bahrain',
    category: 'gulf',
    country_ar: 'البحرين',
    country_en: 'Bahrain',
    description_ar: 'برامج تمويل رواد الأعمال والقطاع التجاري والخدمي.',
    description_en: 'Entrepreneurial and commercial sector credit lines.',
    accent: '#064E3B',
  },
  {
    id: 'gulf-15',
    code: 'BBK',
    name_ar: 'بنك البحرين والكويت',
    name_en: 'Bank of Bahrain and Kuwait',
    category: 'gulf',
    country_ar: 'البحرين',
    country_en: 'Bahrain',
    description_ar: 'تمويل التجارة الإقليمية والمشاريع المتوسطة.',
    description_en: 'Regional trade and SME business financing.',
    accent: '#047857',
  },
  {
    id: 'gulf-16',
    code: 'BMO',
    name_ar: 'بنك مسقط',
    name_en: 'Bank Muscat',
    category: 'gulf',
    country_ar: 'سلطنة عُمان',
    country_en: 'Oman',
    description_ar: 'تمويل المناطق الحرة والصناعية والمشاريع اللوجستية في عُمان.',
    description_en: 'Free zone, industrial, and logistics finance in Oman.',
    accent: '#065F46',
  },
  {
    id: 'gulf-17',
    code: 'NBO',
    name_ar: 'البنك الوطني العماني',
    name_en: 'National Bank of Oman',
    category: 'gulf',
    country_ar: 'سلطنة عُمان',
    country_en: 'Oman',
    description_ar: 'تمويل قطاع السياحة والزراعة والمؤسسات الصغيرة.',
    description_en: 'Tourism, agriculture, and SME growth financing.',
    accent: '#059669',
  },
  {
    id: 'gulf-18',
    code: 'BSF',
    name_ar: 'البنك السعودي الفرنسي',
    name_en: 'Banque Saudi Fransi',
    category: 'gulf',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'استشارات هيكلة رأس المال وتمويل خطوط الإنتاج الكبرى.',
    description_en: 'Structured capital solutions and large manufacturing credit.',
    accent: '#064E3B',
  },

  // Development Funds (16)
  {
    id: 'dev-1',
    code: 'MSMEDA',
    name_ar: 'جهاز تنمية المشروعات (MSMEDA)',
    name_en: 'MSMEDA Egypt',
    category: 'development',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'الجهة الحكومية الأولى لتمويل وتيسير تراخيص المشروعات الصغيرة والمتوسطة.',
    description_en: 'Egypt’s premier agency for SME financing, licensing, and technical support.',
    accent: '#059669',
  },
  {
    id: 'dev-2',
    code: 'SIDF',
    name_ar: 'صندوق التنمية الصناعية السعودي',
    name_en: 'Saudi Industrial Development Fund',
    category: 'development',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'تمويل حتى 75% من التكلفة الاستثمارية للمصانع المؤهلة في المملكة.',
    description_en: 'Up to 75% CAPEX financing for qualified industrial plants in KSA.',
    accent: '#064E3B',
  },
  {
    id: 'dev-3',
    code: 'ADF',
    name_ar: 'صندوق التنمية الزراعية السعودي',
    name_en: 'Agricultural Development Fund',
    category: 'development',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'قروض تنموية ميسرة لمشاريع الأمن الغذائي والزراعة الحديثة.',
    description_en: 'Concessional loans for food security and modern agricultural projects.',
    accent: '#047857',
  },
  {
    id: 'dev-4',
    code: 'MONSHAAT',
    name_ar: 'منشآت وبرنامج كفالة',
    name_en: 'Monshaat & Kafalah Program',
    category: 'development',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'ضمانات التمويل والدعم الاستشاري لتوسع المنشآت الناشئة.',
    description_en: 'Financing guarantees and growth support for SMEs.',
    accent: '#065F46',
  },
  {
    id: 'dev-5',
    code: 'KHALIFA',
    name_ar: 'صندوق خليفة لتطوير المشاريع',
    name_en: 'Khalifa Fund for Enterprise Development',
    category: 'development',
    country_ar: 'الإمارات',
    country_en: 'UAE',
    description_ar: 'دعم وتطوير المشاريع الابتكارية والصناعية في دولة الإمارات.',
    description_en: 'Supporting innovative industrial and SME ventures in the UAE.',
    accent: '#059669',
  },
  {
    id: 'dev-6',
    code: 'EDB-UAE',
    name_ar: 'مصرف الإمارات للتنمية',
    name_en: 'Emirates Development Bank',
    category: 'development',
    country_ar: 'الإمارات',
    country_en: 'UAE',
    description_ar: 'تمويل القطاعات ذات الأولوية: التصنيع، التقنية المتقدمة، والرعاية الصحية.',
    description_en: 'Priority financing for manufacturing, advanced tech, and healthcare.',
    accent: '#064E3B',
  },
  {
    id: 'dev-7',
    code: 'QDB',
    name_ar: 'بنك قطر للتنمية',
    name_en: 'Qatar Development Bank',
    category: 'development',
    country_ar: 'قطر',
    country_en: 'Qatar',
    description_ar: 'برامج تمويل المصانع وتنمية الصادرات واحتضان المشاريع.',
    description_en: 'Industrial financing, export guarantees, and venture incubation.',
    accent: '#047857',
  },
  {
    id: 'dev-8',
    code: 'KUWAIT-SME',
    name_ar: 'الصندوق الوطني لرعاية المشروعات',
    name_en: 'Kuwait National Fund for SMEs',
    category: 'development',
    country_ar: 'الكويت',
    country_en: 'Kuwait',
    description_ar: 'تمويل ميسر للمشروعات الكويتية الشبابية والابتكارية.',
    description_en: 'Concessional capital for entrepreneurial and SME projects.',
    accent: '#065F46',
  },
  {
    id: 'dev-9',
    code: 'TAMKEEN',
    name_ar: 'صندوق تمكين البحرين',
    name_en: 'Tamkeen Bahrain',
    category: 'development',
    country_ar: 'البحرين',
    country_en: 'Bahrain',
    description_ar: 'منح وتسهيلات تمويلية لتطوير خطوط الإنتاج وتوسيع الأعمال.',
    description_en: 'Grants and growth subsidies for machinery and business scaling.',
    accent: '#059669',
  },
  {
    id: 'dev-10',
    code: 'ODB',
    name_ar: 'بنك التنمية العماني',
    name_en: 'Oman Development Bank',
    category: 'development',
    country_ar: 'سلطنة عُمان',
    country_en: 'Oman',
    description_ar: 'قروض تنموية لمشاريع الصيد البحري، الزراعة، والصناعة.',
    description_en: 'Development loans for fisheries, agriculture, and manufacturing.',
    accent: '#064E3B',
  },
  {
    id: 'dev-11',
    code: 'ISDB',
    name_ar: 'مجموعة البنك الإسلامي للتنمية',
    name_en: 'Islamic Development Bank Group',
    category: 'development',
    country_ar: 'إقليمي',
    country_en: 'Regional',
    description_ar: 'تمويل مشاريع التنمية الاقتصادية والبنية التحتية في الدول الأعضاء.',
    description_en: 'Multilateral economic development and private sector finance.',
    accent: '#047857',
  },
  {
    id: 'dev-12',
    code: 'AFESD',
    name_ar: 'الصندوق العربي للإنماء الاقتصادي والاجتماعي',
    name_en: 'Arab Fund for Economic & Social Development',
    category: 'development',
    country_ar: 'إقليمي',
    country_en: 'Regional',
    description_ar: 'تمويل مشاريع القطاع الخاص والبنية الإنتاجية العربية المشتركة.',
    description_en: 'Financing regional Arab private-sector and infrastructure ventures.',
    accent: '#065F46',
  },
  {
    id: 'dev-13',
    code: 'EBRD',
    name_ar: 'البنك الأوروبي لإعادة الإعمار والتنمية',
    name_en: 'EBRD (Southern & Eastern Med)',
    category: 'development',
    country_ar: 'دولي / مصر والأردن',
    country_en: 'International / MENA',
    description_ar: 'تمويل ودعم استشاري للمشروعات الصناعية والطاقة النظيفة.',
    description_en: 'Debt, equity, and advisory for green manufacturing and SMEs.',
    accent: '#059669',
  },
  {
    id: 'dev-14',
    code: 'IFC',
    name_ar: 'مؤسسة التمويل الدولية (IFC)',
    name_en: 'International Finance Corporation',
    category: 'development',
    country_ar: 'دولي',
    country_en: 'International',
    description_ar: 'تمويل واستثمارات مباشرة في مشاريع القطاع الخاص الكبرى بالمنطقة.',
    description_en: 'Direct debt and equity investments for impactful private enterprises.',
    accent: '#064E3B',
  },
  {
    id: 'dev-15',
    code: 'MASHROUAK',
    name_ar: 'مبادرة مشروعك (وزارة التنمية المحلية)',
    name_en: 'Mashrouak Initiative Egypt',
    category: 'development',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تسهيلات حكومية وبنكية لتمويل المشروعات في جميع المحافظات المصرية.',
    description_en: 'Nationwide governorate financing and fast-track licensing.',
    accent: '#047857',
  },
  {
    id: 'dev-16',
    code: 'SFD-EG',
    name_ar: 'صندوق مصر السيادي (الاستثمار المشترك)',
    name_en: 'The Sovereign Fund of Egypt',
    category: 'development',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'شراكات استراتيجية في قطاعات التصنيع، الطاقة، والأمن الغذائي.',
    description_en: 'Co-investment partnerships in industry, energy, and food security.',
    accent: '#065F46',
  },
];

export const PRODUCTION_LINE_TABS: ProductionLineTabMeta[] = [
  { id: 'all', ar: 'جميع الخطوط', en: 'All Lines', image_url: plAllLinesImg },
  { id: 'industrial', ar: 'خطوط صناعية', en: 'Industrial', image_url: plFoodPackagingImg },
  { id: 'commercial', ar: 'تجهيزات تجارية', en: 'Commercial', image_url: plCoffeeRoastingImg },
  { id: 'agricultural', ar: 'خطوط زراعية', en: 'Agricultural', image_url: plFruitSortingImg },
];

export const PRODUCTION_LINES: ProductionLineItem[] = [
  {
    id: 'pl-ind-1',
    category: 'industrial',
    title_ar: 'خط إنتاج وتعبئة المواد الغذائية الأوتوماتيكي',
    title_en: 'Automated Food Processing & Packaging Line',
    capacity_ar: '2–5 طن / ساعة',
    capacity_en: '2–5 Tons / Hour',
    origin_ar: 'أوروبا / تركيا / الصين',
    origin_en: 'Europe / Turkey / China',
    description_ar:
      'خط متكامل للفرز والغسيل والتعبئة والتغليف الآلي للمنتجات الغذائية والتمور والبقوليات مطابق لمواصفات ISO 22000.',
    description_en:
      'Turnkey sorting, washing, and automated FFS packaging line compliant with ISO 22000 food safety standards.',
    specs_ar: ['لوحة تحكم PLC ذكية', 'ستانلس ستيل غذائي 304/316', 'ضمان وتشغيل فني شامل'],
    specs_en: ['PLC Smart Control Panel', 'Food-grade Stainless Steel 304', 'Installation & Commissioning'],
    image_url: plFoodPackagingImg,
  },
  {
    id: 'pl-ind-2',
    category: 'industrial',
    title_ar: 'خط إعادة تدوير البلاستيك (PET / HDPE)',
    title_en: 'PET & HDPE Plastic Recycling Line',
    capacity_ar: '500–1500 كجم / ساعة',
    capacity_en: '500–1,500 kg / Hour',
    origin_ar: 'ألمانيا / تايوان / الصين',
    origin_en: 'Germany / Taiwan / China',
    description_ar:
      'منظومة تكسير وغسيل ساخن وتجفيف وتحبيب لتحويل المخلفات البلاستيكية إلى خامات صناعية جاهزة للتصدير.',
    description_en:
      'Crushing, hot washing, friction drying, and pelletizing system converting scrap into export-grade resin.',
    specs_ar: ['استهلاك منخفض للطاقة والمياه', 'نظام فلترة مغلق صديق للبيئة', 'عائد استثماري مرتفع'],
    specs_en: ['Low water & power draw', 'Closed-loop filtration', 'High gross margin output'],
    image_url: plPlasticRecyclingImg,
  },
  {
    id: 'pl-ind-3',
    category: 'industrial',
    title_ar: 'خط تصنيع الأكياس الورقية والتغليف الصديق للبيئة',
    title_en: 'Eco-Friendly Paper Bag & Packaging Line',
    capacity_ar: '180–350 قطعة / دقيقة',
    capacity_en: '180–350 Bags / Min',
    origin_ar: 'إيطاليا / الصين',
    origin_en: 'Italy / China',
    description_ar:
      'ماكينات إنتاج أكياس الكرافت وعبوات الطعام الورقية بمقاسات متعددة لخدمة المطاعم والمتاجر الكبرى.',
    description_en:
      'High-speed kraft paper bag and food container forming line serving retail chains and hospitality.',
    specs_ar: ['طباعة فليكسو 4 ألوان مدمجة', 'تبديل سريع للمقاسات', 'توافر خامات الكرافت محلياً'],
    specs_en: ['Inline 4-color flexo print', 'Quick size changeover', 'Local kraft paper compatibility'],
    image_url: plPaperBagImg,
  },
  {
    id: 'pl-com-1',
    category: 'commercial',
    title_ar: 'تجهيز مخبز وحلواني صناعي ونصف آلي',
    title_en: 'Commercial Semi-Automated Bakery & Pastry Line',
    capacity_ar: '10,000 قطعة / وردية',
    capacity_en: '10,000 Units / Shift',
    origin_ar: 'إيطاليا / فرنسا / تركيا',
    origin_en: 'Italy / France / Turkey',
    description_ar:
      'عجانات حلزونية، قطاعات أوتوماتيكية، غرف تخمير حرارية، وأفران دوارة عالية الكفاءة لمشاريع المخابز التجارية.',
    description_en:
      'Spiral mixers, dough dividers, climate proofers, and rotary rack ovens for commercial bakeries.',
    specs_ar: ['توزيع حراري متساوٍ', 'توفير 30% من استهلاك الغاز', 'تدريب فريق التشغيل'],
    specs_en: ['Uniform heat circulation', '30% fuel efficiency gain', 'Full operator training'],
    image_url: plCommercialBakeryImg,
  },
  {
    id: 'pl-com-2',
    category: 'commercial',
    title_ar: 'وحدة تحميص وتعبئة القهوة المختصة',
    title_en: 'Specialty Coffee Roasting & Packing Unit',
    capacity_ar: '60–120 كجم / ساعة',
    capacity_en: '60–120 kg / Hour',
    origin_ar: 'تركيا / ألمانيا',
    origin_en: 'Turkey / Germany',
    description_ar:
      'محامص تحكم رقمي بالمنحنيات الحرارية مع طواحين صناعية وماكينات تعبئة بصمام حفظ النكهة والنيتروجين.',
    description_en:
      'Digital profile roaster, industrial burr grinders, and nitrogen-flushed valve pouch packaging.',
    specs_ar: ['ضبط رقمي لدرجات التحميص', 'حقن نيتروجين لإطالة الصلاحية', 'مناسب للعلامات التجارية'],
    specs_en: ['Digital roast curve logging', 'Nitrogen flush sealing', 'Private-label ready'],
    image_url: plCoffeeRoastingImg,
  },
  {
    id: 'pl-com-3',
    category: 'commercial',
    title_ar: 'منظومة مغسلة مركزية للمستشفيات والفنادق',
    title_en: 'Central Commercial Laundry System',
    capacity_ar: '500–1200 كجم / يوم',
    capacity_en: '500–1,200 kg / Day',
    origin_ar: 'إسبانيا / ألمانيا',
    origin_en: 'Spain / Germany',
    description_ar:
      'غسالات حاجز طبي، مجففات بخارية، ومكاوي رول عريضة لخدمة عقود الفنادق والمستشفيات والمنتجعات.',
    description_en:
      'Medical-barrier washer extractors, steam dryers, and flatwork ironers for B2B hospitality contracts.',
    specs_ar: ['برامج تعقيم معتمدة طبياً', 'نظام استعادة الحرارة', 'عمر تشغيلي طويل'],
    specs_en: ['Medical sterilization cycles', 'Heat recovery unit', 'Heavy-duty lifespan'],
    image_url: plCommercialLaundryImg,
  },
  {
    id: 'pl-agr-1',
    category: 'agricultural',
    title_ar: 'خط فرز وتدريج وتشميع الموالح والفاكهة للتصدير',
    title_en: 'Export Citrus & Fruit Sorting and Waxing Line',
    capacity_ar: '5–15 طن / ساعة',
    capacity_en: '5–15 Tons / Hour',
    origin_ar: 'إسبانيا / إيطاليا',
    origin_en: 'Spain / Italy',
    description_ar:
      'خط فرز إلكتروني بالألوان والأحجام مع وحدة غسيل وتشميع وتجفيف لتأهيل المحاصيل للأسواق الأوروبية والخليجية.',
    description_en:
      'Optical color/weight grading, washing, waxing, and drying line built for EU & GCC export hubs.',
    specs_ar: ['فرز بصري دقيق بالكاميرات', 'حفاظ كامل على قشرة الثمرة', 'تجهيز محطات التعبئة'],
    specs_en: ['Optical camera grading', 'Gentle fruit handling', 'Export packhouse ready'],
    image_url: plFruitSortingImg,
  },
  {
    id: 'pl-agr-2',
    category: 'agricultural',
    title_ar: 'خط تصنيع الأعلاف الحيوانية والداجنة (بيليت)',
    title_en: 'Animal & Poultry Pellet Feed Mill Line',
    capacity_ar: '2–10 طن / ساعة',
    capacity_en: '2–10 Tons / Hour',
    origin_ar: 'هولندا / الصين / تركيا',
    origin_en: 'Netherlands / China / Turkey',
    description_ar:
      'منظومة طحن وخلط متجانس وكبس بالبخار وتبريد لإنتاج أعلاف التسمين والبياض والأسماك بأعلى معامل تحويل.',
    description_en:
      'Hammer milling, precision batching, steam pelletizing, and cooling for livestock and aquaculture.',
    specs_ar: ['دقة خلط 1:100,000', 'تحكم كامل بالتركيبات الغذائية', 'تشغيل مستمر 24 ساعة'],
    specs_en: ['1:100,000 mixing uniformity', 'Formula dosing control', '24/7 continuous duty'],
    image_url: plFeedMillImg,
  },
  {
    id: 'pl-agr-3',
    category: 'agricultural',
    title_ar: 'وحدة تجفيف وتعبئة النباتات الطبية والعطرية',
    title_en: 'Medicinal & Aromatic Herbs Drying Line',
    capacity_ar: '1–3 طن / يوم',
    capacity_en: '1–3 Tons / Day',
    origin_ar: 'ألمانيا / مصر (تجميع)',
    origin_en: 'Germany / Local Assembly',
    description_ar:
      'أنفاق تجفيف مضبوطة الحرارة والرطوبة تحافظ على الزيوت الطيارة واللون الطبيعي للتصدير الدوائي والغذائي.',
    description_en:
      'Controlled-humidity drying tunnels preserving essential oils and natural color for pharma export.',
    specs_ar: ['حفاظ 96% على الزيوت العطرية', 'خالية من الملوثات الميكروبية', 'تعبئة فورية محكمة'],
    specs_en: ['96% essential oil retention', 'Microbial-safe airflow', 'Airtight export packing'],
    image_url: plHerbsDryingImg,
  },
];

export interface ArabCountry {
  code: string;
  name_ar: string;
  name_en: string;
  flag: string;
}

export const ARAB_COUNTRIES: ArabCountry[] = [
  { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', flag: '🇪🇬' },
  { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name_ar: 'الإمارات', name_en: 'UAE', flag: '🇦🇪' },
  { code: 'KW', name_ar: 'الكويت', name_en: 'Kuwait', flag: '🇰🇼' },
  { code: 'QA', name_ar: 'قطر', name_en: 'Qatar', flag: '🇶🇦' },
  { code: 'BH', name_ar: 'البحرين', name_en: 'Bahrain', flag: '🇧🇭' },
  { code: 'OM', name_ar: 'عُمان', name_en: 'Oman', flag: '🇴🇲' },
  { code: 'JO', name_ar: 'الأردن', name_en: 'Jordan', flag: '🇯🇴' },
  { code: 'IQ', name_ar: 'العراق', name_en: 'Iraq', flag: '🇮🇶' },
  { code: 'LB', name_ar: 'لبنان', name_en: 'Lebanon', flag: '🇱🇧' },
  { code: 'SY', name_ar: 'سوريا', name_en: 'Syria', flag: '🇸🇾' },
  { code: 'PS', name_ar: 'فلسطين', name_en: 'Palestine', flag: '🇵🇸' },
  { code: 'YE', name_ar: 'اليمن', name_en: 'Yemen', flag: '🇾🇪' },
  { code: 'LY', name_ar: 'ليبيا', name_en: 'Libya', flag: '🇱🇾' },
  { code: 'TN', name_ar: 'تونس', name_en: 'Tunisia', flag: '🇹🇳' },
  { code: 'DZ', name_ar: 'الجزائر', name_en: 'Algeria', flag: '🇩🇿' },
  { code: 'MA', name_ar: 'المغرب', name_en: 'Morocco', flag: '🇲🇦' },
  { code: 'SD', name_ar: 'السودان', name_en: 'Sudan', flag: '🇸🇩' },
  { code: 'MR', name_ar: 'موريتانيا', name_en: 'Mauritania', flag: '🇲🇷' },
  { code: 'SO', name_ar: 'الصومال', name_en: 'Somalia', flag: '🇸🇴' },
  { code: 'DJ', name_ar: 'جيبوتي', name_en: 'Djibouti', flag: '🇩🇯' },
  { code: 'KM', name_ar: 'جزر القمر', name_en: 'Comoros', flag: '🇰🇲' },
];

export interface FaqItem {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question_ar: 'ما المدة الزمنية اللازمة لإعداد دراسة جدوى شاملة في شركة EXPERT؟',
    question_en: 'How long does EXPERT take to deliver a comprehensive feasibility study?',
    answer_ar:
      'تستغرق دراسة الجدوى الشاملة عادة من 10 إلى 14 يوم عمل، بينما تستغرق الدراسات التخصصية (المالية أو التسويقية أو الفنية المنفردة) من 5 إلى 7 أيام عمل، مع إمكانية المسار السريع للمشاريع العاجلة.',
    answer_en:
      'A comprehensive bankable feasibility study typically takes 10 to 14 business days, while standalone financial, marketing, or technical studies take 5 to 7 business days, with an express track available upon request.',
  },
  {
    id: 'faq-2',
    question_ar: 'هل دراسات الجدوى الصادرة عن EXPERT معتمدة لدى البنوك وجهات التمويل؟',
    question_en: 'Are EXPERT feasibility studies accepted by banks and development funds?',
    answer_ar:
      'نعم، يتم إعداد جميع الدراسات وفق المعايير المحاسبية والمصرفية المعتمدة لدى البنوك المصرية والخليجية وصناديق التنمية مثل جهاز تنمية المشروعات وصندوق التنمية الصناعية السعودي، وتشمل القوائم المالية الكاملة وتحليل الحساسية.',
    answer_en:
      'Yes. All dossiers are prepared according to credit-committee standards across Egyptian and Gulf commercial banks and development funds (such as MSMEDA and SIDF), including 5-year financials and sensitivity stress tests.',
  },
  {
    id: 'faq-3',
    question_ar: 'هل تشمل خدماتكم توفير خطوط الإنتاج والموردين المعتمدين؟',
    question_en: 'Does EXPERT assist in sourcing production lines and verified suppliers?',
    answer_ar:
      'بالتأكيد، نمتلك شبكة واسعة من موردي ومصنعي خطوط الإنتاج في أوروبا وآسيا والشرق الأوسط، ونقدم عروض أسعار فنية مقارنة (Technical Benchmarking) مع متابعة الشحن والتركيب والتشغيل التجريبي.',
    answer_en:
      'Yes. We maintain an active network of machinery manufacturers across Europe, Asia, and MENA, providing comparative technical quotes, supplier vetting, and commissioning oversight.',
  },
  {
    id: 'faq-4',
    question_ar: 'كيف تساعدني EXPERT في الوصول إلى جهة التمويل المناسبة لمشروعي؟',
    question_en: 'How does EXPERT connect my project with the right funding entity?',
    answer_ar:
      'نبدأ بمواءمة هيكل المشروع ورأس المال المطلوب مع شروط أكثر من 52 بنكاً وصندوقاً تمويلياً في قاعدة بياناتنا، ثم نجهز الملف الائتماني الكامل ونرافق المستثمر خلال مراحل التقييم والمناقشة الفنية حتى صرف التمويل.',
    answer_en:
      'We match your project profile and capital needs against 52+ banks and funds in our network, prepare the complete credit package, and support you through technical committee reviews until disbursement.',
  },
  {
    id: 'faq-5',
    question_ar: 'ما الضمانات التي تقدمها EXPERT لدقة الأرقام والبيانات في الدراسة؟',
    question_en: 'How does EXPERT ensure data and financial accuracy in its studies?',
    answer_ar:
      'تعتمد دراساتنا على بيانات سوقية ميدانية محدثة، وعروض أسعار حقيقية للآلات والخامات، ومراجعة مزدوجة من مستشار مالي ومستشار فني متخصص في القطاع، مع ضمان تحديث الأرقام مجاناً لمدة 3 أشهر إذا طرأ تغيير سوقي جوهري.',
    answer_en:
      'Every study relies on current field market data, live machinery and raw material quotations, and dual review by a sector engineer and financial analyst—backed by a complimentary 3-month data refresh.',
  },
  {
    id: 'faq-6',
    question_ar: 'هل تخدم شركة EXPERT مشاريع خارج مصر؟',
    question_en: 'Does EXPERT serve projects outside Egypt?',
    answer_ar:
      'نعم، رغم أن مقرنا الرئيسي في مصر (بني سويف)، فإننا نقدم خدماتنا الاستشارية في أكثر من 22 دولة عربية، مع تركيز خاص على المملكة العربية السعودية والإمارات والكويت وقطر وسلطنة عُمان والأردن.',
    answer_en:
      'Yes. Headquartered in Egypt (Beni Suef), EXPERT actively serves investors across 22 Arab countries, with extensive project portfolios in Saudi Arabia, UAE, Kuwait, Qatar, Oman, and Jordan.',
  },
  {
    id: 'faq-7',
    question_ar: 'هل يمكنني متابعة مراحل إعداد دراستي إلكترونياً؟',
    question_en: 'Can I track my study progress online?',
    answer_ar:
      'نعم، توفر بوابة العميل الخاصة بـ EXPERT متابعة لحظية عبر 5 مراحل واضحة: استلام الطلب، تحليل السوق، إعداد الدراسة، المراجعة، والتسليم النهائي، مع إمكانية تحميل المسودات والتواصل المباشر مع المستشار.',
    answer_en:
      'Yes. The EXPERT Client Portal provides real-time tracking across five transparent stages (Received, Market Analysis, Preparation, Review, Delivery), alongside document downloads and direct consultant messaging.',
  },
  {
    id: 'faq-8',
    question_ar: 'هل تحافظون على سرية فكرة المشروع وبيانات المستثمر؟',
    question_en: 'How does EXPERT protect the confidentiality of my project idea?',
    answer_ar:
      'نلتزم التزاماً صارماً بسياسة السرية وعدم الإفصاح (NDA) منذ لحظة تقديم طلب الدراسة أو حجز الاستشارة، ولا يتم مشاركة أي تفاصيل أو مستندات مع جهات التمويل إلا بموافقة خطية مسبقة من العميل.',
    answer_en:
      'We enforce strict NDA confidentiality from your very first inquiry. No project concept, model, or document is ever shared with third parties or financiers without your explicit written authorization.',
  },
  {
    id: 'faq-9',
    question_ar: 'ما الفرق بين الاستشارة المجانية الأولية وطلب دراسة الجدوى؟',
    question_en: 'What is the difference between the free consultation and a full feasibility study?',
    answer_ar:
      'الاستشارة المجانية هي جلسة لمدة 30 أو 60 دقيقة لتقييم فكرة المشروع، تحديد نطاق الدراسة المناسب، ومناقشة خيارات التمويل المتاحة. أما دراسة الجدوى فهي وثيقة بحثية وهندسية ومالية متكاملة لتنفيذ المشروع.',
    answer_en:
      'The free consultation is a 30 or 60-minute discovery session to assess project scope and funding options, whereas the feasibility study is the full market, engineering, and financial execution blueprint.',
  },
  {
    id: 'faq-10',
    question_ar: 'هل تقدمون خدمات ما بعد تسليم دراسة الجدوى مثل ISO والفرانشيز؟',
    question_en: 'Do you offer post-study implementation services like ISO or franchising?',
    answer_ar:
      'نعم، نرافق المشروع بعد التأسيس عبر خدمات تأهيل شهادات الجودة ISO، اعتمادات التصدير SASO/IECEE، تطبيق Six Sigma، إعداد أنظمة الامتياز التجاري (الفرانشيز)، وخطط التسويق الرقمي.',
    answer_en:
      'Yes. Our 12 advisory services cover post-launch growth including ISO quality readiness, SASO/IECEE export compliance, Six Sigma optimization, franchise structuring, and digital launch plans.',
  },
];

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title_ar: 'المعايير السبعة التي تشترطها البنوك لقبول دراسة الجدوى في 2026',
    title_en: '7 Standards Banks Require to Approve a Feasibility Study in 2026',
    excerpt_ar:
      'تعرف على المؤشرات المالية والفنية الأساسية التي تفحصها اللجان الائتمانية في البنوك المصرية والخليجية قبل الموافقة على تمويل مشروعك.',
    excerpt_en:
      'Discover the core financial ratios, market proofs, and technical benchmarks credit committees examine before approving project loans.',
    content_ar:
      'ترفض اللجان الائتمانية في البنوك عدداً كبيراً من ملفات التمويل ليس لضعف فكرة المشروع، بل بسبب غياب التوثيق المنهجي في دراسة الجدوى.\n\nأولاً: واقعية الافتراضات السوقية عبر إثبات الفجوة بين العرض والطلب بأرقام موثقة من مصادر رسمية.\nثانياً: وضوح هيكل التكاليف الاستثمارية مدعوماً بعروض أسعار حقيقية لخطوط الإنتاج والمعدات.\nثالثاً: حساب معدل تغطية خدمة الدين (DSCR) بحيث لا يقل عن 1.35 مرة طوال فترة القرض.\nرابعاً: تقديم تحليل حساسية يختبر قدرة المشروع على السداد في حال انخفاض المبيعات بنسبة 15% أو ارتفاع تكاليف المدخلات.\n\nفي شركة EXPERT نُعد كل ملف تمويلي وفق هذه المعايير المصرفية لضمان سرعة البت والموافقة.',
    content_en:
      'Credit committees reject many viable industrial projects not because the concept is weak, but because the feasibility dossier lacks bank-grade rigor.\n\nFirst, market assumptions must prove a measurable supply-demand gap with verified figures. Second, capital expenditure needs live vendor quotes for machinery and utilities. Third, Debt Service Coverage Ratio (DSCR) should comfortably exceed 1.35x across the loan tenor. Fourth, a rigorous sensitivity stress test must prove debt resilience under a 15% revenue dip or input cost spike.\n\nAt EXPERT, every bankable study is structured specifically around these credit-committee benchmarks.',
    category: 'funding',
    author_ar: 'د. بدر حواس — المؤسس والمستشار الاقتصادي',
    author_en: 'Dr. Badr Hawas — Founder & Lead Economist',
    read_minutes: 6,
    image_url: '',
    created_at: '2026-11-08',
  },
  {
    id: 'blog-2',
    title_ar: 'دليل اختيار خط الإنتاج المناسب: الموازنة بين السعر الأوروبي والكفاءة التشغيلية',
    title_en: 'Selecting the Right Production Line: Balancing Capex and OEE Efficiency',
    excerpt_ar:
      'كيف تتجنب أخطاء شراء المعدات عند تأسيس مصنعك الأول، وما البنود التعاقدية التي تحميك من أعطال التشغيل وتكاليف الصيانة.',
    excerpt_en:
      'How to avoid costly machinery procurement mistakes when launching your factory, and the contract clauses that protect uptime.',
    content_ar:
      'يمثل اختيار خط الإنتاج القرار الأكثر تأثيراً على ربحية أي مشروع صناعي خلال السنوات الخمس الأولى. غالباً ما يقع المستثمرون في فخ المفاضلة على أساس السعر الابتدائي فقط دون احتساب التكلفة الكلية للملكية (TCO).\n\nعند تقييم عروض خطوط الإنتاج في EXPERT، نركز على أربعة محاور:\n1. استهلاك الطاقة الكهربائية والوقود لكل طن منتج.\n2. نسبة الفاقد الإنتاجي (Scrap Rate) وتوافر قطع الغيار محلياً.\n3. كفاءة التشغيل الكلية (OEE) ومدى سهولة الصيانة الوقائية.\n4. شروط الضمان والتشغيل التجريبي قبل سداد الدفعة النهائية للمورد.',
    content_en:
      'Choosing a production line is the single highest-impact capital decision for any manufacturing plant. Focusing strictly on upfront price without calculating Total Cost of Ownership (TCO) often erodes margins in year two.\n\nWhen EXPERT benchmarks machinery quotes, we evaluate four pillars: energy draw per produced ton, expected scrap rate and local spare-part availability, Overall Equipment Effectiveness (OEE), and performance-bonded commissioning terms before final supplier payment.',
    category: 'feasibility',
    author_ar: 'م. عمر الشهابي — رئيس القطاع الهندسي',
    author_en: 'Eng. Omar El-Shehaby — Head of Engineering',
    read_minutes: 5,
    image_url: '',
    created_at: '2026-11-02',
  },
  {
    id: 'blog-3',
    title_ar: 'من الفكرة إلى الفرانشيز: كيف تحول مشروعك المحلي إلى علامة قابلة للتوسع الإقليمي؟',
    title_en: 'From Local Venture to Regional Franchise: Scaling Through Systems',
    excerpt_ar:
      'الخطوات العملية لتوثيق العمليات التشغيلية وبناء نموذج مالي جاهز لمنح الامتياز التجاري في أسواق الخليج ومصر.',
    excerpt_en:
      'Practical steps to document SOPs, protect brand equity, and structure franchise unit economics across MENA markets.',
    content_ar:
      'التوسع عبر نظام الامتياز التجاري (الفرانشيز) يتطلب تحويل الخبرة الفردية لصاحب المشروع إلى نظام تشغيلي قابل للتكرار بنفس الجودة في أي مدينة عربية.\n\nتبدأ الرحلة بتقييم اقتصاديات الوحدة الواحدة (Unit Economics) والتأكد من قدرتها على تحقيق هامش ربح يغطي رسوم الامتياز ويحقق عائداً مجزياً للممنوح له. بعد ذلك يتم إعداد أدلة التشغيل القياسية (SOPs)، توحيد سلاسل التوريد، وتسجيل العلامة التجارية وحماية حقوق الملكية الفكرية قبل طرح فرص الامتياز في السوق.',
    content_en:
      'Scaling through franchising requires turning founder intuition into repeatable operating systems that maintain uniform quality across borders.\n\nThe roadmap starts with proving unit economics—ensuring each outlet generates healthy returns even after franchise royalties. Next comes documenting Standard Operating Procedures (SOPs), centralizing supply chain quality, and securing trademark protection prior to regional rollout.',
    category: 'entrepreneurship',
    author_ar: 'أ. سلمى المنصوري — مستشارة الامتياز التجاري',
    author_en: 'Salma El-Mansouri — Franchise Advisory Lead',
    read_minutes: 7,
    image_url: '',
    created_at: '2026-10-25',
  },
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    client_name: 'م. طارق المنياوي',
    project_type: 'مصنع تعبئة وتجميد خضروات — المنطقة الصناعية ببني سويف',
    rating: 5,
    review_text:
      'اعتمدنا على فريق EXPERT في إعداد دراسة الجدوى الشاملة واختيار خط الإنتاج، وبفضل دقة القوائم المالية حصلنا على الموافقة التمويلية من البنك الصناعي خلال 6 أسابيع فقط.',
    created_at: '2026-10-28',
  },
  {
    id: 'rev-2',
    client_name: 'د. سارة العتيبي',
    project_type: 'مجمع عيادات تخصصية — الرياض، السعودية',
    rating: 5,
    review_text:
      'الدراسة التسويقية والمالية كانت واضحة ومبنية على أرقام فعلية للقطاع الطبي في الرياض، كما ساعدتنا خدمة تحليل الحساسية في اتخاذ قرار التوسع بثقة كاملة.',
    created_at: '2026-10-14',
  },
  {
    id: 'rev-3',
    client_name: 'أ. كريم أبو زيد',
    project_type: 'خط إعادة تدوير البلاستيك (PET) — العاشر من رمضان',
    rating: 5,
    review_text:
      'احترافية عالية في المتابعة عبر بوابة العميل والالتزام الصارم بموعد التسليم. مقارنة عروض الموردين وفرت علينا أكثر من 18% من التكلفة الرأسمالية لخط الإنتاج.',
    created_at: '2026-09-30',
  },
  {
    id: 'rev-4',
    client_name: 'أ. نورة الدوسري',
    project_type: 'مشروع فرانشيز مطاعم ومخابز — الدمام',
    rating: 5,
    review_text:
      'استشارات الفرانشيز ونموذج العمل التجاري مع مؤسسة بدر حواس وخبراء EXPERT نقلت علامتنا من فرع واحد إلى التعاقد على ثلاثة فروع جديدة.',
    created_at: '2026-09-12',
  },
  {
    id: 'rev-5',
    client_name: 'م. حسام الشاذلي',
    project_type: 'محطة فرز وتعبئة موالح للتصدير — البحيرة',
    rating: 4,
    review_text:
      'فريق استشاري متمكن جداً في متطلبات التصدير وتأهيل ISO وSASO. التواصل السريع عبر الواتساب والاجتماعات الدورية جعلت التجربة سلسة للغاية.',
    created_at: '2026-08-24',
  },
];

export const SEED_STUDY_REQUESTS: StudyRequest[] = [
  {
    id: 'EXP-2026-1042',
    type: 'comprehensive',
    sector: 'industrial',
    project_name: 'مصنع تعبئة وتجفيف التمور للتصدير',
    location: 'بني سويف، مصر',
    capital_range: '5M - 20M EGP',
    needs_funding: true,
    name: 'أحمد عبد الرحمن',
    phone: '+201009876543',
    email: 'client@expertconsu.com',
    preferred_contact: 'whatsapp',
    status: 'preparing',
    created_at: '2026-11-10T09:30:00Z',
  },
  {
    id: 'EXP-2026-1041',
    type: 'economic',
    sector: 'medical',
    project_name: 'مركز الأشعة والتحاليل المتقدم',
    location: 'جدة، السعودية',
    capital_range: '1M - 5M USD',
    needs_funding: true,
    name: 'د. خالد الغامدي',
    phone: '+966501234567',
    email: 'khalid@clinic-ksa.com',
    preferred_contact: 'email',
    status: 'review',
    created_at: '2026-11-08T14:15:00Z',
  },
  {
    id: 'EXP-2026-1039',
    type: 'technical',
    sector: 'recycling',
    project_name: 'وحدة تدوير مخلفات الورق والكرتون',
    location: 'السادس من أكتوبر، مصر',
    capital_range: '5M - 20M EGP',
    needs_funding: false,
    name: 'م. شريف كامل',
    phone: '+201123456789',
    email: 'sherif@greenpack.eg',
    preferred_contact: 'phone',
    status: 'delivered',
    created_at: '2026-11-03T11:00:00Z',
  },
];

export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-901',
    name: 'أحمد عبد الرحمن',
    phone: '+201009876543',
    email: 'client@expertconsu.com',
    topic: 'مناقشة عروض خطوط إنتاج تعبئة التمور',
    date: '2026-11-18',
    time: '11:00',
    duration: 60,
    type: 'online',
    status: 'confirmed',
    created_at: '2026-11-12T10:00:00Z',
  },
  {
    id: 'APT-902',
    name: 'مريم المنصور',
    phone: '+971504455667',
    email: 'mariam@gulfventures.ae',
    topic: 'استشارة تأسيس شركة خدمات لوجستية',
    date: '2026-11-19',
    time: '14:00',
    duration: 30,
    type: 'online',
    status: 'pending',
    created_at: '2026-11-13T16:20:00Z',
  },
];

export const SEED_CLIENT_DOCS: ClientDocument[] = [
  {
    id: 'doc-1',
    title_ar: 'المسودة الأولية لدراسة السوق والفجوة التنافسية',
    title_en: 'Market Gap & Competitive Benchmark Draft',
    file_type: 'PDF',
    size: '2.4 MB',
    updated_at: '2026-11-11',
  },
  {
    id: 'doc-2',
    title_ar: 'مقارنة عروض أسعار خطوط الإنتاج (3 موردين)',
    title_en: 'Production Line Technical Quote Comparison (3 Vendors)',
    file_type: 'XLSX',
    size: '1.1 MB',
    updated_at: '2026-11-13',
  },
  {
    id: 'doc-3',
    title_ar: 'نموذج التدفقات النقدية التقديرية (5 سنوات)',
    title_en: '5-Year Cash Flow & Sensitivity Model',
    file_type: 'XLSX',
    size: '1.8 MB',
    updated_at: '2026-11-14',
  },
];

export const SEED_CLIENT_MESSAGES: ClientPortalMessage[] = [
  {
    id: 'msg-1',
    sender: 'consultant',
    sender_name_ar: 'م. عمر الشهابي — مستشار أول دراسات الجدوى',
    sender_name_en: 'Eng. Omar El-Shehaby — Lead Feasibility Consultant',
    text_ar:
      'تم الانتهاء من تحليل السوق ومقارنة 3 عروض أسعار لخط تعبئة التمور. نعمل الآن على استكمال القوائم المالية ومعدل تغطية خدمة الدين تمهيداً لمرحلة المراجعة النهائية.',
    text_en:
      'Market analysis and 3 production line vendor quotes are complete. We are currently finalizing the 5-year financial statements and DSCR model ahead of final review.',
    created_at: '2026-11-14 14:30',
  },
  {
    id: 'msg-2',
    sender: 'client',
    sender_name_ar: 'أحمد عبد الرحمن',
    sender_name_en: 'Ahmed Abdelrahman',
    text_ar: 'شكراً لفريق EXPERT على سرعة الإنجاز. هل ملف التمويل متوافق مع شروط البنك الصناعي؟',
    text_en: 'Thank you for the prompt progress. Is the financing dossier aligned with IDB criteria?',
    created_at: '2026-11-14 16:05',
  },
];

export const DEFAULT_ADMIN_PROFILE: AdminProfileConfig = {
  display_name: 'مدير النظام — EXPERT',
  admin_email: 'admin@expertconsu.com',
  updated_at: '2026-11-14T00:00:00Z',
};

export const DEFAULT_SITE_CMS_CONFIG: SiteCmsConfig = {
  hero: {
    badge_ar: 'مصر والشرق الأوسط · دراسات جدوى معتمدة · خطوط إنتاج · جهات تمويل',
    badge_en: 'Egypt & MENA · Bankable Feasibility Studies · Production Lines · Funding Network',
    headline_ar: 'الشريك الاستراتيجي لنجاح مشروعك',
    headline_en: 'Your Strategic Partner for Project Success',
    subheading_ar:
      'نحول رؤيتك الاستثمارية إلى مشروع صناعي أو تجاري قابل للتنفيذ والتمويل، عبر دراسات جدوى اقتصادية دقيقة، تأمين خطوط الإنتاج العالمية، وربط مباشر بأكثر من 52 بنكاً وصندوقاً تمويلياً.',
    subheading_en:
      'We transform investment ideas into bankable industrial and commercial ventures through precision feasibility studies, vetted production lines, and direct access to 52+ regional banks and development funds.',
    cta_primary_ar: 'اطلب دراستك الآن',
    cta_primary_en: 'Request Your Study Now',
    cta_secondary_ar: 'احجز استشارة مجانية',
    cta_secondary_en: 'Book Free Consultation',
    why_subtitle_ar: 'القيمة الاستشارية المضافة',
    why_subtitle_en: 'Strategic Advisory Edge',
    why_title_ar: 'لماذا يختار المستثمرون شركة EXPERT؟',
    why_title_en: 'Why Investors Choose EXPERT',
    welcome_badge_ar: 'تقييم مبدئي مجاني لفكرتك',
    welcome_badge_en: 'Complimentary Initial Assessment',
    welcome_title_ar: 'جاهز لإطلاق مشروعك على أسس اقتصادية راسخة؟',
    welcome_title_en: 'Ready to Launch Your Venture on Verified Economics?',
    welcome_desc_ar:
      'ابدأ معالج طلب الدراسة الذكي في دقيقتين أو احجز جلسة مباشرة مع مستشارينا لمناقشة التمويل وخطوط الإنتاج.',
    welcome_desc_en:
      'Complete our 2-minute Smart Study Request Wizard or book a live session with our consultants to plan funding and equipment.',
  },
  metrics: [
    { key: 'studies', target: 5000, label_ar: 'دراسة جدوى معتمدة', label_en: 'Approved Feasibility Studies' },
    { key: 'requests', target: 95000, label_ar: 'طلب خدمة واستشارة', label_en: 'Advisory & Service Requests' },
    { key: 'experts', target: 350, label_ar: 'مستشار وخبير اقتصادي', label_en: 'Economic & Technical Experts' },
    { key: 'countries', target: 22, label_ar: 'دولة عربية مخدومة', label_en: 'Arab Countries Served' },
  ],
  sectors: SECTORS.map((s) => ({
    id: s.id,
    name_ar: s.name_ar,
    name_en: s.name_en,
    description_ar: s.description_ar,
    description_en: s.description_en,
    price_ar: 'تبدأ من 15,000 ج.م',
    price_en: 'From $950',
  })),
  services: SERVICES_LIST.map((srv) => ({
    id: srv.id,
    code: srv.code,
    title_ar: srv.title_ar,
    title_en: srv.title_en,
    description_ar: srv.description_ar,
    description_en: srv.description_en,
    deliverable_ar: srv.deliverable_ar,
    deliverable_en: srv.deliverable_en,
    price_ar: 'حسب نطاق المشروع',
    price_en: 'Custom Scope',
    icon: srv.icon,
  })),
  about_contact: {
    story_ar:
      'تأسست شركة EXPERT (مؤسسة بدر حواس) لتكون الجسر التنفيذي بين الأفكار الاستثمارية الطموحة والتمويل المصرفي المعتمد، عبر فريق يضم أكثر من 350 خبيراً اقتصادياً ومهندساً قطاعياً في مصر والعالم العربي.',
    story_en:
      'Founded under the Badr Hawas Foundation, EXPERT bridges ambitious investment concepts and bankable institutional financing through 350+ economists and sector engineers across Egypt and MENA.',
    mission_ar:
      'تمكين رواد الأعمال والمصانع من اتخاذ قرارات استثمارية مبنية على بيانات سوقية حقيقية ونماذج مالية معتمدة لدى البنوك وصناديق التنمية.',
    mission_en:
      'Empowering founders and industrialists to deploy capital with confidence through verified market intelligence and credit-committee-ready financial models.',
    footer_tagline_ar:
      'شركة EXPERT للاستشارات الاقتصادية — شريكك الاستراتيجي في إعداد دراسات الجدوى المعتمدة، تأمين خطوط الإنتاج، وربط المشاريع بجهات التمويل في مصر والشرق الأوسط.',
    footer_tagline_en:
      'EXPERT Economic Consultation — your strategic partner for bankable feasibility studies, production line sourcing, and funding connections across Egypt and MENA.',
    phone_primary: '+201142464520',
    phone_secondary: '+201009876543',
    whatsapp_number: '201142464520',
    address_ar: 'بني سويف، جمهورية مصر العربية',
    address_en: 'Beni Suef, Arab Republic of Egypt',
  },
  notifications: {
    public_contact_email: 'info@expertconsu.com',
    notification_email: 'alerts@expertconsu.com',
    alert_on_study_request: true,
    alert_on_booking: true,
    alert_on_contact_message: true,
  },
  production_lines: PRODUCTION_LINES.map((pl) => ({
    ...pl,
    price_ar: 'عرض سعر مخصص',
    price_en: 'Request Quote',
  })),
  production_tabs: PRODUCTION_LINE_TABS.map((tab) => ({ ...tab })),
};

