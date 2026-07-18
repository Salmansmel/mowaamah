import type { Dictionary } from './ar';

export const en: Dictionary = {
  nav: {
    home: 'Home',
    about: 'About Us',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    startProject: 'Get Started',
    brand: 'Mowaama',
  },
  hero: {
    headline: 'Coding Compliance, Designing Your Financial Future',
    subheadline:
      'Intelligent regulatory solutions tailored specifically to your business model. Fast-track your route to licensing.',
    ctaPrimary: 'Start Your Project Now',
    ctaSecondary: 'Learn More',
    trustLabel: 'Aligned and compliant with',
  },
  auth: {
    nafathHeader: 'Sign in via Nafath',
    nafathCaption: 'Secure sign-in using your email',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginTitle: 'Log In',
    signupTitle: 'Create a New Account',
    loginSubmit: 'Log In',
    signupSubmit: 'Create Account',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    goSignup: 'Create one',
    goLogin: 'Log in',
    errorGeneric: 'Something went wrong, please try again.',
    errorInvalidCredential: 'Invalid email or password.',
    errorEmailInUse: 'This email is already in use.',
    errorWeakPassword: 'Password is too weak (min. 6 characters).',
    guestLogin: 'Continue as Guest (Beta Trial)',
    orDivider: 'or',
    guestBadge: 'Beta',
  },
  upload: {
    title: 'Upload Project File',
    sectorLabel: 'Sector',
    sectorFintech: 'Fintech Sector - Digital Payments',
    dropzoneTitle: 'Drag and drop your file here',
    dropzoneOr: 'or',
    dropzoneBrowse: 'Browse Files',
    dropzoneHint: 'PDF or DOCX files, max 2MB',
    errorInvalidType: 'Unsupported file type. Please upload a PDF or DOCX file.',
    errorTooLarge: 'File size exceeds the maximum limit (2MB).',
    submit: 'Start Project Analysis',
    loading: 'Uploading and analyzing file...',
  },
  analysis: {
    scoreLabel: 'Overall Alignment Score',
    riskTitle: 'Risk Assessment',
    riskRegulatory: 'Regulatory Compliance Risk',
    riskCyber: 'Cybersecurity Risk',
    riskOperational: 'Operational Risk',
    gapTitle: 'Gap Analysis',
    gapRequirement: "Regulator's Requirement",
    gapFound: 'Gap Found in Your Document',
    autoCorrect: 'Auto-Correct',
    autoCorrecting: 'Correcting...',
    autoCorrected: 'Corrected',
    exportReport: 'Download Report PDF',
    exporting: 'Preparing...',
    exported: 'Downloaded',
    degradedBadge: 'Approximate result (analysis engine unreachable)',
    showDetailedReport: 'Show Detailed Report',
    suggestedFix: 'Suggested Fix',
    reportGeneratedOn: 'Generated on',
    reportTableTitle: 'Risk Category Summary',
    reportTableCategory: 'Category',
    reportTableScore: 'Score',
    reportTableLevel: 'Level',
    reportBarChartTitle: 'Readiness Indicators',
    reportDonutChartTitle: 'Compliance Indicator Breakdown',
  },
  dashboard: {
    finalReport: 'Final Report',
    title: 'Regulatory Compliance Readiness',
    riskSimTitle: 'Risk Simulation',
    details: 'Details',
    geminiDataTitle: 'Analysis Data (Gemini AI)',
    risksDetected: 'Risks Detected',
    risksUnit: 'risks',
    sectorLabel: 'Sector',
    scoreLabel: 'Overall Score',
    readinessHigh: 'High Readiness',
    readinessMedium: 'Moderate Readiness',
    readinessLow: 'Low Readiness',
    perfExcellent: 'Excellent performance, very low risk.',
    perfModerate: 'Good performance, some risks need attention.',
    perfWeak: 'Weak performance, material risks require urgent action.',
    indicatorsTitle: 'Readiness Indicator Details (Auto-Calculated)',
    indGovernance: 'Governance & Policy',
    indDataProtection: 'Data Protection',
    indSecurity: 'Security & Risk',
    indOverall: 'Overall Compliance',
  },
  detail: {
    back: 'Back to Dashboard',
    howComputed: 'How this value is calculated',
    relatedGaps: 'Related Gaps',
    contributing: 'Contributing Categories',
    noGaps: 'No gaps in this category. Excellent performance!',
    blurbOverall:
      'The overall score summarizes total compliance readiness based on analysis of all regulatory categories and the gaps found in your document.',
    blurbGovernance:
      'This indicator measures how well your document meets governance and regulatory-policy requirements (regulatory compliance) under SAMA controls.',
    blurbDataProtection:
      'This indicator reflects data-protection readiness, computed from cybersecurity controls and the related regulatory-compliance requirements.',
    blurbSecurity:
      'This indicator combines cybersecurity controls and operational risk to assess your security posture and operational resilience.',
    blurbRisks:
      'The complete list of every gap and risk the analysis engine detected when comparing your document against the regulator’s requirements.',
    blurbSector:
      'The regulatory sector your project was analyzed against. Below are all risks detected within this sector.',
  },
  about: {
    eyebrow: 'About Us',
    title: 'Coding Compliance to Accelerate the Future of Startups',
    intro:
      "Mowaama is Saudi Arabia's first automated regulatory-compliance platform, built to serve both regulators and startups.",
    problemTitle: 'The Problem We Solve',
    problemBody:
      'Regulatory approvals can take 6–12 months, and 55% of startups fail at the idea stage due to the cost and time of these procedures. We remove that bottleneck.',
    howTitle: 'How Mowaama Works',
    step1Title: 'Upload Your Project Documents',
    step1Body: 'Submit your technical and regulatory requirement documents as PDF or DOCX.',
    step2Title: 'Document Text Extraction',
    step2Body: 'The platform extracts the text from your PDF or DOCX file ahead of precise analysis.',
    step3Title: 'Smart SAMA Comparison',
    step3Body:
      'The Gemini engine compares the extracted content against the SAMA regulatory requirement dataset to flag every possible gap.',
    step4Title: 'Risk Scoring & Calculation',
    step4Body:
      'Gaps are classified into regulatory, cybersecurity, and operational risk, and an overall readiness score is calculated automatically.',
    step5Title: 'Regulator-Ready Report',
    step5Body:
      "We deliver a risk-assessed model with auto-correction suggestions, comparing your files against the regulator's requirements to speed decisions and cut costs.",
    missionTitle: 'Our Mission',
    missionBody:
      "To empower startups and regulators in Saudi Arabia by automating regulatory compliance — accelerating the licensing path and cutting the cost and time needed to launch innovative financial solutions.",
    visionTitle: 'Our Vision',
    visionBody:
      'To be the leading regional platform for intelligent regulatory compliance, and a trusted partner bridging technical innovation with regulatory commitment in support of Saudi Vision 2030.',
    trustTitle: 'Aligned With Regulatory Frameworks',
    ctaTitle: 'Ready to fast-track your route to licensing?',
    ctaButton: 'Start Your Project Now',
  },
  journey: {
    title: 'Our Journey',
    step1Title: 'The Beginning',
    step1Body:
      'Our participation and first-place win in the Future Economies track of the Eastern Province Government Innovation Hackathon.',
    step1Detail:
      'The Mowaama team took part in the Eastern Province Government Innovation Hackathon, organized in partnership with Imam Abdulrahman Bin Faisal University as part of the Eastern Province governorate\'s initiatives to empower government innovation. The team competed in the "Future Economies and Innovation" track, presenting Mowaama as an integrated technical model for automated regulatory compliance, and won first place in that track amid strong competition from teams representing various universities and entities.',
    step2Title: 'Leading the Pack',
    step2Body:
      'We achieved the highest evaluation score among all participating teams in the hackathon at 78.60%, proving the strength and innovation of our technical solution.',
    step2Detail:
      "Following a rigorous evaluation by the hackathon's judging panel — covering innovation, technical readiness, and real-world impact — the Mowaama team earned the highest final score among all teams competing in the Future Economies and Innovation track, at 78.60%. This result confirms the strength of the technical solution the team built and its ability to address real challenges facing startups in the financial sector.",
    step3Title: 'The Honoring',
    step3Body:
      "The Mowaama team was honored by His Royal Highness Prince Saud bin Naif Al Saud, Governor of the Eastern Province, in recognition of this achievement.",
    step3Detail:
      "As part of his continued support for government innovation initiatives in the Eastern Province, His Royal Highness Prince Saud bin Naif Al Saud, Governor of the Eastern Province, received the winning hackathon teams and honored the Mowaama team in recognition of its first-place achievement — a step that reflects leadership's support for empowering innovative technical solutions that contribute to Saudi Vision 2030's goals.",
    step4Title: 'Academic Recognition',
    step4Body:
      'The team was honored with the Best External Representation award on Technical Day 4 by the President of Shaqra University and the Dean of the College of Computer and Information Technology.',
    step4Detail:
      "Honored with the Best External Representation award on the Fourth Technical Day, presented by the President of Shaqra University and the Dean of the College of Computer and Information Technology. This recognition crowns the team's efforts in achieving first place at the Government Innovation Hackathon, where we were also honored by His Royal Highness the Governor of the Eastern Province.",
    imagePlaceholder: 'Photo coming soon',
    viewDetails: 'View Details',
    close: 'Close',
  },
  common: {
    loading: 'Loading...',
  },
};
