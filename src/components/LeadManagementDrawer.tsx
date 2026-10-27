import { useState } from 'react';
import { X, Download, Phone, Mail, MapPin, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { SubmittedLeadRecord } from '../types/solar';
import { formatCurrency } from '../utils/solarCalculations';

interface LeadManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: SubmittedLeadRecord[];
  onUpdateStatus: (leadId: string, status: SubmittedLeadRecord['status']) => void;
  onDeleteLead: (leadId: string) => void;
}

export function LeadManagementDrawer({
  isOpen,
  onClose,
  leads,
  onUpdateStatus,
  onDeleteLead,
}: LeadManagementDrawerProps) {
  if (!isOpen) return null;

  const exportCsv = () => {
    if (leads.length === 0) return;
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Address',
      'ZIP',
      'Monthly Bill',
      'Roof Type',
      'System kW',
      'Panels',
      'Annual Savings',
      'Federal ITC',
      'Status',
      'Date',
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName}"`,
      l.email,
      l.phone,
      `"${l.address}, ${l.city || ''} ${l.state || ''}"`,
      l.zipCode,
      l.monthlyElectricBill,
      l.roofType,
      l.calculation.systemSizeKw,
      l.designedPanelCount || l.calculation.systemSizeKw * 2.5,
      l.calculation.estimatedAnnualSavings,
      l.calculation.federalTaxCreditValue,
      l.status,
      l.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heliocraft_solar_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
                Installer Lead Portal
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Qualified Inbound Leads ({leads.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {leads.length > 0 && (
                <button
                  onClick={exportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {leads.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <p className="text-sm">No solar leads submitted yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Complete the Savings Calculator on the main page to generate a real 3D qualified lead.
                </p>
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{lead.fullName}</span>
                        <span className="font-mono text-xs text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                          {lead.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as any)}
                        className="text-xs font-semibold px-2.5 py-1 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="site_visit_scheduled">Site Visit Booked</option>
                        <option value="proposal_sent">Proposal Sent</option>
                      </select>
                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* System & Property Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white border border-slate-200 rounded-lg p-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                        System Sized
                      </span>
                      <span className="font-bold font-mono text-slate-900">
                        {lead.calculation.systemSizeKw} kW DC
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                        Annual Savings
                      </span>
                      <span className="font-bold font-mono text-emerald-600">
                        {formatCurrency(lead.calculation.estimatedAnnualSavings)}/yr
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                        Electric Bill
                      </span>
                      <span className="font-medium text-slate-700">
                        ${lead.monthlyElectricBill}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                        Roof Design
                      </span>
                      <span className="font-medium capitalize text-slate-700">
                        {lead.roofType} Roof
                      </span>
                    </div>
                  </div>

                  {/* Address & Submission Info */}
                  <div className="text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lead.address}, {lead.zipCode}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Submitted {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {lead.notes && (
                    <div className="text-xs bg-amber-50/50 border border-amber-200/50 rounded-md p-2 text-slate-700">
                      <strong className="text-amber-800">Notes:</strong> {lead.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
