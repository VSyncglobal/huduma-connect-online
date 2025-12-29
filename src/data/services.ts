import { 
  Landmark, FileText, Car, GraduationCap, 
  Palette, CreditCard, Laptop
} from 'lucide-react';

// --- INTERFACES ---

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'tel' | 'date' | 'file' | 'textarea' | 'select';
  required: boolean;
  options?: string[]; // For select inputs
  helperText?: string;
}

export interface ServiceItem {
  id: string;
  slug: string; // URL friendly ID
  category: string;
  title: string;
  description?: string;
  price: number;
  serviceFee?: number; // <--- ADDED THIS PROPERTY (Optional)
  requirements: string[];
  turnaround: string;
  formFields: FormField[]; // The Smart Engine Data
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: any;
  description: string;
  items: ServiceItem[];
}

// --- THE FULL CATALOG ---

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'gov-official',
    title: 'Government & Official',
    icon: Landmark,
    description: 'eCitizen, KRA, Immigration & Civil Registration.',
    items: [
      {
        id: 'passport-application',
        slug: 'passport-application',
        category: 'Immigration',
        title: 'Passport Application (New)',
        description: 'First-time application. We handle eCitizen booking & forms.',
        price: 2500,
        requirements: ['Original ID', 'Birth Certificate', 'Parents IDs', 'Digital Photo'],
        turnaround: '10-15 Days',
        formFields: [
          { id: 'birth_entry_no', label: 'Birth Cert Entry Number', type: 'text', required: true, helperText: 'Found on the top right of the certificate' },
          { id: 'occupation', label: 'Occupation', type: 'text', required: true },
          { id: 'file_id', label: 'Upload ID (Front & Back)', type: 'file', required: true },
          { id: 'file_birth_cert', label: 'Upload Birth Certificate', type: 'file', required: true },
          { id: 'file_parents_id', label: 'Upload Parents IDs', type: 'file', required: true },
          { id: 'file_photo', label: 'Passport Photo (White Background)', type: 'file', required: true }
        ]
      },
      {
        id: 'passport-renewal',
        slug: 'passport-renewal',
        category: 'Immigration',
        title: 'Passport Renewal',
        description: 'Renewal of expired, filled, or mutilated passport.',
        price: 2000,
        requirements: ['Old Passport', 'Original ID', 'Passport Photos'],
        turnaround: '10 Days',
        formFields: [
          { id: 'old_passport_no', label: 'Old Passport Number', type: 'text', required: true },
          { id: 'file_old_passport_bio', label: 'Upload Old Passport Bio Page', type: 'file', required: true },
          { id: 'file_id', label: 'Upload ID', type: 'file', required: true },
          { id: 'file_photo', label: 'Passport Photo', type: 'file', required: true }
        ]
      },
      {
        id: 'birth-certificate',
        slug: 'birth-certificate',
        category: 'Civil Registration',
        title: 'Birth Certificate Application',
        description: 'Application for a new birth certificate.',
        price: 1500,
        requirements: ['Notification of Birth', 'Parents ID', 'Clinic Card'],
        turnaround: '5-7 Days',
        formFields: [
          { id: 'notification_no', label: 'Birth Notification Number', type: 'text', required: true },
          { id: 'hospital_name', label: 'Hospital of Birth', type: 'text', required: true },
          { id: 'file_notification', label: 'Upload Notification Slip', type: 'file', required: true },
          { id: 'file_parents_id', label: 'Upload Parents IDs', type: 'file', required: true }
        ]
      },
      {
        id: 'death-certificate',
        slug: 'death-certificate',
        category: 'Civil Registration',
        title: 'Death Certificate App',
        description: 'Official registration of death.',
        price: 1500,
        requirements: ['Burial Permit', 'Deceased ID', 'Applicant ID'],
        turnaround: '5-7 Days',
        formFields: [
          { id: 'deceased_name', label: 'Deceased Full Name', type: 'text', required: true },
          { id: 'deceased_id', label: 'Deceased ID Number', type: 'text', required: true },
          { id: 'burial_permit_no', label: 'Burial Permit Number', type: 'text', required: true },
          { id: 'file_burial_permit', label: 'Upload Burial Permit', type: 'file', required: true },
          { id: 'file_deceased_id', label: 'Upload Deceased ID', type: 'file', required: true }
        ]
      },
      {
        id: 'good-conduct',
        slug: 'good-conduct',
        category: 'DCI',
        title: 'Good Conduct (PCC)',
        description: 'Police Clearance Certificate application.',
        price: 1550,
        requirements: ['Original ID', 'Huduma Namba (Optional)'],
        turnaround: '3-5 Days',
        formFields: [
          { id: 'id_number', label: 'ID Number', type: 'text', required: true },
          { id: 'fingerprint_location', label: 'Preferred Fingerprint Center', type: 'text', required: true, helperText: 'e.g., Huduma Center Nyeri' },
          { id: 'file_id', label: 'Upload ID', type: 'file', required: true }
        ]
      },
      {
        id: 'marriage-certificate',
        slug: 'marriage-certificate',
        category: 'Civil Registration',
        title: 'Marriage Certificate',
        description: 'Registration of marriage (AG).',
        price: 3000,
        requirements: ['Both IDs', 'Witness IDs', 'Affidavits'],
        turnaround: '21 Days',
        formFields: [
          { id: 'groom_name', label: 'Groom Name', type: 'text', required: true },
          { id: 'bride_name', label: 'Bride Name', type: 'text', required: true },
          { id: 'file_ids', label: 'Upload Couple IDs', type: 'file', required: true },
          { id: 'file_witness', label: 'Upload Witness IDs', type: 'file', required: true }
        ]
      },
      {
        id: 'company-registration',
        slug: 'company-registration',
        category: 'Business',
        title: 'Company Registration',
        description: 'Limited Company registration with Registrar.',
        price: 5000,
        requirements: ['Proposed Names', 'Director IDs', 'KRA PINs', 'Passport Photos'],
        turnaround: '3-5 Days',
        formFields: [
          { id: 'proposed_name_1', label: 'Proposed Name (Option 1)', type: 'text', required: true },
          { id: 'proposed_name_2', label: 'Proposed Name (Option 2)', type: 'text', required: true },
          { id: 'proposed_name_3', label: 'Proposed Name (Option 3)', type: 'text', required: true },
          { id: 'nature_business', label: 'Nature of Business', type: 'text', required: true },
          { id: 'file_directors', label: 'Upload Directors IDs & KRA', type: 'file', required: true },
          { id: 'file_photos', label: 'Upload Directors Photos', type: 'file', required: true }
        ]
      },
      {
        id: 'business-name',
        slug: 'business-name',
        category: 'Business',
        title: 'Business Name Search',
        description: 'Search and reservation of business name.',
        price: 1000,
        requirements: ['Proposed Business Names', 'Nature of Business'],
        turnaround: '24 Hours',
        formFields: [
          { id: 'proposed_name', label: 'Proposed Business Name', type: 'text', required: true },
          { id: 'file_id', label: 'Upload Owner ID', type: 'file', required: true }
        ]
      },
      {
        id: 'land-search',
        slug: 'land-search',
        category: 'Lands',
        title: 'Land Search',
        description: 'Official title deed search.',
        price: 1500,
        requirements: ['Title Deed Copy', 'ID Copy', 'KRA PIN'],
        turnaround: '24-48 Hours',
        formFields: [
          { id: 'title_number', label: 'Title Number / Parcel No', type: 'text', required: true },
          { id: 'file_title', label: 'Upload Title Deed Copy', type: 'file', required: true },
          { id: 'file_id', label: 'Upload ID', type: 'file', required: true }
        ]
      },
      {
        id: 'kra-pin-reg',
        slug: 'kra-pin-reg',
        category: 'KRA',
        title: 'KRA PIN Registration',
        description: 'New PIN generation for individuals.',
        price: 500,
        requirements: ['Original ID', 'Email', 'Phone'],
        turnaround: 'Instant',
        formFields: [
          { id: 'id_number', label: 'ID Number', type: 'text', required: true },
          { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
          { id: 'district', label: 'District of Birth', type: 'text', required: true },
          { id: 'mother_name', label: 'Mothers Name', type: 'text', required: true },
          { id: 'file_id', label: 'Upload ID', type: 'file', required: true }
        ]
      },
      {
        id: 'kra-returns',
        slug: 'kra-returns',
        category: 'KRA',
        title: 'KRA Returns (Nil/Employment)',
        description: 'Filing of annual tax returns.',
        price: 500,
        requirements: ['KRA PIN', 'P9 Form (if employed)', 'Password'],
        turnaround: '24 Hours',
        formFields: [
          { id: 'kra_pin', label: 'KRA PIN', type: 'text', required: true },
          { id: 'kra_password', label: 'iTax Password', type: 'text', required: false, helperText: 'Leave blank if you want us to reset it' },
          { id: 'return_type', label: 'Return Type', type: 'select', required: true, options: ['Nil Return', 'Employment (P9)'] },
          { id: 'file_p9', label: 'Upload P9 Form (If Employed)', type: 'file', required: false }
        ]
      },
      {
        id: 'tax-compliance',
        slug: 'tax-compliance',
        category: 'KRA',
        title: 'Tax Compliance Cert',
        description: 'Application for TCC.',
        price: 1000,
        requirements: ['KRA PIN', 'Password'],
        turnaround: 'Instant',
        formFields: [
          { id: 'kra_pin', label: 'KRA PIN', type: 'text', required: true },
          { id: 'kra_password', label: 'iTax Password', type: 'text', required: true }
        ]
      }
    ]
  },
  {
    id: 'transport',
    title: 'NTSA & Transport',
    icon: Car,
    description: 'Vehicle management and licensing services.',
    items: [
      {
        id: 'smart-dl',
        slug: 'smart-dl',
        category: 'NTSA',
        title: 'Smart DL Application',
        description: 'Apply for the new digital driving license.',
        price: 3550,
        requirements: ['Old DL', 'ID Copy', 'Blood Group Report'],
        turnaround: 'Instant Booking',
        formFields: [
          { id: 'id_number', label: 'ID Number', type: 'text', required: true },
          { id: 'old_dl_no', label: 'Old DL Number', type: 'text', required: false },
          { id: 'blood_group', label: 'Blood Group', type: 'text', required: false },
          { id: 'file_id', label: 'Upload ID', type: 'file', required: true }
        ]
      },
      {
        id: 'pdv-licence-renew',
        slug: 'pdv-licence-renew',
        category: 'NTSA',
        title: 'Driving Licence Renewal',
        description: '1 Year or 3 Years renewal.',
        price: 1000,
        requirements: ['Expired DL', 'NTSA Account'],
        turnaround: 'Instant',
        formFields: [
          { id: 'id_number', label: 'ID Number', type: 'text', required: true },
          { id: 'duration', label: 'Duration', type: 'select', required: true, options: ['1 Year', '3 Years'] },
          { id: 'ntsa_password', label: 'NTSA Password', type: 'text', required: false }
        ]
      },
      {
        id: 'logbook-search',
        slug: 'logbook-search',
        category: 'NTSA',
        title: 'Motor Vehicle Search',
        description: 'Confirm vehicle ownership details.',
        price: 1000,
        requirements: ['Car Reg Number', 'ID Copy'],
        turnaround: '15 Minutes',
        formFields: [
          { id: 'reg_number', label: 'Vehicle Registration No.', type: 'text', required: true },
          { id: 'file_id', label: 'Upload Your ID', type: 'file', required: true }
        ]
      },
      {
        id: 'transfer-ownership',
        slug: 'transfer-ownership',
        category: 'NTSA',
        title: 'Transfer of Ownership',
        description: 'Transfer vehicle from seller to buyer.',
        price: 2500,
        requirements: ['Original Logbook', 'Seller ID', 'Buyer ID'],
        turnaround: '3 Days',
        formFields: [
          { id: 'reg_number', label: 'Registration Number', type: 'text', required: true },
          { id: 'seller_id', label: 'Seller ID', type: 'text', required: true },
          { id: 'buyer_id', label: 'Buyer ID', type: 'text', required: true },
          { id: 'file_logbook', label: 'Upload Logbook', type: 'file', required: true },
          { id: 'file_ids', label: 'Upload Both IDs', type: 'file', required: true }
        ]
      },
      {
        id: 'psv-badge',
        slug: 'psv-badge',
        category: 'NTSA',
        title: 'PSV Badge Application',
        description: 'Application for PSV driver/conductor badge.',
        price: 1500,
        requirements: ['Valid DL', 'Good Conduct', 'ID Copy'],
        turnaround: '5 Days',
        formFields: [
          { id: 'dl_number', label: 'DL Number', type: 'text', required: true },
          { id: 'file_dl', label: 'Upload DL', type: 'file', required: true },
          { id: 'file_good_conduct', label: 'Upload Good Conduct', type: 'file', required: true }
        ]
      },
      {
        id: 'inspection-booking',
        slug: 'inspection-booking',
        category: 'NTSA',
        title: 'Vehicle Inspection Booking',
        description: 'Book inspection date and center.',
        price: 1000,
        requirements: ['Logbook', 'NTSA Account'],
        turnaround: 'Instant',
        formFields: [
          { id: 'reg_number', label: 'Registration Number', type: 'text', required: true },
          { id: 'preferred_center', label: 'Preferred Inspection Center', type: 'text', required: true },
          { id: 'file_logbook', label: 'Upload Logbook', type: 'file', required: true }
        ]
      }
    ]
  },
  {
    id: 'academic',
    title: 'Academic & Professional',
    icon: GraduationCap,
    description: 'KUCCPS, HELB, and Research Assistance.',
    items: [
      {
        id: 'helb-application',
        slug: 'helb-application',
        category: 'Education',
        title: 'HELB Loan Application',
        description: 'First time or Subsequent loan application.',
        price: 1500,
        requirements: ['ID Copy', 'Admission Letter', 'Guarantors'],
        turnaround: 'As per Deadline',
        formFields: [
          { id: 'index_number', label: 'KCSE Index Number', type: 'text', required: true },
          { id: 'university', label: 'University/College Name', type: 'text', required: true },
          { id: 'file_admission', label: 'Upload Admission Letter', type: 'file', required: true },
          { id: 'file_id', label: 'Upload ID', type: 'file', required: true }
        ]
      },
      {
        id: 'kuccps-placement',
        slug: 'kuccps-placement',
        category: 'Education',
        title: 'KUCCPS Application',
        description: 'Course selection and revision.',
        price: 1500,
        requirements: ['KCSE Index Number', 'Selected Courses'],
        turnaround: 'As per Deadline',
        formFields: [
          { id: 'index_number', label: 'KCSE Index Number', type: 'text', required: true },
          { id: 'kcpe_index', label: 'KCPE Index Number', type: 'text', required: true },
          { id: 'preferred_courses', label: 'Preferred Courses (Comma separated)', type: 'textarea', required: true }
        ]
      },
      {
        id: 'tsc-registration',
        slug: 'tsc-registration',
        category: 'Education',
        title: 'TSC Registration',
        description: 'Registration for Teachers.',
        price: 2000,
        requirements: ['Academic Certs', 'GP 69 Form', 'Good Conduct'],
        turnaround: '30 Days',
        formFields: [
          { id: 'tsc_number', label: 'TSC Number (If available)', type: 'text', required: false },
          { id: 'file_certs', label: 'Upload Academic Certs (PDF)', type: 'file', required: true },
          { id: 'file_gp69', label: 'Upload GP 69 Form', type: 'file', required: true }
        ]
      },
      {
        id: 'assignment-typing',
        slug: 'assignment-typing',
        category: 'Professional',
        title: 'Assignment Typing',
        description: 'Digitizing handwritten work.',
        price: 50,
        requirements: ['Handwritten Draft or Audio'],
        turnaround: 'Per Page Rate',
        formFields: [
          { id: 'instructions', label: 'Formatting Instructions', type: 'textarea', required: false },
          { id: 'file_draft', label: 'Upload Draft (Photo/PDF)', type: 'file', required: true }
        ]
      },
      {
        id: 'research-assistance',
        slug: 'research-assistance',
        category: 'Professional',
        title: 'Research Assistance',
        description: 'Assistance with academic research projects.',
        price: 3000,
        requirements: ['Topic', 'Guidelines'],
        turnaround: 'Variable',
        formFields: [
          { id: 'topic', label: 'Research Topic', type: 'text', required: true },
          { id: 'guidelines', label: 'Detailed Guidelines', type: 'textarea', required: true },
          { id: 'file_rubric', label: 'Upload Rubric (Optional)', type: 'file', required: false }
        ]
      }
    ]
  },
  {
    id: 'media-design',
    title: 'Design & Media',
    icon: Palette,
    description: 'Creative branding and digital assets.',
    items: [
      {
        id: 'graphic-design',
        slug: 'graphic-design',
        category: 'Design',
        title: 'Poster / Flyer Design',
        description: 'Custom graphics for marketing.',
        price: 1500,
        requirements: ['Content Text', 'Preferred Colors', 'Images'],
        turnaround: '24 Hours',
        formFields: [
          { id: 'design_brief', label: 'Describe what you need', type: 'textarea', required: true },
          { id: 'preferred_colors', label: 'Preferred Colors', type: 'text', required: false },
          { id: 'file_assets', label: 'Upload Logos/Images', type: 'file', required: false }
        ]
      },
      {
        id: 'logo-design',
        slug: 'logo-design',
        category: 'Design',
        title: 'Professional Logo',
        description: 'Unique logo design for your brand.',
        price: 2500,
        requirements: ['Business Name', 'Slogan'],
        turnaround: '48 Hours',
        formFields: [
          { id: 'biz_name', label: 'Business Name', type: 'text', required: true },
          { id: 'slogan', label: 'Slogan (Optional)', type: 'text', required: false },
          { id: 'style', label: 'Style (e.g., Minimalist, Corporate)', type: 'text', required: true }
        ]
      },
      {
        id: 'business-cards',
        slug: 'business-cards',
        category: 'Design',
        title: 'Business Card Design',
        description: 'Print-ready business card layout.',
        price: 1000,
        requirements: ['Logo', 'Contact Details'],
        turnaround: '24 Hours',
        formFields: [
          { id: 'details', label: 'Name, Phone, Email, Role', type: 'textarea', required: true },
          { id: 'file_logo', label: 'Upload Logo', type: 'file', required: true }
        ]
      },
      {
        id: 'photo-editing',
        slug: 'photo-editing',
        category: 'Design',
        title: 'Passport Photo Resizing',
        description: 'Resize/Background removal for official use.',
        price: 200,
        requirements: ['Digital Photo'],
        turnaround: 'Instant',
        formFields: [
          { id: 'instructions', label: 'Specific Requirements', type: 'text', required: false, helperText: 'e.g., 2x2 inch, white background' },
          { id: 'file_photo', label: 'Upload Photo', type: 'file', required: true }
        ]
      }
    ]
  },
  {
    id: 'digital-admin',
    title: 'Admin & Documents',
    icon: FileText,
    description: 'Typing, formatting, and proofreading.',
    items: [
      {
        id: 'cv-writing',
        slug: 'cv-writing',
        category: 'Admin',
        title: 'Professional CV Design',
        description: 'Modern CV/Resume writing.',
        price: 1500,
        requirements: ['Current CV', 'Experience Details'],
        turnaround: '24 Hours',
        formFields: [
          { id: 'experience', label: 'Brief Work History', type: 'textarea', required: false },
          { id: 'file_old_cv', label: 'Upload Old CV (if available)', type: 'file', required: false }
        ]
      },
      {
        id: 'cover-letter',
        slug: 'cover-letter',
        category: 'Admin',
        title: 'Cover Letter Writing',
        description: 'Tailored cover letter for job apps.',
        price: 1000,
        requirements: ['Job Description', 'CV'],
        turnaround: '24 Hours',
        formFields: [
          { id: 'job_desc', label: 'Paste Job Description', type: 'textarea', required: true },
          { id: 'file_cv', label: 'Upload Your CV', type: 'file', required: true }
        ]
      },
      {
        id: 'data-entry',
        slug: 'data-entry',
        category: 'Admin',
        title: 'Data Entry Services',
        description: 'Digitizing physical records.',
        price: 500,
        requirements: ['Source Data'],
        turnaround: 'Hourly Rate',
        formFields: [
          { id: 'instructions', label: 'Instructions', type: 'textarea', required: true },
          { id: 'file_source', label: 'Upload Source Files', type: 'file', required: true }
        ]
      }
    ]
  },
  {
    id: 'payments',
    title: 'Payments & Banking',
    icon: CreditCard,
    description: 'Utility bills and banking support.',
    items: [
      {
        id: 'bill-payment',
        slug: 'bill-payment',
        category: 'Utilities',
        title: 'Token / Water Bill',
        description: 'Fast payment processing.',
        price: 100,
        requirements: ['Meter Number', 'Amount'],
        turnaround: 'Instant',
        formFields: [
          { id: 'bill_type', label: 'Bill Type', type: 'select', required: true, options: ['KPLC Token', 'Water Bill', 'WiFi'] },
          { id: 'account_no', label: 'Meter/Account Number', type: 'text', required: true },
          { id: 'amount', label: 'Amount to Pay', type: 'number', required: true }
        ]
      },
      {
        id: 'nssf-nhif',
        slug: 'nssf-nhif',
        category: 'Statutory',
        title: 'NSSF / NHIF Returns',
        description: 'Monthly statutory deductions filing.',
        price: 300,
        requirements: ['Employer Portal Login'],
        turnaround: 'Monthly',
        formFields: [
          { id: 'portal_credentials', label: 'Portal Username/Pass', type: 'textarea', required: false, helperText: 'We will contact you securely if blank' },
          { id: 'file_payroll', label: 'Upload Payroll/Excel', type: 'file', required: true }
        ]
      },
      {
        id: 'banking-support',
        slug: 'banking-support',
        category: 'Banking',
        title: 'Online Banking Setup',
        description: 'Assistance setting up apps/internet banking.',
        price: 500,
        requirements: ['Bank Account Details', 'ID'],
        turnaround: 'Assisted',
        formFields: [
          { id: 'bank_name', label: 'Bank Name', type: 'text', required: true },
          { id: 'issue', label: 'Describe the Issue', type: 'textarea', required: true }
        ]
      }
    ]
  },
  {
    id: 'training',
    title: 'Online Training',
    icon: Laptop,
    description: 'Digital literacy and platform guidance.',
    items: [
      {
        id: 'computer-basics',
        slug: 'computer-basics',
        category: 'Training',
        title: 'Basic Computer Skills',
        description: 'Introduction to Word, Excel, Email.',
        price: 3000,
        requirements: ['Laptop/PC', 'Internet'],
        turnaround: '5 Sessions',
        formFields: [
          { id: 'preferred_time', label: 'Preferred Time', type: 'text', required: true },
          { id: 'current_level', label: 'Current Knowledge Level', type: 'select', required: true, options: ['Beginner', 'Intermediate'] }
        ]
      },
      {
        id: 'platform-training',
        slug: 'platform-training',
        category: 'Training',
        title: 'Zoom/Teams/Google Class',
        description: 'How to use online meeting platforms.',
        price: 1000,
        requirements: ['Device'],
        turnaround: '1 Session',
        formFields: [
          { id: 'platform', label: 'Platform to Learn', type: 'text', required: true },
          { id: 'device_type', label: 'Device (Laptop/Phone)', type: 'text', required: true }
        ]
      }
    ]
  }
];

// --- HELPERS ---

export function getServiceBySlug(slug: string) {
  for (const category of SERVICE_CATEGORIES) {
    const found = category.items?.find(item => item.slug === slug || item.id === slug);
    if (found) return found;
  }
  return null;
}

export const searchServices = (query: string) => {
  const q = query.toLowerCase();
  const results: ServiceItem[] = [];
  SERVICE_CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      if (item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) results.push(item);
    });
  });
  return results;
};