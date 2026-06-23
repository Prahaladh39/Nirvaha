export const CURRENT_CONSENT_VERSION = '1.1.0';

export interface ConsentSection {
  title: string;
  content: string[];
}

export const TERMS_AND_CONDITIONS: ConsentSection[] = [
  {
    title: '1. Introduction',
    content: [
      'Welcome to Nirvaha. By accessing or using our mobile application, you agree to be bound by these Terms & Conditions. Please read them carefully.',
      'Nirvaha is a preventive self-care application. Our services support your emotional well-being through structured exercises and AI-assisted conversational interfaces.',
      'By using Nirvaha, you acknowledge that your journey is unique and that our tools are designed to facilitate mindfulness and self-guided self-improvement.',
    ],
  },
  {
    title: '2. Eligibility',
    content: [
      'To use Nirvaha, you must be of legal age to form a binding contract in your jurisdiction (typically 18 years or older). If you are under the legal age, you may only use Nirvaha under the supervision of a parent or legal guardian who agrees to these Terms.',
      'You represent that all information you provide during registration is accurate, current, and complete. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      'You agree to use Nirvaha strictly for lawful purposes and in compliance with all local, national, and international laws.',
    ],
  },
  {
    title: '3. Acceptable Use',
    content: [
      'You agree to use Nirvaha in a respectful and lawful manner. You specifically agree NOT to:',
      '• Harass, abuse, stalk, threaten, or defame other users or staff.',
      '• Upload, post, or transmit any illegal, harmful, hateful, obscene, or infringing content.',
      '• Attempt to reverse engineer, decompile, disassemble, or extract source code from the application.',
      '• Misuse, manipulate, or attempt to exploit the AI companion interfaces or jailbreak prompts.',
      '• Exploit, probe, or test the vulnerabilities of our security networks or systems.',
      '• Impersonate any person or entity, or falsely state your affiliation with any person or entity.',
      '• Abuse services, bypass rate limits, or perform automated scraping or data harvesting.',
      '• Distribute viruses, malware, or other harmful software programs.',
      '• Attempt unauthorized access to our servers, databases, or user accounts.',
    ],
  },
  {
    title: '4. AI Companion Disclaimer',
    content: [
      'Nirvaha integrates generative artificial intelligence (AI) companions designed to support emotional well-being and offer reflection guidance.',
      'CRITICAL NOTICE: AI companions are conversational tools for wellness support and self-reflection. THEY DO NOT REPLACE MEDICAL PROFESSIONALS, CLINICAL PSYCHOLOGISTS, PSYCHIATRISTS, EMERGENCY HEALTHCARE SERVICES, OR PROFESSIONAL COUNSELLING.',
      'If you are experiencing a mental health crisis, severe distress, or thoughts of self-harm, please contact national emergency services or crisis hotlines immediately. Nirvaha does not provide emergency intervention services.',
    ],
  },
  {
    title: '5. Wellness Disclaimer',
    content: [
      'All content, exercises, guided audios, reflections, and insights available in Nirvaha are provided for educational, reflective, and self-development purposes only.',
      'The service does not constitute medical advice, diagnosis, or treatment. You should never disregard professional medical advice or delay seeking it because of information or reflections obtained through Nirvaha.',
      'Use of Nirvaha does not establish a therapist-patient relationship.',
    ],
  },
  {
    title: '6. Intellectual Property',
    content: [
      'All content, layout, designs, branding, logos, graphics, icons, system architecture, media assets, software code, and proprietary AI prompts utilized within the app are the exclusive property of Nirvaha and its licensors.',
      'You are granted a limited, personal, non-exclusive, non-transferable, and revocable license to access and use the app for personal, non-commercial purposes. Any unauthorized copying, distribution, modification, or commercial exploitation is strictly prohibited.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'Nirvaha is provided on an "as-is" and "as-available" basis. We offer no guarantees of uninterrupted, secure, or error-free operations.',
      'To the maximum extent permitted by law, Nirvaha, its developers, and partners shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, our services, or from inaccuracies in AI-generated outputs.',
    ],
  },
  {
    title: '8. Account Suspension',
    content: [
      'We reserve the right to suspend or restrict access to your account at our sole discretion, without prior notice, if we believe you have violated these Terms, engaged in fraudulent or abusive behavior, violated safety guidelines, or engaged in illegal activities.',
    ],
  },
  {
    title: '9. Termination',
    content: [
      'You have the right to terminate your relationship with Nirvaha at any time by deleting your account through the application settings or by requesting deletion.',
      'Nirvaha reserves the right to terminate our services, delete user accounts, or modify features at any time, subject to local regulatory requirements.',
    ],
  },
  {
    title: '10. Governing Law',
    content: [
      'These Terms and Conditions shall be governed by, construed, and enforced in accordance with the laws of India.',
      'Any disputes arising out of or in connection with these Terms, including any questions regarding their existence, validity, or termination, shall be subject to the exclusive jurisdiction of the competent courts in India.',
    ],
  },
];

