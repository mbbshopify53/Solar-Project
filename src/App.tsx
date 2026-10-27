/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SolarLayoutConfig, SubmittedLeadRecord } from './types/solar';
import { calculateSolarMetrics } from './utils/solarCalculations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Solar3DStudio } from './components/Solar3DStudio';
import { SavingsCalculator } from './components/SavingsCalculator';
import { ProjectGallery } from './components/ProjectGallery';
import { ProcessSection } from './components/ProcessSection';
import { Footer } from './components/Footer';
import { LeadManagementDrawer } from './components/LeadManagementDrawer';

export default function App() {
  // 3D Solar Layout Configuration State
  const [layoutConfig, setLayoutConfig] = useState<SolarLayoutConfig>({
    roofType: 'gabled',
    panelCount: 24, // 24 panels * 400W = 9.6 kW DC
    tiltAngle: 28, // 28 degrees pitch
    azimuth: 180, // Facing South
    timeOfDay: 12.0, // Solar Noon
    season: 'summer',
    panelWattage: 400,
  });

  // Leads state
  const [leads, setLeads] = useState<SubmittedLeadRecord[]>([]);
  const [isLeadsDrawerOpen, setIsLeadsDrawerOpen] = useState(false);

  // Initialize sample lead if storage is empty for tangible demonstration
  useEffect(() => {
    try {
      const stored = localStorage.getItem('heliocraft_leads');
      if (stored) {
        setLeads(JSON.parse(stored));
      } else {
        const sampleLead: SubmittedLeadRecord = {
          id: 'HC-842109',
          fullName: 'Robert Harrison',
          email: 'robert.h@example.com',
          phone: '(512) 555-0198',
          address: '4208 Oak Grove Lane',
          city: 'Austin',
          state: 'TX',
          zipCode: '78704',
          monthlyElectricBill: 260,
          roofType: 'gabled',
          roofAgeYears: 5,
          sunExposure: 'high',
          includeBattery: true,
          preferredContactMethod: 'phone',
          timeframe: 'immediate',
          notes: 'Interested in financing and adding a Level-2 EV charger along with the solar system.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'site_visit_scheduled',
          designedSystemSizeKw: 9.6,
          designedPanelCount: 24,
          designedTiltAngle: 28,
          calculation: calculateSolarMetrics(
            { panelCount: 24, tiltAngle: 28, azimuth: 180, panelWattage: 400 },
            260,
            true
          ),
        };
        setLeads([sampleLead]);
        localStorage.setItem('heliocraft_leads', JSON.stringify([sampleLead]));
      }
    } catch {
      // ignore localStorage restriction
    }
  }, []);

  const handleApplyToQuote = () => {
    const calcSection = document.getElementById('calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLeadSubmitted = (newLead: SubmittedLeadRecord) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleUpdateStatus = (leadId: string, status: SubmittedLeadRecord['status']) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status } : l));
    setLeads(updated);
    try {
      localStorage.setItem('heliocraft_leads', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteLead = (leadId: string) => {
    const updated = leads.filter((l) => l.id !== leadId);
    setLeads(updated);
    try {
      localStorage.setItem('heliocraft_leads', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Contract Navigation */}
      <Navbar
        onOpenLeadsDrawer={() => setIsLeadsDrawerOpen(true)}
        leadCount={leads.length}
      />

      <main className="flex-1">
        {/* Value Proposition Hero */}
        <HeroSection />

        {/* 3D Interactive Rooftop Visualizer */}
        <Solar3DStudio
          config={layoutConfig}
          onChangeConfig={setLayoutConfig}
          onApplyToQuote={handleApplyToQuote}
        />

        {/* Multi-Step Savings Calculator & Lead Funnel */}
        <SavingsCalculator
          layoutConfig={layoutConfig}
          onLeadSubmitted={handleLeadSubmitted}
        />

        {/* Project Case Studies Gallery */}
        <ProjectGallery />

        {/* 4-Step Installation Standard */}
        <ProcessSection />
      </main>

      {/* Quiet Corporate Footer */}
      <Footer />

      {/* Installer Leads Management Drawer */}
      <LeadManagementDrawer
        isOpen={isLeadsDrawerOpen}
        onClose={() => setIsLeadsDrawerOpen(false)}
        leads={leads}
        onUpdateStatus={handleUpdateStatus}
        onDeleteLead={handleDeleteLead}
      />
    </div>
  );
}
