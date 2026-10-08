const setupCompanies = [
  {
    id: "1",
    name: "RESPONSIVCODE TECHNOLOGY SOLUTIONS",
    address: "RM301E-3 MEDALLE BLDG. FUENTE OSME\xD1A CAPITOL SITE, CEBU CITY",
    contactNo: "09175734911",
    tinNo: "252-890-529-000",
    status: "Active"
  },
  {
    id: "2",
    name: "RSC TECHNOLOGY AND DEVELOPMENT CORPORATION",
    address: "RM301E-2 MEDALLE BLDG. FUENTE OSME\xD1A CAPITOL SITE, CEBU CITY",
    contactNo: "09175734911",
    tinNo: "690-772-316-000",
    status: "Active"
  }
];
const setupUsers = [
  { id: "USR-001", name: "WEB ADMINISTRATOR", username: "admin", type: "ADMIN", position: "\u2014", branch: "RTS-MAIN", status: "Active" },
  { id: "USR-002", name: "JON-ERIK SAYSON", username: "skip", type: "ADMIN", position: "Admin Manager", branch: "RTS-MAIN", status: "Active" },
  { id: "USR-003", name: "LARKE GELBOLINGO", username: "lark", type: "ADMIN", position: "CEO/President", branch: "RTS-MAIN", status: "Active" },
  { id: "USR-004", name: "CYRUS RANQUE", username: "cyrus", type: "USER", position: "Admin Staff", branch: "RTS-MAIN", status: "Active" },
  { id: "USR-005", name: "NI\xD1O ALONZO", username: "nino", type: "USER", position: "Admin Staff", branch: "RTS-MAIN", status: "Active" }
];
const setupBranches = [
  { code: "BR-001", name: "RTS-MAIN", address: "Cebu City, Cebu", contact: "09175734911", status: "Active" },
  { code: "BR-002", name: "RSC-MAIN", address: "Cebu City, Cebu", contact: "09175734911", status: "Active" }
];
const setupProjects = [
  {
    code: "PRJ-001",
    name: "Cebu Office Expansion",
    customer: "ABC Corporation",
    branch: "RTS-MAIN",
    startDate: "August 1, 2026",
    endDate: "December 31, 2026",
    status: "Active"
  }
];
const setupPositions = [
  { name: "CEO/President", description: "Company head", status: "Active" },
  { name: "Admin Manager", description: "Administration manager", status: "Active" },
  { name: "Admin Staff", description: "Administration staff", status: "Active" },
  { name: "Authorized Personnel", description: "Authorized operations", status: "Active" },
  { name: "Business Development Officer", description: "Business development", status: "Active" },
  { name: "Technical Personnel", description: "Technical operations", status: "Active" }
];
const setupCategories = [
  { code: "CAT-001", name: "IP Camera", description: "IP surveillance cameras", status: "Active" },
  { code: "CAT-002", name: "NVR", description: "Network video recorders", status: "Active" },
  { code: "CAT-003", name: "DVR", description: "Digital video recorders", status: "Active" },
  { code: "CAT-004", name: "Switches/Router", description: "Network switches and routers", status: "Active" },
  { code: "CAT-005", name: "Analog Camera", description: "Analog surveillance cameras", status: "Active" },
  { code: "CAT-006", name: "Cables", description: "Cabling and accessories", status: "Active" }
];
const setupBrands = [
  "HIKVISION",
  "DAHUA",
  "IMOU",
  "CISCO",
  "UBIQUITI",
  "SAMSUNG",
  "SUNMI",
  "BOSCH",
  "LOTUS",
  "KEN",
  "EPSON",
  "HP",
  "INGCO",
  "TPLINK",
  "ANKER",
  "RUIJIE",
  "BROTHER",
  "ROYU",
  "APC",
  "COMLINK",
  "VSOL",
  "SEAGATE",
  "PREMIUM LINE",
  "OMADA BY TPLINK",
  "ZKTECO",
  "ITC",
  "SPON",
  "GOODWE",
  "TIANDY",
  "PANASONIC",
  "ONTI",
  "CCA",
  "WESTERN DIGITAL"
].map((name, i) => ({
  code: `BRD-${String(i + 1).padStart(3, "0")}`,
  name,
  status: "Active"
}));
const setupModels = [
  { brand: "HIKVISION", name: "DS-2CD1023G0-IUF", description: "IP camera", status: "Active" },
  { brand: "HIKVISION", name: "DS-7616NI-Q2", description: "NVR", status: "Active" },
  { brand: "HIKVISION", name: "DS-3E0505P-EM", description: "PoE switch", status: "Active" },
  { brand: "DAHUA", name: "DH-IPC-HFW1230S1-S5", description: "IP camera", status: "Active" },
  { brand: "DAHUA", name: "DHI-NVR5432-EI", description: "NVR", status: "Active" },
  { brand: "DAHUA", name: "DH-PFS3206-4P-96", description: "PoE switch", status: "Active" }
];
const setupUnits = [
  { code: "PCS", name: "PC/S", description: "Pieces", status: "Active" },
  { code: "BOX", name: "BOX/ES", description: "Boxes", status: "Active" },
  { code: "PACK", name: "PACK/S", description: "Packs", status: "Active" },
  { code: "SET", name: "SET", description: "Set", status: "Active" },
  { code: "UNIT", name: "UNIT", description: "Unit", status: "Active" },
  { code: "LOT", name: "LOT", description: "Lot", status: "Active" },
  { code: "METER", name: "METER/S", description: "Meters", status: "Active" },
  { code: "FEET", name: "FEET/FOOT", description: "Feet", status: "Active" }
];
const setupItems = [
  {
    code: "ITM-0001",
    name: "HIKVISION DS-2CD1023G0-IUF",
    category: "IP Camera",
    brand: "HIKVISION",
    model: "DS-2CD1023G0-IUF",
    unit: "PC/S",
    description: "IP camera",
    status: "Active"
  },
  {
    code: "ITM-0002",
    name: "HIKVISION DS-7616NI-Q2",
    category: "NVR",
    brand: "HIKVISION",
    model: "DS-7616NI-Q2",
    unit: "UNIT",
    description: "NVR",
    status: "Active"
  }
];
const companyInfo = {
  name: setupCompanies[0].name,
  address: setupCompanies[0].address,
  phone: setupCompanies[0].contactNo,
  email: "info@responsivcode.example",
  taxInfo: setupCompanies[0].tinNo
};
export {
  companyInfo,
  setupBranches,
  setupBrands,
  setupCategories,
  setupCompanies,
  setupItems,
  setupModels,
  setupPositions,
  setupProjects,
  setupUnits,
  setupUsers
};
