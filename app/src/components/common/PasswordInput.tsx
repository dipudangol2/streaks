import { useState } from "react";
import { Input } from "@/components/ui/input";

type PasswordInputProps = {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const PasswordInput = ({
  id = "password",
  value,
  onChange,
  required = true,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        required={required}
      />
      {/*center the button vertically and set it on the right horizontally and inside the password field*/}
      <button
        className="absolute top-1/4 right-2 text-sm text-muted-foreground"
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}>
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default PasswordInput;
