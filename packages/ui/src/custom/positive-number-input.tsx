import { FC } from "react";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

interface PositiveNumberInputProps {
  /** Current value of the input */
  value?: number;
  /** Callback function called when the value changes */
  onChange: (value: number | undefined) => void;
  /** Whether this is a price input (enables decimal places with step 0.01) */
  price?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Minimum value (defaults to 0 for positive numbers) */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Additional input props */
  inputProps?: Omit<React.ComponentProps<"input">, "type" | "value" | "onChange" | "onKeyDown" | "min" | "max" | "step" | "placeholder" | "disabled" | "className">;
}

const PositiveNumberInput: FC<PositiveNumberInputProps> = ({
  value,
  onChange,
  price = false,
  placeholder = "0",
  disabled = false,
  className,
  min = 0,
  max,
  inputProps,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // If empty string, set to undefined
    if (inputValue === "") {
      onChange(undefined);
      return;
    }
    
    // Handle leading zeros (e.g., "058" should become "58")
    // But preserve "0" and "0." for price inputs
    let cleanedValue = inputValue;
    if (inputValue.length > 1 && inputValue.startsWith("0") && !inputValue.startsWith("0.")) {
      cleanedValue = inputValue.replace(/^0+/, "") || "0";
    }
    
    // Convert to number
    const numericValue = Number(cleanedValue);
    
    // Check if it's a valid number and positive
    if (!isNaN(numericValue) && numericValue >= 0) {
      onChange(numericValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text when input is focused for better UX
    // This allows users to easily replace the entire value
    e.target.select();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, arrow keys
    const allowedKeys = [
      "Backspace",
      "Delete", 
      "Tab",
      "Escape",
      "Enter",
      "Home",
      "End",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Allow decimal point for price inputs
    if (price && e.key === "." && !String(value || "").includes(".")) {
      return;
    }

    // Ensure that it is a number and stop the keypress for invalid characters
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Input
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={price ? 0.01 : 1}
      className={cn(className)}
      {...inputProps}
    />
  );
};

export default PositiveNumberInput;
