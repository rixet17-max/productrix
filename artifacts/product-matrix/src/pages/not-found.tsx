import { Link } from "wouter";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
      <div className="text-center flex flex-col items-center max-w-md px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <PackageX className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-3 tracking-tight">404 - Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
