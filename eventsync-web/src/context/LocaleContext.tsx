"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Locale = "en" | "es";

interface Translations {
  appName: string;
  tagline: string;
  navLaunchpad: string;
  navEngine: string;
  navCommand: string;
  langSwitchAria: string;

  // Launchpad (Home Page)
  launchHeader: string;
  launchSubheader: string;
  launchCustomButton: string;
  templateBirthdayTitle: string;
  templateBirthdayDesc: string;
  templateWeddingTitle: string;
  templateWeddingDesc: string;
  templateEcoTitle: string;
  templateEcoDesc: string;
  templateCustomTitle: string;
  templateCustomDesc: string;

  // Atmosphere Engine (Input Form)
  engineTitle: string;
  engineSubtitle: string;
  vibeSectionTitle: string;
  categoryLabel: string;
  atmosphereLabel: string;
  atmospherePlaceholder: string;
  telemetrySectionTitle: string;
  dateLabel: string;
  locationLabel: string;
  guestLabel: string;
  budgetLabel: string;
  priorityMatrixTitle: string;
  priorityLimitNotice: string;
  priorityGourmet: string;
  priorityEntertainment: string;
  priorityDecor: string;
  priorityEco: string;
  prioritySound: string;
  priorityLogistics: string;
  dietaryAccessTitle: string;
  dietVegetarian: string;
  dietVegan: string;
  dietHalal: string;
  accessWheelchair: string;
  accessSensory: string;
  accessGlutenFree: string;
  synthesizeButton: string;
  synthesizingButton: string;

  // Command Center
  commandCenterTitle: string;
  countdownPrefix: string;
  tabOverview: string;
  tabFinance: string;
  tabVendors: string;
  tabCopilot: string;
  statGuests: string;
  statBudget: string;
  statLocation: string;
  statAuraGrade: string;

  // Overview Tab
  orbitTimelineTitle: string;
  orbitSubtitle: string;
  criticalActionsTitle: string;
  actionPermits: string;
  actionAudio: string;
  actionCatering: string;
  actionRSVP: string;

  // Financial Pulse Tab
  financialPulseTitle: string;
  burnRateTitle: string;
  burnRateDesc: string;
  budgetCap: string;
  committed: string;
  reserveBuffer: string;
  costBreakdownTitle: string;

  // Live Copilot
  copilotHeader: string;
  copilotPlaceholder: string;
  copilotSendAria: string;
  copilotSample1: string;
  copilotSample2: string;
  copilotSample3: string;

  // Legacy Compatibility Keys
  formTitle: string;
  formSubtitle: string;
  eventTypeLabel: string;
  eventTypeWedding: string;
  eventTypeBirthday: string;
  eventTypeCommunity: string;
  eventTypeCorporate: string;
  eventDateLabel: string;
  totalBudgetLabel: string;
  guestCountLabel: string;
  themeLabel: string;
  themePlaceholder: string;
  constraintsLabel: string;
  constraintsPlaceholder: string;
  generateButton: string;
  generatingButton: string;
  formErrorAria: string;

  planTitle: string;
  sustainabilityBadge: string;
  scoreOutOf100: string;
  keyRecsTitle: string;
  timelineTitle: string;
  ecoTipLabel: string;
  vendorIdeasTitle: string;
  outOfTheBoxSubtitle: string;
  pitchLabel: string;
  estimatedCostLabel: string;
  ecoFriendlyBadge: string;
  importVendorsButton: string;
  importVendorsSuccess: string;
  budgetBreakdownTitle: string;

  dashboardTitle: string;
  dashboardSubtitle: string;
  selectEventLabel: string;
  totalBudgetCard: string;
  allocatedCard: string;
  actualSpentCard: string;
  varianceCard: string;
  budgetProgressAria: string;
  budgetAllocationHealth: string;
  vendorChecklistTitle: string;
  addVendorButton: string;
  vendorNameHeader: string;
  categoryHeader: string;
  statusHeader: string;
  costHeader: string;
  ecoHeader: string;
  actionHeader: string;
  statusPending: string;
  statusContacted: string;
  statusContracted: string;
  statusPaid: string;
  statusDeclined: string;

  opsTitle: string;
  opsSubtitle: string;
  simulateIncidentLabel: string;
  incidentOptionRain: string;
  incidentOptionPower: string;
  incidentOptionCateringDelay: string;
  triggerPivotButton: string;
  pivotingButton: string;
  severityLabel: string;
  instantActionTitle: string;
  timelineAdjustmentsTitle: string;
  vendorAlertsTitle: string;
  safeguardTitle: string;
}

