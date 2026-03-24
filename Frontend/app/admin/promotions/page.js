"use client";

import { useState } from 'react';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { Send, Tags } from 'lucide-react';

const dummyLogs = [
  { id: 'CAMP-01', subject: 'Winter Maintenance Discount - 15% OFF', sentDate: 'Nov 01, 2023', recipients: 450, status: 'Completed' },
  { id: 'CAMP-02', subject: 'New CNC Machining Services Available', sentDate: 'Oct 15, 2023', recipients: 890, status: 'Completed' },
];

export default function AdminPromotions() {
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });

  const columns = [
    { header: 'Campaign Info', accessor: 'subject', cell: (row) => (
      <div>
        <div className="font-medium text-zinc-900 text-sm">{row.subject}</div>
        <div className="text-xs text-zinc-500">{row.id}</div>
      </div>
    )},
    { header: 'Sent Date', accessor: 'sentDate' },
    { header: 'Recipients', accessor: 'recipients', cell: (row) => <span className="font-medium">{row.recipients}</span> },
    { header: 'Status', accessor: 'status', cell: (row) => (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
        {row.status}
      </span>
    )},
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Promotional email campaign queued for sending!');
    setFormData({ subject: '', content: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Promotions & Marketing</h1>
        <p className="text-zinc-500 mt-1">Send marketing emails to your customer base.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Tags className="h-5 w-5 text-brand-blue" />
          <h2 className="text-lg font-semibold text-zinc-900">New Email Campaign</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <FormInput 
            label="Email Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Special Holiday Maintenance Offer"
            required
          />

          <FormInput 
            label="Email Content"
            name="content"
            type="textarea"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your email body here. HTML is supported."
            rows={8}
            required
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" className="h-10 px-6">
              <Send className="mr-2 h-4 w-4" /> Send Email Campaign
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4 px-1">Campaign Log</h2>
        <Table columns={columns} data={dummyLogs} />
      </div>
    </div>
  );
}
