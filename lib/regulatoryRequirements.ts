import { RegulatoryRequirement } from './types';

/** Requirements applicable to ALL fintech sectors (payments + open banking) */
export const COMMON_REQUIREMENTS: RegulatoryRequirement[] = [
  {
    id: 'sama-cust-authn',
    source: 'SAMA',
    clauseRef: 'IT Governance Framework — Customer Authentication',
    textAr:
      'يجب على مقدم خدمة المدفوعات الرقمية تطبيق مصادقة ثنائية العامل (2FA) لجميع عمليات تسجيل الدخول والمعاملات المالية الحساسة، مع توثيق آلية المصادقة المستخدمة.',
    textEn:
      'The digital payment service provider must implement two-factor authentication (2FA) for all login sessions and sensitive financial transactions, with documentation of the authentication mechanism used.',
    category: 'cybersecurity',
  },
  {
    id: 'sama-data-residency',
    source: 'SAMA',
    clauseRef: 'Cyber Security Framework — Data Residency',
    textAr:
      'يجب تخزين ومعالجة بيانات العملاء الحساسة داخل المملكة العربية السعودية، ولا يجوز نقلها خارج الحدود إلا بموافقة تنظيمية صريحة.',
    textEn:
      'Sensitive customer data must be stored and processed within the Kingdom of Saudi Arabia, and may not be transferred outside its borders without explicit regulatory approval.',
    category: 'regulatory',
  },
  {
    id: 'sama-incident-response',
    source: 'SAMA',
    clauseRef: 'Cyber Security Framework — Incident Response Plan',
    textAr:
      'يجب أن يكون لدى المنشأة خطة موثقة للاستجابة للحوادث السيبرانية، تتضمن إجراءات الإبلاغ للجهة التنظيمية خلال مدة لا تتجاوز 24 ساعة من اكتشاف الحادث.',
    textEn:
      'The entity must maintain a documented cyber incident response plan, including procedures for notifying the regulator within no more than 24 hours of incident discovery.',
    category: 'cybersecurity',
  },
  {
    id: 'sama-capital-adequacy',
    source: 'SAMA',
    clauseRef: 'Payment Services Provider Regulations — Capital Requirements',
    textAr:
      'يجب على مقدم خدمات المدفوعات الاحتفاظ بحد أدنى من رأس المال المدفوع يتناسب مع حجم المعاملات المتوقع، وتقديم إثبات كفاية رأس المال ضمن الملف التنظيمي.',
    textEn:
      'The payment service provider must maintain a minimum paid-up capital proportionate to expected transaction volume, and submit proof of capital adequacy within the regulatory file.',
    category: 'regulatory',
  },
  {
    id: 'sama-aml-kyc',
    source: 'SAMA',
    clauseRef: 'AML/CFT Rules — Customer Due Diligence',
    textAr:
      'يجب تطبيق إجراءات اعرف عميلك (KYC) ومكافحة غسل الأموال (AML) على جميع العملاء قبل تفعيل الحساب، بما يشمل التحقق من الهوية عبر نفاذ أو ما يعادله.',
    textEn:
      'Know-Your-Customer (KYC) and Anti-Money-Laundering (AML) procedures must be applied to all customers before account activation, including identity verification via Nafath or an equivalent mechanism.',
    category: 'regulatory',
  },
  {
    id: 'sama-data-encryption',
    source: 'SAMA',
    clauseRef: 'Cyber Security Framework — Data Encryption',
    textAr:
      'يجب تشفير جميع البيانات المالية الحساسة أثناء النقل والتخزين باستخدام خوارزميات تشفير معتمدة (مثل AES-256 وTLS 1.2 أو أحدث).',
    textEn:
      'All sensitive financial data must be encrypted both in transit and at rest using approved encryption algorithms (e.g., AES-256 and TLS 1.2 or later).',
    category: 'cybersecurity',
  },
  {
    id: 'sama-business-continuity',
    source: 'SAMA',
    clauseRef: 'Business Continuity Management Framework',
    textAr:
      'يجب توفر خطة استمرارية أعمال معتمدة تتضمن نظام تعافي من الكوارث بحد أقصى زمن استرداد (RTO) لا يتجاوز 4 ساعات للأنظمة الحساسة.',
    textEn:
      'An approved business continuity plan must be in place, including a disaster recovery system with a Recovery Time Objective (RTO) of no more than 4 hours for critical systems.',
    category: 'operational',
  },
  {
    id: 'sama-outsourcing',
    source: 'SAMA',
    clauseRef: 'Outsourcing Policy — Third-Party Risk',
    textAr:
      'يجب الحصول على موافقة تنظيمية مسبقة قبل الاستعانة بمصادر خارجية لأي وظيفة جوهرية، مع إجراء تقييم مخاطر شامل للطرف الثالث.',
    textEn:
      'Prior regulatory approval must be obtained before outsourcing any critical function, along with a comprehensive third-party risk assessment.',
    category: 'operational',
  },
  {
    id: 'sama-transaction-monitoring',
    source: 'SAMA',
    clauseRef: 'AML/CFT Rules — Transaction Monitoring',
    textAr:
      'يجب تطبيق نظام آلي لمراقبة المعاملات المالية بشكل مستمر لرصد الأنماط المشبوهة، مع إبلاغ وحدة التحريات المالية عند الاقتضاء.',
    textEn:
      'An automated system must continuously monitor financial transactions to detect suspicious patterns, with reporting to the Financial Intelligence Unit when warranted.',
    category: 'regulatory',
  },
  {
    id: 'sama-staff-training',
    source: 'SAMA',
    clauseRef: 'Operational Resilience Framework — Staff Competency',
    textAr:
      'يجب توثيق برنامج تدريب دوري للموظفين المعنيين بالامتثال والأمن السيبراني، مع الاحتفاظ بسجلات الحضور وتقييم الكفاءة.',
    textEn:
      'A documented periodic training program must be in place for staff involved in compliance and cybersecurity, with attendance and competency assessment records retained.',
    category: 'operational',
  },
];

