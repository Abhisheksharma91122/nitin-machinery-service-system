"use client";

import { useState, useEffect } from 'react';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { Send, Tags, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function AdminPromotions() {
  const [formData, setFormData] = useState({ subject: '', content: '' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 📥 Fetch campaign logs
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/promotions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } catch {
      toast.error("Failed to load campaign logs");
    } finally {
      setLoading(false);
    }
  };

  // 📥 Fetch customer count
  const fetchCustomerCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/service/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCustomerCount(data.data.length);
    } catch {}
  };

  useEffect(() => {
    fetchLogs();
    fetchCustomerCount();
  }, []);

  // 📤 Send campaign
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.content.trim()) {
      toast.error("Subject and content are required");
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/promotions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send campaign");
        return;
      }

      const { sent, failed } = data.summary;
      toast.success(`Campaign sent! ✅ ${sent} delivered, ${failed} failed`);
      setFormData({ subject: '', content: '' });
      fetchLogs();
    } catch {
      toast.error("Server error");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Derived stats ──────────────────────────────────────────
  const totalEmailsSent   = logs.reduce((sum, l) => sum + (l.recipients || 0), 0);
  const totalSuccess      = logs.reduce((sum, l) => sum + (l.successCount || 0), 0);
  const totalFailed       = logs.reduce((sum, l) => sum + (l.failCount || 0), 0);
  const completedCampaigns = logs.filter(l => l.status === 'completed').length;

  // ── Table columns ──────────────────────────────────────────
  const columns = [
    {
      header: 'Campaign Info',
      accessor: 'subject',
      cell: (row) => (
        <div>
          <div className="font-medium text-zinc-900 text-sm">{row.subject}</div>
          <div className="text-xs text-zinc-500 font-mono">#{row._id.slice(-6).toUpperCase()}</div>
        </div>
      ),
    },
    {
      header: 'Sent Date',
      accessor: 'createdAt',
      cell: (row) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
    {
      header: 'Recipients',
      accessor: 'recipients',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-zinc-400" />
          <span className="font-medium">{row.recipients}</span>
        </div>
      ),
    },
    {
      header: 'Delivered',
      accessor: 'successCount',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span className="font-medium text-green-700">{row.successCount ?? 0}</span>
        </div>
      ),
    },
    {
      header: 'Failed',
      accessor: 'failCount',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <XCircle className="h-3 w-3 text-red-400" />
          <span className={`font-medium ${row.failCount > 0 ? 'text-red-600' : 'text-zinc-400'}`}>
            {row.failCount ?? 0}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const styles = {
          completed: "bg-green-50 text-green-700 ring-green-600/20",
          sending:   "bg-blue-50 text-blue-700 ring-blue-600/20",
          failed:    "bg-red-50 text-red-700 ring-red-600/20",
        };
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[row.status]}`}>
            {row.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
            {row.status === 'sending'   && <Clock className="mr-1 h-3 w-3" />}
            {row.status === 'failed'    && <XCircle className="mr-1 h-3 w-3" />}
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Promotions & Marketing</h1>
        <p className="text-zinc-500 mt-1">Send marketing emails to your customer base.</p>
      </div>

      {/* 📊 Stats — 5 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Recipients */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">{customerCount}</p>
            <p className="text-xs text-zinc-500">Total Recipients</p>
          </div>
        </div>

        {/* Campaigns Sent */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
            <Send className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">{completedCampaigns}</p>
            <p className="text-xs text-zinc-500">Campaigns Sent</p>
          </div>
        </div>

        {/* Total Emails Sent */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Send className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">{totalEmailsSent}</p>
            <p className="text-xs text-zinc-500">Total Emails Sent</p>
          </div>
        </div>

        {/* Successfully Delivered */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-700">{totalSuccess}</p>
            <p className="text-xs text-zinc-500">Successfully Delivered</p>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className={`text-2xl font-bold ${totalFailed > 0 ? 'text-red-600' : 'text-zinc-400'}`}>
              {totalFailed}
            </p>
            <p className="text-xs text-zinc-500">Failed to Deliver</p>
          </div>
        </div>
      </div>

      {/* 📝 New Campaign Form */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Tags className="h-5 w-5 text-brand-blue" />
          <h2 className="text-lg font-semibold text-zinc-900">New Email Campaign</h2>
          {customerCount > 0 && (
            <span className="ml-auto text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">
              Will send to {customerCount} customers
            </span>
          )}
        </div>

        {/* Placeholder hint */}
        <div className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 space-y-1">
          <p className="font-semibold mb-1">✨ Personalization placeholders you can use:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 font-mono">
            {['${customer.name}', '${customer.email}', '${customer.contactNumber}',
              '${customer.address}'].map(p => (
              <span key={p} className="bg-white border border-blue-200 rounded px-2 py-0.5">{p}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <FormInput
            label="Email Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Hey ${customer.name}, a special offer for you!"
            required
          />

          <FormInput
            label="Email Content"
            name="content"
            type="textarea"
            value={formData.content}
            onChange={handleChange}
            placeholder={`Write your email body here. HTML is supported.\n\nExample:\n<p>Hi \${customer.name}, We have a special offer just for you!</p>`}
            rows={8}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="h-10 px-6"
              disabled={sending}
            >
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Sending..." : `Send to ${customerCount} Customers`}
            </Button>
          </div>
        </form>
      </div>

      {/* 📋 Campaign Logs */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4 px-1">Campaign Log</h2>
        {loading ? (
          <div className="text-center py-10 text-zinc-500">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 bg-white rounded-xl border border-zinc-200">
            No campaigns sent yet.
          </div>
        ) : (
          <Table columns={columns} data={logs} />
        )}
      </div>
    </div>
  );
}