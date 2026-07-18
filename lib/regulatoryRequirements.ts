import { RegulatoryRequirement } from './types';

export const REGULATORY_REQUIREMENTS: RegulatoryRequirement[] = [
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
