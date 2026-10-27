# HelioCraft Solar - Residential 3D Solar Visualizer & Lead Engine

HelioCraft Solar is a high-performance web platform for residential solar installers that combines an interactive, physics-grounded Three.js 3D rooftop visualizer with a multi-step savings calculator and project showcase to turn curious homeowners into high-converting qualified leads.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions below incorporate your confirmed choices from Phase 1. Review the open details and recommended defaults before building begins.

- **Confirmed Decision 1 (Architecture & Roof Focus)**: Residential homes with interactive **Gabled** and **Hip** roof configurations, authentic architectural detailing (dormers, chimneys, gutters, overhangs, siding, and asphalt shingle PBR textures).
- **Confirmed Decision 2 (Lead Funnel Style)**: Interactive multi-step savings calculator with instant roof sizing, monthly electricity bill inputs, utility tier offsets, annual kWh production estimates, 25-year financial ROI projections, and direct contact submission.
- **Confirmed Decision 3 (3D Visualizer Capabilities)**: Real-time **Sun Trajectory Simulator** (time-of-day and seasonal solar path with realistic directional key light and ambient shadows), **Tilt & Azimuth Adjusters** (15°–45° pitch and compass rotation), and **Dynamic Panel Counter** with live energy output calculation.
- **Recommended Architectural Default (Asset Reliability)**: 100% procedural 3D modeling using multi-part `THREE.Group` assemblies, procedural canvas textures for solar silicon cells with anti-reflective busbars, and zero external `.glb` dependencies to guarantee zero 404s and instantaneous load times.

---

## 1. Overview & Core Concept

HelioCraft Solar bridges the gap between complex engineering estimates and consumer decision-making. Homeowners explore realistic 3D representations of residential solar setups on authentic gabled and hip roofs, visualize how solar shadows shift across the day, customize panel layouts, and calculate accurate financial savings in an intuitive multi-step lead capture workflow.

- **What It Does**: Provides an immersive rooftop 3D simulator, an automated solar financial savings estimator, a filterable residential installation gallery, and an integrated lead generation engine.
- **Target Audience**: Single-family homeowners seeking clean energy transitions, residential solar sales consultants, and installation teams seeking qualified pre-designed leads.
- **Key Value**: Delivers tangible spatial proof and financial clarity to homeowners before the first sales call, reducing customer acquisition friction and accelerating quote conversion.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Homepage Discovery & Value Proposition**:
   - Clean 3-zone navigation header (`HelioCraft Solar` brand wordmark, single-line links: *Visualizer*, *Savings Calculator*, *Project Gallery*, *Our Process*, and *Get Free Quote* primary CTA).
   - High-impact hero section presenting concrete solar installation guarantees, average homeowner savings ($1,840/yr), and a direct jump into the interactive 3D studio.
2. **Interactive 3D Rooftop Visualizer**:
   - Full-featured 3D viewport featuring a detailed procedural home with gabled/hip roof switching.
   - Sunlight and time-of-day slider (morning, solar noon, golden hour, dusk) casting accurate dynamic shadows.
   - Panel density control (adjust from 12 to 36 premium 400W monocrystalline panels) with live panel counting and power rating display (kW DC).
   - Roof pitch and orientation controls (azimuth N/S/E/W and tilt angle 15°–45°).
   - Collapsible bottom control dock with cinema mode toggle, keeping the central 3D viewport completely unobstructed.
3. **Interactive Multi-Step Savings Calculator & Lead Funnel**:
   - Step 1: Home profile & roof style selection (Square footage, roof pitch, shading condition).
   - Step 2: Energy consumption & utility cost (Monthly electric bill from $100 to $600+).
   - Step 3: Instant financial breakdown (System size in kW, annual production in kWh, 25-year cumulative savings, federal tax credit incentive).
   - Step 4: Lead submission (Homeowner name, address/zip code, phone, email, and preferred contact time with instant confirmation and quote summary preview).
4. **Residential Project Showcase Gallery**:
   - Filterable gallery by roof type (*All*, *Gabled Roofs*, *Hip Roofs*, *Tile Roofs*, *Battery Integration*).
   - Detailed project cards showing real installation metrics (System Size, Annual Offset %, Estimated Annual Savings, City/State, and Installation Timeline).
   - Interactive modal inspection with full specs and customer testimonials.

### Visual Identity & Theme

- **Aesthetic Direction**: Clean, contemporary clean-tech editorial style with industrial precision and architectural restraint.
- **Color Palette (60-30-10 Rule)**:
  - `60% Neutral Canvas`: Crisp slate-50 (`#F8FAFC`) with deep slate-900 (`#0F172A`) typography for impeccable daylight legibility.
  - `30% Structural Surfaces`: Pure white (`#FFFFFF`) cards with subtle hairline slate borders (`border-slate-200`) and soft elevation.
  - `10% Vibrant Accent`: Solar Amber & Deep Indigo (`#D97706` amber and `#0284C7` sky blue accents) reserved strictly for primary interactive CTAs, sun dials, and active filter tabs.
