/**
 * Single source of truth for DARL's public content.
 *
 * Editorial rule: only publish facts DARL can substantiate. Anything marked
 * `TODO(DARL)` needs confirmation from the laboratory before launch.
 */

export const site = {
  name: "Delhi Analytical Research Laboratory",
  shortName: "DARL",
  established: 2016,
  tagline: "First Know About It Then It",
  description:
    "Advanced analytical testing and quality assurance solutions for food, water, environment, pharmaceuticals, materials and industrial products.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: { display: "097173 24010", href: "tel:+919717324010", e164: "+91-9717324010" },
  email: "darltesting@gmail.com",
  address: {
    // TODO(DARL): add plot/building number and PIN code.
    lines: ["Jhilmil Industrial Area", "New Delhi, Delhi, India"],
    locality: "New Delhi",
    region: "Delhi",
    country: "IN",
  },
  // TODO(DARL): confirm working hours.
  hours: [
    { days: "Monday – Saturday", time: "9:30 AM – 6:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  mapQuery: "Delhi Analytical Research Laboratory, Jhilmil Industrial Area, New Delhi",
} as const;

export const nav = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#standards", label: "Standards" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
] as const;

export const trustItems = [
  "Established 2016",
  "Analytical Testing",
  "Quality & Compliance",
  "Industrial Testing",
  "Professional Reporting",
] as const;

export type ServiceIcon = "food" | "water" | "environment" | "pharma" | "pipe" | "material";

export type Service = {
  id: string;
  title: string;
  icon: ServiceIcon;
  summary: string;
  detail: string;
  sampleTypes: string[];
};

// Descriptions stay at the level of "what kind of work" — specific parameters
// and methods are confirmed per enquiry against DARL's current scope.
export const services: Service[] = [
  {
    id: "food",
    title: "Food Testing",
    icon: "food",
    summary: "Analytical testing that supports food safety, quality and labelling decisions.",
    detail:
      "For manufacturers, processors, exporters and brand owners who need independent evidence about what is in their product before it reaches the market.",
    sampleTypes: ["Raw materials & ingredients", "Processed & packaged foods", "Beverages", "Finished products"],
  },
  {
    id: "water",
    title: "Water Testing",
    icon: "water",
    summary: "Testing of water samples to check suitability against the requirement you specify.",
    detail:
      "For utilities, housing societies, industries and bottlers who need to know how their water measures up before they rely on it.",
    sampleTypes: ["Drinking water", "Packaged water", "Process water", "Groundwater & source water"],
  },
  {
    id: "environment",
    title: "Environmental Testing",
    icon: "environment",
    summary: "Environmental sample analysis to support monitoring and compliance reporting.",
    detail:
      "For industrial units and consultants who need defensible data for environmental monitoring and regulatory submissions.",
    sampleTypes: ["Effluent & wastewater", "Soil", "Ambient & source samples", "Industrial discharge"],
  },
  {
    id: "pharma",
    title: "Pharmaceutical Testing",
    icon: "pharma",
    summary: "Quality testing of pharmaceutical materials and products.",
    detail:
      "For manufacturers and suppliers who need independent verification of materials and finished products against the applicable specification.",
    sampleTypes: ["Raw materials", "Excipients", "Finished formulations", "Herbal & traditional products"],
  },
  {
    id: "pipe",
    title: "Plastic & Pipe Testing",
    icon: "pipe",
    summary: "Testing of plastic pipes and fittings against the Indian Standard specified by you.",
    detail:
      "For pipe and fitting manufacturers, contractors and buyers who need evidence that product conforms to the relevant IS specification.",
    sampleTypes: ["PVC-U & CPVC pipes", "Polyethylene pipes", "Injection-moulded fittings", "Irrigation laterals"],
  },
  {
    id: "material",
    title: "Material & Industrial Testing",
    icon: "material",
    summary: "Testing of industrial materials and products for quality and conformity.",
    detail:
      "For manufacturers, procurement teams and contractors who need objective data on incoming material or finished goods.",
    sampleTypes: ["Polymers & compounds", "Industrial raw materials", "Construction materials", "Finished industrial goods"],
  },
];

export const industries = [
  { title: "Food & Beverage", icon: "food" },
  { title: "Pharmaceuticals", icon: "pharma" },
  { title: "Water & Utilities", icon: "water" },
  { title: "Plastic & Pipe", icon: "pipe" },
  { title: "Manufacturing", icon: "factory" },
  { title: "Environmental", icon: "environment" },
  { title: "Construction", icon: "construction" },
  { title: "Industrial Materials", icon: "material" },
] as const;

export type StandardCategory =
  | "Water supply pipes"
  | "Drainage & sewerage"
  | "Fittings"
  | "Irrigation"
  | "Gas distribution"
  | "Borewell"
  | "Other";

export type Standard = {
  code: string;
  /** Abbreviated subject of the standard. `null` = not yet confirmed by DARL. */
  title: string | null;
  category: StandardCategory;
};

// Short titles only; the current BIS edition is authoritative. Scope of
// testing against each standard is confirmed per sample.
export const standards: Standard[] = [
  { code: "IS 4984", title: "Polyethylene pipes for water supply", category: "Water supply pipes" },
  { code: "IS 4985", title: "Unplasticized PVC pipes for potable water supplies", category: "Water supply pipes" },
  { code: "IS 15778", title: "Chlorinated PVC (CPVC) pipes for potable hot and cold water", category: "Water supply pipes" },
  { code: "IS 14333", title: "High density polyethylene pipes for sewerage", category: "Drainage & sewerage" },
  { code: "IS 15328", title: "Unplasticized non-pressure PVC pipes for underground drainage and sewerage", category: "Drainage & sewerage" },
  { code: "IS 13592", title: "Unplasticized PVC pipes for soil and waste discharge systems", category: "Drainage & sewerage" },
  { code: "IS 14735", title: "Unplasticized PVC injection-moulded fittings for soil and waste discharge", category: "Fittings" },
  { code: "IS 7834", title: "Injection-moulded PVC socket fittings with solvent cement joints for water supplies", category: "Fittings" },
  { code: "IS 12786", title: "Irrigation equipment — polyethylene pipes for irrigation laterals", category: "Irrigation" },
  { code: "IS 13487", title: "Irrigation equipment — emitters", category: "Irrigation" },
  { code: "IS 13488", title: "Irrigation equipment — emitting pipes systems", category: "Irrigation" },
  { code: "IS 14885", title: "Polyethylene pipes for the supply of gaseous fuel", category: "Gas distribution" },
  { code: "IS 12818", title: "Unplasticized PVC screen and casing pipes for bore/tubewells", category: "Borewell" },
  // TODO(DARL): confirm short titles for the two standards below.
  { code: "IS 17425", title: null, category: "Other" },
  { code: "IS 16647", title: null, category: "Other" },
];

export type Credential = {
  id: string;
  acronym: string;
  body: string;
  about: string;
  /**
   * Set to true ONLY after the certificate has been checked against the
   * issuing body's public register. Unverified credentials are shown as
   * "details on request" and never as a held accreditation.
   */
  verified: boolean;
  certificateNo?: string;
  validUntil?: string;
  scopeUrl?: string;
};

export const credentials: Credential[] = [
  {
    id: "nabl",
    acronym: "NABL",
    body: "National Accreditation Board for Testing and Calibration Laboratories",
    about: "Assesses the technical competence of testing laboratories against ISO/IEC 17025.",
    verified: false,
  },
  {
    id: "bis",
    acronym: "BIS",
    body: "Bureau of Indian Standards",
    about: "India's national standards body; recognises laboratories for product-certification testing.",
    verified: false,
  },
  {
    id: "fssai",
    acronym: "FSSAI",
    body: "Food Safety and Standards Authority of India",
    about: "Regulates food safety in India and notifies laboratories for food analysis.",
    verified: false,
  },
  {
    id: "apeda",
    acronym: "APEDA",
    body: "Agricultural & Processed Food Products Export Development Authority",
    about: "Recognises laboratories for testing agricultural and processed food exports.",
    verified: false,
  },
  {
    id: "ayush",
    acronym: "AYUSH",
    body: "Ministry of Ayush, Government of India",
    about: "Approves laboratories for testing Ayurveda, Siddha, Unani and Homoeopathy drugs.",
    verified: false,
  },
  {
    id: "cpcb",
    acronym: "CPCB",
    body: "Central Pollution Control Board",
    about: "Recognises environmental laboratories under the Environment (Protection) Act, 1986.",
    verified: false,
  },
];

export const processSteps = [
  { title: "Requirement", text: "Share the product, the purpose and the standard or specification you need to meet." },
  { title: "Sample Submission", text: "Submit your sample with the details we confirm — quantity, packing and labelling." },
  { title: "Laboratory Testing", text: "Samples are logged, coded and tested against the agreed method." },
  { title: "Analysis", text: "Results are reviewed and checked against the requirement before release." },
  { title: "Testing Report", text: "You receive a clear, professional test report you can act on." },
] as const;

export const evidenceChain = ["Sample", "Science", "Analysis", "Evidence", "Confidence"] as const;
