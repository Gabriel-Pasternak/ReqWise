import { siteConfig } from "@/config/site";
import { BrainCircuit } from "lucide-react"; // Using BrainCircuit as a placeholder logo icon

type AppLogoProps = {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
};

export function AppLogo({ className, iconSize = 24, textSize = "text-xl", showText = true }: AppLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BrainCircuit size={iconSize} className="text-primary" />
      {showText && <span className={`font-bold ${textSize} text-foreground`}>{siteConfig.name}</span>}
    </div>
  );
}
