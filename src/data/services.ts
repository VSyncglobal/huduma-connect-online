import { Landmark, FileText, Car, GraduationCap, Palette, CreditCard } from 'lucide-react';

export const SERVICE_CATEGORIES = [
  {
    id: 'gov-official',
    title: 'Government & Official',
    icon: Landmark,
    description: 'eCitizen, KRA, Immigration & Civil Registration.',
    services: ['Passport Application', 'Birth/Death Certificates', 'Good Conduct', 'KRA Returns & PIN', 'Company Registration', 'Land Search']
  },
  {
    id: 'transport',
    title: 'NTSA & Transport',
    icon: Car,
    description: 'Vehicle management and licensing services.',
    services: ['Smart DL Application', 'Logbook Search', 'Transfer of Ownership', 'PSV Badge', 'Inspection Booking']
  },
  {
    id: 'academic',
    title: 'Academic & Professional',
    icon: GraduationCap,
    description: 'KUCCPS, HELB, and Research Assistance.',
    services: ['HELB Application', 'KUCCPS Placement', 'Research Assistance', 'Assignment Typing', 'Exam Registration']
  },
  {
    id: 'media-design',
    title: 'Design & Media',
    icon: Palette,
    description: 'Creative branding and digital assets.',
    services: ['Graphic Design', 'Logo Creation', 'Business Cards', 'Photo Editing', 'Social Media Ads']
  },
  {
    id: 'digital-admin',
    title: 'Admin & Documents',
    icon: FileText,
    description: 'Typing, formatting, and proofreading.',
    services: ['CV/Résumé Writing', 'Report Typing', 'Data Entry', 'Proposal Writing', 'Document Conversion']
  },
  {
    id: 'payments',
    title: 'Payments & Banking',
    icon: CreditCard,
    description: 'Utility bills and banking support.',
    services: ['Token/Bill Payment', 'Online Banking Setup', 'NSSF/NHIF Returns']
  }
];
