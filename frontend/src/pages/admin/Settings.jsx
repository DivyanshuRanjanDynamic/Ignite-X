// src/pages/admin/Settings.jsx
export default function Settings() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Settings & Configuration
        </h1>
        <p className="text-gray-500">
          Customize system behavior, security, notifications, and integrations.
        </p>
      </div>

      {/* General & System */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          ⚙️ General & System
        </h2>

        <div>
          <label className="text-sm font-medium">Organization Name</label>
          <input
            type="text"
            placeholder="Enter organization name"
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Default Timezone</label>
          <select className="w-full border rounded-md p-2 mt-1">
            <option>IST (India)</option>
            <option>UTC</option>
            <option>EST</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <span>
            Dark Mode <p className="text-xs text-gray-500">Enable system-wide dark UI</p>
          </span>
          <input type="checkbox" />
        </div>

        <div className="flex justify-between items-center">
          <span>
            Auto Updates <p className="text-xs text-gray-500">Keep platform up-to-date</p>
          </span>
          <input type="checkbox" defaultChecked />
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          🔐 Security & Privacy
        </h2>

        <div className="flex justify-between items-center">
          <span>
            Two-Factor Authentication <p className="text-xs text-gray-500">Extra layer of login security</p>
          </span>
          <input type="checkbox" />
        </div>

        <div className="flex justify-between items-center">
          <span>
            Password Expiry <p className="text-xs text-gray-500">Force users to reset every 90 days</p>
          </span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="flex justify-between items-center">
          <span>
            Session Timeout <p className="text-xs text-gray-500">Auto logout inactive users after 30 min</p>
          </span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Compliance</h3>
          <div className="flex justify-between items-center mb-2">
            <span>GDPR Mode</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span>Data Retention (1 year)</span>
            <input type="checkbox" />
          </div>
        </div>
      </div>

      {/* Communication & Integrations */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          🔔 Communication & Integrations
        </h2>

        <div className="flex justify-between items-center">
          <span>Email Notifications</span>
          <input type="checkbox" />
        </div>
        <div className="flex justify-between items-center">
          <span>SMS Alerts</span>
          <input type="checkbox" />
        </div>
        <div className="flex justify-between items-center">
          <span>System Push Notifications</span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Integrations</h3>
          <label className="text-sm">PM Portal API Key</label>
          <input
            type="password"
            placeholder="••••••••••"
            className="w-full border rounded-md p-2 mt-1"
          />
          <button className="bg-blue-600 text-white px-3 py-2 rounded-md mt-3 w-full">
            Connect
          </button>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Backup & Restore</h3>
          <button className="bg-blue-600 text-white px-3 py-2 rounded-md w-full mb-2">
            Backup Now
          </button>
          <button className="border border-gray-300 px-3 py-2 rounded-md w-full">
            Restore Backup
          </button>
          <p className="text-xs text-gray-500 mt-2">Last backup: 2 days ago</p>
        </div>
      </div>

      {/* Billing & Audit */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          💳 Billing & Audit
        </h2>

        <div>
          <p className="text-sm">Current Plan: <span className="font-medium">Pro (Monthly)</span></p>
          <div className="flex justify-between items-center mt-2">
            <span>Auto-Renew</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Audit & Logging</h3>
          <label className="text-sm">Log Retention Period</label>
          <select className="w-full border rounded-md p-2 mt-1">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
          </select>
          <button className="border border-gray-300 px-3 py-2 rounded-md w-full mt-3">
            Export Logs
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md">
          Save All Changes
        </button>
      </div>
    </div>
  );
}
