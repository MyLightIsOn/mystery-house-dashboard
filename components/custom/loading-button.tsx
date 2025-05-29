import { ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image"; // Add this import

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  isLoading,
  ...props
}) => {
  return (
    <Button onClick={onClick} {...props} className={"text-primary"}>
      {isLoading ? (
        <span className="flex items-center gap-2 ">
          Generating Summary... <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Generate AI Summary
          <Image src="/ai-icon.svg" alt="AI Icon" width={16} height={16} />
        </span>
      )}
    </Button>
  );
};

export default LoadingButton;
