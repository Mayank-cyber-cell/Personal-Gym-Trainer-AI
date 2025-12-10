import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VoicePersona, VOICE_PERSONAS } from '@/hooks/useVoiceCues';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VoiceCueButtonProps {
  onSpeak: () => void;
  isSpeaking?: boolean;
  isEnabled?: boolean;
  compact?: boolean;
  className?: string;
}

export const VoiceCueButton = ({ 
  onSpeak, 
  isSpeaking = false,
  isEnabled = true,
  compact = false,
  className 
}: VoiceCueButtonProps) => {
  return (
    <Button
      variant="ghost"
      size={compact ? "icon" : "sm"}
      onClick={(e) => {
        e.stopPropagation();
        onSpeak();
      }}
      disabled={isSpeaking}
      className={cn(
        "transition-all",
        isSpeaking && "animate-pulse text-primary",
        !isEnabled && "opacity-50",
        className
      )}
      title={isSpeaking ? "Speaking..." : "Hear exercise instructions"}
    >
      {isSpeaking ? (
        <Loader2 className={cn("animate-spin", compact ? "w-4 h-4" : "w-4 h-4 mr-1")} />
      ) : (
        <Volume2 className={cn(compact ? "w-4 h-4" : "w-4 h-4 mr-1")} />
      )}
      {!compact && !isSpeaking && <span>Listen</span>}
    </Button>
  );
};

interface VoiceToggleButtonProps {
  isEnabled: boolean;
  onToggle: () => void;
  persona: VoicePersona;
  onPersonaChange: (persona: VoicePersona) => void;
  className?: string;
}

export const VoiceToggleButton = ({ 
  isEnabled, 
  onToggle,
  persona,
  onPersonaChange,
  className 
}: VoiceToggleButtonProps) => {
  const currentPersona = VOICE_PERSONAS[persona];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        title={isEnabled ? "Disable voice cues" : "Enable voice cues"}
      >
        {isEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <span>{currentPersona.icon}</span>
            <span className="hidden sm:inline">{currentPersona.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.keys(VOICE_PERSONAS) as VoicePersona[]).map((key) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onPersonaChange(key)}
              className={cn(
                "gap-2 cursor-pointer",
                persona === key && "bg-accent"
              )}
            >
              <span>{VOICE_PERSONAS[key].icon}</span>
              <span>{VOICE_PERSONAS[key].name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