const dictionaries: Record<Locale, Translations> = {
  en: {
    appName: "Aura",
    tagline: "Next-Gen AI Event Architecture & Command Center",
    navLaunchpad: "Launchpad",
    navEngine: "Atmosphere Engine",
    navCommand: "Command Center",
    langSwitchAria: "Change application language. Current language: English",

    launchHeader: "Launch an Experience",
    launchSubheader: "Select a curated aesthetic template or engineer a completely custom event architecture powered by Gemini AI.",
    launchCustomButton: "Open Atmosphere Engine",
    templateBirthdayTitle: "Neon Cyber-Birthday",
    templateBirthdayDesc: "High-octane synthwave aesthetics, laser projection mapping, and kinetic cocktail bars.",
    templateWeddingTitle: "Grand Heritage Wedding",
    templateWeddingDesc: "Architectural botanical pavilions, candlelit acoustic courtyards, and organic vineyard dining.",
    templateEcoTitle: "Zero-Waste Eco-Fair",
    templateEcoDesc: "Closed-loop circular gastronomy, solar-battery stage rigs, and zero single-use plastics.",
    templateCustomTitle: "Custom Aura",
    templateCustomDesc: "Define bespoke atmospheric telemetry, spatial constraints, and personalized sensory parameters.",

    engineTitle: "The Atmosphere Engine",
    engineSubtitle: "Configure environmental vectors, sensory parameters, and financial boundaries.",
    vibeSectionTitle: "The Vibe Check",
    categoryLabel: "Experience Archetype",
    atmosphereLabel: "Describe the atmosphere & sensory vibe",
    atmospherePlaceholder: "e.g., cyberpunk neon, royal vintage ballroom, organic minimalist eco-retreat...",
    telemetrySectionTitle: "Logistics & Spatial Telemetry",
    dateLabel: "Execution Date",
    locationLabel: "Target Location / Venue",
    guestLabel: "Expected Cohort (Guests)",
    budgetLabel: "Total Budget (USD)",
    priorityMatrixTitle: "The Priority Matrix",
    priorityLimitNotice: "Select up to 3 core focal points",
    priorityGourmet: "Gourmet Gastronomy",
    priorityEntertainment: "High-Energy Entertainment",
    priorityDecor: "Flawless Spatial Decor",
    priorityEco: "Low Carbon Footprint",
    prioritySound: "Immersive Soundscape",
    priorityLogistics: "Frictionless Logistics",
    dietaryAccessTitle: "Dietary & Accessibility Directives",
    dietVegetarian: "Vegetarian",
    dietVegan: "100% Vegan",
    dietHalal: "Halal Certified",
    accessWheelchair: "Step-Free / ADA",
    accessSensory: "Sensory-Quiet Zone",
    accessGlutenFree: "Gluten-Free Only",
    synthesizeButton: "Engage Aura Engine",
    synthesizingButton: "Synthesizing Event Telemetry...",

    commandCenterTitle: "Aura Command Center",
    countdownPrefix: "T-Minus",
    tabOverview: "Command Overview",
    tabFinance: "Financial Pulse",
    tabVendors: "Vendor Matrix",
    tabCopilot: "AI Copilot",
    statGuests: "Cohort Size",
    statBudget: "Budget Envelope",
    statLocation: "Deployment Zone",
    statAuraGrade: "Sustainability Index",

    orbitTimelineTitle: "The Orbit Timeline",
    orbitSubtitle: "Synchronized run-sheet and temporal milestone sequence",
    criticalActionsTitle: "Critical Flight Checks",
    actionPermits: "Execute municipal acoustic & spatial permits",
    actionAudio: "Verify battery storage load test on stage audio rig",
    actionCatering: "Confirm closed-loop zero-waste catering contract",
    actionRSVP: "Push digital QR credentials to guest cohort",

    financialPulseTitle: "Financial Pulse & Capital Efficiency",
    burnRateTitle: "Capital Burn Rate & Allocation Health",
    burnRateDesc: "Committed vendor contracts versus reserve contingency buffer",
    budgetCap: "Budget Cap",
    committed: "Committed",
    reserveBuffer: "Reserve Buffer",
    costBreakdownTitle: "Category Allocation Breakdown",

    copilotHeader: "Live Aura Copilot",
    copilotPlaceholder: "Adjust the Aura... (e.g., 'Trim catering budget by 10%', 'Add sensory calm area')",
    copilotSendAria: "Transmit instruction to Aura Copilot",
    copilotSample1: "Cut budget by 10%",
    copilotSample2: "Rain contingency pivot",
    copilotSample3: "Add zero-proof bar",

    // Legacy Compatibility Keys
    formTitle: "Create Intelligent Event Plan",
    formSubtitle: "Powered by Google Gemini with deep eco-sustainability scoring",
    eventTypeLabel: "Event Category",
    eventTypeWedding: "Eco-Luxury Wedding",
    eventTypeBirthday: "Milestone Birthday",
    eventTypeCommunity: "Community & Civic Festival",
    eventTypeCorporate: "Green Corporate Summit",
    eventDateLabel: "Event Date",
    totalBudgetLabel: "Total Budget (USD)",
    guestCountLabel: "Estimated Guest Count",
    themeLabel: "Atmosphere & Theme (Optional)",
    themePlaceholder: "e.g., Rustic Solar Chic, Neon Cyber Garden",
    constraintsLabel: "Eco-Constraints & Dietary Directives",
    constraintsPlaceholder: "e.g., 100% plant-based, zero single-use plastics, local flora only",
    generateButton: "Synthesize AI Event Blueprint",
    generatingButton: "Engaging Gemini AI...",
    formErrorAria: "Form submission error alert",

    planTitle: "Synthesized Event Blueprint",
    sustainabilityBadge: "Eco-Sustainability Index",
    scoreOutOf100: "Score: {score} / 100",
    keyRecsTitle: "Key Sustainability Directives",
    timelineTitle: "Synchronized Hourly Timeline",
    ecoTipLabel: "Eco Action Tip",
    vendorIdeasTitle: "Curated Out-of-the-Box Vendor Concepts",
    outOfTheBoxSubtitle: "Unconventional, high-impact sustainable partner proposals",
    pitchLabel: "Concept Pitch:",
    estimatedCostLabel: "Est. Allocation:",
    ecoFriendlyBadge: "Certified Eco-Friendly",
    importVendorsButton: "Import Concepts to Vendor Tracker",
    importVendorsSuccess: "Vendors imported successfully to active dashboard!",
    budgetBreakdownTitle: "Estimated Category Allocation",

    dashboardTitle: "Budget & Vendor Telemetry",
    dashboardSubtitle: "Track budget allocations vs real expenditures with vendor status control",
    selectEventLabel: "Active Event Focus:",
    totalBudgetCard: "Total Allocated Budget",
    allocatedCard: "Vendor Commitments",
    actualSpentCard: "Actual Disbursed",
    varianceCard: "Remaining Buffer",
    budgetProgressAria: "Budget allocation progress bar",
    budgetAllocationHealth: "Budget Allocation Health",
    vendorChecklistTitle: "Vendor Operational Checklist",
    addVendorButton: "+ Add Custom Vendor",
    vendorNameHeader: "Vendor Entity",
    categoryHeader: "Category",
    statusHeader: "Operational Status",
    costHeader: "Cost (Est. / Actual)",
    ecoHeader: "Eco Standard",
    actionHeader: "Update",
    statusPending: "Pending",
    statusContacted: "Contacted",
    statusContracted: "Contracted",
    statusPaid: "Paid",
    statusDeclined: "Declined",

    opsTitle: "Real-Time Operational Intelligence",
    opsSubtitle: "Simulate live disruptions to test autonomous AI contingency pivoting",
    simulateIncidentLabel: "Trigger Live Disruption Scenario:",
    incidentOptionRain: "Sudden torrential rainstorm detected at outdoor grounds (2h before start)",
    incidentOptionPower: "Main generator blackout in sound and catering pavilion",
    incidentOptionCateringDelay: "Key farm-to-table organic food transport stranded in traffic",
    triggerPivotButton: "Trigger Live AI Pivot",
    pivotingButton: "Synthesizing Emergency Pivot...",
    severityLabel: "Disruption Severity:",
    instantActionTitle: "Instant Mitigation Directives (Next 15-30 Min)",
    timelineAdjustmentsTitle: "Dynamic Timeline Re-scheduling",
    vendorAlertsTitle: "Emergency Vendor Dispatch Directives",
    safeguardTitle: "Sustainability Guardrail (Zero-Waste Protocol)",
  },
  es: {
    appName: "Aura",
    tagline: "Arquitectura de Eventos IA y Centro de Comando de Próxima Generación",
    navLaunchpad: "Plataforma",
    navEngine: "Motor de Atmósfera",
    navCommand: "Centro de Comando",
    langSwitchAria: "Cambiar idioma. Idioma actual: Español",

    launchHeader: "Lanza una Experiencia",
    launchSubheader: "Selecciona una plantilla estética curada o diseña una arquitectura personalizada impulsada por Gemini IA.",
    launchCustomButton: "Abrir Motor de Atmósfera",
    templateBirthdayTitle: "Cumpleaños Cyber-Neón",
    templateBirthdayDesc: "Estética synthwave de alta energía, proyección láser y barras de cócteles cinéticos.",
    templateWeddingTitle: "Boda Gran Patrimonio",
    templateWeddingDesc: "Pabellones botánicos arquitectónicos, patios con velas y gastronomía de viñedo orgánico.",
    templateEcoTitle: "Feria Ecológica Cero-Residuos",
    templateEcoDesc: "Gastronomía circular, equipos de audio solares y cero plásticos de un solo uso.",
    templateCustomTitle: "Aura Personalizada",
    templateCustomDesc: "Define telemetría atmosférica a medida, restricciones espaciales y parámetros sensoriales.",

    engineTitle: "El Motor de Atmósfera",
    engineSubtitle: "Configura vectores ambientales, parámetros sensoriales y límites financieros.",
    vibeSectionTitle: "El Enfoque Estético",
    categoryLabel: "Arquetipo de Experiencia",
    atmosphereLabel: "Describe la atmósfera y vibra sensorial",
    atmospherePlaceholder: "ej., cyberpunk neón, salón vintage real, retiro minimalista ecológico...",
    telemetrySectionTitle: "Logística y Telemetría Espacial",
    dateLabel: "Fecha de Ejecución",
    locationLabel: "Ubicación / Espacio",
    guestLabel: "Cohorte de Invitados",
    budgetLabel: "Presupuesto Total (USD)",
    priorityMatrixTitle: "La Matriz de Prioridades",
    priorityLimitNotice: "Selecciona hasta 3 pilares clave",
    priorityGourmet: "Gastronomía Gourmet",
    priorityEntertainment: "Entretenimiento de Alta Energía",
    priorityDecor: "Decoración Espacial Impecable",
    priorityEco: "Baja Huella de Carbono",
    prioritySound: "Paisaje Sonoro Inmersivo",
    priorityLogistics: "Logística sin Fricción",
    dietaryAccessTitle: "Directivas Dietéticas y de Accesibilidad",
    dietVegetarian: "Vegetariano",
    dietVegan: "100% Vegano",
    dietHalal: "Certificado Halal",
    accessWheelchair: "Acceso sin Escalones",
    accessSensory: "Zona de Calma Sensorial",
    accessGlutenFree: "Sin Gluten Exclusivo",
    synthesizeButton: "Activar Motor Aura",
    synthesizingButton: "Sintetizando Telemetría de Evento...",

    commandCenterTitle: "Centro de Comando Aura",
    countdownPrefix: "T-Menos",
    tabOverview: "Visión de Comando",
    tabFinance: "Pulso Financiero",
    tabVendors: "Matriz de Proveedores",
    tabCopilot: "Copiloto IA",
    statGuests: "Cohorte",
    statBudget: "Presupuesto",
    statLocation: "Zona de Despliegue",
    statAuraGrade: "Índice de Sostenibilidad",

    orbitTimelineTitle: "El Cronograma Orbital",
    orbitSubtitle: "Secuencia horaria sincronizada e hitos temporales",
    criticalActionsTitle: "Verificaciones Críticas",
    actionPermits: "Tramitar permisos acústicos y municipales",
    actionAudio: "Verificar carga de baterías solares para audio",
    actionCatering: "Confirmar contrato de catering circular",
    actionRSVP: "Enviar credenciales QR digitales a invitados",

    financialPulseTitle: "Pulso Financiero y Eficiencia de Capital",
    burnRateTitle: "Tasa de Quema y Salud Presupuestaria",
    burnRateDesc: "Contratos comprometidos versus reserva de contingencia",
    budgetCap: "Límite Presupuestario",
    committed: "Comprometido",
    reserveBuffer: "Reserva de Seguridad",
    costBreakdownTitle: "Desglose por Categoría",

    copilotHeader: "Copiloto Aura en Vivo",
    copilotPlaceholder: "Ajustar el Aura... (ej., 'Reducir catering 10%', 'Añadir carpa para lluvia')",
    copilotSendAria: "Transmitir instrucción a Copiloto Aura",
    copilotSample1: "Reducir presupuesto 10%",
    copilotSample2: "Plan de lluvia en vivo",
    copilotSample3: "Barra sin alcohol",

    // Legacy Compatibility Keys
    formTitle: "Crear Plan Inteligente de Evento",
    formSubtitle: "Impulsado por Google Gemini con puntuación ecológica avanzada",
    eventTypeLabel: "Categoría de Evento",
    eventTypeWedding: "Boda Eco-Lujo",
    eventTypeBirthday: "Cumpleaños Especial",
    eventTypeCommunity: "Festival Comunitario y Cívico",
    eventTypeCorporate: "Cumbre Corporativa Sostenible",
    eventDateLabel: "Fecha del Evento",
    totalBudgetLabel: "Presupuesto Total (USD)",
    guestCountLabel: "Número Estimado de Invitados",
    themeLabel: "Atmósfera y Temática (Opcional)",
    themePlaceholder: "ej., Rústico Solar Chic, Jardín Neón Ecológico",
    constraintsLabel: "Restricciones Ecológicas y Dietéticas",
    constraintsPlaceholder: "ej., 100% vegetariano, cero plásticos de un solo uso, flora local",
    generateButton: "Sintetizar Plan con IA",
    generatingButton: "Consultando a Gemini IA...",
    formErrorAria: "Alerta de error al enviar el formulario",

    planTitle: "Plan de Evento Sintetizado",
    sustainabilityBadge: "Índice de Sostenibilidad Ecológica",
    scoreOutOf100: "Puntuación: {score} / 100",
    keyRecsTitle: "Directrices Clave de Sostenibilidad",
    timelineTitle: "Cronograma Horario Sincronizado",
    ecoTipLabel: "Consejo Ecológico",
    vendorIdeasTitle: "Propuestas Innovadoras de Proveedores",
    outOfTheBoxSubtitle: "Socios sostenibles originales y de alto impacto",
    pitchLabel: "Propuesta de Valor:",
    estimatedCostLabel: "Presupuesto Est.:",
    ecoFriendlyBadge: "Certificado Eco-Amigable",
    importVendorsButton: "Importar al Panel de Proveedores",
    importVendorsSuccess: "¡Proveedores importados con éxito al panel activo!",
    budgetBreakdownTitle: "Desglose Estimado de Categorías",

    dashboardTitle: "Telemetría de Presupuesto y Proveedores",
    dashboardSubtitle: "Monitoreo de presupuestos asignados versus gastos reales con control de estado",
    selectEventLabel: "Evento Activo:",
    totalBudgetCard: "Presupuesto Asignado Total",
    allocatedCard: "Compromisos de Proveedores",
    actualSpentCard: "Desembolso Real",
    varianceCard: "Fondo de Reserva",
    budgetProgressAria: "Barra de progreso de asignación presupuestaria",
    budgetAllocationHealth: "Salud de la Asignación Presupuestaria",
    vendorChecklistTitle: "Lista de Verificación Operativa de Proveedores",
    addVendorButton: "+ Agregar Proveedor",
    vendorNameHeader: "Entidad Proveedora",
    categoryHeader: "Categoría",
    statusHeader: "Estado Operativo",
    costHeader: "Costo (Est. / Real)",
    ecoHeader: "Estándar Eco",
    actionHeader: "Actualizar",
    statusPending: "Pendiente",
    statusContacted: "Contactado",
    statusContracted: "Contratado",
    statusPaid: "Pagado",
    statusDeclined: "Rechazado",

    opsTitle: "Inteligencia Operacional en Tiempo Real",
    opsSubtitle: "Simule imprevistos para probar la respuesta adaptativa de contingencia con IA",
    simulateIncidentLabel: "Disparar Escenario de Imprevisto en Vivo:",
    incidentOptionRain: "Tormenta torrencial repentina detectada en jardines (2h antes del inicio)",
    incidentOptionPower: "Apagón del generador principal en el pabellón de sonido y catering",
    incidentOptionCateringDelay: "Transporte de comida orgánica artesanal varado por tráfico vehicular",
    triggerPivotButton: "Activar Plan de Contingencia IA",
    pivotingButton: "Sintetizando Plan de Emergencia...",
    severityLabel: "Severidad del Incidente:",
    instantActionTitle: "Directrices de Acción Inmediata (Próximos 15-30 Min)",
    timelineAdjustmentsTitle: "Reprogramación Dinámica del Cronograma",
    vendorAlertsTitle: "Directivas de Emergencia para Proveedores",
    safeguardTitle: "Protocolo de Salvaguarda Sostenible (Cero Basura)",
  },
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const value = {
    locale,
    setLocale,
    t: dictionaries[locale],
  };

  return (
    <LocaleContext.Provider value={value}>
      <div lang={locale}>{children}</div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