export const PRIVACY_POLICY: ConsentSection[] = [
  {
    title: '1. Information We Collect',
    content: [
      'To provide our personalized wellness companion services, we collect the following data categories:',
      '• Account Information: Name, email address, and authentication credentials.',
      '• Interactive Responses: Quiz selections, personality assessments, and historical score milestones.',
      '• AI Conversation Data: Chat message logs with your AI companions.',
      '• Device Information: Device model, operating system, unique identifiers, and app settings.',
      '• Usage Logs: App performance metrics, analytics event data, and crash logs.',
      '• User Media: Images or documents uploaded voluntarily by you for profile customisation or contextual logging.',
    ],
  },
  {
    title: '2. Why We Collect Data',
    content: [
      'We process your data strictly to fulfill the following purposes:',
      '• Maintaining your user account and handling authentication.',
      '• Personalizing your app experience and theme settings.',
      '• Generating relevant responses from your AI companions.',
      '• Formulating insights, progress analytics, and wellness recommendations.',
      '• Troubleshooting bugs, analyzing performance, and preventing fraudulent activities.',
    ],
  },
  {
    title: '3. AI Processing',
    content: [
      'Your interactive conversations with AI companions are securely processed to generate guidance and insights.',
      'We transmit message logs to secure, third-party AI model providers strictly to compute responses. These logs are transmitted using industry-standard encryption.',
      'We DO NOT sell, rent, or trade your conversations or reflections. Processing is limited to the minimum necessary to provide the interactive emotional support features.',
    ],
  },
  {
    title: '4. Data Security',
    content: [
      'We employ robust, industry-standard administrative, physical, and technical safeguards to secure your personal data.',
      'Data transmission is protected using SSL/TLS encryption, and data in storage is protected using secure cloud databases and local encryption methods. Access to sensitive logs is strictly limited through role-based access control systems.',
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      'We retain your personal data only as long as is necessary to support your active account or to fulfill the purposes outlined in this policy.',
      'You can request the deletion of your account and associated personal data at any time. Upon receiving a valid deletion request, your files will be purged securely within statutory timelines.',
    ],
  },
  {
    title: '6. User Rights',
    content: [
      'You are entitled to key rights regarding your personal information, including:',
      '• Right to Access: View the categories of personal data we maintain about you.',
      '• Right to Correction: Update or rectify inaccurate or incomplete profile details.',
      '• Right to Deletion: Request the permanent erasure of your AI logs and user profile.',
      '• Right to Withdraw Consent: Revoke previously granted permissions for data processing (which may limit access to specific features).',
      '• Right to Grievance Redressal: Raise queries, complaints, or feedback with our data compliance officer.',
    ],
  },
  {
    title: '7. Cookies / Local Storage',
    content: [
      'We utilize local device storage (AsyncStorage) to store security tokens, theme and layout preferences, and consent configuration data.',
      'This data is stored on your device to enable quick startup, offline usability, and maintain your login state without relying entirely on a persistent internet connection.',
    ],
  },
  {
    title: '8. Third-party Services',
    content: [
      'We collaborate with trusted service providers to run our app infrastructure. We share data only with the following provider categories:',
      '• Authentication Providers: To verify and maintain your identity securely.',
      '• Cloud Database and Storage Providers: To store your data securely.',
      '• AI Model Providers: To process text inputs and generate reflections/chats.',
      '• Analytics and Crash Reporting Providers: To record performance diagnostics and crashes.',
      '• Push Notification Services: To send reminders and affirmations.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    content: [
      'Nirvaha is not directed at children under the age of 18 (or the applicable statutory age in your jurisdiction). We do not knowingly collect personal data from children. If we discover that we have inadvertently collected data from a child without verifiable parental consent, we will purge it immediately.',
    ],
  },
  {
    title: '10. Policy Updates',
    content: [
      'We may update this Privacy Policy from time to time. If we introduce substantial updates, we will notify you inside the app or via email, and seek renewed consent when legally required.',
    ],
  },
];

export const DPDP_ACT_COMPLIANCE: ConsentSection = {
  title: 'Digital Personal Data Protection Act (DPDP), 2023 Compliance',
  content: [
    'In accordance with India\'s Digital Personal Data Protection Act, 2023, and the Digital Personal Data Protection Rules, 2025:',
    '• Consent-Based Processing: We only collect and process your personal data based on your explicit, specific, and clear consent.',
    '• Purpose Limitation: Your personal data is processed solely for the preventive self-care features you authorize.',
    '• Data Minimization: We collect only the minimum required information necessary to run Nirvaha.',
    '• Storage Limitation: We only retain your personal data for as long as your account remains active or as required by law.',
    '• Security Safeguards: We implement appropriate security standards to prevent data breaches or unauthorized access.',
    '• Grievance Redressal: You can report any data protection concerns, grievances, or seek clarification from our Data Protection Officer by contacting us through the app.',
    '• User Rights: You have the right to access a summary of your data, correct inaccuracies, withdraw your consent at any time, and request complete erasure of your account.',
  ],
};

export const GLOBAL_PRIVACY_PRINCIPLES: ConsentSection = {
  title: 'International Privacy & Guiding Principles',
  content: [
    'Nirvaha is committed to maintaining high standards of data protection for all users. We align our data processing with globally recognized privacy principles, including those inspired by the General Data Protection Regulation (GDPR):',
    '• Transparency: We explain our data collection methods clearly and keep our privacy documentation accessible.',
    '• Purpose Limitation: We never repurpose or reuse your data for unrelated secondary activities (such as advertising tracking) without your explicit permission.',
    '• Data Minimization: We restrict our data collection to what is relevant and necessary for providing our wellness companion.',
    '• Accuracy: We provide tools that allow you to easily keep your personal details updated and correct.',
    '• Security & Confidentiality: Your conversations and assessments are treated with strict confidentiality and protected using secure transmission and storage.',
    '• Accountability: We design our internal workflows to ensure compliance and accountability for the data entrusted to us.',
  ],
};
