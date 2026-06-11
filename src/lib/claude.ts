import Anthropic from '@anthropic-ai/sdk'
import { BCPData } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateBCPContent(data: BCPData): Promise<string> {
  const prompt = buildPrompt(data)

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')
  return content.text
}

function buildPrompt(data: BCPData): string {
  const { company, people, functions, threats, strategies, itRecovery, communications, maintenance } = data

  return `You are an expert business continuity consultant helping a UK small or medium-sized business create a professional Business Continuity Plan (BCP).

Using the information provided below, write a complete, professional Business Continuity Plan document.

The plan should:
- Be written in clear, plain English appropriate for a business owner
- Follow UK best practice and be consistent with Cabinet Office and BSI BS 65000 guidance
- Include all section headings and be ready to be adopted as a formal document
- Be practical and specific to this business, not generic
- Use a confident, authoritative but accessible tone

---

BUSINESS INFORMATION:
Company Name: ${company.name}
${company.registrationNumber ? `Companies House Number: ${company.registrationNumber}` : ''}
Sector: ${company.sector}
Size: ${company.sizeCategory} (${company.employeeCount} employees)
Address: ${company.address}, ${company.postcode}
${company.description ? `Business Description: ${company.description}` : ''}

BCP OWNER: ${people.bcpOwner.name} (${people.bcpOwner.role}) — ${people.bcpOwner.phone} / ${people.bcpOwner.email}
DEPUTIES: ${people.deputies.map(d => `${d.name} (${d.role})`).join(', ')}
EMERGENCY CONTACTS: ${people.emergencyContacts.map(c => `${c.name} — ${c.phone}`).join(', ')}

CRITICAL FUNCTIONS:
${functions.map(f => `- ${f.name} [${f.priority.toUpperCase()}]: ${f.description}
  RTO: ${f.rto} | RPO: ${f.rpo}
  Dependencies: ${f.dependencies.join(', ') || 'None identified'}
  Minimum staff required: ${f.staffRequired}`).join('\n')}

THREAT ASSESSMENT:
${threats.map(t => `- ${t.threat}: Likelihood ${t.likelihood}, Impact ${t.impact}
  Existing controls: ${t.existingControls || 'None documented'}`).join('\n')}

RECOVERY STRATEGIES:
${strategies.map(s => `- For ${s.threat}:
  Immediate actions: ${s.immediateActions}
  Short-term actions: ${s.shortTermActions}
  Resources needed: ${s.resources}
  Lead person: ${s.responsiblePerson}`).join('\n')}

IT & DATA RECOVERY:
Critical systems: ${itRecovery.criticalSystems.join(', ')}
Cloud services: ${itRecovery.cloudServices.join(', ')}
Backup solution: ${itRecovery.backupSolution}
Backup frequency: ${itRecovery.backupFrequency}
Backup location: ${itRecovery.backupLocation}
IT recovery RTO: ${itRecovery.recoveryTimeObjective}
IT support contact: ${itRecovery.dataRecoveryContact}
Alternative work location: ${itRecovery.alternativeWorkLocation}

COMMUNICATIONS PLAN:
Staff notification: ${communications.staffNotificationMethod}
Customer notification: ${communications.customerNotificationMethod}
Supplier notification: ${communications.supplierNotificationMethod}
Media policy: ${communications.mediaPolicy}
Regulatory notifications: ${communications.regulatoryNotifications}
Internal escalation: ${communications.internalEscalationPath}

MAINTENANCE & TESTING:
Review frequency: ${maintenance.reviewFrequency}
Test frequency: ${maintenance.testFrequency}
Test type: ${maintenance.testType}
Training frequency: ${maintenance.trainingFrequency}

---

Please write the complete Business Continuity Plan document now. Structure it with the following sections:

1. Document Control (version, date, owner, review date)
2. Executive Summary
3. Scope and Objectives
4. Business Profile
5. Key Contacts and Responsibilities
6. Critical Functions and Recovery Priorities
7. Risk Assessment and Threat Register
8. Recovery Strategies (one sub-section per major threat)
9. IT and Data Recovery Plan
10. Communications Plan
11. Return to Normal Operations
12. Plan Maintenance and Testing Schedule
13. Appendices (contact lists, key supplier details placeholder, emergency service numbers)

Write the full document now:`
}
