// ─── Core contact type ───────────────────────────────────────────────────────

export interface Contact {
  name: string
  role: string
  phone: string
  email: string
  mobilePhone?: string
}

// ─── BCP wizard data ──────────────────────────────────────────────────────────

export interface CompanyProfile {
  name: string
  registrationNumber?: string
  sector: string
  sizeCategory: 'micro' | 'small' | 'medium'
  employeeCount: number
  address: string
  postcode: string
  website?: string
  description?: string
}

export interface KeyPeople {
  bcpOwner: Contact
  deputies: Contact[]
  emergencyContacts: Contact[]
}

export interface CriticalFunction {
  id: string
  name: string
  description: string
  priority: 'critical' | 'essential' | 'important'
  rto: string // Recovery Time Objective e.g. "4 hours"
  rpo: string // Recovery Point Objective e.g. "24 hours"
  dependencies: string[]
  staffRequired: number
}

export interface ThreatAssessment {
  threat: string
  likelihood: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  existingControls: string
}

export interface RecoveryStrategy {
  threat: string
  immediateActions: string
  shortTermActions: string
  resources: string
  responsiblePerson: string
}

export interface ITRecovery {
  criticalSystems: string[]
  cloudServices: string[]
  backupSolution: string
  backupFrequency: string
  backupLocation: string
  recoveryTimeObjective: string
  dataRecoveryContact: string
  alternativeWorkLocation: string
}

export interface CommunicationsPlan {
  staffNotificationMethod: string
  customerNotificationMethod: string
  supplierNotificationMethod: string
  mediaPolicy: string
  regulatoryNotifications: string
  internalEscalationPath: string
}

export interface MaintenancePlan {
  reviewFrequency: string
  testFrequency: string
  testType: string
  trainingFrequency: string
  bcpOwnerReviewSignoff: string
}

export interface BCPData {
  company: CompanyProfile
  people: KeyPeople
  functions: CriticalFunction[]
  threats: ThreatAssessment[]
  strategies: RecoveryStrategy[]
  itRecovery: ITRecovery
  communications: CommunicationsPlan
  maintenance: MaintenancePlan
}

// ─── Database record ──────────────────────────────────────────────────────────

export interface BCPRecord {
  id: string
  accessToken: string
  createdAt: string
  updatedAt: string
  data: Partial<BCPData>
  generatedContent?: string
  status: 'draft' | 'generating' | 'complete'
  currentStep: number
}

// ─── Wizard step config ───────────────────────────────────────────────────────

export interface WizardStep {
  id: number
  title: string
  description: string
  field: keyof BCPData | null
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: 'Company Profile', description: 'Tell us about your business', field: 'company' },
  { id: 2, title: 'Key People', description: 'Who manages your business continuity', field: 'people' },
  { id: 3, title: 'Critical Functions', description: 'What must keep running during a disruption', field: 'functions' },
  { id: 4, title: 'Threat Assessment', description: 'Identify your key risks', field: 'threats' },
  { id: 5, title: 'Recovery Strategies', description: 'How you will respond to each threat', field: 'strategies' },
  { id: 6, title: 'IT & Data Recovery', description: 'Systems, backups and digital resilience', field: 'itRecovery' },
  { id: 7, title: 'Communications Plan', description: 'Keeping staff, customers and suppliers informed', field: 'communications' },
  { id: 8, title: 'Maintenance & Testing', description: 'Keeping your BCP current and tested', field: 'maintenance' },
  { id: 9, title: 'Generate Your BCP', description: 'Review and generate your Business Continuity Plan', field: null },
]

// ─── Common UK sectors ────────────────────────────────────────────────────────

export const UK_SECTORS = [
  'Agriculture, forestry and fishing',
  'Construction',
  'Education',
  'Financial and insurance activities',
  'Health and social care',
  'Hospitality and food service',
  'Information and communication (IT/Tech)',
  'Legal and professional services',
  'Manufacturing',
  'Real estate activities',
  'Retail',
  'Transport and storage',
  'Wholesale and trade',
  'Other',
]

export const COMMON_THREATS = [
  'Cyber attack or data breach',
  'IT or systems failure',
  'Loss of key staff / key person dependency',
  'Supply chain disruption',
  'Premises unavailable (fire, flood, damage)',
  'Severe weather / extreme weather event',
  'Power or utilities failure',
  'Pandemic or widespread illness',
  'Financial loss / insolvency of a key customer',
  'Regulatory or legal action',
  'Reputational damage',
]
