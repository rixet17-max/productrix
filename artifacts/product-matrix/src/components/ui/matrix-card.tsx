import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn, getFlagEmoji } from "@/lib/utils";

interface Company {
  name: string;
  country: string;
  description: string;
}

interface Country {
  name: string;
  value: string;
  percentage: string;
}

interface MatrixCardProps {
  title: string;
  items: any[];
  type: "company" | "country";
  icon: LucideIcon;
  delay?: number;
  className?: string;
}

export function MatrixCard({ title, items, type, icon: Icon, delay = 0, className }: MatrixCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-card border border-border/60 shadow-xl shadow-black/5 rounded-2xl flex flex-col h-[420px] overflow-hidden group hover:border-border transition-colors duration-300",
        className
      )}
    >
      <div className="px-6 py-4 border-b border-border/50 bg-slate-50/50 flex items-center gap-3 shrink-0">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
        <div className="ml-auto bg-white border border-border px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm">
          {items.length} records
        </div>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Icon className="w-6 h-6 text-slate-400" />
            </div>
            <p>No data available for this category.</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={i} className="p-4 hover:bg-slate-50 rounded-xl transition-colors">
                {type === "company" ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-xl shrink-0 border border-black/5 shadow-sm">
                      {getFlagEmoji((item as Company).country)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground leading-tight">{(item as Company).name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{(item as Company).country}</p>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2" title={(item as Company).description}>
                        {(item as Company).description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-xl shrink-0 border border-black/5 shadow-sm">
                        {getFlagEmoji((item as Country).name)}
                      </div>
                      <h4 className="font-semibold text-foreground">{(item as Country).name}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">{(item as Country).value}</p>
                      <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100/50 inline-block px-2.5 py-0.5 rounded-full mt-1">
                        {(item as Country).percentage} share
                      </p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