/** Requirements ONLY for Open Banking (AISP) sector */
export const OPEN_BANKING_REQUIREMENTS: RegulatoryRequirement[] = [
  {
    id: 'ob-no-credential-storage',
    source: 'SAMA Open Banking',
    clauseRef: 'Open Banking Policy — Credential Prohibition',
    textAr:
      'يُمنع منعاً باتاً على مقدم خدمة المعلومات (AISP) تخزين أو حفظ بيانات اعتماد العميل البنكية (اسم المستخدم وكلمة المرور). يجب استخدام بروتوكول OAuth 2.0 أو ما يعادله للوصول المفوض للبيانات دون الاطلاع على بيانات الدخول.',
    textEn:
      'An Account Information Service Provider (AISP) is strictly prohibited from storing or retaining customer bank credentials (username and password). OAuth 2.0 or equivalent delegated authorization protocol must be used to access data without exposure to login credentials.',
    category: 'cybersecurity',
  },
  {
    id: 'ob-explicit-granular-consent',
    source: 'SAMA Open Banking',
    clauseRef: 'Open Banking Policy — Explicit Granular Consent',
    textAr:
      'يجب الحصول على موافقة صريحة ومفصلة من العميل لكل نوع بيانات يتم الوصول إليه (مثل: الرصيد، المعاملات) بشكل منفصل. لا يجوز تجميع الموافقات في موافقة واحدة شاملة ضمن الشروط والأحكام العامة.',
    textEn:
      'Explicit and granular consent must be obtained from the customer for each type of data accessed (e.g., balance, transactions) separately. Bundling all consents into a single blanket agreement within general Terms & Conditions is prohibited.',
    category: 'regulatory',
  },
  {
    id: 'ob-data-minimization',
    source: 'SAMA/NDMO',
    clauseRef: 'Personal Data Protection Law — Data Minimization',
    textAr:
      'يجب ألا يجمع التطبيق إلا البيانات الضرورية لتقديم الخدمة المحددة. جمع بيانات غير ضرورية (مثل: جهات الاتصال، سجل المكالمات، الموقع الجغرافي GPS) بدون مبرر خدمي مباشر يُعد مخالفة صريحة لنظام حماية البيانات الشخصية.',
    textEn:
      'The application must only collect data necessary for the specified service. Collecting unnecessary data (e.g., contacts, call logs, GPS location) without direct service justification is an explicit violation of the Personal Data Protection Law (PDPL).',
    category: 'regulatory',
  },
  {
    id: 'ob-data-retention-limit',
    source: 'SAMA/NDMO',
    clauseRef: 'Personal Data Protection Law — Data Retention',
    textAr:
      'يجب تحديد فترة احتفاظ بالبيانات الشخصية والمالية بوضوح، ولا يجوز الاحتفاظ بها إلى أجل غير مسمى. يجب حذف البيانات فور انتهاء الغرض منها أو بناءً على طلب العميل.',
    textEn:
      'A clear data retention period must be defined for personal and financial data. Indefinite or lifetime retention is prohibited. Data must be deleted once its purpose has been fulfilled or upon customer request.',
    category: 'regulatory',
  },
  {
    id: 'ob-third-party-sharing',
    source: 'SAMA/NDMO',
    clauseRef: 'Personal Data Protection Law — Third-Party Data Sharing',
    textAr:
      'لا يجوز مشاركة بيانات العملاء المالية مع أطراف ثالثة (مثل: وكالات إعلانية أو متاجر) إلا بموافقة صريحة ومنفصلة من العميل، مع تحديد الغرض والطرف المستلم بدقة. الاكتفاء بإزالة الأسماء (Anonymization) لا يكفي إذا كان يمكن إعادة تعريف الهوية.',
    textEn:
      'Customer financial data must not be shared with third parties (e.g., advertising agencies, e-commerce platforms) without explicit and separate customer consent specifying the purpose and recipient. Pseudonymization alone is insufficient if re-identification is possible.',
    category: 'regulatory',
  },
  {
    id: 'ob-right-to-revoke',
    source: 'SAMA Open Banking',
    clauseRef: 'Open Banking Policy — Right to Revoke Access',
    textAr:
      'يجب أن يتمكن العميل من سحب موافقته وإلغاء ربط حساباته البنكية في أي وقت، ويجب أن يؤدي ذلك فوراً إلى وقف الوصول للبيانات وحذف البيانات المخزنة خلال مدة محددة.',
    textEn:
      'The customer must be able to revoke consent and unlink bank accounts at any time. Revocation must immediately stop data access and trigger deletion of stored data within a defined timeframe.',
    category: 'regulatory',
  },
];

/** Helper: get requirements for a sector */
export function getRequirementsForSector(sector: string): RegulatoryRequirement[] {
  if (sector === 'open-banking-aisp') {
    return [...COMMON_REQUIREMENTS, ...OPEN_BANKING_REQUIREMENTS];
  }
  return COMMON_REQUIREMENTS;
}

/** Legacy export for backward compatibility */
export const REGULATORY_REQUIREMENTS = COMMON_REQUIREMENTS;
