// app/push-email/page.js
'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Textarea, Spinner } from '@heroui/react';

export default function PushEmail() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Booking Confirmed!');
  const [templateId, setTemplateId] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [customContent, setCustomContent] = useState('');
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [useTemplate, setUseTemplate] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await fetch('/api/brevo-templates');
        const data = await res.json();
        if (data.templates) {
          setTemplates(data.templates);
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setStatus('Failed to load templates');
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const sendEmail = async () => {
    if (!email) {
      setStatus('Please enter an email address.');
      return;
    }

    setIsSending(true);
    setStatus('Sending...');

    try {
      const payload = {
        to: email,
        subject,
        templateId: useTemplate ? templateId : null,
        content: useTemplate ? null : customContent,
        params: {
          customerName: "Valued Customer",
          bookingDate: new Date().toLocaleDateString(),
          bookingTime: "10:00 AM"
        }
      };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setStatus('Email sent successfully!');
      } else {
        setStatus('Failed to send email: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setStatus('Error sending email: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const openBrevoTemplateEditor = () => {
    window.open('https://app.brevo.com/templates', '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Email Campaign</h2>
      
      <div className="space-y-6">
        <Input
          label="Recipient Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@example.com"
          fullWidth
          isRequired
        />

        <Input
          label="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject line"
          fullWidth
        />

        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={useTemplate}
              onChange={() => setUseTemplate(true)}
              className="mr-2"
            />
            Use Template
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!useTemplate}
              onChange={() => setUseTemplate(false)}
              className="mr-2"
            />
            Custom Content
          </label>
        </div>

        {useTemplate ? (
          <>
            {loadingTemplates ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <Select
                label="Select Template"
                placeholder="Choose an email template"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                fullWidth
              >
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </Select>
            )}
            <div className="mt-2">
              <Button 
                color="secondary" 
                variant="bordered" 
                onClick={openBrevoTemplateEditor}
                className="text-sm"
              >
                Create/Edit Templates in Brevo
              </Button>
            </div>
          </>
        ) : (
          <Textarea
            label="Email Content"
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
            placeholder="Enter your custom email content here..."
            minRows={8}
            fullWidth
          />
        )}

        <div className="flex justify-between items-center pt-4">
          <Button 
            color="primary" 
            onClick={sendEmail}
            disabled={isSending}
            className="min-w-32"
          >
            {isSending ? <Spinner size="sm" color="white" /> : 'Send Email'}
          </Button>
          
          {status && (
            <p className={`text-sm ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