- **Typography**:
  - Display / Headings: `Plus Jakarta Sans` with tight tracking (`tracking-tight`) and balanced line breaks.
  - Body Prose: `Public Sans` / `Inter` with comfortable 1.6 line height and measured reading widths.
  - Metrics & Data: Tabular figures (`font-mono tabular-nums`) for kW, kWh, dollar savings, and solar tilt degrees.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural Multi-Part 3D Models vs External GLTF Assets**
  - *Chosen Approach*: Procedural Three.js geometry assembled as composite `THREE.Group` models (home base, exterior siding, roof fascias, chimney, gutters, solar racking rails, and monocrystalline panel cells with procedural canvas textures).
  - *Why*: Eliminates broken 404 network fetches, guarantees sub-second load times, and enables dynamic parametric manipulation (changing roof type, adjusting pitch, and adding/removing panels dynamically).
  - *Alternatives Considered*: Loading static `.gltf` files would prevent dynamic panel count adjustments and risk file loading failures in sandboxed runtimes.
- **Decision 2: Studio PBR Lighting & Sun Trajectory Rig**
  - *Chosen Approach*: Dynamic directional key light orbiting along a realistic solar diurnal arc, paired with a cool hemisphere sky/ground fill light and `PMREMGenerator` + `RoomEnvironment` reflection probe.
  - *Why*: Provides tangible visual feedback on how roof pitch and sun angles impact panel efficiency and shadow occlusion.
- **Decision 3: Seamless Integration between 3D Visualizer and Lead Funnel**
  - *Chosen Approach*: The panel count, system size, and roof type chosen in the 3D visualizer automatically pre-populate the savings calculator, allowing visitors to seamlessly transition from visual design to a custom quote request.
  - *Why*: Dramatically boosts conversion by preserving user intent and effort across the customer journey.

---

## 4. Technical Architecture & Data Strategy

### System & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                               App.tsx                                  │
│  State: activeView, layoutConfig (roofType, panelCount, tilt, azimuth) │
│         calculatorState, submittedLeads, activeProjectFilter           │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
     ┌──────────────┴──────────────┐   ┌─────────────┴─────────────┐
     ▼                             ▼   ▼                           ▼
┌─────────────────────────┐  ┌───────────────────┐  ┌────────────────────┐
│      Navbar.tsx         │  │    HeroSection    │  │   Solar3DStudio    │
│  Brand Wordmark         │  │ Value Prop, Stats │  │ ┌────────────────┐ │
│  Nav Links (Single-row) │  │ Quick Quote CTA   │  │ │ ThreeCanvas.tsx│ │
│  Request Quote Button   │  │ Proof Metric Strip│  │ └────────┬───────┘ │
└─────────────────────────┘  └───────────────────┘  │          │         │
                                                    │ ┌────────┴───────┐ │
                                                    │ │ControlDock.tsx │ │
                                                    │ │Sun / Tilt / Qty│ │
                                                    │ └────────────────┘ │
                                                    └────────────────────┘
                    ┌────────────────────────────────┬───────────────────┘
                    │                                │
     ┌──────────────┴──────────────┐   ┌─────────────┴─────────────┐
     ▼                             ▼   ▼                           ▼
┌─────────────────────────┐  ┌───────────────────┐  ┌────────────────────┐
│ SavingsCalculator.tsx   │  │ ProjectGallery.tsx│  │    Footer.tsx      │
│ 4-Step Interactive Form │  │ Filterable Grid   │  │ Company Info       │
│ Live Solar Sizing Math  │  │ Spec Modal Views  │  │ Accreditations     │
│ Direct Lead Submission  │  │ Before/After Data │  │ Clean Nav Links    │
└─────────────────────────┘  └───────────────────┘  └────────────────────┘
```

### Core Data Models

- **SolarLayoutConfig**:
  ```ts
  interface SolarLayoutConfig {
    roofType: 'gabled' | 'hip';
    panelCount: number; // 12 to 36 panels
    tiltAngle: number; // 15 to 45 degrees
    azimuth: number; // 0 to 360 degrees (compass)
    timeOfDay: number; // 6.0 to 18.0 (hours)
    systemWattage: number; // panelCount * 400W
  }
  ```
- **SolarQuoteLead**:
  ```ts
  interface SolarQuoteLead {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    monthlyElectricBill: number;
    roofType: 'gabled' | 'hip';
    estimatedSystemKw: number;
    estimatedAnnualSavings: number;
    estimated25YrSavings: number;
    notes: string;
    submittedAt: string;
  }
  ```
- **ProjectCaseStudy**:
  ```ts
  interface ProjectCaseStudy {
    id: string;
    title: string;
    location: string;
    roofType: 'gabled' | 'hip';
    systemSizeKw: number;
    panelCount: number;
    annualProductionKwh: number;
    annualSavings: number;
    completionTime: string;
    summary: string;
    testimonial: { author: string; quote: string; rating: number };
  }
  ```

### Interactive State Transitions

- Moving the **Time of Day** slider computes the sun elevation and azimuth coordinates, updating the Three.js directional key light position, sky hemisphere color temperature, and contact shadow cast.
- Changing **Panel Count** updates the instanced solar panel mesh matrices on the roof facets in real time, simultaneously updating the system kW capacity badge and estimated annual kilowatt-hour counter.
- Clicking **Apply Design to Quote** transfers the current 3D configuration directly into the Savings Calculator, advancing the homeowner into the personalized lead generation funnel with immediate feedback and instant submission confirmation.
