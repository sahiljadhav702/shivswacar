import api from '../../api/axiosConfig';
import { useState, useEffect } from "react";
import { UserCog, Car, Mail, Phone } from "lucide-react";

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/mechanics`)
      .then((res) => res.json())
      .then((data) => {
        // Mock data if no mechanics are found
        if (data.length === 0) {
          setMechanics([
            { id: 1, name: "Ravi Kumar", email: "ravi@example.com", phone_number: "9988776655", active_jobs: 2, current_vehicle: "MH-12-AB-1234 (Honda City)" },
            { id: 2, name: "Suresh Menon", email: "suresh@example.com", phone_number: "8877665544", active_jobs: 0, current_vehicle: "Available" }
          ]);
        } else {
          setMechanics(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch mechanics:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mechanics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage mechanics and their assigned vehicles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500">Loading mechanics...</p>
        ) : (
          mechanics.map((mech) => (
            <div key={mech.id} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserCog className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{mech.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {mech.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {mech.phone_number}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Assigned Vehicle</p>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Car className="w-4 h-4 text-primary" />
                  {mech.current_vehicle || "None Assigned"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
