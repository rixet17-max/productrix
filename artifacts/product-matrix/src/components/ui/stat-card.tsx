import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  delay?: number;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, delay = 0, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-card border border-border/60 rounded-2xl p-6 shadow-lg shadow-black/5 relative overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
        className
      )}
    >
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 text-center">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">{value}</h4>
        <p className="text-xs font-medium text-muted-foreground leading-tight">{title}</p>
      </div>
    </motion.div>
  );
}
